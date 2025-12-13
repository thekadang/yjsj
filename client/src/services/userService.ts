/**
 * 사용자 프로필 서비스
 * 프로필 조회 및 수정 API 호출
 */

import { get, put } from './api';
import type { ApiResponse } from '../types';

// 프로필 데이터 인터페이스
export interface ProfileData {
  id: number;
  username: string;
  name?: string;
  phone_number?: string;
  birthdate?: string;
  address?: string;
  detail_address?: string;
  zipcode?: string;
  death_certifier_1_name?: string;
  death_certifier_1_phone?: string;
  death_certifier_1_relation?: string;
  death_certifier_2_name?: string;
  death_certifier_2_phone?: string;
  death_certifier_2_relation?: string;
  insurance_status?: 'not_joined' | 'joined' | 'consultation_requested';
  insurance_name?: string;
  created_at?: string;
  updated_at?: string;
}

// 프로필 업데이트 요청 데이터
export interface ProfileUpdateData {
  name?: string;
  phone_number?: string;
  birthdate?: string;
  address?: string;
  detail_address?: string;
  zipcode?: string;
  death_certifier_1_name?: string;
  death_certifier_1_phone?: string;
  death_certifier_1_relation?: string;
  death_certifier_2_name?: string;
  death_certifier_2_phone?: string;
  death_certifier_2_relation?: string;
  insurance_status?: 'not_joined' | 'joined' | 'consultation_requested';
  insurance_name?: string;
}

// API 응답 타입
interface ProfileResponse {
  success: boolean;
  user?: ProfileData;
  error?: string;
}

/**
 * 사용자 프로필 조회
 * @param userId 사용자 ID
 */
export const getProfile = async (userId: number): Promise<ApiResponse<ProfileData>> => {
  const response = await get<ProfileResponse>(`/users/${userId}/profile`);

  // 백엔드는 { success: true, user: {...} } 형식으로 직접 반환
  const rawResponse = response as unknown as ProfileResponse;

  if (rawResponse.success && rawResponse.user) {
    return {
      success: true,
      data: rawResponse.user,
    };
  }

  return {
    success: false,
    error: rawResponse.error || '프로필을 불러오는데 실패했습니다.',
  };
};

/**
 * 사용자 프로필 수정
 * @param userId 사용자 ID
 * @param data 수정할 프로필 데이터
 */
export const updateProfile = async (
  userId: number,
  data: ProfileUpdateData
): Promise<ApiResponse<ProfileData>> => {
  const response = await put<ProfileResponse>(`/users/${userId}/profile`, data);

  // 백엔드는 { success: true, user: {...} } 형식으로 직접 반환
  const rawResponse = response as unknown as ProfileResponse;

  if (rawResponse.success && rawResponse.user) {
    return {
      success: true,
      data: rawResponse.user,
    };
  }

  return {
    success: false,
    error: rawResponse.error || '프로필 수정에 실패했습니다.',
  };
};

// 기본 내보내기
export const userService = {
  getProfile,
  updateProfile,
};

export default userService;
