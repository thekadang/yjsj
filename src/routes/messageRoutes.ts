/**
 * 남기는 말 API 라우트
 * /api/messages
 */

import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getCurrentMessage,
  getUserMessage,
  getMessageHistory,
  createMessage,
  activateMessage,
  deleteMessage,
  hideCurrentMessage
} from '../controllers/messageController';

const router = Router();

// 현재 활성화된 남기는 말 조회 (인증 필요)
router.get('/current', requireAuth, getCurrentMessage);

// 남기는 말 이력 조회 (인증 필요)
router.get('/history', requireAuth, getMessageHistory);

// 다른 사용자의 남기는 말 조회 (인증 선택)
router.get('/user/:userId', getUserMessage);

// 새 남기는 말 작성 (인증 필요)
router.post('/', requireAuth, createMessage);

// 과거 남기는 말 활성화 (인증 필요)
router.put('/:messageId/activate', requireAuth, activateMessage);

// 현재 남기는 말 숨기기 (인증 필요)
router.put('/hide', requireAuth, hideCurrentMessage);

// 남기는 말 삭제 (인증 필요)
router.delete('/:messageId', requireAuth, deleteMessage);

export default router;
