# 프로젝트 구성 및 검토

- [x] 기존 프로젝트 문서 읽기 (`docs/task.md`, `docs/structure.md`)
- [x] 프로젝트 명세서 읽기 (`info/기능명세서.md`, `info/프로젝트_기획서.md`)
- [x] 개선을 위해 `claude.md` 분석
- [x] `docs/structure.md`를 실제(Node.js/React)에 맞게 업데이트
- [x] 명세서 내용을 바탕으로 `docs/task.md` 업데이트
- [x] 기술 스택 결정 사항으로 `docs/decisions.md` 업데이트
- [x] `claude.md` 예제 업데이트
- [x] 프로젝트 상태 요약

# 구현 단계

## 1단계: 프로젝트 초기화 및 디자인 마이그레이션 (완료)
- [x] **Git 리포지토리 설정 및 푸시** (`main`, `design` 브랜치)
- [x] Node.js/Express/React 프로젝트 구조 설정
- [x] Tailwind CSS 및 PostCSS 설정
- [x] React Router 설정 (`App.tsx`)
- [x] `Login` 페이지 구현 (HTML/CSS 이식)
- [x] `MySpace` 페이지 구현 (HTML/CSS 이식)
- [x] `MySpace` 페이지 "미니홈피" 스타일 팝업 뷰 구현
- [x] `Login` 페이지 내 "내 공간" 3D 모달 팝업 구현
- [x] 코드 리팩토링 (컴포넌트 분리 및 재사용성 향상)

## 2단계: 인증 및 회원가입 시스템 ✅ 완료
- [x] **로그인 시스템 구현**
    - [x] 로그인 모달 UI 및 API 연동 (`LoginModal.tsx`)
    - [x] 소셜 로그인 UI 추가 (카카오, 구글)
    - [x] 메인 페이지(`Home`)에서 로그인 모달 연동
- [x] 회원가입 시스템 구현
    - [x] `SignUp.tsx` 페이지 생성 (이메일 가입 폼, 소셜 로그인 버튼 UI)
    - [x] `SignUpModal.tsx` 로 리팩토링 및 모달 전환 로직 구현
    - [x] `/api/auth/register` API 연동
    - [x] `SignUpInfo.tsx` 구현 (추가 정보 입력: 생년월일, 주소, 사망 확인인 정보)
        - [x] 필수 정보: 이름, 연락처, 생년월일, 성별, 주소
        - [x] 선택 정보: 보험/상조 가입 여부
        - [x] **중요**: 사망 확인용 지인 2인 정보 입력
    - [x] 회원가입 API (`POST /api/auth/register`) 및 추가 정보 업데이트 API (`PUT /api/users/profile`)

## 데이터베이스 설정 ✅ 완료
> **완료일**: 2025-12-13

- [x] **PostgreSQL 18 설치 및 실행**
    - 한글 사용자명 TEMP 폴더 경로 문제 해결 (C:\Temp로 변경)
- [x] **데이터베이스 생성** (`forever_love`)
- [x] **테이블 생성** (pgAdmin으로 `database/schema.sql` 실행)
    - users, media, diaries 테이블 생성 완료
- [x] **연결 확인** (`src/check-db.ts` 실행 성공)

## 2.5단계: 프론트엔드 리팩토링 ✅ 완료
> **참고 문서**: `docs/refactoring-guide.md`
> **완료일**: 2025-12-13

### Phase 1: 기반 구축 ✅
- [x] styled-components 설치 (`npm install styled-components @types/styled-components`)
- [x] 테마 파일 생성 (`client/src/styles/theme.ts`)
- [x] 타입 선언 파일 생성 (`client/src/styles/styled.d.ts`)
- [x] 글로벌 스타일 생성 (`client/src/styles/GlobalStyles.ts`)
- [x] App.tsx에 ThemeProvider 적용

