# 프로젝트 요약서

> 📋 **Forever Love Project - 디지털 영정사진 보관소 및 유산 관리 서비스**

**작성일**: 2025-12-10
**버전**: 1.0.0 (개발 중)
**브랜치**: `design` (현재), `main` (배포용)

---

## 🎯 프로젝트 개요

### 서비스명
**영원히 정말 사랑해 진짜로** (Forever Love Project)

### 서비스 목적
- 개인의 영정사진과 추억을 안전하게 보관하고 관리
- 사후 가족 및 지인들이 고인의 기록을 열람할 수 있는 플랫폼 제공
- 디지털 시대의 새로운 추모 문화 창조

### 타겟 사용자
- **주 타겟**: 20-60대 성인 (가장 아름다운 시기의 사진 보관)
- **부 타겟**: 자녀가 부모님을 위해 서비스 구매

---

## 🛠️ 기술 스택

### Backend
| 기술 | 버전 | 용도 |
|------|------|------|
| Node.js | 20.x LTS | 런타임 환경 |
| Express.js | 4.18.x | 웹 프레임워크 |
| TypeScript | 5.3.x | 타입 안전성 |
| PostgreSQL | 15.x | 관계형 데이터베이스 |
| JWT | - | 토큰 기반 인증 |
| bcrypt | 6.x | 비밀번호 해싱 |
| multer | 1.4.x | 파일 업로드 |
| sharp | 0.32.x | 이미지 처리 |

### Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19.2.x | UI 라이브러리 |
| TypeScript | 5.9.x | 타입 안전성 |
| Vite | 7.2.x | 빌드 도구 |
| React Router | 7.9.x | 클라이언트 라우팅 |
| Tailwind CSS | 3.4.x | 유틸리티 CSS |

### 인프라 (예정)
| 서비스 | 용도 |
|--------|------|
| GCP Cloud Run | 백엔드 서버 (Serverless) |
| GCP Cloud SQL | PostgreSQL 데이터베이스 |
| Firebase Hosting | 프론트엔드 배포 (CDN) |
| GCP Cloud Storage | 이미지/오디오 저장 |

---

## 📦 핵심 기능

### ✅ 구현 완료

#### 1. 인증 시스템
- **회원가입**: 이메일 기반 회원가입
- **로그인**: JWT 토큰 인증
- **프로필 관리**: 생년월일, 주소, 보험 정보, 사망확인인 정보

#### 2. UI/UX
- **메인 페이지 (Home)**: 서비스 소개 및 CTA
- **로그인 페이지**: 로그인/회원가입 모달
- **마이스페이스**: 개인 공간 (사전/사후 상태)
- **3D 모달 효과**: 인터랙티브 UI

#### 3. 미디어 처리
- **이미지 업로드**: multer 기반
- **썸네일 생성**: sharp (300x400, WebP, 80% 품질)
- **오디오 검증**: 1.5MB 제한, MP3/AAC/WebM 지원

### ⏳ 구현 예정

#### Phase 1: 데이터베이스 설정 (다음 단계)
- [ ] PostgreSQL 설치 및 실행
- [ ] 데이터베이스 생성 (`forever_love`)
- [ ] 테이블 생성 (`database/schema.sql`)
- [ ] 연결 확인 (`src/check-db.ts`)

#### Phase 2: 친구 관계 시스템
- [ ] 관계 타입 (가족, 찐친, 친구)
- [ ] 친구 검색 및 신청
- [ ] 친구 요청 수락/거절
- [ ] 비대칭 관계 관리

#### Phase 3: 일기장 기능
- [ ] 텍스트 일기 (하루 1-2회)
- [ ] 음성 일기 (월 30분)
- [ ] 관계별 공개 범위 설정

#### Phase 4: 마이스페이스 동적 연동
- [ ] 실제 데이터 표시
- [ ] 영정사진 업로드/교체
- [ ] 일기장 연동

#### Phase 5: 배포
- [ ] GCP Cloud Run 배포
- [ ] Firebase Hosting 설정
- [ ] HTTPS 적용
- [ ] 도메인 연결

---

## 📁 프로젝트 구조

