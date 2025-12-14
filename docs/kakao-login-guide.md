# 카카오 로그인 구현 매뉴얼

> **프로젝트**: 친애 (Chinae)
> **작성일**: 2025-12-14
> **대상**: Node.js + Express + React 환경

---

## 목차

1. [개요](#1-개요)
2. [사전 준비](#2-사전-준비)
3. [카카오 개발자 앱 등록](#3-카카오-개발자-앱-등록)
4. [데이터베이스 스키마 수정](#4-데이터베이스-스키마-수정)
5. [백엔드 구현](#5-백엔드-구현)
6. [프론트엔드 구현](#6-프론트엔드-구현)
7. [환경 변수 설정](#7-환경-변수-설정)
8. [테스트](#8-테스트)
9. [문제 해결](#9-문제-해결)

---

## 1. 개요

### 카카오 로그인 흐름 (OAuth 2.0)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   사용자     │     │  프론트엔드  │     │   백엔드    │     │  카카오 API  │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │                   │
       │ 1. 카카오 로그인 클릭                  │                   │
       │──────────────────>│                   │                   │
       │                   │                   │                   │
       │                   │ 2. 카카오 인증 페이지로 리다이렉트       │
       │                   │──────────────────────────────────────>│
       │                   │                   │                   │
       │ 3. 카카오 계정으로 로그인 및 동의                          │
       │<──────────────────────────────────────────────────────────│
       │                   │                   │                   │
       │                   │ 4. 인가 코드(code) 전달 (Redirect URI) │
       │                   │<──────────────────────────────────────│
       │                   │                   │                   │
       │                   │ 5. 인가 코드를 백엔드로 전송            │
       │                   │──────────────────>│                   │
       │                   │                   │                   │
       │                   │                   │ 6. 인가 코드로 액세스 토큰 요청
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ 7. 액세스 토큰 반환
       │                   │                   │<──────────────────│
       │                   │                   │                   │
       │                   │                   │ 8. 액세스 토큰으로 사용자 정보 요청
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ 9. 사용자 정보 반환
       │                   │                   │<──────────────────│
       │                   │                   │                   │
       │                   │ 10. JWT 토큰 + 사용자 정보 반환         │
       │                   │<──────────────────│                   │
       │                   │                   │                   │
       │ 11. 로그인 완료                       │                   │
       │<──────────────────│                   │                   │
```

### 구현 방식 선택

| 방식 | 설명 | 장점 | 단점 |
|------|------|------|------|
| **REST API** | 백엔드에서 토큰 교환 | 보안성 높음, 서버 제어 | 구현 복잡 |
| JavaScript SDK | 프론트에서 처리 | 구현 간단 | 보안 취약, 제한적 |

**본 프로젝트**: REST API 방식 사용 (권장)

---

## 2. 사전 준비

### 필요 패키지 설치

```bash
# 백엔드 (루트 디렉토리)
npm install axios

# 프론트엔드 (client 디렉토리)
cd client
npm install
```

### 현재 프로젝트 구조

```
src/
├── controllers/
│   └── authController.ts      # 기존 인증 컨트롤러
├── routes/
│   └── authRoutes.ts          # 기존 인증 라우트
└── config/
    └── db.ts                  # 데이터베이스 설정

client/src/
├── services/
│   └── authService.ts         # 기존 인증 서비스
├── components/modals/
│   └── LoginModal.tsx         # 로그인 모달 (카카오 버튼 있음)
└── contexts/
    └── AuthContext.tsx        # 인증 컨텍스트
```

---

## 3. 카카오 개발자 앱 등록

### 3.1 카카오 개발자 계정 생성

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 카카오 계정으로 로그인
3. 개발자 등록 완료 (약관 동의)

### 3.2 애플리케이션 생성

1. **내 애플리케이션** → **애플리케이션 추가하기**
2. 앱 정보 입력:
   - **앱 이름**: `친애` (또는 원하는 이름)
   - **사업자명**: 개인 또는 회사명
3. **저장** 클릭

### 3.3 앱 키 확인

생성된 앱에서 **앱 키** 탭 확인:

| 키 종류 | 용도 | 사용 여부 |
|---------|------|----------|
| 네이티브 앱 키 | 모바일 앱 | ❌ |
| **REST API 키** | 서버 API 호출 | ✅ 사용 |
| JavaScript 키 | 웹 SDK | ❌ |
| Admin 키 | 관리자 기능 | ❌ |

> **중요**: REST API 키를 복사하여 안전하게 보관

### 3.4 플랫폼 등록

**앱 설정** → **플랫폼**에서 Web 플랫폼 등록:

```
사이트 도메인:
- http://localhost:5173     (개발용 프론트엔드)
- http://localhost:3000     (개발용 백엔드)
- https://your-domain.com   (프로덕션, 추후 추가)
```

### 3.5 카카오 로그인 활성화

**제품 설정** → **카카오 로그인**:

1. **활성화 설정**: ON
2. **Redirect URI 등록**:
   ```
   http://localhost:5173/auth/kakao/callback
   https://your-domain.com/auth/kakao/callback
   ```

### 3.6 동의 항목 설정

**제품 설정** → **카카오 로그인** → **동의항목**:

| 항목 | 동의 수준 | 필수 여부 | 설명 |
|------|----------|----------|------|
| **닉네임** | 필수 동의 | ✅ | 사용자 이름으로 사용 |
| **프로필 사진** | 선택 동의 | ⬜ | 프로필 이미지 |
| **카카오계정(이메일)** | 선택 동의 | ⬜ | 이메일 주소 |

> **참고**: 이메일은 사용자가 동의해야만 받을 수 있으며, 일부 사용자는 이메일이 없을 수 있음

### 3.7 비즈 앱 전환 (선택)

개인정보 수집을 위해 비즈 앱 전환이 필요할 수 있습니다:
- **앱 설정** → **비즈니스** → **비즈 앱 전환**

---

## 4. 데이터베이스 스키마 수정

### 4.1 users 테이블에 소셜 로그인 필드 추가

```sql
-- database/migrations/add_social_login_fields.sql

-- 소셜 로그인 제공자 (kakao, google, naver 등)
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(20) DEFAULT 'local';

-- 소셜 로그인 고유 ID
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_id VARCHAR(100);

-- 프로필 이미지 URL (소셜 로그인에서 가져온 경우)
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- 소셜 로그인 시 비밀번호는 NULL 허용
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- 인덱스 추가 (소셜 로그인 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider);
CREATE INDEX IF NOT EXISTS idx_users_provider_id ON users(provider, provider_id);

-- provider와 provider_id 조합은 유니크해야 함
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_provider_unique
ON users(provider, provider_id)
WHERE provider_id IS NOT NULL;
```

### 4.2 pgAdmin에서 실행

1. pgAdmin 열기
2. `forever_love` 데이터베이스 선택
3. **Query Tool** 열기
4. 위 SQL 실행

### 4.3 변경 확인

```sql
-- 테이블 구조 확인
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users';
```

---

## 5. 백엔드 구현

### 5.1 카카오 인증 컨트롤러 생성

```typescript
// src/controllers/kakaoAuthController.ts

import { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { query } from '../config/db';

// 카카오 API 응답 타입
interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
}

interface KakaoUserResponse {
  id: number;
  connected_at: string;
  properties?: {
    nickname?: string;
    profile_image?: string;
    thumbnail_image?: string;
  };
  kakao_account?: {
    profile_nickname_needs_agreement?: boolean;
    profile?: {
      nickname?: string;
      thumbnail_image_url?: string;
      profile_image_url?: string;
    };
    email_needs_agreement?: boolean;
    email?: string;
    is_email_valid?: boolean;
    is_email_verified?: boolean;
  };
}

/**
 * 카카오 인가 코드로 액세스 토큰 발급
 */
const getKakaoToken = async (code: string): Promise<KakaoTokenResponse> => {
  const tokenUrl = 'https://kauth.kakao.com/oauth/token';

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.KAKAO_REST_API_KEY!,
    redirect_uri: process.env.KAKAO_REDIRECT_URI!,
    code: code,
  });

  // client_secret이 있는 경우 추가 (선택 사항)
  if (process.env.KAKAO_CLIENT_SECRET) {
    params.append('client_secret', process.env.KAKAO_CLIENT_SECRET);
  }

  const response = await axios.post<KakaoTokenResponse>(tokenUrl, params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });

  return response.data;
};

/**
 * 액세스 토큰으로 카카오 사용자 정보 조회
 */
const getKakaoUser = async (accessToken: string): Promise<KakaoUserResponse> => {
  const userUrl = 'https://kapi.kakao.com/v2/user/me';

  const response = await axios.get<KakaoUserResponse>(userUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });

  return response.data;
};

/**
 * 카카오 로그인 콜백 처리
 * POST /api/auth/kakao/callback
 */
export const kakaoCallback = async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: '인가 코드가 필요합니다.' });
  }

  try {
    // 1. 인가 코드로 액세스 토큰 발급
    const tokenData = await getKakaoToken(code);

    // 2. 액세스 토큰으로 사용자 정보 조회
    const kakaoUser = await getKakaoUser(tokenData.access_token);

    const kakaoId = kakaoUser.id.toString();
    const nickname = kakaoUser.properties?.nickname ||
                     kakaoUser.kakao_account?.profile?.nickname ||
                     `카카오사용자${kakaoId.slice(-4)}`;
    const email = kakaoUser.kakao_account?.email;
    const profileImage = kakaoUser.properties?.profile_image ||
                         kakaoUser.kakao_account?.profile?.profile_image_url;

    // 3. 기존 사용자 조회 (카카오 ID로)
    let userResult = await query(
      'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
      ['kakao', kakaoId]
    );

    let user;
    let isNewUser = false;

    if (userResult.rows.length > 0) {
      // 기존 사용자 - 프로필 이미지 업데이트
      user = userResult.rows[0];

      if (profileImage && profileImage !== user.profile_image_url) {
        await query(
          'UPDATE users SET profile_image_url = $1 WHERE id = $2',
          [profileImage, user.id]
        );
        user.profile_image_url = profileImage;
      }
    } else {
      // 신규 사용자 생성
      isNewUser = true;

      // 이메일이 있으면 이미 해당 이메일로 가입된 계정이 있는지 확인
      if (email) {
        const existingEmailUser = await query(
          'SELECT * FROM users WHERE username = $1',
          [email]
        );

        if (existingEmailUser.rows.length > 0) {
          // 기존 이메일 계정에 카카오 연동
          const existingUser = existingEmailUser.rows[0];
          await query(
            'UPDATE users SET provider = $1, provider_id = $2, profile_image_url = $3 WHERE id = $4',
            ['kakao', kakaoId, profileImage, existingUser.id]
          );
          user = { ...existingUser, provider: 'kakao', provider_id: kakaoId, profile_image_url: profileImage };
          isNewUser = false;
        }
      }

      if (!user) {
        // 완전히 새로운 사용자 생성
        const username = email || `kakao_${kakaoId}`;

        const insertResult = await query(
          `INSERT INTO users (username, name, provider, provider_id, profile_image_url)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, username, name, provider, provider_id, profile_image_url, birthdate`,
          [username, nickname, 'kakao', kakaoId, profileImage]
        );

        user = insertResult.rows[0];
      }
    }

    // 4. JWT 토큰 생성
    const payload = {
      user: {
        id: user.id,
        name: user.name,
      },
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    // 5. 응답
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        birthdate: user.birthdate,
        profile_image_url: user.profile_image_url,
        provider: user.provider,
      },
      isNewUser, // 프론트엔드에서 추가 정보 입력 유도에 사용
    });

  } catch (error) {
    console.error('Kakao login error:', error);

    if (axios.isAxiosError(error)) {
      const kakaoError = error.response?.data;
      console.error('Kakao API error:', kakaoError);
      return res.status(400).json({
        error: '카카오 로그인 처리 중 오류가 발생했습니다.',
        details: kakaoError
      });
    }

    const message = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ error: message });
  }
};