### Phase 2: 공통 컴포넌트 생성 ✅
- [x] `components/common/` 폴더 생성
- [x] Button.tsx 생성 (Primary, Secondary, Kakao, Google, Outline, Ghost 변형)
- [x] Input.tsx 생성 (텍스트, 패스워드, 날짜, 아이콘 지원)
- [x] FormGroup.tsx 생성 (라벨 + 입력 조합)
- [x] Card.tsx 생성 (Header, Body, Footer 서브컴포넌트 포함)
- [x] Modal.tsx 생성 (Portal 기반, 3D 효과, ESC 닫기)
- [x] Divider.tsx 생성 (텍스트 포함 구분선)
- [x] Flex.tsx 생성 (Stack, HStack, VStack, Center 유틸리티)
- [x] Typography.tsx 생성 (Heading, Text, Link)
- [x] SocialIcons.tsx 생성 (Kakao, Google, Apple, Naver)
- [x] index.ts 배럴 export

### Phase 3: 모달 리팩토링 ✅
- [x] LoginModal.tsx → styled-components 전환
- [x] SignUpModal.tsx → styled-components 전환
- [x] SignUpInfoModal.tsx → styled-components 전환
- [x] Modal3D.tsx 삭제
- [x] `components/modals/` 폴더로 이동

### Phase 4: 레이아웃 통합 ✅
- [x] `components/layout/` 폴더 생성
- [x] Header 통합 (4개 → 1개, variant: guest/authenticated/minimal)
- [x] Footer 통합 (2개 → 1개)
- [x] 기존 Header/Footer 컴포넌트 삭제

### Phase 5: 상태 관리 ✅
- [x] `contexts/AuthContext.tsx` 생성
- [x] `services/api.ts` 생성 (fetch 래퍼, 타임아웃, 에러 처리)
- [x] `services/authService.ts` 생성
- [x] useAuth 훅 (AuthContext 내장)

### Phase 6: 정리 ✅
- [x] 불필요한 컴포넌트 파일 삭제
- [x] `docs/structure.md` 업데이트

## 3단계: 친구 관계 시스템 ✅ 완료
> **완료일**: 2025-12-13

### 3-1. 백엔드 API ✅
- [x] **데이터베이스 구축** (`docs/friend-system-design.md` 참고)
    - [x] `relationship_types` 테이블 생성 및 초기 데이터(가족, 찐친, 친구) 시딩
    - [x] `friend_requests`, `friendships` 테이블 생성
    - [x] `diary_visibility` 테이블 생성
    - [x] 인덱스 생성 (성능 최적화)
- [x] **친구 검색 및 신청**
    - [x] 이름 + 연락처 기반 회원 검색 API (`GET /api/friends/search`)
    - [x] 친구 신청 API (`POST /api/friends/request`): 상대방 타입(가족/찐친/친구) 선택 필수
    - [x] 친구 신청 취소 API (`DELETE /api/friends/request/:requestId`)
- [x] **친구 요청 관리**
    - [x] 받은 친구 신청 목록 조회 API (`GET /api/friends/requests`)
    - [x] 보낸 친구 신청 목록 조회 API (`GET /api/friends/requests/sent`)
    - [x] 친구 신청 수락/거절 API (`POST /api/friends/respond`): 수락 시 내 입장에서의 관계 타입 선택 필수
- [x] **친구 목록 및 관리**
    - [x] 친구 목록 조회 API (`GET /api/friends`): 내가 설정한 관계 타입 포함, 그룹별 분류
    - [x] 친구 관계 타입 수정 API (`PUT /api/friends/:friendId`)
    - [x] 친구 삭제 API (`DELETE /api/friends/:friendId`): 양방향 삭제

### 3-2. 프론트엔드 UI ✅
> **완료일**: 2025-12-13

- [x] **친구 서비스 레이어**
    - [x] `friendService.ts` 생성 (API 래퍼)
    - [x] 친구 관련 타입 정의 (types/index.ts 확장)
- [x] **친구 컴포넌트** (`components/friends/`)
    - [x] `FriendCard.tsx` - 친구 정보 카드 (관계 타입별 색상, 수정/삭제)
    - [x] `FriendList.tsx` - 친구 목록 (관계 타입별 그룹화)
    - [x] `FriendRequestList.tsx` - 받은/보낸 친구 신청 목록
    - [x] `FriendSearch.tsx` - 친구 검색 및 신청
