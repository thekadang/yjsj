/**
 * 일기장 라우트
 * 일기 CRUD 및 공개범위 설정
 */

import express from 'express';
import { requireAuth, optionalAuth } from '../middleware/auth';
import {
  createDiary,
  getMyDiaries,
  getDiaryById,
  getFriendDiaries,
  getFriendsFeed,
  updateDiary,
  deleteDiary
} from '../controllers/diaryController';

const router = express.Router();

// 일기 작성 (인증 필요)
router.post('/', requireAuth, createDiary);

// 내 일기 목록 조회 (인증 필요)
router.get('/my', requireAuth, getMyDiaries);

// 친구들의 최신 일기 피드 조회 (인증 필요)
router.get('/feed', requireAuth, getFriendsFeed);

// 친구의 공개된 일기 목록 조회 (인증 필요)
router.get('/friend/:friendId', requireAuth, getFriendDiaries);

// 일기 상세 조회 (선택적 인증 - 본인/친구 구분)
router.get('/:diaryId', optionalAuth, getDiaryById);

// 일기 수정 (인증 필요)
router.put('/:diaryId', requireAuth, updateDiary);

// 일기 삭제 (인증 필요)
router.delete('/:diaryId', requireAuth, deleteDiary);

export default router;