/**
 * 카카오 로그인 URL 생성
 * GET /api/auth/kakao/url
 */
export const getKakaoAuthUrl = (req: Request, res: Response) => {
  const kakaoAuthUrl = 'https://kauth.kakao.com/oauth/authorize';

  const params = new URLSearchParams({
    client_id: process.env.KAKAO_REST_API_KEY!,
    redirect_uri: process.env.KAKAO_REDIRECT_URI!,
    response_type: 'code',
    scope: 'profile_nickname profile_image account_email',
  });

  const url = `${kakaoAuthUrl}?${params.toString()}`;

  res.json({ url });
};

/**
 * 카카오 계정 연결 해제 (회원 탈퇴 시)
 */
export const unlinkKakao = async (kakaoAccessToken: string): Promise<void> => {
  try {
    await axios.post(
      'https://kapi.kakao.com/v1/user/unlink',
      {},
      {
        headers: {
          Authorization: `Bearer ${kakaoAccessToken}`,
        },
      }
    );
  } catch (error) {
    console.error('Kakao unlink error:', error);
    throw error;
  }
};
```

### 5.2 라우트 추가

```typescript
// src/routes/authRoutes.ts 에 추가

import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { kakaoCallback, getKakaoAuthUrl } from '../controllers/kakaoAuthController';

