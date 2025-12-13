/**
 * 남기는 말 서비스
 * 남기는 말 CRUD 및 이력 관리 API
 */

import { fetchWithAuth } from './api';

const API_BASE = '/api/messages';

export interface UserMessage {
  id: number;
  content: string;
  is_active: boolean;
  created_at: string;
}

export interface MessageHistoryResponse {
  success: boolean;
  data: UserMessage[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface MessageResponse {
  success: boolean;
  data: UserMessage | null;
  message?: string;
  error?: string;
}

/**
 * 현재 활성화된 남기는 말 조회
 */
export const getCurrentMessage = async (): Promise<MessageResponse> => {
  return fetchWithAuth<MessageResponse>(`${API_BASE}/current`);
};

/**
 * 다른 사용자의 남기는 말 조회
 */
export const getUserMessage = async (userId: number): Promise<MessageResponse> => {
  return fetchWithAuth<MessageResponse>(`${API_BASE}/user/${userId}`);
};

/**
 * 남기는 말 이력 조회
 */
export const getMessageHistory = async (
  page: number = 1,
  limit: number = 20
): Promise<MessageHistoryResponse> => {
  return fetchWithAuth<MessageHistoryResponse>(
    `${API_BASE}/history?page=${page}&limit=${limit}`
  );
};

/**
 * 새 남기는 말 작성
 */
export const createMessage = async (content: string): Promise<MessageResponse> => {
  return fetchWithAuth<MessageResponse>(API_BASE, {
    method: 'POST',
    body: JSON.stringify({ content })
  });
};

/**
 * 과거 남기는 말 활성화
 */
export const activateMessage = async (messageId: number): Promise<MessageResponse> => {
  return fetchWithAuth<MessageResponse>(`${API_BASE}/${messageId}/activate`, {
    method: 'PUT'
  });
};

/**
 * 남기는 말 삭제
 */
export const deleteMessage = async (messageId: number): Promise<{ success: boolean; message?: string }> => {
  return fetchWithAuth(`${API_BASE}/${messageId}`, {
    method: 'DELETE'
  });
};

/**
 * 현재 남기는 말 숨기기
 */
export const hideCurrentMessage = async (): Promise<{ success: boolean; message?: string }> => {
  return fetchWithAuth(`${API_BASE}/hide`, {
    method: 'PUT'
  });
};

// 서비스 객체로 묶어서 export
export const messageService = {
  getCurrentMessage,
  getUserMessage,
  getMessageHistory,
  createMessage,
  activateMessage,
  deleteMessage,
  hideCurrentMessage
};

export default messageService;
