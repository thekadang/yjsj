# 인프라 구축 및 디자인 통합 계획

## 목표
GCP(Google Cloud Platform) 기반의 비용 효율적인 인프라를 구축하고, 미디어 최적화 전략을 포함하여 시스템을 구현합니다. 또한, **친구 관계 시스템**을 새롭게 구현하여 사용자 간의 연결을 강화합니다.

## 사용자 검토 필요
> [!IMPORTANT]
> **친구 관계 정의**: 친구 신청 및 수락 시 '가족', '찐친', '친구' 3단계 중 하나를 필수적으로 선택해야 합니다. 이는 추후 콘텐츠 공개 범위(권한) 설정에 사용됩니다.

## 변경 제안

### 1. 프로젝트 초기화 (GCP Ready)
#### [NEW] [package.json](file:///f:/The%20kadang/code_project/google%20antigravity/%EC%83%88%20%ED%8F%B4%EB%8D%94/package.json)
- Root `package.json` 생성

#### [NEW] [client/](file:///f:/The%20kadang/code_project/google%20antigravity/%EC%83%88%20%ED%8F%B4%EB%8D%94/client/)
- Vite + React + TypeScript 프로젝트 초기화
- Tailwind CSS 설치
- **[NEW] `react-easy-crop` 등 이미지 크롭 라이브러리 추가**

#### [NEW] [src/](file:///f:/The%20kadang/code_project/google%20antigravity/%EC%83%88%20%ED%8F%B4%EB%8D%94/src/)
- Express + TypeScript 서버 기본 구조
- **[NEW] `sharp` (이미지 리사이징) 및 `multer` (파일 업로드) 설정**

### 2. 디자인 마이그레이션
#### [MODIFY] [client/src/index.css](file:///f:/The%20kadang/code_project/google%20antigravity/%EC%83%88%20%ED%8F%B4%EB%8D%94/client/src/index.css)
- 기존 스타일 이식

#### [NEW] [client/src/components/](file:///f:/The%20kadang/code_project/google%20antigravity/%EC%83%88%20%ED%8F%B4%EB%8D%94/client/src/components/)
- Header, Footer, LinkInBio 구현

### 3. 회원가입 및 인증 시스템 구현 (진행 중)
#### [DONE] 로그인 시스템 (모달 방식)
- **`LoginModal.tsx`**: 로그인 폼 모달 (구현 완료)
    - 아이디/비밀번호 입력
    - 카카오/구글 로그인 버튼 (UI 구현 완료)
    - 회원가입 버튼 -> `SignUpModal`로 전환
- **`Login.tsx` & `Home.tsx` 수정**: 로그인 모달 연동 완료

#### [DONE] 회원가입 시스템 (모달 방식)
- **`SignUpModal.tsx`**: 회원가입 폼 모달 (구현 완료)
    - 기본 정보 입력 (아이디, 비밀번호, 이름, 전화번호)
    - 소셜 로그인 버튼 (UI)
    - 회원가입 완료 후 로그인 모달로 전환

#### [NEW] 추가 정보 입력 (예정)
- **`SignUpInfo.tsx`**: 가입 후 추가 정보 입력 페이지
    - **필수 정보**: 이름, 연락처, 생년월일, 성별, 주소
    - **선택 정보**: 보험/상조 가입 여부 (가입 시 상품명 입력, 미가입 시 상담요청 버튼)
    - **사망 확인인 정보**: 지인 2인 이상의 이름, 연락처, 생년월일 (필수)
    - 약관 동의

#### [NEW] API 엔드포인트
- `POST /api/auth/register`: 이메일 회원가입 처리 (완료)
- `POST /api/auth/login`: 로그인 처리 (완료)
- `POST /api/auth/social`: 소셜 로그인/가입 처리
- `PUT /api/users/profile`: 추가 정보 업데이트

#### [NEW] API 엔드포인트
- `GET /api/users/search`: 이름과 연락처로 회원 검색
- `POST /api/friends/request`: 친구 신청 (recipientId, relation)
- `GET /api/friends/requests`: 받은 친구 신청 목록 조회
- `POST /api/friends/respond`: 친구 신청 응답 (requestId, status, relation?)

#### [NEW] UI 컴포넌트
- **`FriendSearchModal.tsx`**: 사용자 검색 및 관계 선택 후 신청
- **`FriendRequestList.tsx`**: 내 공간에서 받은 신청 확인 및 수락/거절 (관계 선택 포함)

### 5. 미디어 처리 로직 구현
#### [NEW] [src/services/mediaService.ts](file:///f:/The%20kadang/code_project/google%20antigravity/%EC%83%88%20%ED%8F%B4%EB%8D%94/src/services/mediaService.ts)
- 이미지 업로드 시 썸네일(300KB) 생성 로직
- 원본/썸네일 분리하여 GCS(Google Cloud Storage) 업로드

## 검증 계획
- 로컬에서 이미지 업로드 시 썸네일 생성되는지 확인
- 1분 이상 오디오 녹음 시 차단 또는 경고 확인
- **친구 신청 시나리오 테스트**: A가 B에게 '찐친'으로 신청 -> B가 목록에서 확인 -> B가 '가족'으로 수락 -> 양쪽 친구 목록에 표시 확인
- **회원가입 시나리오 테스트**: 이메일 가입 -> 추가 정보 입력 -> 가입 완료 및 로그인 상태 확인