const router = Router();

// 기존 라우트
router.post('/register', register);
router.post('/login', login);

// 카카오 로그인 라우트
router.get('/kakao/url', getKakaoAuthUrl);
router.post('/kakao/callback', kakaoCallback);

export default router;
```

### 5.3 기존 authRoutes.ts 수정

기존 파일이 있다면 카카오 라우트만 추가:

```typescript
// src/routes/authRoutes.ts

import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { kakaoCallback, getKakaoAuthUrl } from '../controllers/kakaoAuthController';

const router = Router();

// 이메일 인증
router.post('/register', register);
router.post('/login', login);

// 카카오 로그인
router.get('/kakao/url', getKakaoAuthUrl);
router.post('/kakao/callback', kakaoCallback);

export default router;
```

---

## 6. 프론트엔드 구현

### 6.1 카카오 인증 서비스 추가

```typescript
// client/src/services/kakaoAuthService.ts

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
```

### 6.2 카카오 콜백 페이지 생성

```tsx
// client/src/pages/KakaoCallback.tsx

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts';
import { kakaoAuthService } from '../services/kakaoAuthService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.kakao};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Message = styled.p`
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.secondary};
`;

const ErrorMessage = styled.p`
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.error};
`;

const KakaoCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processKakaoLogin = async () => {
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');

      // 에러 파라미터가 있는 경우 (사용자가 취소한 경우 등)
      if (errorParam) {
        const errorDescription = searchParams.get('error_description') || '로그인이 취소되었습니다.';
        setError(errorDescription);
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      // 인가 코드가 없는 경우
      if (!code) {
        setError('인가 코드가 없습니다.');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        // 백엔드로 인가 코드 전송
        const response = await kakaoAuthService.login(code);

        if (response.success && response.data) {
          const { token, user, isNewUser } = response.data;

          // AuthContext의 login 함수 호출
          login(user, token);

          // 신규 사용자인 경우 추가 정보 입력 페이지로 이동
          if (isNewUser) {
            // 추가 정보 입력이 필요하다는 플래그 저장
            sessionStorage.setItem('needsAdditionalInfo', 'true');
            navigate('/', { state: { openSignUpInfo: true } });
          } else {
            navigate('/');
          }
        } else {
          setError(response.error || '로그인 처리 중 오류가 발생했습니다.');
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (err) {
        console.error('Kakao login error:', err);
        setError('로그인 처리 중 오류가 발생했습니다.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    processKakaoLogin();
  }, [searchParams, login, navigate]);

  return (
    <Container>
      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <>
          <LoadingSpinner />
          <Message>카카오 로그인 처리 중...</Message>
        </>
      )}
    </Container>
  );
};

export default KakaoCallback;
```