- [x] **Friends 페이지** (`pages/Friends.tsx`)
    - [x] 탭 UI (내 친구 / 받은 요청 / 보낸 요청)
    - [x] 라우터 연결 (`/friends`)

- [x] **일기장 연동 (권한 제어)** - 4단계에서 구현 완료
    - [x] 일기 작성 시 공개 범위(다중 선택) 저장 로직 구현
    - [x] 일기 조회 시 친구 관계 기반 필터링 쿼리 구현

## 4단계: 마이 스페이스 및 미디어 기능 ✅ 완료
> **완료일**: 2025-12-13

### 4-1. 백엔드 API ✅
- [x] **미디어 컨트롤러** (`src/controllers/mediaController.ts`)
    - [x] 이미지 업로드 및 썸네일 생성 (`sharp`)
    - [x] 오디오 업로드 및 검증 (`multer`)
    - [x] 미디어 삭제 API
    - [x] 프로필 이미지 설정 API
- [x] **일기장 컨트롤러** (`src/controllers/diaryController.ts`)
    - [x] CRUD API 구현
    - [x] 관계 타입별 공개범위 설정 (다중 선택)
    - [x] 친구 관계 기반 일기 필터링
- [x] **마이스페이스 통합 API** (`src/controllers/myspaceController.ts`)
    - [x] 내 공간 조회 API (`GET /api/myspace`)
    - [x] 타인 공간 조회 API (`GET /api/myspace/:userId`)
    - [x] 남기는 말(묘비명) 수정 API

### 4-2. 프론트엔드 UI ✅
- [x] **타입 정의 확장** (`types/index.ts`)
    - [x] Media, Diary, MySpaceData, UserSpaceData 타입 추가
- [x] **서비스 레이어** (`services/`)
    - [x] `mediaService.ts` - 미디어 업로드/삭제
    - [x] `diaryService.ts` - 일기 CRUD
    - [x] `myspaceService.ts` - 마이스페이스 데이터 조회
- [x] **MySpace 컴포넌트** (`components/myspace/`)
    - [x] `ProfileSection.tsx` - 프로필 이미지 + 남기는 말
    - [x] `DiarySection.tsx` - 일기 목록 (공개범위 배지)
    - [x] `MediaGallery.tsx` - 이미지/오디오 갤러리 + 업로드
    - [x] `FriendStats.tsx` - 관계별 친구 수 통계
    - [x] `SpaceNavigation.tsx` - 탭 네비게이션
- [x] **MySpace 페이지 리팩토링**
    - [x] 동적 데이터 연동
    - [x] styled-components 적용
    - [x] 타인 공간 방문 지원 (`/myspace/:userId`)

### 미완료 (선택 사항)
- [ ] GCS 연동 (현재 로컬 스토리지 사용)

## 4.5단계: 메인페이지 로그인 상태 통합 ✅ 완료
> **완료일**: 2025-12-13

- [x] **Header 컴포넌트 개선**
    - [x] `onLogoutClick` prop 추가
    - [x] authenticated variant에 "로그아웃" 버튼 추가
- [x] **Home.tsx 통합**
    - [x] AuthContext 연동 (`useAuth` 훅)
    - [x] 조건부 Header variant (`isAuthenticated ? 'authenticated' : 'guest'`)
    - [x] MySpace, Profile 모달 추가
    - [x] 로그인 후 같은 페이지 유지 (navigate 제거)
- [x] **LoginModal AuthContext 연동**
    - [x] AuthContext의 `login()` 함수 사용
    - [x] localStorage 키 통일 (`auth_token`, `auth_user`)
- [x] **/login 경로 삭제**
    - [x] Login.tsx 파일 삭제
    - [x] App.tsx에서 `/login` 라우트 제거
- [x] **MySpace 모달 스타일 복원**
    - [x] `elementor elementor-33` wrapper 추가

### 동작 방식
```
[비로그인] 헤더: "로그인 | 회원가입"
     ↓ 로그인 성공
[로그인] 헤더: "내 공간 | 내 정보 | 로그아웃" (같은 페이지 유지)
     ↓ 로그아웃 클릭
[비로그인] 헤더 복귀
```

