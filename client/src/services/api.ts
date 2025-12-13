/**
 * API 서비스 레이어
 * 공통 HTTP 요청 유틸리티 및 API 엔드포인트 정의
 */

// API 기본 설정
const API_BASE_URL = '/api';

// HTTP 메서드 타입
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// API 응답 기본 인터페이스
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 요청 옵션 인터페이스
interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

// 스토리지 키
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
} as const;

/**
 * 인증 토큰 가져오기
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * 공통 API 요청 함수
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = 30000,
  } = options;

  const token = getAuthToken();
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      // 401 에러 시 토큰 만료 처리 - 자동 로그아웃
      if (response.status === 401) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem('auth_user');
        // 현재 페이지가 로그인 페이지가 아니면 리다이렉트
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/?expired=true';
        }
      }
      return {
        success: false,
        error: data.error || data.message || `HTTP error: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { success: false, error: '요청 시간이 초과되었습니다.' };
      }
      return { success: false, error: error.message };
    }

    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
};

/**
 * GET 요청 헬퍼
 */
export const get = <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiRequest<T>(endpoint, { ...options, method: 'GET' });

/**
 * POST 요청 헬퍼
 */
export const post = <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiRequest<T>(endpoint, { ...options, method: 'POST', body });

/**
 * PUT 요청 헬퍼
 */
export const put = <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiRequest<T>(endpoint, { ...options, method: 'PUT', body });

/**
 * PATCH 요청 헬퍼
 */
export const patch = <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiRequest<T>(endpoint, { ...options, method: 'PATCH', body });

/**
 * DELETE 요청 헬퍼
 */
export const del = <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  apiRequest<T>(endpoint, { ...options, method: 'DELETE' });

/**
 * 인증이 필요한 API 요청 (fetchWithAuth)
 * 토큰을 자동으로 헤더에 추가합니다.
 */
export const fetchWithAuth = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  return response.json();
};

// API 서비스 객체
export const api = {
  get,
  post,
  put,
  patch,
  delete: del,
  request: apiRequest,
  fetchWithAuth,
};

export default api;