### 6.3 라우터에 콜백 페이지 추가

```tsx
// client/src/App.tsx 에 라우트 추가

import KakaoCallback from './pages/KakaoCallback';

// Routes 내부에 추가
<Route path="/auth/kakao/callback" element={<KakaoCallback />} />
```

### 6.4 LoginModal 카카오 버튼 수정

```tsx
// client/src/components/modals/LoginModal.tsx
// 카카오 버튼 클릭 핸들러 수정

import { kakaoAuthService } from '../../services/kakaoAuthService';

// 컴포넌트 내부
const handleKakaoLogin = async () => {
  try {
    const response = await kakaoAuthService.getAuthUrl();

    if (response.success && response.data?.url) {
      // 카카오 인증 페이지로 리다이렉트
      window.location.href = response.data.url;
    } else {
      console.error('Failed to get Kakao auth URL');
      alert('카카오 로그인을 시작할 수 없습니다.');
    }
  } catch (error) {
    console.error('Kakao login error:', error);
    alert('카카오 로그인 중 오류가 발생했습니다.');
  }
};

// 버튼에 onClick 연결
<Button variant="kakao" fullWidth onClick={handleKakaoLogin}>
  <KakaoIcon />
  카카오로 시작하기
</Button>
```

### 6.5 SignUpModal 카카오 버튼 수정

