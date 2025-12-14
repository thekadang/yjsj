import express from 'express';
import { register, login } from '../controllers/authController';
import { kakaoCallback, getKakaoAuthUrl } from '../controllers/kakaoAuthController';

const router = express.Router();

// 이메일 인증
router.post('/register', register);
router.post('/login', login);

// 카카오 로그인
router.get('/kakao/url', getKakaoAuthUrl);
router.post('/kakao/callback', kakaoCallback);

export default router;
