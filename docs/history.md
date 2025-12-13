# 작업 이력 (History)

> 📜 **모든 작업의 이력을 기록합니다. 롤백 및 컨텍스트 복원에 사용됩니다.**

**마지막 업데이트**: 2025-12-14 (History #26 - 코드 품질 검사 및 ESLint 이슈 수정)

---

## 📋 이력 작성 가이드

### 형식
```markdown
## History #[번호] - [작업 제목]

**날짜**: YYYY-MM-DD HH:MM
**사용자 요청**: "원문 그대로"

### 수행한 작업
- [x] 작업 항목 1
- [x] 작업 항목 2

### 변경된 파일
- 📄 [생성] 파일경로
- 📝 [수정] 파일경로
- 🗑️ [삭제] 파일경로
- ⏪ [복원] 파일경로 (롤백 시)

### 참조한 문서
- docs/task.md
- docs/structure.md

### 중요도
⭐ 마일스톤 (주요 기능 완성) / 일반 작업
```

---

## 📚 이력 목록

---

## History #1 - 프로젝트 초기 설정 ⭐

**날짜**: 2025-12-02
**사용자 요청**: "프로젝트 초기화 및 설정"

### 수행한 작업
- [x] Git 리포지토리 초기화 (`main`, `design` 브랜치)
- [x] Node.js/Express/TypeScript 백엔드 구조 설정
- [x] React/Vite/TypeScript 프론트엔드 구조 설정
- [x] Tailwind CSS 및 PostCSS 설정
- [x] PostgreSQL 데이터베이스 스키마 정의
- [x] 환경 변수 설정 (.env, .env.example)

### 변경된 파일
- 📄 [생성] package.json (루트)
- 📄 [생성] tsconfig.json
- 📄 [생성] src/app.ts
- 📄 [생성] src/server.ts
- 📄 [생성] src/config/db.ts
- 📄 [생성] client/package.json
- 📄 [생성] client/vite.config.ts
- 📄 [생성] client/tailwind.config.js
- 📄 [생성] database/schema.sql
- 📄 [생성] .env.example
- 📄 [생성] .gitignore

### 참조한 문서
- docs/decisions.md (ADR-001, ADR-002)

### 중요도
⭐ 마일스톤 - 프로젝트 기반 구조 완성

---

## History #2 - 디자인 마이그레이션 ⭐

**날짜**: 2025-12-02
**사용자 요청**: "WordPress/Elementor 디자인을 React로 이식"

### 수행한 작업
- [x] Login 페이지 HTML/CSS → React 컴포넌트 변환
- [x] MySpace 페이지 HTML/CSS → React 컴포넌트 변환
- [x] 공통 컴포넌트 분리 (Header, Footer, LinkInBio)
- [x] React Router 설정 (App.tsx)
- [x] 3D 모달 효과 구현 (Modal3D.tsx)

### 변경된 파일
- 📄 [생성] client/src/pages/Home.tsx
- 📄 [생성] client/src/pages/Login.tsx
- 📄 [생성] client/src/pages/MySpace.tsx
- 📄 [생성] client/src/components/Header.tsx
- 📄 [생성] client/src/components/Footer.tsx
- 📄 [생성] client/src/components/LoginHeader.tsx
- 📄 [생성] client/src/components/MySpaceHeader.tsx
- 📄 [생성] client/src/components/LinkInBio.tsx
- 📄 [생성] client/src/components/Modal3D.tsx
- 📝 [수정] client/src/App.tsx

### 참조한 문서
- docs/decisions.md (ADR-004)
- info/기능명세서.md

### 중요도
⭐ 마일스톤 - 디자인 이식 완료

---

## History #3 - 인증 시스템 구현 ⭐

**날짜**: 2025-12-02
**사용자 요청**: "로그인/회원가입 기능 구현"

### 수행한 작업
- [x] 백엔드 인증 API 구현 (register, login)
- [x] JWT 토큰 기반 인증 설정
- [x] bcrypt 비밀번호 해싱 적용
- [x] 로그인 모달 UI 구현 (LoginModal.tsx)
- [x] 회원가입 모달 UI 구현 (SignUpModal.tsx)
- [x] 추가 정보 입력 모달 구현 (SignUpInfoModal.tsx)
- [x] 사용자 프로필 업데이트 API 구현

### 변경된 파일
- 📄 [생성] src/controllers/authController.ts
- 📄 [생성] src/controllers/userController.ts
- 📄 [생성] src/routes/authRoutes.ts
- 📄 [생성] src/routes/userRoutes.ts
- 📄 [생성] client/src/components/LoginModal.tsx
- 📄 [생성] client/src/components/SignUpModal.tsx
- 📄 [생성] client/src/components/SignUpInfoModal.tsx
- 📝 [수정] src/app.ts (라우트 추가)
- 📝 [수정] database/schema.sql (users 테이블 확장)

### 참조한 문서
- info/기능명세서.md (FS-001, FS-002)
- docs/decisions.md

### 중요도
⭐ 마일스톤 - 인증 시스템 완성

---

## History #4 - 미디어 서비스 구현

**날짜**: 2025-12-02
**사용자 요청**: "이미지/오디오 업로드 기능 구현"

### 수행한 작업
- [x] multer 파일 업로드 설정
- [x] sharp 이미지 처리 서비스 구현
- [x] 썸네일 생성 (300x400, WebP)
- [x] 오디오 파일 검증 로직 구현
- [x] 미디어 API 라우트 구현

### 변경된 파일
- 📄 [생성] src/services/mediaService.ts
- 📄 [생성] src/routes/mediaRoutes.ts
- 📝 [수정] src/app.ts (미디어 라우트 추가)
- 📝 [수정] database/schema.sql (media 테이블 추가)

### 참조한 문서
- docs/decisions.md (ADR-005)
- info/기능명세서.md (FS-005, FS-008)

### 중요도
일반 작업

---

## History #5 - 마이스페이스 컴포넌트 구현

**날짜**: 2025-12-02
**사용자 요청**: "마이스페이스 상세 UI 구현"

### 수행한 작업
- [x] MySpacePre 컴포넌트 구현 (사전 상태)
- [x] MySpacePost 컴포넌트 구현 (사후 상태)
- [x] FriendSpacePre 컴포넌트 구현 (친구 공간 - 사전)
- [x] FriendSpacePost 컴포넌트 구현 (친구 공간 - 사후)

### 변경된 파일
- 📄 [생성] client/src/components/myspace/MySpacePre.tsx
- 📄 [생성] client/src/components/myspace/MySpacePost.tsx
- 📄 [생성] client/src/components/myspace/FriendSpacePre.tsx
- 📄 [생성] client/src/components/myspace/FriendSpacePost.tsx
- 📝 [수정] client/src/pages/MySpace.tsx

### 참조한 문서
- info/프로젝트_기획서.md
- my-space.html (레거시 참고)

### 중요도
일반 작업

---

## History #6 - 친구 시스템 설계 문서 작성

**날짜**: 2025-12-03
**사용자 요청**: "친구 관계 시스템 설계"

### 수행한 작업
- [x] 비대칭 친구 관계 데이터 모델 설계
- [x] ERD 작성 (Mermaid)
- [x] 친구 신청/수락 로직 설계
- [x] 일기장 공개 범위 설정 로직 설계

### 변경된 파일
- 📄 [생성] docs/friend-system-design.md

### 참조한 문서
- info/기능명세서.md
- docs/decisions.md

### 중요도
일반 작업 - 설계 문서

---

## History #7 - 문서 정비 및 프로젝트 요약 ⭐

**날짜**: 2025-12-10
**사용자 요청**: "claude.md 파일을 참고하고 전체 프로젝트를 꼼꼼하게 확인해서 필요한 파일들 업데이트 및 생성하고 프로젝트 내용과 기능들을 요약해서 md파일로 만들어봐"

### 수행한 작업
- [x] 프로젝트 전체 구조 분석
- [x] docs/structure.md 상세 업데이트 (실제 파일 구조 반영)
- [x] docs/architecture.md 생성 (기술 스택, 아키텍처 다이어그램)
- [x] docs/history.md 생성 (작업 이력 추적)
- [x] 프로젝트 요약 문서 생성 예정

### 변경된 파일
- 📝 [수정] docs/structure.md
- 📄 [생성] docs/architecture.md
- 📄 [생성] docs/history.md
- 📄 [생성] docs/PROJECT_SUMMARY.md (예정)

### 참조한 문서
- CLAUDE.md
- docs/task.md
- docs/decisions.md
- info/프로젝트_기획서.md
- info/기능명세서.md
- 모든 소스 코드 파일

### 중요도
⭐ 마일스톤 - 문서 체계 정비 완료

---

## History #8 - 프론트엔드 리팩토링 ⭐

**날짜**: 2025-12-13
**사용자 요청**: "styled-components로 프론트엔드 리팩토링 및 ESLint 오류 해결"

### 수행한 작업
- [x] styled-components 기반 테마 시스템 구축
- [x] 공통 컴포넌트 생성 (Button, Input, FormGroup, Card, Modal, Divider, Flex, Typography, SocialIcons)
- [x] 모달 컴포넌트 리팩토링 (LoginModal, SignUpModal, SignUpInfoModal)
- [x] 레이아웃 통합 (Header, Footer)
- [x] AuthContext 상태 관리 구현
- [x] API 서비스 레이어 생성
- [x] TypeScript 타입 정의 분리 (types/index.ts)
- [x] ESLint 오류 11개 → 0개 해결
    - 미사용 import 제거 (Heading4, HStack, Divider, VStack)
    - `any` 타입 → User 타입으로 교체
    - 빈 인터페이스 eslint-disable 추가
    - fast-refresh 경고 eslint-disable 추가

### 변경된 파일
- 📄 [생성] client/src/styles/theme.ts
- 📄 [생성] client/src/styles/styled.d.ts
- 📄 [생성] client/src/styles/GlobalStyles.ts
- 📄 [생성] client/src/contexts/AuthContext.tsx
- 📄 [생성] client/src/services/api.ts
- 📄 [생성] client/src/services/authService.ts
- 📄 [생성] client/src/types/index.ts
- 📄 [생성] client/src/components/common/*.tsx (9개 파일)
- 📄 [생성] client/src/components/layout/Header.tsx
- 📄 [생성] client/src/components/layout/Footer.tsx
- 📝 [수정] client/src/components/modals/LoginModal.tsx
- 📝 [수정] client/src/components/modals/SignUpModal.tsx
- 📝 [수정] client/src/components/modals/SignUpInfoModal.tsx
- 📝 [수정] client/src/pages/Home.tsx (User 타입 적용)
- 📝 [수정] client/src/pages/Login.tsx (User 타입 적용)
- 📝 [수정] client/src/App.tsx (ThemeProvider, AuthProvider 적용)
- 🗑️ [삭제] client/src/components/Modal3D.tsx
- 🗑️ [삭제] 기존 Header/Footer 컴포넌트들 (4개 → 2개로 통합)

### 참조한 문서
- docs/refactoring-guide.md
- docs/conventions.md

### 중요도
⭐ 마일스톤 - 프론트엔드 아키텍처 개선 완료

---

## History #9 - PostgreSQL 18 데이터베이스 설정 ⭐

**날짜**: 2025-12-13
**사용자 요청**: "다음 작업 해줘" (데이터베이스 설정 단계)

### 수행한 작업
- [x] PostgreSQL 18 설치 (Windows)
    - 한글 사용자명으로 인한 "Illegal characters in path" 오류 해결
    - C:\Temp 폴더 생성 및 TEMP/TMP 환경변수 변경
- [x] `forever_love` 데이터베이스 생성 (pgAdmin 사용)
- [x] 테이블 생성 (database/schema.sql 실행)
    - users 테이블
    - media 테이블
    - diaries 테이블
- [x] 데이터베이스 연결 확인 (src/check-db.ts 실행 성공)
- [x] 개발 서버 실행 확인 (백엔드:3000, 프론트엔드:5173)

### 변경된 파일
- 📝 [수정] docs/troubleshooting.md (PostgreSQL 설치 오류 해결법 추가)
- 📝 [수정] docs/task.md (데이터베이스 설정 완료 체크)
- 📝 [수정] docs/structure.md (types/ 폴더 추가)

### 참조한 문서
- docs/DB_SETUP_GUIDE.md
- docs/troubleshooting.md
- database/schema.sql

### 중요도
⭐ 마일스톤 - 데이터베이스 설정 완료

---

## History #10 - 친구 관계 시스템 구현 ⭐

**날짜**: 2025-12-13
**사용자 요청**: "/sc:implement --ultrathink 친구관계 시스템 구현해봐"

### 수행한 작업
- [x] **데이터베이스 스키마 설계 및 구현**
    - relationship_types 테이블 (가족, 찐친, 친구)
    - friend_requests 테이블 (친구 신청 관리)
    - friendships 테이블 (양방향 친구 관계)
    - diary_visibility 테이블 (일기 공개 범위)
    - 성능 최적화 인덱스 생성
- [x] **백엔드 API 구현**
    - GET /api/friends/relationship-types - 관계 타입 목록
    - GET /api/friends/search - 회원 검색
    - POST /api/friends/request - 친구 신청
    - DELETE /api/friends/request/:requestId - 친구 신청 취소
    - GET /api/friends/requests - 받은 친구 신청 목록
    - GET /api/friends/requests/sent - 보낸 친구 신청 목록
    - POST /api/friends/respond - 친구 신청 수락/거절
    - GET /api/friends - 친구 목록 조회
    - PUT /api/friends/:friendId - 친구 관계 타입 수정
    - DELETE /api/friends/:friendId - 친구 삭제
- [x] **JWT 인증 미들웨어 구현**
- [x] **API 테스트 완료** (비대칭 관계 정상 작동 확인)

### 변경된 파일
- 📝 [수정] database/schema.sql (친구 시스템 테이블 추가)
- 📄 [생성] database/friend_system.sql (독립 실행용 SQL)
- 📄 [생성] src/controllers/friendController.ts
- 📄 [생성] src/routes/friendRoutes.ts
- 📄 [생성] src/middleware/auth.ts
- 📄 [생성] src/setup-friend-tables.ts (테이블 생성 스크립트)
- 📝 [수정] src/app.ts (친구 라우트 추가)
- 📝 [수정] docs/task.md (3단계 완료 체크)
- 📝 [수정] docs/structure.md (새 파일 구조 반영)

### 참조한 문서
- docs/friend-system-design.md
- docs/task.md

### 중요도
⭐ 마일스톤 - 친구 관계 시스템 백엔드 완성

---

## History #11 - 친구 관리 UI 구현 ⭐

**날짜**: 2025-12-13
**사용자 요청**: "/sc:implement --ultrathink 니가 판단해서 프로젝트를 잘 진행하기 위해 선택해서 다음단계를 시작해"

### 수행한 작업
- [x] 프로젝트 상태 분석 및 다음 단계 결정
    - 친구 관리 UI 구현 선택 (백엔드 완성 → 프론트엔드 연결)
- [x] 친구 관련 TypeScript 타입 정의 확장
    - RelationshipType, Friend, GroupedFriends
    - SearchedUser, ReceivedFriendRequest, SentFriendRequest
    - API 응답 타입들
- [x] friendService.ts 생성 (API 래퍼)
    - 10개 API 함수 구현
- [x] 친구 컴포넌트 생성 (components/friends/)
    - FriendCard.tsx - 관계 타입별 색상, 수정/삭제
    - FriendList.tsx - 관계 타입별 그룹화
    - FriendRequestList.tsx - 받은/보낸 요청
    - FriendSearch.tsx - 검색 및 신청
    - index.ts 배럴 export
- [x] Friends.tsx 페이지 생성
    - 탭 UI (내 친구/받은 요청/보낸 요청)
    - 라우터 연결 (/friends)
- [x] 타입 에러 수정
    - ReactNode, ApiResponse type-only import
    - LoginModal User 타입 수정

### 변경된 파일
- 📝 [수정] client/src/types/index.ts (친구 타입 추가)
- 📄 [생성] client/src/services/friendService.ts
- 📄 [생성] client/src/components/friends/FriendCard.tsx
- 📄 [생성] client/src/components/friends/FriendList.tsx
- 📄 [생성] client/src/components/friends/FriendRequestList.tsx
- 📄 [생성] client/src/components/friends/FriendSearch.tsx
- 📄 [생성] client/src/components/friends/index.ts
- 📄 [생성] client/src/pages/Friends.tsx
- 📝 [수정] client/src/App.tsx (라우트 추가)
- 📝 [수정] client/src/contexts/AuthContext.tsx (type import)
- 📝 [수정] client/src/services/authService.ts (type import)
- 📝 [수정] client/src/components/modals/LoginModal.tsx (User 타입)
- 📝 [수정] docs/task.md
- 📝 [수정] docs/structure.md
- 📝 [수정] docs/history.md

### 참조한 문서
- docs/task.md
- docs/history.md
- docs/structure.md
- src/controllers/friendController.ts (API 구조 참조)

### 중요도
⭐ 마일스톤 - 친구 관계 시스템 완성 (백엔드 + 프론트엔드)

---

## History #12 - 마이스페이스 및 미디어 기능 구현 ⭐

**날짜**: 2025-12-13
**사용자 요청**: "/sc:implement --ultrathink 4단계: 마이스페이스 및 미디어 기능 - MySpace 동적 데이터 연동 - 이미지/오디오 업로드 - 썸네일 생성"

### 수행한 작업
- [x] **백엔드 API 구현**
    - [x] mediaController.ts - 이미지/오디오 업로드, 썸네일 생성(sharp), 프로필 이미지 설정
    - [x] diaryController.ts - CRUD, 관계 타입별 공개범위 다중 선택
    - [x] myspaceController.ts - 통합 공간 데이터 API, 남기는 말 수정
    - [x] 인증 미들웨어 적용 (requireAuth, optionalAuth)
- [x] **프론트엔드 서비스 레이어**
    - [x] mediaService.ts - 미디어 업로드/삭제 API 래퍼
    - [x] diaryService.ts - 일기 CRUD API 래퍼
    - [x] myspaceService.ts - 마이스페이스 데이터 조회 API 래퍼
    - [x] api.ts - fetchWithAuth 함수 추가
- [x] **MySpace 컴포넌트 리팩토링** (styled-components)
    - [x] ProfileSection.tsx - 프로필 이미지 + 남기는 말
    - [x] DiarySection.tsx - 일기 목록 (공개범위 배지)
    - [x] MediaGallery.tsx - 이미지/오디오 갤러리 + 업로드
    - [x] FriendStats.tsx - 관계별 친구 수 통계
    - [x] SpaceNavigation.tsx - 탭 네비게이션
- [x] **MySpace.tsx 페이지 완전 재작성**
    - [x] 동적 데이터 로드 (API 연동)
    - [x] 타인 공간 방문 지원 (/myspace/:userId)
    - [x] 탭별 콘텐츠 (일기, 친구소식, 친구관리, 친구신청)
- [x] **TypeScript 에러 수정** (31개 → 0개)
    - [x] theme.fontSize → theme.typography.fontSize
    - [x] theme.colors.white → theme.colors.background
    - [x] NavTab type-only import
    - [x] isOwner boolean | null 타입 수정
    - [x] FriendRequestList type prop 추가
    - [x] styled-components transient props ($type, $active)
- [x] **빌드 검증**
    - [x] TypeScript 타입 검사 통과 (npx tsc --noEmit)
    - [x] ESLint 검사 통과 (npm run lint)
    - 참고: dist 폴더 잠금으로 인한 vite 빌드 실패 (코드 문제 아님)

### 변경된 파일
- 📄 [생성] src/controllers/mediaController.ts
- 📄 [생성] src/controllers/diaryController.ts
- 📄 [생성] src/controllers/myspaceController.ts
- 📄 [생성] src/routes/diaryRoutes.ts
- 📄 [생성] src/routes/myspaceRoutes.ts
- 📝 [수정] src/routes/mediaRoutes.ts (인증 미들웨어 추가)
- 📝 [수정] src/app.ts (새 라우트 추가, uploads 정적 서빙)
- 📝 [수정] client/src/types/index.ts (Media, Diary, MySpaceData 타입)
- 📄 [생성] client/src/services/mediaService.ts
- 📄 [생성] client/src/services/diaryService.ts
- 📄 [생성] client/src/services/myspaceService.ts
- 📝 [수정] client/src/services/api.ts (fetchWithAuth 추가)
- 📄 [생성] client/src/components/myspace/ProfileSection.tsx
- 📄 [생성] client/src/components/myspace/DiarySection.tsx
- 📄 [생성] client/src/components/myspace/MediaGallery.tsx
- 📄 [생성] client/src/components/myspace/FriendStats.tsx
- 📄 [생성] client/src/components/myspace/SpaceNavigation.tsx
- 📝 [수정] client/src/components/myspace/index.ts (배럴 export)
- 📝 [수정] client/src/pages/MySpace.tsx (완전 재작성)
- 📝 [수정] client/src/App.tsx (/myspace/:userId 라우트)
- 📝 [수정] docs/task.md (4단계 완료)
- 📝 [수정] docs/history.md (이 항목)

### 참조한 문서
- docs/task.md
- docs/refactoring-guide.md
- client/src/styles/theme.ts

### 중요도
⭐ 마일스톤 - 마이스페이스 및 미디어 기능 완성

---

## History #13 - 메인페이지 로그인 상태 통합 ⭐

**날짜**: 2025-12-13
**사용자 요청**: "메인페이지에서 로그인 후 페이지 이동 없이 헤더만 변경되도록 통합"

### 수행한 작업
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

### 변경된 파일
- 📝 [수정] client/src/components/layout/Header.tsx (onLogoutClick prop 추가)
- 📝 [수정] client/src/pages/Home.tsx (AuthContext 연동, 모달 추가)
- 📝 [수정] client/src/components/modals/LoginModal.tsx (AuthContext login 함수 사용)
- 📝 [수정] client/src/App.tsx (/login 라우트 제거)
- 🗑️ [삭제] client/src/pages/Login.tsx
- 📝 [수정] docs/task.md (4.5단계 추가)

### 해결한 문제
1. **AuthContext 연동 문제**: LoginModal이 직접 API 호출 → AuthContext의 `login()` 함수 사용으로 변경
2. **localStorage 키 불일치**: `token` → `auth_token`, `user` → `auth_user`로 통일
3. **MySpace 디자인 깨짐**: wrapper div `elementor elementor-33` 누락 → 추가

### 동작 방식
```
[비로그인] 헤더: "로그인 | 회원가입"
     ↓ 로그인 성공
[로그인] 헤더: "내 공간 | 내 정보 | 로그아웃" (같은 페이지 유지)
     ↓ 로그아웃 클릭
[비로그인] 헤더 복귀
```

### 참조한 문서
- docs/task.md
- docs/refactoring-guide.md

### 중요도
⭐ 마일스톤 - 메인페이지 로그인 UX 통합 완성

---

## History #14 - 브랜드 적용: 친애 (Chin-ae) ⭐

**날짜**: 2025-12-13
**사용자 요청**: "프로젝트 메인 이름을 '친애(親愛)'로, 슬로건/카피 적용해줘"

### 브랜드 요소
| 요소 | 값 |
|------|-----|
| **브랜드명** | 친애 (한글) |
| **슬로건** | "영원히 정말로 사랑해, 진짜" |
| **카피** | "당신의 마지막 안부를 보관합니다, 친애" |

### 수행한 작업
- [x] **index.html 메타데이터 업데이트**
    - [x] 타이틀: "친애 - 영원히 정말로 사랑해, 진짜"
    - [x] meta description, keywords 추가
    - [x] Open Graph 태그 추가 (og:title, og:description, og:type)
- [x] **Header 컴포넌트 브랜딩**
    - [x] 로고 텍스트: "로고 이미지 자리" → "친애"
    - [x] 설명: "My WordPress Blog" → "영원히 정말로 사랑해, 진짜"
- [x] **Footer 컴포넌트 브랜딩**
    - [x] 사이트명: "My WordPress Blog" → "친애"
- [x] **Home 페이지 콘텐츠 브랜딩**
    - [x] 슬로건 추가: "영원히 정말로 사랑해, 진짜"
    - [x] 메인 카피: "당신의 마지막 안부를 보관합니다"
    - [x] 브랜드 강조: "친애와 함께 시작하는 나의 준비"
- [x] **package.json 프로젝트명 변경**
    - [x] 루트: "forever-love-project" → "chinae-project"
    - [x] 클라이언트: "client" → "chinae-client"

### 변경된 파일
- 📝 [수정] client/index.html (타이틀, 메타태그)
- 📝 [수정] client/src/components/layout/Header.tsx (로고, 설명)
- 📝 [수정] client/src/components/layout/Footer.tsx (사이트명)
- 📝 [수정] client/src/pages/Home.tsx (슬로건, 카피)
- 📝 [수정] package.json (프로젝트명)
- 📝 [수정] client/package.json (프로젝트명)
- 📝 [수정] docs/task.md (4.6단계 추가)

### 참조한 문서
- docs/task.md

### 중요도
⭐ 마일스톤 - 브랜드 아이덴티티 적용 완료

---

## History #15 - 5단계: 배포 및 검증 완료 ⭐

**날짜**: 2025-12-13
**사용자 요청**: "둘다 진행해" (프로덕션 빌드 테스트 + 브라우저 기능 검증)

### 수행한 작업
- [x] **프로덕션 빌드 테스트**
    - [x] TypeScript 타입 검사 통과 (`npx tsc --noEmit`)
    - [x] dist 폴더 권한 이슈로 `dist-test` 대체 디렉토리 사용
    - [x] Vite 빌드 성공 (107 modules, 382KB gzip: 111KB)
- [x] **Playwright 브라우저 기능 검증**
    - [x] 메인 페이지 로드 확인
    - [x] 3단계 회원가입 플로우 테스트 (기본정보 → 추가정보 → 완료)
    - [x] 로그인/로그아웃 기능 검증
    - [x] 헤더 상태 변경 확인 (비로그인 ↔ 로그인)

### 변경된 파일
- 📝 [수정] docs/task.md (5단계 완료 체크)

### 참조한 문서
- docs/task.md

### 중요도
⭐ 마일스톤 - 5단계 배포 준비 검증 완료

---

## History #16 - 마이스페이스 기능 연동 수정 ⭐

**날짜**: 2025-12-13
**사용자 요청**: "--ultrathink 내 공간 모달에 아무 기능이나 변화가 없잖아"

### 문제 분석
- Home.tsx에서 "내 공간" 버튼 클릭 시 `MySpacePre` 컴포넌트(정적 와이어프레임) 모달 표시
- 반면 `/myspace` 라우트에는 완전히 동작하는 `MySpace.tsx` 페이지가 이미 존재
- 토큰 키 불일치로 API 호출 시 401 인증 오류 발생

### 수행한 작업
- [x] **Home.tsx 수정**
    - [x] 모달 방식 → 페이지 네비게이션 변경
    - [x] `MySpacePre` import 및 모달 코드 제거
    - [x] `useNavigate` 훅으로 `/myspace` 이동
    - [x] `isMySpaceOpen` 상태 제거
- [x] **토큰 키 통일** (`'token'` → `'auth_token'`)
    - [x] api.ts: `fetchWithAuth` 함수 수정
    - [x] mediaService.ts: `uploadImage`, `uploadAudio` 함수 수정 (2곳)
- [x] **Playwright 브라우저 검증**
    - [x] 마이스페이스 페이지 정상 로드 확인
    - [x] 프로필 섹션, 친구 통계, 일기 섹션, 미디어 갤러리 표시 확인

### 변경된 파일
- 📝 [수정] client/src/pages/Home.tsx (모달 → 네비게이션)
- 📝 [수정] client/src/services/api.ts (토큰 키 수정)
- 📝 [수정] client/src/services/mediaService.ts (토큰 키 수정 2곳)
- 📝 [수정] docs/task.md
- 📝 [수정] docs/history.md (이 항목)

### 해결한 문제
| 문제 | 원인 | 해결 |
|------|------|------|
| 내 공간 기능 없음 | 정적 MySpacePre 컴포넌트 사용 | /myspace 페이지로 네비게이션 |
| 401 Unauthorized | 토큰 키 불일치 (`token` vs `auth_token`) | 모든 파일에서 `auth_token` 통일 |

### 참조한 문서
- docs/task.md
- client/src/contexts/AuthContext.tsx (토큰 키 확인)

### 중요도
⭐ 마일스톤 - 마이스페이스 기능 정상 연동

---

## History #17 - 마이스페이스 모달 UI 통합 ⭐

**날짜**: 2025-12-13
**사용자 요청**: "이전에 내 공간을 누르면 모달이 떴잖아? 그 디자인에 지금 myspace페이지의 기능이 적용이 되어야해. 모달의 디자인을 유지하면서 myspace페이지의 기능이 적용되어야 하는거야."

### 분석 및 설계
- MySpacePre.tsx: Elementor 기반 정적 와이어프레임 (기능 없음)
- MySpace.tsx: 완전한 API 연동 페이지 (ProfileSection, DiarySection, MediaGallery 등)
- 요구사항: 모달 형태로 열리면서 MySpace의 모든 기능이 동작

### 수행한 작업
- [x] **MySpaceModal.tsx 컴포넌트 생성**
    - [x] MySpace.tsx의 모든 기능 로직 통합
    - [x] MiniHomepyWindow 디자인 (그라데이션 헤더 + 맥OS 스타일 버튼)
    - [x] 빨간 점 클릭 시 모달 닫기 기능
    - [x] 2컬럼 레이아웃 (LeftPanel + RightPanel)
    - [x] 탭 네비게이션 (일기/친구소식/친구관리/친구신청)
    - [x] 일기 작성/조회 모달 중첩 지원
- [x] **Home.tsx 수정**
    - [x] `useNavigate` 제거, 모달 상태 추가
    - [x] `handleMySpaceClick`: navigate → setIsMySpaceOpen(true)
    - [x] MySpaceModal import 및 렌더링
    - [x] isAnyModalOpen에 MySpace 모달 포함
- [x] **modals/index.ts 업데이트**
    - [x] MySpaceModal export 추가
- [x] **브라우저 검증**
    - [x] 모달 정상 열림 확인
    - [x] 프로필/친구통계/일기/미디어 갤러리 표시 확인
    - [x] 닫기 버튼 정상 동작 확인

### 변경된 파일
- 📄 [생성] client/src/components/modals/MySpaceModal.tsx
- 📝 [수정] client/src/components/modals/index.ts (export 추가)
- 📝 [수정] client/src/pages/Home.tsx (모달 연동)
- 📝 [수정] docs/history.md (이 항목)

### 구현된 기능
| 기능 | 설명 |
|------|------|
| 프로필 섹션 | 프로필 이미지 표시/변경, 사용자명 |
| 남기는 말 | 묘비명 작성/수정 기능 |
| 친구 통계 | 가족/찐친/친구 수 표시 |
| 일기장 | 일기 목록, 작성, 조회 |
| 미디어 갤러리 | 사진/음성 업로드 및 표시 |
| 친구 관리 | 친구 목록, 검색, 신청 관리 |

### 참조한 문서
- client/src/pages/MySpace.tsx (기능 로직 참조)
- client/src/components/common/Modal.tsx (모달 구조 참조)

### 중요도
⭐ 마일스톤 - 마이스페이스 모달 UI + 기능 통합 완료

---

## History #18 - 마이스페이스 모달 Elementor 디자인 복원 ⭐

**날짜**: 2025-12-13
**사용자 요청**: "모달형태로 변경은 잘 됐다. 근데 기존의 디자인이 전혀 없어. 기존 디자인을 유지하는게 중요해."

### 문제 분석
- History #17에서 생성한 MySpaceModal이 기능은 동작하나 원본 Elementor 디자인이 적용되지 않음
- MySpacePre.tsx의 Elementor 클래스 구조(`.elementor elementor-33`, `.elementor-element-*`)가 필요
- elementor-post-33.css의 스타일이 클래스명 기반으로 적용되므로 동일한 클래스 구조 필수

### 수행한 작업
- [x] **MySpacePre.tsx Elementor 구조 분석**
    - [x] `.elementor elementor-33` wrapper 클래스 확인
    - [x] 주요 요소: `.elementor-element-e779b6b`, `.elementor-element-3b60109`, `.elementor-element-9bff52b`, `.elementor-element-8b6855b`
    - [x] 2컬럼 레이아웃: 20% + 80%
- [x] **elementor-post-33.css 스타일 분석**
    - [x] min-height: 600px, border: 2px solid, border-radius: 20px
    - [x] cyan/blue 계열 테두리 색상
    - [x] 분리선 및 패딩 스타일
- [x] **MySpaceModal.tsx 전면 재작성**
    - [x] Elementor 클래스 구조 적용 (`.elementor elementor-33` wrapper)
    - [x] 모든 `.elementor-element-*` 클래스 적용
    - [x] `ElementorStyles` styled-component로 추가 UI 스타일 정의
    - [x] 기존 모든 기능 유지 (API 연동, 탭, 일기 CRUD, 미디어 업로드)
- [x] **브라우저 검증**
    - [x] Elementor 2컬럼 레이아웃 적용 확인
    - [x] cyan/blue 테두리 스타일 확인
    - [x] 프로필/남기는 말/친구통계/탭/일기/미디어 모두 정상 표시

### 변경된 파일
- 📝 [수정] client/src/components/modals/MySpaceModal.tsx (Elementor 구조로 전면 재작성)
- 📝 [수정] docs/history.md (이 항목)

### 적용된 디자인 요소
| 요소 | 설명 |
|------|------|
| 2컬럼 레이아웃 | 왼쪽 20% (프로필) + 오른쪽 80% (콘텐츠) |
| 테두리 스타일 | cyan/blue 계열 2px solid border |
| 둥근 모서리 | border-radius: 20px |
| 제목 스타일 | 핑크/마젠타 색상 제목 |
| 분리선 | 패널 간 구분선 |

### 참조한 문서
- client/src/components/myspace/MySpacePre.tsx (Elementor 구조 참조)
- client/public/css/elementor-post-33.css (CSS 스타일 참조)

### 중요도
⭐ 마일스톤 - Elementor 원본 디자인 + 기능 통합 완성

---

## History #19 - 코드 최적화 및 개발자/디자이너 친화성 개선 ⭐

**날짜**: 2025-12-13
**사용자 요청**: "claude.md를 비롯한 문서들을 검토해서 전체 코드 최적화 한번 하고 가자. 기능이랑 디자인이 유지되는것이 중요해. 그리고 디자이너에게 의뢰했을때 ui/ux요소 추가 및 변경이 어렵지 않아야해. 개발자에게 의뢰했을때 기능의 추가 변경역시 마찬가지야."

### 수행한 작업
- [x] **서비스 레이어 패턴 통일**
    - [x] mediaService.ts - named export 추가
    - [x] diaryService.ts - named export 추가
    - [x] myspaceService.ts - named export 추가
    - [x] services/index.ts - 모든 서비스 배럴 export 추가
- [x] **백엔드 타입 안전성 개선**
    - [x] authController.ts - `error: any` → `error instanceof Error` 패턴으로 수정 (2곳)
- [x] **디자이너 친화적 테마 유틸리티 추가**
    - [x] `generateCSSVariables()` - 테마를 CSS 변수로 변환
    - [x] `media` 객체 - 반응형 미디어 쿼리 헬퍼 (xs~xxl, max variants)
    - [x] `mixins` 객체 - 재사용 가능한 스타일 패턴
        - flexCenter, flexBetween, flexColumn, flexColumnCenter
        - cardStyle, inputBase, buttonBase
        - textEllipsis, lineClamp, hideScrollbar, customScrollbar
        - focusRing, overlay
- [x] **컴포넌트 문서화 강화**
    - [x] Button.tsx - 포괄적인 JSDoc 주석 추가 (사용 예시, variant/size 설명)
- [x] **TypeScript 에러 수정**
    - [x] MySpaceModal.tsx:601 - profileImage 타입 불일치 해결
        - `src={profileImage}` → `src={profileImage.thumbnailUrl || profileImage.url}`

### 변경된 파일
- 📝 [수정] client/src/services/mediaService.ts (named export 추가)
- 📝 [수정] client/src/services/diaryService.ts (named export 추가)
- 📝 [수정] client/src/services/myspaceService.ts (named export 추가)
- 📝 [수정] client/src/services/index.ts (전체 서비스 export)
- 📝 [수정] src/controllers/authController.ts (타입 안전성 개선)
- 📝 [수정] client/src/styles/theme.ts (유틸리티 함수 추가)
- 📝 [수정] client/src/styles/index.ts (유틸리티 export 추가)
- 📝 [수정] client/src/components/common/Button.tsx (JSDoc 강화)
- 📝 [수정] client/src/components/modals/MySpaceModal.tsx (타입 에러 수정)

### 개선 효과

**디자이너 친화성**:
| 기능 | 사용 예시 | 효과 |
|------|----------|------|
| CSS 변수 | `var(--color-primary)` | 직관적인 색상/간격 조정 |
| 미디어 쿼리 | `${media.md} { ... }` | 일관된 반응형 브레이크포인트 |
| 믹스인 | `${mixins.flexCenter}` | 자주 쓰는 패턴 재사용 |

**개발자 친화성**:
| 기능 | 사용 예시 | 효과 |
|------|----------|------|
| 배럴 export | `import { mediaService } from '@/services'` | 단일 import 경로 |
| 타입 안전성 | `error instanceof Error` | 런타임 에러 방지 |
| JSDoc 문서화 | IDE 자동완성 + 툴팁 | 빠른 API 파악 |

### 참조한 문서
- CLAUDE.md
- docs/task.md
- docs/structure.md
- docs/refactoring-guide.md

### 중요도
⭐ 마일스톤 - 코드 최적화 및 개발자/디자이너 친화성 개선

---

## History #20 - 오디오 압축 및 다운로드 기능 ⭐

**날짜**: 2025-12-13
**사용자 요청**: "음성일기를 남길때 저장할때 음질은 유지하면서 용량은 줄여서 저장할 수 있어? 필요할땐 파일로 다운로드 할 수도 있는거야?"

### 수행한 작업
- [x] **백엔드 오디오 압축 구현**
    - [x] `fluent-ffmpeg` 패키지 추가
    - [x] `mediaService.ts` - Opus 압축 함수 추가 (`compressAudioToOpus`)
    - [x] `mediaService.ts` - MP3 변환 함수 추가 (`convertOpusToMp3`)
    - [x] `mediaController.ts` - 업로드 시 자동 압축 적용
    - [x] 압축 실패 시 원본 유지 (안전한 폴백)
- [x] **백엔드 다운로드 API 구현**
    - [x] `GET /api/media/download/:mediaId` 엔드포인트 추가
    - [x] `?format=opus` (기본) 또는 `?format=mp3` 지원
    - [x] MP3 요청 시 실시간 변환 후 제공
    - [x] 파일명에 사용자명 포함
- [x] **프론트엔드 다운로드 기능 추가**
    - [x] `mediaService.ts` - `getAudioDownloadUrl()`, `downloadAudio()` 함수 추가
    - [x] `MediaGallery.tsx` - 오디오 항목에 다운로드 버튼 2개 추가 (Opus/MP3)

### 변경된 파일
- 📝 [수정] package.json (fluent-ffmpeg, @types/fluent-ffmpeg 추가)
- 📝 [수정] src/services/mediaService.ts (압축/변환 함수 추가)
- 📝 [수정] src/controllers/mediaController.ts (압축 적용, 다운로드 API)
- 📝 [수정] src/routes/mediaRoutes.ts (다운로드 라우트 추가)
- 📝 [수정] client/src/services/mediaService.ts (다운로드 함수 추가)
- 📝 [수정] client/src/components/myspace/MediaGallery.tsx (다운로드 버튼 UI)
- 📝 [수정] docs/task.md (5.1단계 추가)

### 기술 상세

**압축 설정 (Opus)**:
| 설정 | 값 | 설명 |
|------|-----|------|
| 코덱 | libopus | 음성에 최적화된 코덱 |
| 비트레이트 | 48kbps | 음성에 충분한 품질 |
| 채널 | 모노 | 음성 녹음에 적합 |
| 샘플레이트 | 48000Hz | Opus 표준 |

**압축 효과**:
| 원본 형식 | 원본 크기 | 압축 후 | 절감률 |
|-----------|----------|---------|--------|
| WAV 1분 | ~10MB | ~0.3MB | 97% |
| MP3 1분 | ~1MB | ~0.3MB | 70% |

### 사전 조건
- FFmpeg 설치 필요 (서버에서 압축 기능 동작)
- 미설치 시 원본 파일 그대로 저장 (압축 없음)

### 참조한 문서
- docs/task.md

### 중요도
⭐ 마일스톤 - 오디오 압축 및 다운로드 기능 완성

---

## History #21 - FFmpeg 모듈 오류 수정 및 활성화

**날짜**: 2025-12-13
**사용자 요청**: "내 공간 버튼 누르면 오류가 뜬다" + "그럼 서버에서 기능이 잘 작동하도록 해"

### 문제 원인 분석
1. "내 공간" 버튼 클릭 시 500 Internal Server Error 발생
2. 콘솔: `GET /api/myspace/my 500`, `SyntaxError: Unexpected end of JSON input`
3. **근본 원인**: 서버가 `fluent-ffmpeg` 모듈 로드 실패로 크래시
   - TypeScript 컴파일 에러: `Cannot find module 'fluent-ffmpeg'`
   - 암시적 any 타입 에러

### 수행한 작업
- [x] **오류 분석**
    - [x] 프론트엔드 API 설정 확인 (정상)
    - [x] Vite 프록시 설정 확인 (정상)
    - [x] 백엔드 서버 로그 확인 → 크래시 발견
- [x] **mediaService.ts 수정**
    - [x] `fluent-ffmpeg`를 선택적 의존성으로 변경
    - [x] try-catch로 안전한 모듈 로드 구현
    - [x] FFprobe 인터페이스 타입 정의 추가
    - [x] 모듈 미설치 시 원본 저장 폴백
- [x] **npm 패키지 설치**
    - [x] `npm install fluent-ffmpeg @types/fluent-ffmpeg`
- [x] **서버 재시작**
    - [x] FFmpeg 모듈 로드 확인 → ✅ 성공

### 변경된 파일
- 📝 [수정] src/services/mediaService.ts (선택적 의존성 패턴 적용)
- 📦 [추가] node_modules/fluent-ffmpeg (v2.1.3)
- 📦 [추가] node_modules/@types/fluent-ffmpeg

### 기술 상세

**수정된 코드 패턴**:
```typescript
// 선택적 의존성 패턴
let ffmpeg: any = null;
let ffmpegAvailable = false;

try {
    ffmpeg = require('fluent-ffmpeg');
    ffmpegAvailable = true;
    console.log('✅ FFmpeg 모듈 로드 완료 - 오디오 압축 기능 활성화');
} catch {
    console.log('⚠️ fluent-ffmpeg 모듈 없음 - 오디오 압축 비활성화');
}
```

**서버 시작 로그**:
```
✅ FFmpeg 모듈 로드 완료 - 오디오 압축 기능 활성화
Server is running on port 3000
```

### 참조한 문서
- docs/troubleshooting.md
- docs/history.md

### 중요도
일반 작업 - 버그 수정 및 기능 활성화

---

## History #22 - 일기 공개 범위 선택 UI 구현 ⭐

**날짜**: 2025-12-13
**사용자 요청**: "일기쓰기 화면에서 일기를 쓰고 저장할때 (다중 선택 가능) 안내 문구는 있는데 선택할 수 있는항목이 없다. 비공개, 가족, 찐친, 친구, 전체공개 선택을 할 수 있어야해. 가족, 찐친, 친구 항목은 중복 선택할 수 있어."

### 문제 분석
1. "공개 범위 (다중 선택 가능)" 라벨은 있으나 선택 항목이 표시되지 않음
2. 기존 코드가 API에서 `relationshipTypes`를 로드하려 했으나 실패
3. 비공개/전체공개 옵션이 데이터베이스에 없었음

### 수행한 작업
- [x] **프론트엔드 UI 개선** (`DiaryWriteModal.tsx`)
    - [x] 5가지 공개 범위 옵션 하드코딩 추가
    - [x] 각 옵션별 색상 및 스타일 구현
    - [x] 다중 선택 로직 구현 (가족/찐친/친구)
    - [x] 단독 선택 로직 구현 (비공개/전체공개)
    - [x] 선택 상태에 따른 도움말 텍스트 표시
- [x] **백엔드 API 수정** (`diaryController.ts`)
    - [x] 공개 범위 타입 매핑 추가 (string → ID)
    - [x] `createDiary` 함수 수정
    - [x] `updateDiary` 함수 수정
- [x] **데이터베이스 스키마 업데이트** (`schema.sql`)
    - [x] 비공개(id=0), 전체공개(id=99) 타입 추가
- [x] **서비스 레이어 수정** (`diaryService.ts`)
    - [x] `VisibilityType` 타입 정의 추가
    - [x] `createDiary`, `updateDiary` 타입 수정

### 변경된 파일
- 📝 [수정] client/src/components/modals/DiaryWriteModal.tsx (UI 및 로직)
- 📝 [수정] client/src/services/diaryService.ts (타입 정의)
- 📝 [수정] src/controllers/diaryController.ts (API 로직)
- 📝 [수정] database/schema.sql (스키마 업데이트)
- 📄 [생성] src/setup-visibility-types.ts (DB 마이그레이션)

### 공개 범위 옵션

| ID | 이름 | 표시명 | 선택 타입 | 색상 |
|----|------|--------|----------|------|
| 0 | private | 비공개 | 단독 | 회색 |
| 1 | family | 가족 | 다중 | 빨강 |
| 2 | close_friend | 찐친 | 다중 | 금색 |
| 3 | friend | 친구 | 다중 | 검정 |
| 99 | public | 전체공개 | 단독 | 초록 |

### 선택 로직
```
비공개 선택 시: 다른 모든 선택 해제 → 나만 볼 수 있음
가족/찐친/친구: 다중 선택 가능, 비공개/전체공개 자동 해제
전체공개 선택 시: 다른 모든 선택 해제 → 모든 사람이 볼 수 있음
```

### 참조한 문서
- docs/task.md
- docs/structure.md

### 중요도
⭐ 마일스톤 - 일기 공개 범위 기능 완성

---

## History #23 - 일기와 남기는 말 분리 ⭐

**날짜**: 2025-12-13
**사용자 요청**: "지금 일기를 작성하면 최종 일기 내용이 내 공간 모달의 좌측에 있는 남기는 말에 나온다. 이 둘은 별개의 기능이야. 일기의 텍스트 길이 제한은 20,000자로 여유있게 잡자. 그리고 모달의 좌측에 있는 남기는 말은 별개로 관리할거야. 최대 100자를 작성할 수 있어. 남기는 말 관리 버튼을 누르면 남기는 말 이력이 따로 관리되어야해."

### 문제 분석
1. 기존에 "남기는 말"이 가장 최근 일기 내용에서 가져오는 구조
2. 일기와 남기는 말은 별개의 기능으로 분리 필요
3. 남기는 말에 이력 관리 기능 필요

### 수행한 작업
- [x] **일기 글자수 제한 변경**
    - [x] `DiaryWriteModal.tsx` - 5,000자 → 20,000자
- [x] **남기는 말 DB 테이블 설계**
    - [x] `schema.sql` - `user_messages` 테이블 추가
    - [x] 100자 제한, is_active 플래그로 현재 메시지 관리
- [x] **남기는 말 백엔드 API 구현**
    - [x] `messageController.ts` - CRUD + 이력 API
    - [x] `messageRoutes.ts` - 라우트 정의
    - [x] `app.ts` - 라우트 등록
- [x] **myspaceController.ts 수정**
    - [x] epitaph를 `user_messages` 테이블에서 조회하도록 변경
    - [x] 기존 `updateEpitaph` 함수 제거
- [x] **남기는 말 관리 모달 UI 구현**
    - [x] `MessageModal.tsx` - 새 메시지 작성 + 이력 관리
    - [x] 탭 인터페이스: 새로 작성 / 이력
    - [x] 과거 메시지 활성화, 삭제, 숨기기 기능
- [x] **프론트엔드 연동**
    - [x] `messageService.ts` - API 서비스 함수
    - [x] `MySpace.tsx` - MessageModal 연결
    - [x] `ProfileSection.tsx` - 안내 문구 수정 (100자)
- [x] **DB 마이그레이션**
    - [x] `setup-user-messages.ts` 스크립트 생성 및 실행

### 변경된 파일
- 📝 [수정] client/src/components/modals/DiaryWriteModal.tsx (글자수 제한 변경)
- 📝 [수정] database/schema.sql (user_messages 테이블 추가)
- 📄 [생성] src/controllers/messageController.ts (남기는 말 API)
- 📄 [생성] src/routes/messageRoutes.ts (라우트 정의)
- 📝 [수정] src/app.ts (라우트 등록)
- 📝 [수정] src/controllers/myspaceController.ts (epitaph 조회 변경)
- 📝 [수정] src/routes/myspaceRoutes.ts (updateEpitaph 제거)
- 📄 [생성] client/src/services/messageService.ts (프론트엔드 서비스)
- 📄 [생성] client/src/components/modals/MessageModal.tsx (관리 모달)
- 📝 [수정] client/src/components/modals/index.ts (export 추가)
- 📝 [수정] client/src/pages/MySpace.tsx (모달 연결)
- 📝 [수정] client/src/components/myspace/ProfileSection.tsx (안내 문구)
- 📄 [생성] src/setup-user-messages.ts (DB 마이그레이션)

### 기능 비교

| 기능 | 일기 | 남기는 말 |
|------|-----|----------|
| 글자수 | 20,000자 | 100자 |
| 목적 | 일상 기록 | 자기 소개 한마디 |
| 공개 범위 | 설정 가능 | 모든 방문자에게 표시 |
| 이력 관리 | 개별 일기 목록 | 별도 이력 관리 |
| 저장 테이블 | diaries | user_messages |

### 남기는 말 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/messages/current | 현재 활성 메시지 조회 |
| GET | /api/messages/history | 메시지 이력 조회 |
| GET | /api/messages/user/:userId | 다른 사용자 메시지 조회 |
| POST | /api/messages | 새 메시지 작성 |
| PUT | /api/messages/:id/activate | 과거 메시지 활성화 |
| PUT | /api/messages/hide | 현재 메시지 숨기기 |
| DELETE | /api/messages/:id | 메시지 삭제 |

### 참조한 문서
- docs/task.md
- docs/structure.md

### 중요도
⭐ 마일스톤 - 일기와 남기는 말 기능 분리

---

## History #24 - 남기는 말 기능 버그 수정 및 Home 모달 연결

**날짜**: 2025-12-13 22:30
**사용자 요청**: "이전 세션에서 발생한 500 에러 해결 및 MySpaceModal에 MessageModal 연결"

### 문제 분석
1. 서버 500 Internal Server Error 발생 - authMiddleware import 오류
2. Home 페이지의 MySpaceModal에 MessageModal이 연결되지 않음

### 수행한 작업
- [x] **서버 에러 수정**
    - [x] `messageRoutes.ts` - `authMiddleware` → `requireAuth`로 수정
    - [x] 서버 재시작 및 정상 동작 확인
- [x] **MySpaceModal에 MessageModal 연결**
    - [x] MessageModal import 추가
    - [x] showMessageModal state 추가
    - [x] "남기는 말 관리" 버튼에 onClick 핸들러 연결
    - [x] MessageModal 렌더링 추가
    - [x] 안내 문구 수정 (500자 → 100자)
- [x] **기능 테스트 완료**
    - [x] 남기는 말 작성 테스트 성공
    - [x] 이력 탭 동작 확인
    - [x] MySpace 모달에 저장된 메시지 표시 확인

### 변경된 파일
- 📝 [수정] src/routes/messageRoutes.ts (import 수정)
- 📝 [수정] client/src/components/modals/MySpaceModal.tsx (MessageModal 연결)

### 참조한 문서
- docs/history.md

### 중요도
일반 작업 - 버그 수정 및 기능 연결 완료

---

## History #25 - UI/UX 개선 및 인증 강화 ⭐

**날짜**: 2025-12-14
**사용자 요청**: 여러 UI/UX 개선 요청 (토큰 만료 해결, 프로필 사진 비율 변경, 레이아웃 통일, 일기 페이지네이션)

### 수행한 작업
- [x] **JWT 토큰 만료 시간 연장**
    - [x] `authController.ts` - expiresIn 변경: `1h` → `7d`
    - [x] 사용자가 자주 로그아웃되는 문제 해결
- [x] **401 Unauthorized 자동 처리**
    - [x] `api.ts` - fetchWithAuth에서 401 응답 시 자동 로그아웃
    - [x] localStorage 토큰 삭제 후 홈으로 리다이렉트
- [x] **프로필 사진 비율 변경 (영정사진 표준 적용)**
    - [x] `MySpaceModal.tsx` - 200x200 → 200x255 (11:14 비율)
    - [x] `ProfileSection.tsx` - 동일 비율 적용
- [x] **레이아웃 너비 통일 (프로필 사진 기준)**
    - [x] `MySpaceModal.tsx` - `.epitaph-section` width: 200px
    - [x] `MySpaceModal.tsx` - `.friend-stats` width: 200px
    - [x] 중앙 정렬 및 box-sizing 적용
- [x] **일기장 페이지네이션 구현**
    - [x] 기존 "더 보기" 버튼 → 페이지네이션 UI
    - [x] DIARIES_PER_PAGE = 4 (한 페이지당 4개)
    - [x] 이전/다음 버튼 및 페이지 정보 표시
    - [x] goToDiaryPage 함수로 페이지 이동

### 변경된 파일
- 📝 [수정] src/controllers/authController.ts (토큰 만료 7일로 연장)
- 📝 [수정] client/src/services/api.ts (401 자동 로그아웃)
- 📝 [수정] client/src/components/modals/MySpaceModal.tsx (프로필 비율, 레이아웃 통일, 페이지네이션)
- 📝 [수정] client/src/components/myspace/ProfileSection.tsx (프로필 비율 변경)
- 📝 [수정] docs/task.md (5.2단계 추가)
- 📝 [수정] docs/history.md (이 항목)

### 기술 상세

**프로필 사진 비율 (영정사진 표준)**:
| 항목 | 이전 | 변경 후 |
|------|------|---------|
| 너비 | 200px | 200px |
| 높이 | 200px | 255px |
| 비율 | 1:1 | 11:14 (영정사진 표준) |

**일기 페이지네이션**:
```tsx
const DIARIES_PER_PAGE = 4;
const [diaryPage, setDiaryPage] = useState(1);
const [totalDiaryPages, setTotalDiaryPages] = useState(1);

const goToDiaryPage = async (page: number) => {
  if (page < 1 || page > totalDiaryPages) return;
  const response = await getMyDiaries(page, DIARIES_PER_PAGE);
  // ...
};
```

**레이아웃 통일**:
| 요소 | 이전 | 변경 후 |
|------|------|---------|
| 프로필 사진 | 200px | 200px |
| 남기는 말 | 가변 | 200px |
| 친구 통계 | 가변 | 200px |

### 참조한 문서
- docs/task.md
- docs/structure.md
- info/기능명세서.md (영정사진 비율 참조)

### 중요도
⭐ 마일스톤 - UI/UX 개선 및 인증 강화 완료

---

## History #26 - 코드 품질 검사 및 ESLint 이슈 수정

**날짜**: 2025-12-14
**사용자 요청**: "프로젝트 코드를 꼼꼼하게 살펴봐. 디자인과 기능이 유지되어야해. 코드 개선할 사항 있는지 확인해."

### 수행한 작업
- [x] **프로젝트 문서 분석**
    - [x] CLAUDE.md, task.md, structure.md 검토
    - [x] 프로젝트 아키텍처 파악

- [x] **백엔드 코드 분석**
    - [x] 컨트롤러 구조 검토 (auth, friend, diary, myspace)
    - [x] 미들웨어 패턴 확인 (JWT 인증)
    - [x] API 라우팅 검토

- [x] **프론트엔드 코드 분석**
    - [x] 서비스 레이어 검토 (api.ts, friendService.ts)
    - [x] 타입 정의 검토 (types/index.ts)
    - [x] 컨텍스트 패턴 검토 (AuthContext.tsx)

- [x] **코드 품질 검사**
    - [x] TypeScript 타입 검사 (npx tsc --noEmit) → ✅ 통과
    - [x] ESLint 검사 (npm run lint) → 3개 이슈 발견

- [x] **ESLint 이슈 수정 (3건)**
    - [x] DiaryViewModal.tsx: loadDiary를 useCallback으로 감싸고 의존성 배열에 추가
    - [x] MediaGallery.tsx: 사용되지 않는 DeleteButton 스타일드 컴포넌트 제거
    - [x] ProfileModal.tsx: eslint-disable 주석 추가 (초기 데이터 로드 패턴 허용)

### 변경된 파일
- 📝 [수정] client/src/components/modals/DiaryViewModal.tsx
    - useCallback import 추가
    - loadDiary 함수를 useCallback으로 감싸기
    - useEffect 의존성 배열에 loadDiary 추가
- 📝 [수정] client/src/components/myspace/MediaGallery.tsx
    - 사용되지 않는 DeleteButton 스타일드 컴포넌트 제거
- 📝 [수정] client/src/components/modals/ProfileModal.tsx
    - eslint-disable-next-line 주석 추가 (초기 데이터 로드 패턴)
- 📝 [수정] docs/history.md (이 항목)

### 기술 상세

**ESLint 이슈 해결**:
| 파일 | 이슈 | 해결 방법 |
|------|------|-----------|
| DiaryViewModal.tsx | react-hooks/exhaustive-deps | useCallback으로 래핑 |
| MediaGallery.tsx | @typescript-eslint/no-unused-vars | 미사용 컴포넌트 삭제 |
| ProfileModal.tsx | react-hooks/set-state-in-effect | eslint-disable 주석 추가 |

**DiaryViewModal.tsx 수정 전/후**:
```tsx
// 이전: 의존성 누락
useEffect(() => {
  if (isOpen && diaryId) {
    loadDiary();
  }
}, [isOpen, diaryId]); // loadDiary 누락

// 이후: useCallback 적용
const loadDiary = useCallback(async () => {
  // ...
}, [diaryId]);

useEffect(() => {
  if (isOpen && diaryId) {
    loadDiary();
  }
}, [isOpen, diaryId, loadDiary]); // 의존성 완전
```

### 참조한 문서
- docs/task.md
- docs/structure.md
- CLAUDE.md

### 중요도
일반 작업 - 코드 품질 유지보수

---

## 📊 마일스톤 요약

| # | 날짜 | 마일스톤 | 상태 |
|---|------|---------|------|
| 1 | 2025-12-02 | 프로젝트 기반 구조 완성 | ✅ 완료 |
| 2 | 2025-12-02 | 디자인 이식 완료 | ✅ 완료 |
| 3 | 2025-12-02 | 인증 시스템 완성 | ✅ 완료 |
| 4 | 2025-12-10 | 문서 체계 정비 완료 | ✅ 완료 |
| 5 | 2025-12-13 | 프론트엔드 리팩토링 완료 | ✅ 완료 |
| 6 | 2025-12-13 | PostgreSQL 18 데이터베이스 설정 | ✅ 완료 |
| 7 | 2025-12-13 | 친구 관계 시스템 백엔드 완성 | ✅ 완료 |
| 8 | 2025-12-13 | 친구 관리 UI 완성 | ✅ 완료 |
| 9 | 2025-12-13 | 마이스페이스 및 미디어 기능 완성 | ✅ 완료 |
| 10 | 2025-12-13 | 메인페이지 로그인 UX 통합 | ✅ 완료 |
| 11 | 2025-12-13 | 브랜드 적용 - 친애 | ✅ 완료 |
| 12 | 2025-12-13 | 5단계 배포 준비 검증 | ✅ 완료 |
| 13 | 2025-12-13 | 마이스페이스 기능 연동 | ✅ 완료 |
| 14 | 2025-12-13 | 마이스페이스 모달 UI 통합 | ✅ 완료 |
| 15 | 2025-12-13 | Elementor 원본 디자인 복원 | ✅ 완료 |
| 16 | 2025-12-13 | 코드 최적화 및 개발자/디자이너 친화성 개선 | ✅ 완료 |
| 17 | 2025-12-13 | 오디오 압축 및 다운로드 기능 | ✅ 완료 |
| 18 | 2025-12-13 | 일기 공개 범위 선택 기능 | ✅ 완료 |
| 19 | 2025-12-13 | 일기와 남기는 말 기능 분리 | ✅ 완료 |
| 20 | 2025-12-14 | UI/UX 개선 및 인증 강화 | ✅ 완료 |

---

## 🔄 롤백 안내

특정 시점으로 롤백하려면:

1. 이 문서에서 롤백 대상 History 번호 확인
2. 해당 History의 "변경된 파일" 목록 확인
3. 역순으로 파일 복원:
   - 📄 [생성]된 파일 → 삭제
   - 📝 [수정]된 파일 → 이전 버전으로 복원 (git checkout)
   - 🗑️ [삭제]된 파일 → 재생성
4. 롤백 완료 후 새 History 항목으로 기록

**롤백 명령어 예시**:
```bash
# 특정 파일을 이전 커밋 버전으로 복원
git checkout HEAD~1 -- path/to/file

# 전체 롤백
git revert <commit-hash>
```