```
project-root/
├── src/                    # 백엔드 (Node.js/Express)
│   ├── app.ts             # Express 앱 설정
│   ├── server.ts          # 서버 진입점
│   ├── config/db.ts       # PostgreSQL 설정
│   ├── controllers/       # 요청 처리
│   ├── routes/            # API 라우트
│   └── services/          # 비즈니스 로직
│
├── client/                 # 프론트엔드 (React/Vite)
│   └── src/
│       ├── pages/         # 페이지 컴포넌트
│       └── components/    # 재사용 컴포넌트
│
├── database/              # DB 스키마
├── docs/                  # 문서
│   ├── task.md           # 작업 진행 상황
│   ├── structure.md      # 프로젝트 구조
│   ├── architecture.md   # 시스템 아키텍처
│   ├── decisions.md      # 기술 결정 기록
│   └── history.md        # 작업 이력
│
└── info/                  # 기획 문서
    ├── 프로젝트_기획서.md
    └── 기능명세서.md
```

---

## 🌐 API 엔드포인트

### 인증 (`/api/auth`)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/register` | 회원가입 |
| POST | `/login` | 로그인 |

### 사용자 (`/api/users`)
| Method | Endpoint | 설명 |
|--------|----------|------|
| PUT | `/profile/:id` | 프로필 업데이트 |

### 미디어 (`/api/media`)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/upload` | 파일 업로드 |

### 헬스체크
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/health` | 서버 상태 |

---

## 🗄️ 데이터베이스

### 현재 테이블
| 테이블 | 설명 |
|--------|------|
| `users` | 사용자 정보 (인증, 프로필, 보험, 사망확인인) |
| `media` | 미디어 파일 (이미지, 오디오) |
| `diaries` | 일기장 |

### 예정 테이블
| 테이블 | 설명 |
|--------|------|
| `relationship_types` | 관계 타입 (가족, 찐친, 친구) |
| `friend_requests` | 친구 신청 |
| `friendships` | 친구 관계 (비대칭) |
| `diary_visibility` | 일기 공개 설정 |

---

## 🚀 실행 방법

### 사전 요구사항
- Node.js 20.x LTS
- PostgreSQL 15.x
- npm 또는 yarn

### 설치
```bash
# 루트 의존성 설치
npm install

# 클라이언트 의존성 설치
cd client && npm install
```

### 환경 변수 설정
```bash
# .env.example을 .env로 복사 후 수정
cp .env.example .env

# .env 내용
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=forever_love
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
```

### 데이터베이스 설정
```bash
# PostgreSQL에서 데이터베이스 생성
createdb forever_love

# 스키마 적용
psql -d forever_love -f database/schema.sql
```

### 개발 서버 실행
```bash
# 백엔드 + 프론트엔드 동시 실행
npm run dev

# 또는 개별 실행
npm run dev:server  # 백엔드만
npm run dev:client  # 프론트엔드만
```

### 빌드
```bash
# 백엔드 빌드
npm run build

# 프론트엔드 빌드
cd client && npm run build
```

---

## 📊 진행 상황

### 완료 (4/7)
- ✅ 프로젝트 초기화 및 구조 설정
- ✅ 디자인 마이그레이션 (WordPress → React)
- ✅ 인증 시스템 (로그인/회원가입)
- ✅ 미디어 처리 서비스

### 진행 중
- 🔄 문서 정비 및 체계화

### 대기 중
- ⏳ PostgreSQL 데이터베이스 설정
- ⏳ 친구 관계 시스템

---

## 📚 관련 문서

| 문서 | 설명 |
|------|------|
| [task.md](./task.md) | 작업 진행 상황 체크리스트 |
| [structure.md](./structure.md) | 프로젝트 파일 구조 |
| [architecture.md](./architecture.md) | 시스템 아키텍처 |
| [decisions.md](./decisions.md) | 기술 결정 기록 (ADR) |
| [history.md](./history.md) | 작업 이력 (롤백용) |
| [friend-system-design.md](./friend-system-design.md) | 친구 시스템 설계 |
| [프로젝트_기획서.md](../info/프로젝트_기획서.md) | 전체 기획서 |
| [기능명세서.md](../info/기능명세서.md) | 상세 기능 명세 |

---

## 👥 팀

**개발**: AI 협업 개발 (Claude Code 활용)

---

## 📝 라이선스

ISC License

---

## 🔗 링크

- **Git Repository**: `main`, `design` 브랜치
- **배포 URL**: (예정)
