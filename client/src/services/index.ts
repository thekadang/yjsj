/**
 * 서비스 레이어 배럴 export
 * 모든 API 서비스를 이 파일에서 export합니다.
 *
 * 사용 예시:
 * import { authService, friendService, mediaService } from '@/services';
 * 또는
 * import { authService } from '../services';
 */

// API 유틸리티
export { api, get, post, put, patch, del, fetchWithAuth, apiRequest } from './api';
export type { ApiResponse } from './api';

// 인증 서비스
export { authService } from './authService';

// 사용자 서비스
export { userService } from './userService';
export type { ProfileData, ProfileUpdateData } from './userService';

// 친구 관계 서비스
export { friendService } from './friendService';
export {
  getRelationshipTypes,
  searchUsers,
  sendFriendRequest,
  cancelFriendRequest,
  getReceivedRequests,
  getSentRequests,
  respondToRequest,
  getFriends,
  updateFriendship,
  deleteFriend,
} from './friendService';

// 미디어 서비스
export { mediaService } from './mediaService';
export {
  uploadImage,
  uploadAudio,
  getMyMedia,
  getUserMedia,
  deleteMedia,
  setProfileImage,
} from './mediaService';

// 일기장 서비스
export { diaryService } from './diaryService';
export {
  createDiary,
  getMyDiaries,
  getDiaryById,
  getFriendDiaries,
  getFriendsFeed,
  updateDiary,
  deleteDiary,
} from './diaryService';

// 마이스페이스 서비스
export { myspaceService } from './myspaceService';
export { getMySpace, getUserSpace, updateEpitaph } from './myspaceService';
