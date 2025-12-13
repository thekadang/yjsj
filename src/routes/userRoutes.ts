import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController';

const router = express.Router();

// 프로필 조회
router.get('/:id/profile', getProfile);

// 프로필 업데이트
router.put('/:id/profile', updateProfile);

export default router;