## 4.6단계: 브랜드 적용 - 친애 (Chin-ae) ✅ 완료
> **완료일**: 2025-12-13

### 브랜드 요소
| 요소 | 값 |
|------|-----|
| **브랜드명** | 친애 (한글) |
| **슬로건** | "영원히 정말로 사랑해, 진짜" |
| **카피** | "당신의 마지막 안부를 보관합니다, 친애" |

### 적용 항목
- [x] **index.html 메타데이터**
    - [x] 타이틀: "친애 - 영원히 정말로 사랑해, 진짜"
    - [x] meta description, keywords
    - [x] Open Graph 태그 (og:title, og:description)
- [x] **Header 컴포넌트**
    - [x] 로고 텍스트: "친애"
    - [x] 설명: "영원히 정말로 사랑해, 진짜"
- [x] **Footer 컴포넌트**
    - [x] 사이트명: "친애"
- [x] **Home 페이지 콘텐츠**
    - [x] 슬로건 표시: "영원히 정말로 사랑해, 진짜"
    - [x] 메인 카피: "당신의 마지막 안부를 보관합니다"
    - [x] 브랜드 강조: "친애와 함께 시작하는 나의 준비"
- [x] **package.json 프로젝트명**
    - [x] 루트: `chinae-project`
    - [x] 클라이언트: `chinae-client`

## 4.7단계: 마이스페이스 모달 Elementor 디자인 통합 ✅ 완료
> **완료일**: 2025-12-13

### 문제
- 마이스페이스 모달이 기능은 동작하나 원본 Elementor 디자인이 적용되지 않음
- MySpacePre.tsx의 Elementor 클래스 구조가 필요

### 해결
- [x] **MySpacePre.tsx Elementor 구조 분석**
    - [x] `.elementor elementor-33` wrapper 클래스 확인
    - [x] 주요 요소 클래스 파악 (`.elementor-element-*`)
- [x] **elementor-post-33.css 스타일 분석**
    - [x] 2컬럼 레이아웃 (20% + 80%)
    - [x] cyan/blue 테두리, border-radius: 20px
- [x] **MySpaceModal.tsx 전면 재작성**
    - [x] Elementor 클래스 구조 적용
    - [x] `ElementorStyles` styled-component로 추가 UI 스타일
    - [x] 기존 모든 기능 유지 (API 연동, 탭, 일기 CRUD, 미디어 업로드)
- [x] **브라우저 검증 완료**

### 적용된 디자인 요소
| 요소 | 상태 |
|------|------|
| 2컬럼 레이아웃 (20% + 80%) | ✅ |
| cyan/blue 테두리 스타일 | ✅ |
| 둥근 모서리 (border-radius: 20px) | ✅ |
| 핑크/마젠타 제목 스타일 | ✅ |
| 프로필/남기는말/친구통계/탭/일기/미디어 | ✅ |

## 5단계: 배포 및 최종 검증 ✅ 완료
> **완료일**: 2025-12-13

- [x] **프로덕션 빌드 테스트**
    - [x] TypeScript 타입 검사 통과 (`npx tsc --noEmit`)
    - [x] Vite 프로덕션 빌드 성공 (107 modules, 382KB gzip: 111KB)
- [x] **최종 사용자 검증** (Playwright 자동화 테스트)
    - [x] 메인 페이지 로드 확인
    - [x] 브랜드 적용 확인 ("친애 - 영원히 정말로 사랑해, 진짜")
    - [x] 회원가입 플로우 검증 (이메일 가입 → 추가정보 3단계)
    - [x] 로그인/로그아웃 동작 확인
    - [x] 마이스페이스 모달 표시 확인

## 5.1단계: 오디오 압축 및 다운로드 기능 ✅ 완료
> **완료일**: 2025-12-13

### 기능 개요
음성 일기 녹음 시 용량을 줄이면서 음질을 유지하고, 필요할 때 다운로드할 수 있는 기능

### 백엔드 구현 ✅
- [x] **FFmpeg 기반 오디오 압축** (`fluent-ffmpeg`)
    - [x] Opus 형식 자동 변환 (48kbps, 모노)
    - [x] 원본 대비 90%+ 용량 절감
    - [x] 압축 실패 시 원본 유지 (안전한 폴백)