```tsx
// client/src/components/modals/SignUpModal.tsx
// 동일한 방식으로 카카오 버튼 수정

import { kakaoAuthService } from '../../services/kakaoAuthService';

const handleKakaoSignUp = async () => {
  try {
    const response = await kakaoAuthService.getAuthUrl();

    if (response.success && response.data?.url) {
      window.location.href = response.data.url;
    } else {
      alert('카카오 회원가입을 시작할 수 없습니다.');
    }
  } catch (error) {
    console.error('Kakao signup error:', error);
    alert('카카오 회원가입 중 오류가 발생했습니다.');
  }
};
```

---

## 7. 환경 변수 설정

### 7.1 루트 .env 파일

```env
# .env (루트 디렉토리)

# 기존 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=forever_love
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key

# 카카오 로그인 설정
KAKAO_REST_API_KEY=your_kakao_rest_api_key
KAKAO_REDIRECT_URI=http://localhost:5173/auth/kakao/callback
# KAKAO_CLIENT_SECRET=your_client_secret  # 선택 사항 (보안 강화 시)
```

### 7.2 프로덕션 환경 변수

```env
# 프로덕션 환경
KAKAO_REDIRECT_URI=https://your-domain.com/auth/kakao/callback
```

### 7.3 .env.example 생성

```env
# .env.example

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=forever_love
DB_USER=postgres
DB_PASSWORD=

# JWT
JWT_SECRET=

# Kakao OAuth
KAKAO_REST_API_KEY=
KAKAO_REDIRECT_URI=http://localhost:5173/auth/kakao/callback
# KAKAO_CLIENT_SECRET=
```

---

## 8. 테스트

### 8.1 테스트 체크리스트

| 테스트 항목 | 예상 결과 | 확인 |
|------------|----------|------|
| 카카오 로그인 버튼 클릭 | 카카오 인증 페이지로 이동 | ⬜ |
| 카카오 로그인 승인 | 콜백 페이지 → 메인으로 리다이렉트 | ⬜ |
| 로그인 취소 | 에러 메시지 표시 후 메인으로 이동 | ⬜ |
| 신규 사용자 | isNewUser=true, 추가정보 입력 유도 | ⬜ |
| 기존 사용자 | 바로 로그인 완료 | ⬜ |
| 동일 이메일 계정 | 기존 계정에 카카오 연동 | ⬜ |

### 8.2 수동 테스트 순서

1. **서버 실행**
   ```bash
   npm run dev
   ```

2. **브라우저에서 테스트**
   - http://localhost:5173 접속
   - 로그인 모달 열기
   - "카카오로 시작하기" 클릭
   - 카카오 계정 로그인 및 동의
   - 리다이렉트 후 로그인 상태 확인

3. **DB 확인**
   ```sql
   SELECT id, username, name, provider, provider_id
   FROM users
   WHERE provider = 'kakao';
   ```

### 8.3 API 테스트 (선택)

```bash
# 카카오 URL 가져오기
curl http://localhost:3000/api/auth/kakao/url

# 응답 예시
{
  "url": "https://kauth.kakao.com/oauth/authorize?client_id=..."
}
```

---

## 9. 문제 해결

### 9.1 일반적인 오류

