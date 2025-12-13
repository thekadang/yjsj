/**
 * 인증 관련 API 서비스
 */

import { api } from './api';
import type { ApiResponse } from './api';
import type { User } from '../contexts';

// 로그인 요청 데이터
interface LoginRequest {
  username: string;
  password: string;
}

// 로그인 응답 데이터
interface LoginResponseData {
  user: User;
  token?: string;
}

// 회원가입 요청 데이터
interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  phone_number: string;
}

// 회원가입 응답 데이터
interface RegisterResponseData {
  user: User;
}

// 프로필 업데이트 요청 데이터
interface ProfileUpdateRequest {
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

// 프로필 업데이트 응답 데이터
interface ProfileUpdateResponseData {
  user: User;
}

/**
 * 인증 서비스
 */
export const authService = {
  /**
   * 로그인
   */
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponseData>> => {
    return api.post<LoginResponseData>('/auth/login', data);
  },

  /**
   * 회원가입
   */
  register: async (data: RegisterRequest): Promise<ApiResponse<RegisterResponseData>> => {
    return api.post<RegisterResponseData>('/auth/register', data);
  },

  /**
   * 로그아웃 (서버 세션 정리가 필요한 경우)
   */
  logout: async (): Promise<ApiResponse<void>> => {
    return api.post<void>('/auth/logout');
  },

  /**
   * 현재 사용자 정보 조회
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return api.get<User>('/auth/me');
  },

  /**
   * 토큰 갱신
   */
  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    return api.post<{ token: string }>('/auth/refresh');
  },

  /**
   * 프로필 업데이트
   */
  updateProfile: async (
    userId: number,
    data: ProfileUpdateRequest
  ): Promise<ApiResponse<ProfileUpdateResponseData>> => {
    return api.put<ProfileUpdateResponseData>(`/users/${userId}/profile`, data);
  },

  /**
   * 비밀번호 변경
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<void>> => {
    return api.post<void>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  /**
   * 비밀번호 재설정 요청
   */
  requestPasswordReset: async (email: string): Promise<ApiResponse<void>> => {
    return api.post<void>('/auth/forgot-password', { email });
  },

  /**
   * 비밀번호 재설정
   */
  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<ApiResponse<void>> => {
    return api.post<void>('/auth/reset-password', { token, newPassword });
  },

  /**
   * 이메일 인증
   */
  verifyEmail: async (token: string): Promise<ApiResponse<void>> => {
    return api.post<void>('/auth/verify-email', { token });
  },

  /**
   * 이메일 인증 재전송
   */
  resendVerificationEmail: async (): Promise<ApiResponse<void>> => {
    return api.post<void>('/auth/resend-verification');
  },
};

export default authService;