- [x] **오디오 다운로드 API** (`GET /api/media/download/:mediaId`)
    - [x] Opus 형식 다운로드 (기본, 작은 용량)
    - [x] MP3 형식 다운로드 (실시간 변환, 호환성 좋음)
    - [x] 파일명에 사용자명 포함

### 프론트엔드 구현 ✅
- [x] **mediaService 확장**
    - [x] `getAudioDownloadUrl()` - 다운로드 URL 생성
    - [x] `downloadAudio()` - 다운로드 실행
- [x] **MediaGallery 컴포넌트 업데이트**
    - [x] 오디오 항목에 다운로드 버튼 추가
    - [x] Opus/MP3 형식 선택 가능

### 압축 효과
| 원본 형식 | 원본 크기 | 압축 후 (Opus) | 절감률 |
|-----------|----------|----------------|--------|
| WAV 1분 | ~10MB | ~0.3MB | 97% |
| MP3 1분 | ~1MB | ~0.3MB | 70% |
| WebM 1분 | ~0.5MB | ~0.3MB | 40% |

### 사전 조건
- **FFmpeg 설치 필요**: 서버에 FFmpeg가 설치되어 있어야 압축 기능 동작
- Windows: `winget install ffmpeg` 또는 https://ffmpeg.org/download.html
- Linux: `apt install ffmpeg`
- Mac: `brew install ffmpeg`

## 5.2단계: UI/UX 개선 및 인증 강화 ✅ 완료
> **완료일**: 2025-12-14

### 인증 시스템 개선
- [x] **JWT 토큰 만료 시간 연장** (1시간 → 7일)
    - `src/controllers/authController.ts` - `expiresIn: '1h'` → `'7d'`
- [x] **401 에러 시 자동 로그아웃 처리**
    - `client/src/services/api.ts` - 토큰 만료 시 자동 로그아웃 및 리다이렉트

### UI 디자인 통일성 개선
- [x] **프로필 사진 비율 영정사진 표준으로 변경**
    - 기존: 1:1 (200×200px) 또는 3:4 (200×267px)
    - 변경: **11:14** (200×255px) - 영정사진 표준 비율
    - 수정 파일: `MySpaceModal.tsx`, `ProfileSection.tsx`
- [x] **내 공간 모달 레이아웃 통일**
    - 프로필 사진, 남기는 말, 친구 통계 영역 모두 **가로 200px**로 통일
    - 수정 파일: `MySpaceModal.tsx`
- [x] **일기장 페이지네이션 구현**
    - 기존: "더 보기" 버튼으로 무한 스크롤 (10개씩 누적)
    - 변경: **4개씩** 페이지네이션 (이전/다음 버튼)
    - 페이지 정보 표시: `현재페이지 / 전체페이지`
    - 수정 파일: `MySpaceModal.tsx`

### 변경된 파일
| 파일 | 변경 내용 |
|------|----------|
| `src/controllers/authController.ts` | 토큰 만료 시간 7일로 변경 |
| `client/src/services/api.ts` | 401 에러 시 자동 로그아웃 |
| `client/src/components/modals/MySpaceModal.tsx` | 프로필 사진 비율, 레이아웃 통일, 페이지네이션 |
| `client/src/components/myspace/ProfileSection.tsx` | 프로필 사진 비율 변경 |

---

## 🎉 프로젝트 완료

모든 구현 단계가 완료되었습니다.

### 완료된 기능 요약
| 기능 | 상태 |
|------|------|
| 프로젝트 초기화 | ✅ |
| 인증/회원가입 시스템 | ✅ |
| 프론트엔드 리팩토링 (styled-components) | ✅ |
| 친구 관계 시스템 | ✅ |
| 마이스페이스 및 미디어 | ✅ |
| 브랜드 적용 (친애) | ✅ |
| 마이스페이스 모달 Elementor 디자인 통합 | ✅ |
| 오디오 압축 및 다운로드 (Opus/MP3) | ✅ |
| 배포 준비 완료 | ✅ |
