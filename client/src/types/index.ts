/**
 * 공통 타입 정의 파일
 */

// 사용자 타입
export interface User {
  id: number;
  username: string;
  email?: string;
  name?: string;
  phone?: string;
  birthdate?: string;
  address?: string;
  detail_address?: string;
  zipcode?: string;
  gender?: 'male' | 'female' | 'other';
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

// API 응답 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 인증 응답 타입
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

// =====================
// 친구 관계 시스템 타입
// =====================

// 관계 타입 (가족, 찐친, 친구)
export interface RelationshipType {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  sort_order: number;
}

// 친구 정보
export interface Friend {
  friend_id: number;
  relationship_type_id: number;
  friends_since: string;
  username: string;
  name: string;
  phone_number?: string;
  relationship_name: string;
  relationship_display: string;
}

// 그룹화된 친구 목록
export interface GroupedFriends {
  [relationshipType: string]: Friend[];
}

// 검색된 사용자
export interface SearchedUser {
  id: number;
  username: string;
  name: string;
  phone_number?: string;
  isFriend: boolean;
  relationshipTypeId: number | null;
  pendingRequest: {
    id: number;
    status: string;
    direction: 'sent' | 'received';
  } | null;
}

// 받은 친구 신청
export interface ReceivedFriendRequest {
  id: number;
  sender_id: number;
  sender_proposed_type_id: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  created_at: string;
  sender_username: string;
  sender_name: string;
  proposed_relationship: string;
}

// 보낸 친구 신청
export interface SentFriendRequest {
  id: number;
  receiver_id: number;
  sender_proposed_type_id: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  created_at: string;
  receiver_username: string;
  receiver_name: string;
  proposed_relationship: string;
}

// 친구 API 응답 타입
export interface FriendsResponse {
  success: boolean;
  friends?: Friend[];
  grouped?: GroupedFriends;
  error?: string;
}

export interface RelationshipTypesResponse {
  success: boolean;
  types?: RelationshipType[];
  error?: string;
}

export interface SearchUsersResponse {
  success: boolean;
  users?: SearchedUser[];
  error?: string;
}

export interface ReceivedRequestsResponse {
  success: boolean;
  requests?: ReceivedFriendRequest[];
  error?: string;
}

export interface SentRequestsResponse {
  success: boolean;
  requests?: SentFriendRequest[];
  error?: string;
}

// =====================
// 미디어 시스템 타입
// =====================

// 미디어 아이템
export interface Media {
  id: number;
  type: 'image' | 'audio';
  filename: string;
  originalName: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: string;
  url: string;
  thumbnailUrl: string | null;
}

// 미디어 업로드 응답
export interface MediaUploadResponse {
  success: boolean;
  data?: {
    id: number;
    filename: string;
    thumbnail?: string;
    thumbnailId?: number;
    originalName: string;
    createdAt: string;
  };
  error?: string;
}

// 미디어 목록 응답
export interface MediaListResponse {
  success: boolean;
  data?: Media[];
  error?: string;
}

// =====================
// 일기장 시스템 타입
// =====================

// 일기 공개범위
export interface DiaryVisibility {
  id: number;
  name: string;
  display_name: string;
}

// 일기
export interface Diary {
  id: number;
  content: string;
  audioUrl: string | null;
  createdAt: string;
  visibility?: DiaryVisibility[];
  isOwner?: boolean;
  author?: {
    id: number;
    username: string;
    name: string;
  };
}

// 일기 목록 응답
export interface DiaryListResponse {
  success: boolean;
  data?: Diary[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

// 일기 상세 응답
export interface DiaryDetailResponse {
  success: boolean;
  data?: Diary;
  error?: string;
}

// 피드 일기 (친구 소식용)
export interface FeedDiary {
  id: number;
  content: string;
  audioUrl: string | null;
  createdAt: string;
  author: {
    id: number;
    name: string;
    username: string;
    profileImage: string | null;
  };
  relationshipToMe: string;
  visibility: DiaryVisibility[];
}

// 친구 피드 응답
export interface FriendsFeedResponse {
  success: boolean;
  data?: FeedDiary[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

// =====================
// 마이스페이스 타입
// =====================

// 마이스페이스 데이터
export interface MySpaceData {
  user: {
    id: number;
    username: string;
    name: string;
    phone?: string;
    birthdate?: string;
    address?: string;
    detailAddress?: string;
    insuranceStatus?: string;
    joinedAt: string;
  };
  profileImage: {
    url: string;
    thumbnailUrl: string;
  } | null;
  epitaph: string | null;
  recentDiaries: {
    id: number;
    content: string;
    audioUrl: string | null;
    createdAt: string;
    visibility: string[];
  }[];
  mediaGallery: Media[];
  friendStats: Record<string, number>;
  totalDiaries: number;
  totalMedia: number;
}

// 다른 사용자 마이스페이스 데이터
export interface UserSpaceData {
  user: {
    id: number;
    username: string;
    name: string;
    joinedAt: string;
  };
  profileImage: {
    url: string;
    thumbnailUrl: string;
  } | null;
  relationship: {
    typeId: number;
    displayName: string;
  } | null;
  epitaph: string | null;
  accessibleDiaries: {
    id: number;
    content: string;
    createdAt: string;
  }[];
  mediaGallery: Media[];
  isFriend: boolean;
  isOwner: boolean;
}

// 마이스페이스 응답
export interface MySpaceResponse {
  success: boolean;
  data?: MySpaceData;
  error?: string;
}

export interface UserSpaceResponse {
  success: boolean;
  data?: UserSpaceData;
  error?: string;
}
