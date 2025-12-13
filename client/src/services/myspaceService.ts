/**
 * 마이스페이스 서비스
 * 사용자 공간 통합 데이터 API
 */

import { fetchWithAuth } from './api';
import type { MySpaceResponse, UserSpaceResponse, ApiResponse } from '../types';

const API_BASE = '/api/myspace';

/**
 * 내 마이스페이스 조회
 */
export const getMySpace = async (): Promise<MySpaceResponse> => {
  return fetchWithAuth<MySpaceResponse>(`${API_BASE}/my`);
};

/**
 * 다른 사용자의 마이스페이스 조회
 */
export const getUserSpace = async (userId: number): Promise<UserSpaceResponse> => {
  return fetchWithAuth<UserSpaceResponse>(`${API_BASE}/user/${userId}`);
};

/**
 * 남기는 말 업데이트
 */
export const updateEpitaph = async (
  content: string,
  visibilityTypes?: number[]
): Promise<ApiResponse> => {
  return fetchWithAuth<ApiResponse>(`${API_BASE}/epitaph`, {
    method: 'PUT',
    body: JSON.stringify({ content, visibilityTypes })
  });
};

// 서비스 객체로 묶어서 export
export const myspaceService = {
  getMySpace,
  getUserSpace,
  updateEpitaph,
};

export default myspaceService;
