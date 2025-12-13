# 프로젝트 구조

> 📁 **이 파일로 프로젝트의 파일/폴더 구조를 파악합니다. 새 파일 추가 시 여기에 기록하세요.**

**마지막 업데이트**: 2025-12-13

---

## 📂 전체 디렉토리 구조

```
project-root/
├── 📚 docs/                     # 모든 문서 파일
│   ├── task.md                 # 작업 진행 상황 (체크리스트)
│   ├── structure.md            # (이 파일) 프로젝트 구조
│   ├── architecture.md         # 시스템 아키텍처
│   ├── conventions.md          # 코딩 컨벤션
│   ├── decisions.md            # 설계 결정 기록 (ADR)
│   ├── friend-system-design.md # 친구 시스템 설계 문서
│   ├── implementation_plan.md  # 구현 계획
│   ├── troubleshooting.md      # 문제 해결 가이드
│   ├── DB_SETUP_GUIDE.md       # 데이터베이스 설정 가이드
│   ├── history.md              # 작업 이력 (롤백용)
│   ├── refactoring-guide.md    # 🆕 프론트엔드 리팩토링 가이드
│   └── gcp-infrastructure.md   # 🆕 GCP 인프라 계획서
│
├── 📖 info/                     # 기획 문서
│   ├── 프로젝트_기획서.md       # 전체 기획서
│   ├── 기능명세서.md            # 상세 기능 명세
│   └── 수익지출_예상서_제미나이버전.md
│
├── 💻 src/                      # 백엔드 소스 코드 (Node.js/Express)
│   ├── app.ts                  # Express 앱 설정 (미들웨어, 라우트)
│   ├── server.ts               # 서버 진입점 (PORT 설정)
│   ├── check-db.ts             # DB 연결 확인 스크립트
│   │
│   ├── config/                 # ⚙️ 설정 파일
│   │   └── db.ts               # PostgreSQL 연결 설정
│   │
│   ├── controllers/            # 🎮 요청 처리 컨트롤러
│   │   ├── authController.ts   # 인증 (로그인/회원가입)
│   │   ├── userController.ts   # 사용자 프로필 관리
│   │   ├── friendController.ts # 친구 관계 시스템
│   │   ├── mediaController.ts  # 🆕 미디어 업로드/삭제
│   │   ├── diaryController.ts  # 🆕 일기장 CRUD
│   │   └── myspaceController.ts # 🆕 마이스페이스 통합 API
│   │
│   ├── routes/                 # 🌐 API 라우터
│   │   ├── authRoutes.ts       # /api/auth/* 엔드포인트
│   │   ├── userRoutes.ts       # /api/users/* 엔드포인트
│   │   ├── mediaRoutes.ts      # /api/media/* 엔드포인트
│   │   ├── friendRoutes.ts     # /api/friends/* 엔드포인트
│   │   ├── diaryRoutes.ts      # 🆕 /api/diaries/* 엔드포인트
│   │   └── myspaceRoutes.ts    # 🆕 /api/myspace/* 엔드포인트
│   │
│   ├── middleware/             # 🔒 미들웨어
│   │   └── auth.ts             # 🆕 JWT 인증 미들웨어
│   │
│   └── services/               # 🔧 비즈니스 로직
│       └── mediaService.ts     # 이미지/오디오 처리
│
├── 🎨 client/                   # 프론트엔드 (React + Vite + styled-components)
│   ├── public/                 # 정적 파일
│   │   ├── css/                # Elementor 기반 CSS (레거시)
│   │   ├── js/                 # jQuery, Elementor JS (레거시)
│   │   └── images/             # 이미지 리소스
│   │
│   ├── src/
│   │   ├── main.tsx            # React 진입점
│   │   ├── App.tsx             # 메인 앱 (라우터, ThemeProvider, AuthProvider)
│   │   ├── App.css             # 글로벌 스타일 (레거시)
│   │   │
│   │   ├── styles/             # 🎨 스타일 시스템 (styled-components)
│   │   │   ├── theme.ts            # 테마 정의 (색상, 간격, 타이포그래피)
│   │   │   ├── styled.d.ts         # styled-components 타입 선언
│   │   │   ├── GlobalStyles.ts     # 글로벌 스타일 (CSS 리셋)
│   │   │   └── index.ts            # 배럴 export
│   │   │
│   │   ├── contexts/           # 🔐 React 컨텍스트
│   │   │   ├── AuthContext.tsx     # 인증 컨텍스트 (로그인/로그아웃/회원가입)
│   │   │   └── index.ts            # 배럴 export
│   │   │
│   │   ├── services/           # 🔧 API 서비스 레이어
│   │   │   ├── api.ts              # HTTP 요청 유틸리티
│   │   │   ├── authService.ts      # 인증 관련 API
│   │   │   ├── friendService.ts    # 친구 관계 API
│   │   │   ├── mediaService.ts     # 🆕 미디어 업로드/삭제 API
│   │   │   ├── diaryService.ts     # 🆕 일기장 CRUD API
│   │   │   ├── myspaceService.ts   # 🆕 마이스페이스 API
│   │   │   └── index.ts            # 배럴 export
│   │   │
│   │   ├── types/              # 📝 TypeScript 타입 정의
│   │   │   └── index.ts            # User, Media, Diary, MySpaceData 등 공통 타입
│   │   │
│   │   ├── pages/              # 📄 페이지 컴포넌트
│   │   │   ├── Home.tsx            # 메인 페이지 (비로그인)
│   │   │   ├── Login.tsx           # 로그인 페이지 (로그인 후)
│   │   │   ├── MySpace.tsx         # 마이스페이스 페이지
│   │   │   └── Friends.tsx         # 🆕 친구 관리 페이지
│   │   │
│   │   └── components/         # 🧩 재사용 컴포넌트
│   │       ├── common/             # 공통 UI 컴포넌트
│   │       │   ├── Button.tsx          # 버튼 (primary/secondary/kakao/google)
│   │       │   ├── Input.tsx           # 입력 필드
│   │       │   ├── FormGroup.tsx       # 폼 그룹 (라벨 + 입력)
│   │       │   ├── Card.tsx            # 카드 컴포넌트
│   │       │   ├── Modal.tsx           # 모달 (Portal 기반)
│   │       │   ├── Divider.tsx         # 구분선
│   │       │   ├── Flex.tsx            # Flexbox 유틸리티
│   │       │   ├── Typography.tsx      # 텍스트 스타일링
│   │       │   ├── SocialIcons.tsx     # 소셜 로그인 아이콘
│   │       │   └── index.ts            # 배럴 export
│   │       │
│   │       ├── layout/             # 레이아웃 컴포넌트
│   │       │   ├── Header.tsx          # 통합 헤더 (guest/authenticated/minimal)
│   │       │   ├── Footer.tsx          # 통합 푸터
│   │       │   └── index.ts            # 배럴 export
│   │       │
│   │       ├── modals/             # 모달 컴포넌트
│   │       │   ├── LoginModal.tsx      # 로그인 모달
│   │       │   ├── SignUpModal.tsx     # 회원가입 모달
│   │       │   ├── SignUpInfoModal.tsx # 추가정보 입력 모달
│   │       │   ├── ProfileModal.tsx    # 프로필 수정 모달
│   │       │   ├── DiaryWriteModal.tsx # 일기 작성 모달
│   │       │   ├── DiaryViewModal.tsx  # 일기 상세 보기 모달
│   │       │   ├── MySpaceModal.tsx    # 🆕 마이스페이스 모달 (기능 통합)
│   │       │   └── index.ts            # 배럴 export
│   │       │
│   │       ├── friends/            # 🆕 친구 관리 컴포넌트
│   │       │   ├── FriendCard.tsx      # 친구 카드 (정보/관계 수정/삭제)
│   │       │   ├── FriendList.tsx      # 친구 목록 (관계 타입별 그룹화)
│   │       │   ├── FriendRequestList.tsx  # 받은/보낸 친구 신청 목록
│   │       │   ├── FriendSearch.tsx    # 친구 검색 및 신청
│   │       │   └── index.ts            # 배럴 export
│   │       │
│   │       ├── OriginalLinkInBio.tsx   # 링크인바이오 컴포넌트
│   │       └── myspace/            # 마이스페이스 서브 컴포넌트
│   │           ├── ProfileSection.tsx    # 🆕 프로필 이미지 + 남기는 말
│   │           ├── DiarySection.tsx      # 🆕 일기 목록 (공개범위 배지)
│   │           ├── MediaGallery.tsx      # 🆕 이미지/오디오 갤러리 + 업로드
│   │           ├── FriendStats.tsx       # 🆕 관계별 친구 수 통계
│   │           ├── SpaceNavigation.tsx   # 🆕 탭 네비게이션
│   │           ├── MySpacePre.tsx        # 사전 상태 (레거시)
│   │           ├── MySpacePost.tsx       # 사후 상태 (레거시)
│   │           ├── FriendSpacePre.tsx    # 친구 공간 사전 (레거시)
│   │           ├── FriendSpacePost.tsx   # 친구 공간 사후 (레거시)
│   │           └── index.ts              # 🆕 배럴 export
│   │
│   ├── dist/                   # 빌드 결과물
│   ├── package.json            # 클라이언트 의존성
│   ├── vite.config.ts          # Vite 설정
│   ├── tailwind.config.js      # Tailwind CSS 설정
│   ├── postcss.config.js       # PostCSS 설정
│   └── tsconfig.json           # TypeScript 설정
│
├── 🗄️ database/                 # 데이터베이스
│   └── schema.sql              # PostgreSQL 스키마 정의
│
├── 📦 uploads/                  # 업로드된 파일 저장소
│
├── 🎨 css/                      # 레거시 CSS (WordPress 이식)
├── 📜 js/                       # 레거시 JS (Elementor)
├── 🖼️ images/                   # 레거시 이미지
├── 🔤 fonts/                    # 폰트 파일
├── 🎭 assets/                   # 기타 에셋
│
├── 📄 루트 파일
│   ├── package.json            # 루트 의존성 및 스크립트
│   ├── tsconfig.json           # TypeScript 설정
│   ├── .env                    # 환경 변수 (git 제외)
│   ├── .env.example            # 환경 변수 예시
│   ├── .gitignore              # Git 제외 파일
│   └── CLAUDE.md               # AI 개발 지침
│
└── 📜 레거시 HTML (참고용)
    ├── index.html              # 메인 페이지 원본
    ├── login.html              # 로그인 페이지 원본
    └── my-space.html           # 마이스페이스 원본
```

