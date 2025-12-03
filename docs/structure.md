# 프로젝트 구조

> 📁 **이 파일로 프로젝트의 파일/폴더 구조를 파악합니다. 새 파일 추가 시 여기에 기록하세요.**

**마지막 업데이트**: 2025-12-02

---

## 📂 전체 디렉토리 구조

```
project-root/
├── docs/                    # 📚 모든 문서 파일
│   ├── task.md             # 작업 진행 상황
│   ├── structure.md        # (이 파일) 프로젝트 구조
│   ├── conventions.md      # 코딩 컨벤션
│   ├── architecture.md     # 시스템 아키텍처
│   ├── decisions.md        # 설계 결정 기록
│   ├── api.md             # API 명세
│   ├── setup.md           # 환경 설정 가이드
│   └── troubleshooting.md # 문제 해결 가이드
│
├── src/                    # 💻 소스 코드 (Backend)
│   ├── app.ts             # Express 앱 설정
│   ├── server.ts          # 서버 진입점
│   ├── config/            # ⚙️ 설정 파일
│   │   ├── index.ts       # 설정 로드
│   │   └── constants.ts   # 상수 정의
│   │
│   ├── models/            # 🗂️ 데이터 모델 (ORM)
│   │   ├── user.ts        # User 모델
│   │   └── photo.ts       # Photo 모델
│   │
│   ├── services/          # 🔧 비즈니스 로직
│   │   ├── authService.ts
│   │   └── photoService.ts
│   │
│   ├── controllers/       # 🎮 요청 처리 (Controller)
│   │   ├── authController.ts
│   │   └── photoController.ts
│   │
│   ├── routes/            # 🌐 라우터 정의
│   │   ├── index.ts
│   │   ├── authRoutes.ts
│   │   └── photoRoutes.ts
│   │
│   ├── middlewares/       # 🛡️ 미들웨어
│   │   ├── auth.ts        # 인증 미들웨어
│   │   └── error.ts       # 에러 핸들링
│   │
│   └── utils/             # 🛠️ 유틸리티 함수
│       ├── logger.ts
│       └── validator.ts
│
├── client/                 # 🎨 프론트엔드 (React)
│   ├── public/
│   ├── src/
│   │   ├── components/    # 재사용 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── hooks/         # 커스텀 훅
│   │   ├── services/      # API 호출
│   │   ├── store/         # 상태 관리
│   │   ├── utils/         # 프론트 유틸리티
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── tests/                  # 🧪 테스트 코드
│   ├── unit/
│   └── integration/
│
├── scripts/                # 📜 유틸리티 스크립트
│   └── deploy.sh
│
├── .env.example            # 🔐 환경변수 예시
├── .gitignore             # Git 제외 파일
├── package.json           # Node.js 의존성 및 스크립트
├── tsconfig.json          # TypeScript 설정
├── README.md              # 프로젝트 소개
└── claude.md              # AI 개발 지침
```

---

## 📖 폴더별 상세 설명

### `/docs` - 문서
**목적**: 프로젝트의 모든 문서를 중앙 관리  
**규칙**: 
- 새로운 개념/설계 추가 시 반드시 문서화
- 파일명은 내용을 명확히 표현 (예: `database-schema.md`)
- `claude.md`에서 참조 링크 추가

### `/src` - 백엔드 소스 코드
**목적**: Node.js/Express 애플리케이션 코드  
**규칙**:
- 계층형 아키텍처 (Controller-Service-Model) 준수
- 비동기 처리는 `async/await` 사용
- 엄격한 TypeScript 타입 적용

#### `/src/config` - 설정
- 환경변수 로드 및 유효성 검사
- 상수 정의

#### `/src/models` - 데이터 모델
- TypeORM 또는 Prisma 엔티티 정의
- DB 스키마와 동기화

#### `/src/services` - 비즈니스 로직
- 핵심 비즈니스 규칙 구현
- Controller와 Model 사이의 연결 고리
- 재사용 가능한 로직 캡슐화

#### `/src/controllers` - 컨트롤러
- HTTP 요청 파싱 및 응답 처리
- Service 호출
- 입력 데이터 검증 (DTO)

#### `/src/routes` - 라우터
- URL 경로와 Controller 매핑
- 미들웨어 적용 (인증, 로깅 등)

### `/client` - 프론트엔드
**목적**: React 기반 웹 애플리케이션  
**규칙**:
- 컴포넌트 기반 개발
- Tailwind CSS로 스타일링
- 상태 관리는 필요한 경우에만 최소화

---

## 🎯 파일 명명 규칙

### TypeScript/JavaScript 파일
- **클래스/컴포넌트**: `PascalCase.ts` (예: `UserService.ts`, `Button.tsx`)
- **일반 파일/함수**: `camelCase.ts` (예: `authMiddleware.ts`, `validateInput.ts`)
- **상수**: `UPPER_SNAKE_CASE` (코드 내 변수명)

### 문서 파일
- **일반 문서**: `kebab-case.md` (예: `api-design.md`)
- **특수 문서**: 소문자 (예: `claude.md`, `task.md`)

---

## 🔍 파일 찾기 가이드

### "이 기능은 어디에 있나요?"

| 필요한 것 | 위치 | 파일 예시 |
|---------|------|----------|
| DB 모델 정의 | `/src/models/` | `user.ts` |
| 비즈니스 로직 | `/src/services/` | `authService.ts` |
| API 엔드포인트 | `/src/routes/` | `authRoutes.ts` |
| 요청 처리 | `/src/controllers/` | `authController.ts` |
| 프론트 페이지 | `/client/src/pages/` | `LoginPage.tsx` |
| 공통 컴포넌트 | `/client/src/components/` | `Button.tsx` |

---

## 📋 새 파일 추가 시 체크리스트

- [ ] 적절한 폴더에 배치
- [ ] 명명 규칙 준수 (camelCase vs PascalCase)
- [ ] 이 파일(`structure.md`)에 기록
- [ ] 테스트 파일도 함께 생성
- [ ] 관련 문서 업데이트 (필요시)

---

## 🔄 구조 변경 이력

| 날짜 | 변경 내용 | 이유 |
|------|----------|------|
| 2025-12-02 | Node.js/React 구조로 변경 | 기술 스택 변경 반영 |
