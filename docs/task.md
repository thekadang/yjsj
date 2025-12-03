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
- [x] Node.js/Express/React 프로젝트 구조 설정
- [x] Tailwind CSS 및 PostCSS 설정
- [x] React Router 설정 (`App.tsx`)
- [x] `Login` 페이지 구현 (HTML/CSS 이식)
- [x] `MySpace` 페이지 구현 (HTML/CSS 이식)
- [x] `MySpace` 페이지 "미니홈피" 스타일 팝업 뷰 구현
- [x] `Login` 페이지 내 "내 공간" 3D 모달 팝업 구현
- [x] 코드 리팩토링 (컴포넌트 분리 및 재사용성 향상)

## 2단계: 인증 및 회원가입 시스템 (진행 중)
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

## **[NEXT] 데이터베이스 설정 (필수)**
- [ ] **PostgreSQL 설치 및 실행**
- [ ] **데이터베이스 생성** (`forever_love`)
- [ ] **테이블 생성** (`database/schema.sql` 실행)
- [ ] **연결 확인** (`src/check-db.ts` 실행)

## 3단계: 친구 관계 시스템
## 3단계: 친구 관계 시스템
- [ ] **데이터베이스 구축** (`docs/friend-system-design.md` 참고)
    - [ ] `relationship_types` 테이블 생성 및 초기 데이터(가족, 찐친, 친구) 시딩
    - [ ] `friend_requests`, `friendships` 테이블 생성
    - [ ] `diary_visibility` 테이블 생성
- [ ] **친구 검색 및 신청**
    - [ ] 이름 + 연락처 기반 회원 검색 API (`GET /api/users/search`)
    - [ ] 친구 신청 API (`POST /api/friends/request`): 상대방 타입(가족/찐친/친구) 선택 필수
- [ ] **친구 요청 관리**
    - [ ] 받은 친구 신청 목록 조회 API (`GET /api/friends/requests`)
    - [ ] 친구 신청 수락/거절 API (`POST /api/friends/respond`): 수락 시 내 입장에서의 관계 타입 선택 필수
- [ ] **친구 목록 및 관리**
    - [ ] 친구 목록 조회 API (`GET /api/friends`): 내가 설정한 관계 타입 포함
    - [ ] 친구 관계 수정/삭제 API
- [ ] **일기장 연동 (권한 제어)**
    - [ ] 일기 작성 시 공개 범위(다중 선택) 저장 로직 구현
    - [ ] 일기 조회 시 친구 관계 기반 필터링 쿼리 구현

## 4단계: 마이 스페이스 및 미디어 기능
- [ ] `MySpace` 페이지 동적 데이터 연동
- [ ] **미디어 처리 및 최적화**
    - [ ] 이미지 업로드 및 썸네일 생성 (`sharp`)
    - [ ] 오디오 업로드 및 검증
    - [ ] GCS 연동 (선택 사항)

## 5단계: 배포 및 최종 검증
- [ ] 프로덕션 빌드 테스트
- [ ] 최종 사용자 검증
