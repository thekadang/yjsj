/**
 * 친구 관계 시스템 API 서비스
 * 친구 검색, 신청, 수락/거절, 목록 조회 등
 */

import { api } from './api';
import type {
  FriendsResponse,
  RelationshipTypesResponse,
  SearchUsersResponse,
  ReceivedRequestsResponse,
  SentRequestsResponse,
  ApiResponse,
} from '../types';

/**
 * 관계 타입 목록 조회
 */
export const getRelationshipTypes = () =>
  api.get<RelationshipTypesResponse>('/friends/relationship-types');

/**
 * 회원 검색 (이름 또는 연락처)
 */
export const searchUsers = (params: { name?: string; phone?: string }) => {
  const queryString = new URLSearchParams();
  if (params.name) queryString.append('name', params.name);
  if (params.phone) queryString.append('phone', params.phone);
  return api.get<SearchUsersResponse>(`/friends/search?${queryString.toString()}`);
};

/**
 * 친구 신청
 */
export const sendFriendRequest = (receiverId: number, relationshipTypeId: number) =>
  api.post<ApiResponse>('/friends/request', { receiverId, relationshipTypeId });

/**
 * 친구 신청 취소
 */
export const cancelFriendRequest = (requestId: number) =>
  api.delete<ApiResponse>(`/friends/request/${requestId}`);

/**
 * 받은 친구 신청 목록 조회
 */
export const getReceivedRequests = () =>
  api.get<ReceivedRequestsResponse>('/friends/requests');

/**
 * 보낸 친구 신청 목록 조회
 */
export const getSentRequests = () =>
  api.get<SentRequestsResponse>('/friends/requests/sent');

/**
 * 친구 신청 응답 (수락/거절)
 */
export const respondToRequest = (
  requestId: number,
  action: 'accept' | 'reject',
  relationshipTypeId?: number
) =>
  api.post<ApiResponse>('/friends/respond', { requestId, action, relationshipTypeId });

/**
 * 친구 목록 조회
 */
export const getFriends = () =>
  api.get<FriendsResponse>('/friends');

/**
 * 친구 관계 타입 수정
 */
export const updateFriendship = (friendId: number, relationshipTypeId: number) =>
  api.put<ApiResponse>(`/friends/${friendId}`, { relationshipTypeId });

/**
 * 친구 삭제
 */
export const deleteFriend = (friendId: number) =>
  api.delete<ApiResponse>(`/friends/${friendId}`);

// 서비스 객체로 묶어서 export
export const friendService = {
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
};

export default friendService;
