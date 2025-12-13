/**
 * 미디어 서비스
 * 이미지 처리 (썸네일 생성) 및 오디오 압축 (Opus 변환)
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// fluent-ffmpeg는 선택적 의존성 (설치되지 않아도 서버 실행 가능)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ffmpeg: any = null;
let ffmpegAvailable = false;

try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ffmpeg = require('fluent-ffmpeg');
    ffmpegAvailable = true;
    console.log('✅ FFmpeg 모듈 로드 완료 - 오디오 압축 기능 활성화');
} catch {
    console.log('⚠️ fluent-ffmpeg 모듈 없음 - 오디오 압축 비활성화 (원본 저장)');
    console.log('   설치: npm install fluent-ffmpeg @types/fluent-ffmpeg');
}

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * FFmpeg 사용 가능 여부 확인
 */
export const isFFmpegAvailable = (): boolean => ffmpegAvailable;

/**
 * 이미지 처리 - 원본 유지 + 썸네일 생성
 */
export const processImage = async (file: Express.Multer.File) => {
    const filename = path.parse(file.filename).name;
    const originalPath = path.join(UPLOAD_DIR, file.filename);

    // Generate Thumbnail (Web Display)
    const thumbnailPath = path.join(UPLOAD_DIR, `${filename}_thumb.webp`);

    await sharp(originalPath)
        .resize(300, 400, { fit: 'cover' }) // 3:4 ratio approximation
        .webp({ quality: 80 })
        .toFile(thumbnailPath);

    return {
        original: file.filename,
        thumbnail: `${filename}_thumb.webp`
    };
};

/**
 * 오디오 파일 검증
 */
export const validateAudio = (file: Express.Multer.File) => {
    // Check file size (10MB limit for raw upload, will be compressed)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
        throw new Error('오디오 파일이 너무 큽니다. 최대 10MB까지 허용됩니다.');
    }

    // Check mime type
    const allowedTypes = [
        'audio/mpeg',      // MP3
        'audio/mp4',       // M4A
        'audio/aac',       // AAC
        'audio/webm',      // WebM (브라우저 녹음)
        'audio/wav',       // WAV (원본)
        'audio/ogg',       // OGG
        'audio/opus'       // Opus
    ];
    if (!allowedTypes.includes(file.mimetype)) {
        throw new Error('지원하지 않는 오디오 형식입니다. (MP3, AAC, WAV, WebM, OGG 허용)');
    }

    return true;
};

/**
 * 오디오를 Opus 형식으로 압축
 * - 음성 녹음에 최적화된 48kbps 비트레이트
 * - 원본 대비 90%+ 용량 절감
 * - FFmpeg 미설치 시 원본 반환
 *
 * @param inputPath 원본 오디오 파일 경로
 * @param outputFilename 출력 파일명 (확장자 제외)
 * @returns 압축된 파일 정보
 */
export const compressAudioToOpus = (
    inputPath: string,
    outputFilename: string
): Promise<{ filename: string; size: number; compressed: boolean }> => {
    return new Promise((resolve, reject) => {
        // FFmpeg 미설치 시 원본 반환
        if (!ffmpegAvailable || !ffmpeg) {
            const stats = fs.statSync(inputPath);
            const ext = path.extname(inputPath);
            resolve({
                filename: `${outputFilename}${ext}`,
                size: stats.size,
                compressed: false
            });
            return;
        }

        const outputPath = path.join(UPLOAD_DIR, `${outputFilename}.opus`);

        ffmpeg(inputPath)
            .audioCodec('libopus')
            .audioBitrate('48k')        // 음성에 충분한 품질
            .audioChannels(1)           // 모노 (음성 녹음용)
            .audioFrequency(48000)      // Opus 표준
            .format('opus')
            .on('end', () => {
                // 원본 파일 삭제
                if (fs.existsSync(inputPath)) {
                    fs.unlinkSync(inputPath);
                }

                // 압축된 파일 크기 확인
                const stats = fs.statSync(outputPath);
                resolve({
                    filename: `${outputFilename}.opus`,
                    size: stats.size,
                    compressed: true
                });
            })
            .on('error', (err: Error) => {
                console.error('FFmpeg 오류:', err.message);
                // 압축 실패 시 원본 유지
                reject(new Error('오디오 압축에 실패했습니다. 원본 파일이 유지됩니다.'));
            })
            .save(outputPath);
    });
};

/**
 * Opus 파일을 MP3로 변환 (다운로드용)
 *
 * @param opusPath Opus 파일 경로
 * @returns MP3 파일 경로
 */
export const convertOpusToMp3 = (opusPath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        // FFmpeg 미설치 시 원본 반환
        if (!ffmpegAvailable || !ffmpeg) {
            resolve(opusPath);
            return;
        }

        const filename = path.parse(opusPath).name;
        const mp3Path = path.join(UPLOAD_DIR, `${filename}_download.mp3`);

        // 이미 변환된 파일이 있으면 재사용
        if (fs.existsSync(mp3Path)) {
            resolve(mp3Path);
            return;
        }

        ffmpeg(opusPath)
            .audioCodec('libmp3lame')
            .audioBitrate('128k')
            .audioChannels(2)
            .audioFrequency(44100)
            .format('mp3')
            .on('end', () => {
                resolve(mp3Path);
            })
            .on('error', (err: Error) => {
                console.error('MP3 변환 오류:', err.message);
                reject(new Error('MP3 변환에 실패했습니다.'));
            })
            .save(mp3Path);
    });
};

/**
 * 오디오 파일 메타데이터 조회
 */
interface AudioMetadata {
    duration: number;
    bitrate: number;
    format: string;
}

interface FFprobeStream {
    codec_type?: string;
}

interface FFprobeFormat {
    duration?: number;
    bit_rate?: number | string;
    format_name?: string;
}

interface FFprobeData {
    streams: FFprobeStream[];
    format: FFprobeFormat;
}

export const getAudioMetadata = (
    filePath: string
): Promise<AudioMetadata> => {
    return new Promise((resolve, reject) => {
        // FFmpeg 미설치 시 기본값 반환
        if (!ffmpegAvailable || !ffmpeg) {
            resolve({
                duration: 0,
                bitrate: 0,
                format: 'unknown'
            });
            return;
        }

        ffmpeg.ffprobe(filePath, (err: Error | null, metadata: FFprobeData) => {
            if (err) {
                reject(err);
                return;
            }

            const audioStream = metadata.streams.find((s: FFprobeStream) => s.codec_type === 'audio');
            resolve({
                duration: metadata.format.duration || 0,
                bitrate: metadata.format.bit_rate ? parseInt(String(metadata.format.bit_rate)) : 0,
                format: metadata.format.format_name || 'unknown'
            });
        });
    });
};

/**
 * 임시 MP3 파일 정리 (24시간 이상 된 파일)
 */
export const cleanupTempMp3Files = () => {
    const files = fs.readdirSync(UPLOAD_DIR);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24시간

    files.forEach(file => {
        if (file.endsWith('_download.mp3')) {
            const filePath = path.join(UPLOAD_DIR, file);
            const stats = fs.statSync(filePath);
            if (now - stats.mtimeMs > maxAge) {
                fs.unlinkSync(filePath);
                console.log(`임시 파일 삭제: ${file}`);
            }
        }
    });
};
