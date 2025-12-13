# 시스템 아키텍처

> 🏗️ **이 문서는 프로젝트의 전체 시스템 아키텍처와 기술 스택을 설명합니다.**

**마지막 업데이트**: 2025-12-10

---

## 📋 프로젝트 개요

**프로젝트명**: Forever Love Project (영원히 정말 사랑해 진짜로)
**설명**: 디지털 영정사진 보관소 및 유산 관리 서비스
**버전**: 1.0.0 (개발 중)

---

## 🏛️ 전체 아키텍처

```
┌─────────────────────────────────────────────────────────────────────┐
│                         클라이언트 (Browser)                          │
│                    React 19 + TypeScript + Vite                     │
│                         Tailwind CSS                                 │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  │ HTTP/HTTPS
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Express.js 서버                              │
│                     Node.js + TypeScript                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Middleware Layer                                            │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │   │
│  │  │  CORS   │ │ Helmet  │ │ Morgan  │ │  JSON   │            │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  API Routes                                                  │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │   │
│  │  │  /api/auth   │ │ /api/users  │ │ /api/media   │         │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Controllers → Services → Database                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│      PostgreSQL 15          │   │     File Storage            │
│   ┌─────────────────────┐   │   │   ┌───────────────────┐     │
│   │  users              │   │   │   │  /uploads/        │     │
│   │  media              │   │   │   │  - 원본 이미지    │     │
│   │  diaries            │   │   │   │  - 썸네일         │     │
│   │  friendships (예정) │   │   │   │  - 오디오         │     │
│   └─────────────────────┘   │   │   └───────────────────┘     │
└─────────────────────────────┘   └─────────────────────────────┘
```

---

## 🛠️ 기술 스택

### Backend (서버)

| 기술 | 버전 | 용도 |
|------|------|------|
| **Node.js** | 20.x LTS | 런타임 환경 |
| **Express.js** | 4.18.x | 웹 프레임워크 |
| **TypeScript** | 5.3.x | 타입 안전성 |
| **PostgreSQL** | 15.x | 관계형 데이터베이스 |
| **pg** | 8.11.x | PostgreSQL 클라이언트 |

### 인증 및 보안

| 기술 | 용도 |
|------|------|
| **bcrypt** | 비밀번호 해싱 (salt rounds: 10) |
| **jsonwebtoken** | JWT 토큰 기반 인증 |
| **helmet** | HTTP 보안 헤더 |
| **cors** | Cross-Origin 요청 처리 |

### 파일 처리

| 기술 | 용도 |
|------|------|
| **multer** | 파일 업로드 처리 |
| **sharp** | 이미지 리사이징/최적화 (WebP 변환, 썸네일 생성) |

### Frontend (클라이언트)

| 기술 | 버전 | 용도 |
|------|------|------|
| **React** | 19.2.x | UI 라이브러리 |
| **TypeScript** | 5.9.x | 타입 안전성 |
| **Vite** | 7.2.x | 빌드 도구/개발 서버 |
| **React Router** | 7.9.x | 클라이언트 라우팅 |
| **Tailwind CSS** | 3.4.x | 유틸리티 기반 CSS |
| **PostCSS** | 8.x | CSS 후처리 |

### 개발 도구

| 도구 | 용도 |
|------|------|
| **nodemon** | 서버 자동 재시작 |
| **ts-node** | TypeScript 직접 실행 |
| **concurrently** | 병렬 스크립트 실행 |
| **ESLint** | 코드 품질 검사 |

---

## 🔄 데이터 흐름

### 인증 흐름 (JWT)

```
1. 로그인 요청
   Client → POST /api/auth/login (username, password)

2. 서버 검증
   Server → bcrypt.compare(password, hashedPassword)

3. 토큰 발급
   Server → jwt.sign({ userId, name }, JWT_SECRET, { expiresIn: '1h' })

4. 클라이언트 저장
   Client → localStorage.setItem('token', token)

5. 인증된 요청
   Client → Authorization: Bearer {token}
```

### 이미지 업로드 흐름

```
1. 파일 선택
   Client → <input type="file" accept="image/*" />

2. 업로드 요청
   Client → POST /api/media (multipart/form-data)

3. 파일 저장
   Multer → /uploads/{filename}

4. 이미지 처리
   Sharp → 300x400 썸네일 생성 (WebP, 80% 품질)

5. DB 기록
   PostgreSQL → INSERT INTO media (...)

6. 응답
   Server → { original, thumbnail }
```