#### "KOE101: Invalid client_id"

**원인**: REST API 키가 잘못됨
**해결**:
1. 카카오 개발자 콘솔에서 REST API 키 재확인
2. `.env` 파일의 `KAKAO_REST_API_KEY` 값 확인

#### "KOE006: Redirect URI mismatch"

**원인**: Redirect URI가 등록된 것과 다름
**해결**:
1. 카카오 개발자 콘솔 → 카카오 로그인 → Redirect URI 확인
2. `.env`의 `KAKAO_REDIRECT_URI`와 정확히 일치해야 함
3. 프로토콜(http/https), 포트, 경로 모두 일치 필수

#### "KOE303: Demo app limit exceeded"

**원인**: 테스트 앱의 사용자 수 제한 초과
**해결**:
1. 카카오 개발자 콘솔 → 앱 설정 → 팀 관리
2. 테스트 사용자 추가 (최대 10명)
3. 또는 앱 심사 요청 (프로덕션)

#### "카카오 로그인 처리 중 오류"

**디버깅 방법**:
1. 브라우저 개발자 도구 → 네트워크 탭 확인
2. 서버 콘솔 로그 확인
3. `console.error`로 상세 에러 확인

### 9.2 보안 고려사항

1. **REST API 키 노출 금지**
   - `.env` 파일 gitignore 확인
   - 프론트엔드 코드에 키 하드코딩 금지

2. **HTTPS 필수 (프로덕션)**
   - 프로덕션에서는 반드시 HTTPS 사용
   - Redirect URI도 HTTPS로 등록

3. **Client Secret 사용 권장**
   - 카카오 개발자 콘솔에서 Client Secret 생성
   - 백엔드에서 토큰 요청 시 함께 전송

### 9.3 자주 묻는 질문

**Q: 이메일이 안 받아지는 경우?**
A: 카카오 계정에 이메일이 없거나 사용자가 동의하지 않은 경우. `email`은 선택 동의 항목이므로 null 처리 필요.

**Q: 프로필 사진 URL이 만료되나요?**
A: 카카오 프로필 사진 URL은 영구적이지 않음. 필요시 서버에 저장하거나 주기적으로 갱신.

**Q: 로그아웃 시 카카오 연결도 해제해야 하나요?**
A: 일반적으로 불필요. 완전 탈퇴 시에만 `unlinkKakao()` 호출.

---

## 부록: 파일 구조 요약

```
📁 프로젝트 루트
├── 📄 .env                              # 환경 변수 (KAKAO_REST_API_KEY 등)
├── 📁 src/
│   ├── 📁 controllers/
│   │   ├── 📄 authController.ts         # 기존 인증 (이메일/비밀번호)
│   │   └── 📄 kakaoAuthController.ts    # 🆕 카카오 인증
│   └── 📁 routes/
│       └── 📄 authRoutes.ts             # 인증 라우트 (카카오 추가)
├── 📁 client/src/
│   ├── 📁 pages/
│   │   └── 📄 KakaoCallback.tsx         # 🆕 카카오 콜백 페이지
│   ├── 📁 services/
│   │   ├── 📄 authService.ts            # 기존 인증 서비스
│   │   └── 📄 kakaoAuthService.ts       # 🆕 카카오 인증 서비스
│   ├── 📁 components/modals/
│   │   ├── 📄 LoginModal.tsx            # 카카오 버튼 onClick 수정
│   │   └── 📄 SignUpModal.tsx           # 카카오 버튼 onClick 수정
│   └── 📄 App.tsx                       # 라우트 추가
└── 📁 database/migrations/
    └── 📄 add_social_login_fields.sql   # 🆕 DB 스키마 변경
```

---

## 다음 단계

카카오 로그인 구현이 완료되면:

1. **구글 로그인 구현** - 유사한 OAuth 2.0 흐름
2. **네이버 로그인 구현** - 유사한 OAuth 2.0 흐름
3. **소셜 계정 연동 관리** - 마이페이지에서 소셜 계정 연결/해제
4. **프로덕션 배포** - HTTPS, 도메인 등록

---

**작성자**: Claude AI
**참고 문서**: [카카오 로그인 REST API](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)