---

## 📖 폴더별 상세 설명

### `/src` - 백엔드 소스 코드 (Node.js/Express/TypeScript)

**계층 구조**:
```
Request → Routes → Controllers → Services → Database
```

| 폴더 | 역할 | 예시 |
|------|------|------|
| `config/` | 환경 설정, DB 연결 | `db.ts` - PostgreSQL Pool |
| `controllers/` | HTTP 요청/응답 처리 | 입력 검증, 응답 포맷팅 |
| `services/` | 비즈니스 로직 | 이미지 처리, 파일 검증 |
| `routes/` | URL-Controller 매핑 | `/api/auth/login` → `authController.login` |

### `/client` - 프론트엔드 (React 19 + Vite + Tailwind)

**컴포넌트 구조**:
- `pages/`: 라우트 단위 페이지 컴포넌트
- `components/`: 재사용 가능한 UI 컴포넌트
- `components/myspace/`: 마이스페이스 전용 서브 컴포넌트

### `/database` - 데이터베이스 스키마

**테이블 목록**:
| 테이블 | 설명 |
|--------|------|
| `users` | 사용자 정보 (인증, 프로필, 보험, 사망확인인) |
| `media` | 미디어 파일 (이미지, 오디오) |
| `diaries` | 일기장 |
| `relationship_types` | 🆕 관계 타입 (가족, 찐친, 친구) |
| `friend_requests` | 🆕 친구 신청 |
| `friendships` | 🆕 친구 관계 (양방향) |
| `diary_visibility` | 🆕 일기 공개 범위 |

