/**
 * 미디어 서비스
 * 이미지/오디오 업로드 및 조회 API
 */

import { fetchWithAuth } from './api';
import type { MediaUploadResponse, MediaListResponse, ApiResponse } from '../types';

const API_BASE = '/api/media';

/**
 * 이미지 업로드
 */
export const uploadImage = async (file: File): Promise<MediaUploadResponse> => {
  const formData = new FormData();
  formData.append('image', file);

  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE}/upload/image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData
  });

  return response.json();
};

/**
 * 오디오 업로드
 */
export const uploadAudio = async (file: File): Promise<MediaUploadResponse> => {
  const formData = new FormData();
  formData.append('audio', file);

  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE}/upload/audio`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData
  });

  return response.json();
};

/**
 * 내 미디어 목록 조회
 */
export const getMyMedia = async (type?: 'image' | 'audio'): Promise<MediaListResponse> => {
  const url = type ? `${API_BASE}/my?type=${type}` : `${API_BASE}/my`;
  return fetchWithAuth<MediaListResponse>(url);
};

/**
 * 사용자 미디어 조회
 */
export const getUserMedia = async (
  userId: number,
  type?: 'image' | 'audio'
): Promise<MediaListResponse> => {
  const url = type
    ? `${API_BASE}/user/${userId}?type=${type}`
    : `${API_BASE}/user/${userId}`;
  return fetchWithAuth<MediaListResponse>(url);
};

/**
 * 미디어 삭제
 */
export const deleteMedia = async (mediaId: number): Promise<ApiResponse> => {
  return fetchWithAuth<ApiResponse>(`${API_BASE}/${mediaId}`, {
    method: 'DELETE'
  });
};

/**
 * 프로필 이미지 설정
 */
export const setProfileImage = async (mediaId: number): Promise<ApiResponse> => {
  return fetchWithAuth<ApiResponse>(`${API_BASE}/profile-image`, {
    method: 'POST',
    body: JSON.stringify({ mediaId })
  });
};

/**
 * 오디오 다운로드 URL 생성
 * @param mediaId 미디어 ID
 * @param format 'opus' (기본, 작은 용량) | 'mp3' (호환성 좋음)
 */
export const getAudioDownloadUrl = (
  mediaId: number,
  format: 'opus' | 'mp3' = 'opus'
): string => {
  return `${API_BASE}/download/${mediaId}?format=${format}`;
};

/**
 * 오디오 다운로드 실행
 * @param mediaId 미디어 ID
 * @param format 'opus' | 'mp3'
 */
export const downloadAudio = (
  mediaId: number,
  format: 'opus' | 'mp3' = 'opus'
): void => {
  const url = getAudioDownloadUrl(mediaId, format);
  // 새 창에서 다운로드 (브라우저가 자동으로 다운로드 처리)
  window.open(url, '_blank');
};

// 서비스 객체로 묶어서 export
export const mediaService = {
  uploadImage,
  uploadAudio,
  getMyMedia,
  getUserMedia,
  deleteMedia,
  setProfileImage,
  getAudioDownloadUrl,
  downloadAudio,
};

export default mediaService;
