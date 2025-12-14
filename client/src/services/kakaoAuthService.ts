/**
 * 카카오 OAuth 인증 서비스
 */

import { api } from './api';
import type { ApiResponse } from './api';
import type { User } from '../contexts';

// 카카오 로그인 응답
interface KakaoLoginResponse {
  user: User;
  token: string;
  isNewUser: boolean;
}

// 카카오 URL 응답
interface KakaoUrlResponse {
  url: string;
}

export const kakaoAuthService = {
  /**
   * 카카오 로그인 URL 가져오기
   */
  getAuthUrl: async (): Promise<ApiResponse<KakaoUrlResponse>> => {
    return api.get<KakaoUrlResponse>('/auth/kakao/url');
  },

  /**
   * 카카오 인가 코드로 로그인 처리
   */
  login: async (code: string): Promise<ApiResponse<KakaoLoginResponse>> => {
    return api.post<KakaoLoginResponse>('/auth/kakao/callback', { code });
  },
};

export default kakaoAuthService;