### `/docs` - 문서

| 파일 | 용도 | 자동 업데이트 |
|------|------|--------------|
| `task.md` | 작업 진행 상황 | 작업 완료 시 체크 |
| `structure.md` | 프로젝트 구조 | 파일 추가 시 |
| `history.md` | 작업 이력 | 매 작업마다 |
| `decisions.md` | 기술 결정 | 기술 선택 시 |
| `troubleshooting.md` | 문제 해결 | 에러 해결 시 |

---

## 🎯 파일 명명 규칙

### TypeScript/JavaScript
| 유형 | 규칙 | 예시 |
|------|------|------|
| React 컴포넌트 | `PascalCase.tsx` | `LoginModal.tsx` |
| 일반 모듈 | `camelCase.ts` | `authController.ts` |
| 설정 파일 | `camelCase.config.js` | `tailwind.config.js` |

### 문서
| 유형 | 규칙 | 예시 |
|------|------|------|
| 일반 문서 | `kebab-case.md` | `friend-system-design.md` |
| 특수 문서 | `소문자.md` | `task.md`, `CLAUDE.md` |

---

## 🔍 "어디에 있나요?" 빠른 찾기

| 찾는 것 | 위치 |
|---------|------|
| API 엔드포인트 정의 | `src/routes/*.ts` |
| 비즈니스 로직 | `src/services/*.ts` |
| DB 쿼리 | `src/controllers/*.ts` |
| React 페이지 | `client/src/pages/*.tsx` |
| UI 컴포넌트 | `client/src/components/*.tsx` |
| DB 스키마 | `database/schema.sql` |
| 환경 변수 | `.env` (예시: `.env.example`) |

---

## 📋 새 파일 추가 시 체크리스트

- [ ] 적절한 폴더에 배치
- [ ] 명명 규칙 준수
- [ ] 이 파일(`structure.md`)에 기록
- [ ] 관련 import/export 업데이트
- [ ] 필요시 테스트 파일 생성

---

## 🔄 구조 변경 이력

| 날짜 | 변경 내용 | 이유 |
|------|----------|------|
| 2025-12-02 | Node.js/React 구조로 변경 | 기술 스택 변경 |
| 2025-12-10 | 실제 파일 구조로 상세 업데이트 | 정확한 구조 반영 |
| 2025-12-13 | styled-components 리팩토링 | 코드 품질 개선, 중복 제거 |
| 2025-12-13 | types/ 폴더 추가 | 공통 타입 정의 분리 |
| 2025-12-13 | 친구 시스템 백엔드 추가 | friendController, friendRoutes, middleware/auth 추가 |
| 2025-12-13 | 친구 관리 UI 추가 | friends/, Friends.tsx, friendService.ts 추가 |
