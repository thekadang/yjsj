/**
 * 친구 관계 시스템 라우트
 */

import express from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getRelationshipTypes,
  searchUsers,
  sendFriendRequest,
  getReceivedRequests,
  getSentRequests,
  respondToRequest,
  getFriends,
  updateFriendship,
  deleteFriend,
  cancelFriendRequest
} from '../controllers/friendController';

const router = express.Router();

// 공개 API
router.get('/relationship-types', getRelationshipTypes);

// 인증 필요 API
router.get('/search', requireAuth, searchUsers);
router.post('/request', requireAuth, sendFriendRequest);
router.get('/requests', requireAuth, getReceivedRequests);
router.get('/requests/sent', requireAuth, getSentRequests);
router.post('/respond', requireAuth, respondToRequest);
router.get('/', requireAuth, getFriends);
router.put('/:friendId', requireAuth, updateFriendship);
router.delete('/:friendId', requireAuth, deleteFriend);
router.delete('/request/:requestId', requireAuth, cancelFriendRequest);

export default router;
