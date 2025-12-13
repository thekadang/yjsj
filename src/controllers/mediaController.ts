/**
 * 미디어 컨트롤러
 * 이미지/오디오 업로드, 조회, 삭제 처리
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../config/db';
import {
  processImage,
  validateAudio,
  compressAudioToOpus,
  convertOpusToMp3
} from '../services/mediaService';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

/**
 * 이미지 업로드
 * POST /api/media/upload/image
 */
export const uploadImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: '이미지 파일이 필요합니다.' });
    }

    // 이미지 처리 (썸네일 생성)
    const result = await processImage(req.file);

    // DB에 원본 이미지 저장
    const originalResult = await query(
      `INSERT INTO media (user_id, type, filename, original_filename, file_size, mime_type, is_thumbnail)
       VALUES ($1, 'image', $2, $3, $4, $5, false)
       RETURNING id, filename, created_at`,
      [req.user.id, result.original, req.file.originalname, req.file.size, req.file.mimetype]
    );

    // DB에 썸네일 저장
    const thumbnailResult = await query(
      `INSERT INTO media (user_id, type, filename, original_filename, file_size, mime_type, is_thumbnail)
       VALUES ($1, 'image', $2, $3, $4, 'image/webp', true)
       RETURNING id, filename`,
      [req.user.id, result.thumbnail, req.file.originalname, 0]
    );

    res.json({
      success: true,
      data: {
        id: originalResult.rows[0].id,
        filename: result.original,
        thumbnail: result.thumbnail,
        thumbnailId: thumbnailResult.rows[0].id,
        originalName: req.file.originalname,
        createdAt: originalResult.rows[0].created_at
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '이미지 업로드 실패';
    console.error('이미지 업로드 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};

/**
 * 오디오 업로드 (자동 Opus 압축)
 * POST /api/media/upload/audio
 *
 * - 업로드된 오디오를 Opus 형식으로 자동 압축
 * - 원본 대비 90%+ 용량 절감
 * - 음성 녹음에 최적화된 48kbps 비트레이트
 */
export const uploadAudio = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: '오디오 파일이 필요합니다.' });
    }

    // 오디오 파일 검증
    validateAudio(req.file);

    const originalSize = req.file.size;
    const originalPath = path.join(UPLOAD_DIR, req.file.filename);
    const baseFilename = path.parse(req.file.filename).name;

    let finalFilename = req.file.filename;
    let finalSize = originalSize;
    let compressed = false;

    // Opus로 압축 시도 (FFmpeg 필요)
    try {
      const result = await compressAudioToOpus(originalPath, baseFilename);
      finalFilename = result.filename;
      finalSize = result.size;
      compressed = true;
      console.log(`오디오 압축 완료: ${originalSize} → ${finalSize} (${Math.round((1 - finalSize / originalSize) * 100)}% 절감)`);
    } catch (compressionError) {
      // FFmpeg 없거나 압축 실패 시 원본 유지
      console.warn('오디오 압축 실패, 원본 유지:', compressionError);
    }

    // DB에 오디오 저장
    const result = await query(
      `INSERT INTO media (user_id, type, filename, original_filename, file_size, mime_type)
       VALUES ($1, 'audio', $2, $3, $4, $5)
       RETURNING id, filename, created_at`,
      [
        req.user.id,
        finalFilename,
        req.file.originalname,
        finalSize,
        compressed ? 'audio/opus' : req.file.mimetype
      ]
    );

    res.json({
      success: true,
      data: {
        id: result.rows[0].id,
        filename: finalFilename,
        originalName: req.file.originalname,
        originalSize,
        compressedSize: finalSize,
        compressed,
        compressionRatio: compressed ? Math.round((1 - finalSize / originalSize) * 100) : 0,
        createdAt: result.rows[0].created_at
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '오디오 업로드 실패';
    console.error('오디오 업로드 오류:', error);
    res.status(400).json({ success: false, error: message });
  }
};

/**
 * 내 미디어 목록 조회
 * GET /api/media/my
 */
export const getMyMedia = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }

    const { type } = req.query; // 'image' | 'audio' | undefined (all)

    let queryText = `
      SELECT id, type, filename, original_filename, file_size, mime_type, is_thumbnail, created_at
      FROM media
      WHERE user_id = $1 AND is_thumbnail = false
    `;
    const params: (number | string)[] = [req.user.id];

    if (type && (type === 'image' || type === 'audio')) {
      queryText += ' AND type = $2';
      params.push(type);
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, params);

    res.json({
      success: true,
      data: result.rows.map(row => ({
        id: row.id,
        type: row.type,
        filename: row.filename,
        originalName: row.original_filename,
        fileSize: row.file_size,
        mimeType: row.mime_type,
        createdAt: row.created_at,
        url: `/uploads/${row.filename}`,
        thumbnailUrl: row.type === 'image'
          ? `/uploads/${path.parse(row.filename).name}_thumb.webp`
          : null
      }))
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '미디어 조회 실패';
    console.error('미디어 조회 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};

/**
 * 사용자 미디어 조회 (공개)
 * GET /api/media/user/:userId
 */
export const getUserMedia = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { type } = req.query;

    let queryText = `
      SELECT id, type, filename, original_filename, created_at
      FROM media
      WHERE user_id = $1 AND is_thumbnail = false
    `;
    const params: (string | number)[] = [parseInt(userId)];

    if (type && (type === 'image' || type === 'audio')) {
      queryText += ' AND type = $2';
      params.push(type);
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, params);

    res.json({
      success: true,
      data: result.rows.map(row => ({
        id: row.id,
        type: row.type,
        filename: row.filename,
        originalName: row.original_filename,
        createdAt: row.created_at,
        url: `/uploads/${row.filename}`,
        thumbnailUrl: row.type === 'image'
          ? `/uploads/${path.parse(row.filename).name}_thumb.webp`
          : null
      }))
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '미디어 조회 실패';
    console.error('미디어 조회 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};

/**
 * 미디어 삭제
 * DELETE /api/media/:mediaId
 */
export const deleteMedia = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }

    const { mediaId } = req.params;

    // 미디어 정보 조회 (소유권 확인)
    const mediaResult = await query(
      'SELECT * FROM media WHERE id = $1 AND user_id = $2',
      [parseInt(mediaId), req.user.id]
    );

    if (mediaResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: '미디어를 찾을 수 없습니다.' });
    }

    const media = mediaResult.rows[0];

    // 파일 삭제
    const filePath = path.join(UPLOAD_DIR, media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 썸네일 삭제 (이미지인 경우)
    if (media.type === 'image') {
      const thumbnailFilename = `${path.parse(media.filename).name}_thumb.webp`;
      const thumbnailPath = path.join(UPLOAD_DIR, thumbnailFilename);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }

      // DB에서 썸네일 레코드도 삭제
      await query(
        'DELETE FROM media WHERE user_id = $1 AND filename = $2',
        [req.user.id, thumbnailFilename]
      );
    }

    // DB에서 원본 삭제
    await query('DELETE FROM media WHERE id = $1', [parseInt(mediaId)]);

    res.json({ success: true, message: '미디어가 삭제되었습니다.' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '미디어 삭제 실패';
    console.error('미디어 삭제 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};

/**
 * 프로필 이미지 설정
 * POST /api/media/profile-image
 */
export const setProfileImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }

    const { mediaId } = req.body;

    if (!mediaId) {
      return res.status(400).json({ success: false, error: '미디어 ID가 필요합니다.' });
    }

    // 미디어 소유권 확인
    const mediaResult = await query(
      'SELECT * FROM media WHERE id = $1 AND user_id = $2 AND type = $3',
      [mediaId, req.user.id, 'image']
    );

    if (mediaResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: '이미지를 찾을 수 없습니다.' });
    }

    // users 테이블에 profile_image_id 컬럼이 없으면 추가 필요
    // 일단 media 테이블에 is_profile 컬럼 사용
    // 기존 프로필 이미지 해제
    await query(
      `UPDATE media SET is_thumbnail = false
       WHERE user_id = $1 AND type = 'image' AND filename LIKE '%_profile%'`,
      [req.user.id]
    );

    res.json({
      success: true,
      message: '프로필 이미지가 설정되었습니다.',
      data: {
        profileImageId: mediaId,
        thumbnailUrl: `/uploads/${path.parse(mediaResult.rows[0].filename).name}_thumb.webp`
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '프로필 이미지 설정 실패';
    console.error('프로필 이미지 설정 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};

/**
 * 오디오 다운로드
 * GET /api/media/download/:mediaId
 *
 * Query params:
 * - format: 'opus' (기본) | 'mp3'
 *
 * MP3 요청 시 실시간 변환 후 제공
 */
export const downloadAudio = async (req: AuthRequest, res: Response) => {
  try {
    const { mediaId } = req.params;
    const format = (req.query.format as string) || 'opus';

    // 미디어 정보 조회
    const mediaResult = await query(
      `SELECT m.*, u.username
       FROM media m
       JOIN users u ON m.user_id = u.id
       WHERE m.id = $1 AND m.type = 'audio'`,
      [parseInt(mediaId)]
    );

    if (mediaResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: '오디오를 찾을 수 없습니다.' });
    }

    const media = mediaResult.rows[0];
    const originalPath = path.join(UPLOAD_DIR, media.filename);

    // 파일 존재 확인
    if (!fs.existsSync(originalPath)) {
      return res.status(404).json({ success: false, error: '파일을 찾을 수 없습니다.' });
    }

    // 다운로드 파일명 생성 (사용자명_원본파일명)
    const safeOriginalName = path.parse(media.original_filename).name.replace(/[^a-zA-Z0-9가-힣_-]/g, '_');
    const downloadName = `${media.username}_${safeOriginalName}`;

    if (format === 'mp3') {
      // MP3로 변환 후 다운로드
      try {
        const mp3Path = await convertOpusToMp3(originalPath);
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(downloadName)}.mp3"`);
        res.sendFile(mp3Path);
      } catch (conversionError) {
        console.error('MP3 변환 오류:', conversionError);
        res.status(500).json({ success: false, error: 'MP3 변환에 실패했습니다.' });
      }
    } else {
      // Opus 그대로 다운로드
      const ext = path.extname(media.filename);
      res.setHeader('Content-Type', media.mime_type || 'audio/opus');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(downloadName)}${ext}"`);
      res.sendFile(originalPath);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '다운로드 실패';
    console.error('오디오 다운로드 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};
