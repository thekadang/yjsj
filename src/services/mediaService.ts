import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const processImage = async (file: Express.Multer.File) => {
    const filename = path.parse(file.filename).name;
    const originalPath = path.join(UPLOAD_DIR, file.filename);

    // 1. Save Original (High Quality) - In real app, upload to S3/GCS here
    // For now, it's already saved by multer in UPLOAD_DIR

    // 2. Generate Thumbnail (Web Display)
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

export const validateAudio = (file: Express.Multer.File) => {
    // Check file size (approx 1MB limit)
    const MAX_SIZE = 1.5 * 1024 * 1024; // 1.5MB buffer
    if (file.size > MAX_SIZE) {
        throw new Error('Audio file too large. Max 1 minute allowed.');
    }

    // Check mime type
    const allowedTypes = ['audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/webm']; // webm for browser recording
    if (!allowedTypes.includes(file.mimetype)) {
        throw new Error('Invalid audio format. Use MP3 or AAC.');
    }

    return true;
};
