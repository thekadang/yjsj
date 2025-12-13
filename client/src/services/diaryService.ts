/**
 * 일기장 서비스
 * 일기 CRUD 및 공개범위 설정 API
 */

import { fetchWithAuth } from './api';
import type { DiaryListResponse, DiaryDetailResponse, ApiResponse, FriendsFeedResponse } from '../types';

const API_BASE = '/api/diaries';

/**
 * 공개 범위 타입
 * - private: 비공개 (나만 볼 수 있음)
 * - family: 가족
 * - close_friend: 찐친
 * - friend: 친구
 * - public: 전체공개
 */
export type VisibilityType = 'private' | 'family' | 'close_friend' | 'friend' | 'public';

/**
 * 일기 작성
 */
export const createDiary = async (
  content: string,
  audioUrl?: string,
  visibilityTypes?: VisibilityType[]
): Promise<DiaryDetailResponse> => {
  return fetchWithAuth<DiaryDetailResponse>(API_BASE, {
    method: 'POST',
    body: JSON.stringify({ content, audioUrl, visibilityTypes })
  });
};

/**
 * 내 일기 목록 조회
 */
export const getMyDiaries = async (
  page: number = 1,
  limit: number = 10
): Promise<DiaryListResponse> => {
  return fetchWithAuth<DiaryListResponse>(`${API_BASE}/my?page=${page}&limit=${limit}`);
};

/**
 * 일기 상세 조회
 */
export const getDiaryById = async (diaryId: number): Promise<DiaryDetailResponse> => {
  return fetchWithAuth<DiaryDetailResponse>(`${API_BASE}/${diaryId}`);
};

/**
 * 친구의 공개된 일기 목록 조회
 */
export const getFriendDiaries = async (
  friendId: number,
  page: number = 1,
  limit: number = 10
): Promise<DiaryListResponse> => {
  return fetchWithAuth<DiaryListResponse>(
    `${API_BASE}/friend/${friendId}?page=${page}&limit=${limit}`
  );
};

/**
 * 친구들의 최신 일기 피드 조회
 * 내가 볼 수 있는 권한이 있는 친구들의 일기만 반환
 */
export const getFriendsFeed = async (
  page: number = 1,
  limit: number = 10
): Promise<FriendsFeedResponse> => {
  return fetchWithAuth<FriendsFeedResponse>(
    `${API_BASE}/feed?page=${page}&limit=${limit}`
  );
};

/**
 * 일기 수정
 */
export const updateDiary = async (
  diaryId: number,
  content?: string,
  audioUrl?: string,
  visibilityTypes?: VisibilityType[]
): Promise<DiaryDetailResponse> => {
  return fetchWithAuth<DiaryDetailResponse>(`${API_BASE}/${diaryId}`, {
    method: 'PUT',
    body: JSON.stringify({ content, audioUrl, visibilityTypes })
  });
};

/**
 * 일기 삭제
 */
export const deleteDiary = async (diaryId: number): Promise<ApiResponse> => {
  return fetchWithAuth<ApiResponse>(`${API_BASE}/${diaryId}`, {
    method: 'DELETE'
  });
};

// 서비스 객체로 묶어서 export
export const diaryService = {
  createDiary,
  getMyDiaries,
  getDiaryById,
  getFriendDiaries,
  getFriendsFeed,
  updateDiary,
  deleteDiary,
};

export default diaryService;
