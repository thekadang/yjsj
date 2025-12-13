/**
 * 미디어 라우트
 * 이미지/오디오 업로드, 조회, 삭제
 */

import express from 'express';
import multer from 'multer';
import path from 'path';
import { requireAuth, optionalAuth } from '../middleware/auth';
import {
  uploadImage,
  uploadAudio,
  getMyMedia,
  getUserMedia,
  deleteMedia,
  setProfileImage,
  downloadAudio
} from '../controllers/mediaController';

const router = express.Router();

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const imageFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('지원하지 않는 이미지 형식입니다. (JPEG, PNG, GIF, WebP만 허용)'));
  }
};

const audioFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/webm', 'audio/wav'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('지원하지 않는 오디오 형식입니다. (MP3, AAC, WAV, WebM만 허용)'));
  }
};

const uploadImageMulter = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const uploadAudioMulter = multer({
  storage,
  fileFilter: audioFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// 이미지 업로드 (인증 필요)
router.post('/upload/image', requireAuth, uploadImageMulter.single('image'), uploadImage);

// 오디오 업로드 (인증 필요)
router.post('/upload/audio', requireAuth, uploadAudioMulter.single('audio'), uploadAudio);

// 내 미디어 목록 조회 (인증 필요)
router.get('/my', requireAuth, getMyMedia);

// 사용자 미디어 조회 (공개)
router.get('/user/:userId', optionalAuth, getUserMedia);

// 미디어 삭제 (인증 필요)
router.delete('/:mediaId', requireAuth, deleteMedia);

// 프로필 이미지 설정 (인증 필요)
router.post('/profile-image', requireAuth, setProfileImage);

// 오디오 다운로드 (공개 - 링크 공유 가능)
// ?format=opus (기본) | ?format=mp3
router.get('/download/:mediaId', optionalAuth, downloadAudio);

export default router;