---

## 🗄️ 데이터베이스 스키마

### users 테이블

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20),
  birthdate DATE,
  address VARCHAR(255),
  detail_address VARCHAR(255),
  zipcode VARCHAR(10),
  insurance_status VARCHAR(50),      -- 'joined', 'not_joined', 'consultation_requested'
  insurance_name VARCHAR(100),
  death_certifier_1_name VARCHAR(100),
  death_certifier_1_phone VARCHAR(20),
  death_certifier_1_relation VARCHAR(50),
  death_certifier_2_name VARCHAR(100),
  death_certifier_2_phone VARCHAR(20),
  death_certifier_2_relation VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### media 테이블

```sql
CREATE TABLE media (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'audio')),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(50),
  is_thumbnail BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### diaries 테이블

```sql
CREATE TABLE diaries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  audio_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 예정 테이블 (친구 시스템)

- `relationship_types`: 관계 유형 (가족, 찐친, 친구)
- `friend_requests`: 친구 신청
- `friendships`: 친구 관계
- `diary_visibility`: 일기 공개 설정

---

## 🌐 API 엔드포인트

### 인증 API (`/api/auth`)

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/register` | 회원가입 |
| POST | `/login` | 로그인 |

### 사용자 API (`/api/users`)

| Method | Endpoint | 설명 |
|--------|----------|------|
| PUT | `/profile/:id` | 프로필 업데이트 |

### 미디어 API (`/api/media`)

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/upload` | 이미지/오디오 업로드 |

### 헬스체크 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/health` | 서버 상태 확인 |

---

## 📁 계층 구조

```
┌─────────────────────────────────────────────────────────────┐
│                       Presentation Layer                     │
│                   (React Components, Pages)                  │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                        API Layer                             │
│                     (Express Routes)                         │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                      Business Layer                          │
│                 (Controllers, Services)                      │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                        Data Layer                            │
│                  (PostgreSQL, File System)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 보안 고려사항

### 구현됨
- ✅ 비밀번호 해싱 (bcrypt, salt 10)
- ✅ JWT 토큰 인증
- ✅ Helmet 보안 헤더
- ✅ CORS 설정
- ✅ 환경변수로 민감정보 관리

### 예정
- ⏳ Rate limiting
- ⏳ Input validation (Joi/Zod)
- ⏳ SQL Injection 방지 (Prepared Statements 사용 중)
- ⏳ XSS 방지
- ⏳ HTTPS 적용 (배포 시)

---

## 🚀 배포 아키텍처 (예정)

### GCP 기반 (권장)

```
┌─────────────────────────────────────────────────────────────┐
│                     Firebase Hosting                         │
│                  (React 빌드 결과물, CDN)                    │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                       Cloud Run                              │
│              (Docker 컨테이너, 자동 스케일링)                │
└───────────────────────────┬─────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│      Cloud SQL          │   │    Cloud Storage        │
│    (PostgreSQL)         │   │   (이미지/오디오)       │
└─────────────────────────┘   └─────────────────────────┘
```

---

## 📊 성능 최적화

### 이미지 처리
- **원본 보존**: 고해상도 원본 저장
- **썸네일 생성**: 300x400px, WebP 포맷, 80% 품질
- **Lazy Loading**: 클라이언트에서 지연 로딩

### 데이터베이스
- **인덱스**: `users.username` (UNIQUE)
- **CASCADE DELETE**: 사용자 삭제 시 관련 데이터 자동 삭제
- **Connection Pool**: pg Pool 사용

---

## 🔮 향후 확장 계획

1. **친구 시스템**: 비대칭 관계 기반 친구 관리
2. **일기장 공개 설정**: 관계별 공개 범위 설정
3. **소셜 로그인**: 카카오, 구글 OAuth
4. **실시간 알림**: WebSocket/SSE 기반
5. **결제 시스템**: PG 연동
6. **모바일 앱**: React Native 또는 Flutter

---

## 📚 참고 문서

- [기획서](../info/프로젝트_기획서.md)
- [기능명세서](../info/기능명세서.md)
- [친구 시스템 설계](./friend-system-design.md)
- [기술 결정 기록](./decisions.md)
