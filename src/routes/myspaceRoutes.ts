/**
 * 마이스페이스 라우트
 * 사용자 공간 통합 데이터 조회
 */

import express from 'express';
import { requireAuth, optionalAuth } from '../middleware/auth';
import {
  getMySpace,
  getUserSpace
} from '../controllers/myspaceController';

const router = express.Router();

// 내 마이스페이스 조회 (인증 필요)
router.get('/my', requireAuth, getMySpace);

// 다른 사용자의 마이스페이스 조회 (선택적 인증)
router.get('/user/:userId', optionalAuth, getUserSpace);

// 남기는 말 관리는 /api/messages 라우트로 이동

export default router;
