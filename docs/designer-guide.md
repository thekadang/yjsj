# 디자이너 가이드

> 이 문서는 디자이너가 프로젝트의 UI/스타일을 수정할 때 참고하는 가이드입니다.

**최종 업데이트**: 2025-12-14

---

## 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [개발 환경 실행](#개발-환경-실행)
3. [디자인 시스템](#디자인-시스템)
4. [파일 구조](#파일-구조)
5. [주요 수정 포인트](#주요-수정-포인트)
6. [컴포넌트 가이드](#컴포넌트-가이드)
7. [페이지별 구조](#페이지별-구조)
8. [자주 묻는 질문](#자주-묻는-질문)

---

## 프로젝트 개요

**프로젝트명**: 친애 (Chinae)
**기술 스택**: React 19 + TypeScript + styled-components
**디자인 시스템**: 커스텀 테마 기반

### 브라우저 지원
- Chrome (최신)
- Safari (최신)
- Firefox (최신)
- Edge (최신)

---

## 개발 환경 실행

### 필수 설치
1. [Node.js](https://nodejs.org/) (v18 이상)
2. [Git](https://git-scm.com/)

### 실행 방법
```bash
# 1. 프로젝트 폴더로 이동
cd "프로젝트 경로"

# 2. 의존성 설치 (최초 1회)
npm install
cd client && npm install && cd ..

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 확인
# 프론트엔드: http://localhost:5173
# 백엔드 API: http://localhost:3000
```

### 실시간 미리보기
- 코드 저장 시 자동으로 브라우저가 새로고침됩니다 (Hot Reload)
- CSS/스타일 변경은 즉시 반영됩니다

---

## 디자인 시스템

### 테마 파일 위치
```
client/src/styles/theme.ts
```

### 색상 (Colors)

```typescript
colors: {
  // 기본 색상
  primary: '#333333',      // 주요 텍스트, 버튼
  secondary: '#666666',    // 보조 텍스트
  background: '#ffffff',   // 배경색
  surface: '#f5f5f5',      // 카드/섹션 배경
  border: '#dddddd',       // 테두리

  // 상태 색상
  error: '#f44336',        // 에러, 삭제
  errorLight: '#ffebee',   // 에러 배경
  success: '#4caf50',      // 성공

  // 브랜드 색상
  kakao: '#FEE500',        // 카카오 버튼
  google: '#ffffff',       // 구글 버튼

  // 텍스트 색상
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#999999',
  },

  // 그레이 스케일
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  }
}
```

#### 색상 변경 예시
```typescript
// theme.ts에서
primary: '#333333',  // 이 값을 변경하면 전체 주요 색상이 바뀜
↓
primary: '#1a73e8',  // 파란색 계열로 변경
```

### 간격 (Spacing)

```typescript
spacing: {
  xs: '4px',    // 아주 작은 간격
  sm: '8px',    // 작은 간격
  md: '12px',   // 중간 간격
  lg: '16px',   // 큰 간격
  xl: '20px',   // 아주 큰 간격
  xxl: '32px',  // 섹션 간격
}
```

### 타이포그래피 (Typography)

```typescript
typography: {
  fontFamily: {
    base: "'Noto Sans KR', -apple-system, sans-serif",
  },
  fontSize: {
    xs: '12px',   // 캡션, 라벨
    sm: '14px',   // 보조 텍스트
    md: '16px',   // 본문
    lg: '18px',   // 소제목
    xl: '20px',   // 제목
    xxl: '24px',  // 대제목
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    bold: 700,
  },
}
```

### 둥근 모서리 (Border Radius)

```typescript
borderRadius: {
  sm: '5px',    // 작은 버튼, 입력창
  md: '8px',    // 카드, 모달
  lg: '15px',   // 큰 컨테이너
  full: '9999px', // 원형 (프로필 이미지)
}
```

### 그림자 (Shadows)

```typescript
shadows: {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
}
```

---

## 파일 구조

### 디자이너가 주로 수정할 파일들

```
client/src/
├── styles/
│   ├── theme.ts          # ⭐ 테마 설정 (색상, 간격, 폰트)
│   └── GlobalStyle.ts    # 전역 스타일 (리셋, 기본 스타일)
│
├── components/
│   ├── common/           # ⭐ 공통 UI 컴포넌트
│   │   ├── Button.tsx    # 버튼 스타일
│   │   ├── Input.tsx     # 입력창 스타일
│   │   ├── Card.tsx      # 카드 컴포넌트
│   │   ├── Modal.tsx     # 모달 베이스
│   │   └── index.ts      # 컴포넌트 내보내기
│   │
│   ├── layout/           # 레이아웃 컴포넌트
│   │   ├── Header.tsx    # 헤더
│   │   └── Footer.tsx    # 푸터
│   │
│   ├── modals/           # 모달 컴포넌트들
│   │   ├── LoginModal.tsx
│   │   ├── SignUpModal.tsx
│   │   └── ...
│   │
│   └── myspace/          # 마이스페이스 전용 컴포넌트
│       ├── ProfileSection.tsx   # 프로필 섹션
│       ├── DiarySection.tsx     # 일기 섹션
│       └── MediaGallery.tsx     # 미디어 갤러리
│
└── pages/
    ├── Home.tsx          # 메인 페이지
    ├── MySpace.tsx       # 마이스페이스 페이지
    └── Friends.tsx       # 친구 관리 페이지
```

---

## 주요 수정 포인트

### 1. 전체 색상 변경
**파일**: `client/src/styles/theme.ts`

```typescript
// 예: 메인 색상을 파란색으로 변경
colors: {
  primary: '#1a73e8',  // 기존 #333333에서 변경
  // ...
}
```

### 2. 버튼 스타일 변경
**파일**: `client/src/components/common/Button.tsx`

```typescript
// 버튼 모서리 둥글기
border-radius: ${({ theme }) => theme.borderRadius.md};

// 버튼 패딩
padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
```

### 3. 프로필 사진 크기/비율
**파일**: `client/src/components/myspace/ProfileSection.tsx`

```typescript
const ImageContainer = styled.div`
  width: 200px;
  height: 255px;  // 11:14 비율 (영정사진 표준)
`;
```

### 4. 카드 스타일
**파일**: `client/src/components/common/Card.tsx`

```typescript
// 카드 그림자
box-shadow: ${({ theme }) => theme.shadows.md};

// 카드 배경
background: ${({ theme }) => theme.colors.background};
```

### 5. 모달 스타일
**파일**: `client/src/components/common/Modal.tsx`

```typescript
// 모달 최대 너비
max-width: 500px;  // sm: 400px, md: 500px, lg: 600px

// 모달 배경 오버레이
background: rgba(0, 0, 0, 0.5);
```

### 6. 폰트 변경
**파일**: `client/src/styles/theme.ts`

```typescript
fontFamily: {
  base: "'원하는 폰트명', sans-serif",
}
```

**주의**: 웹폰트 사용 시 `client/index.html`에 폰트 링크 추가 필요

```html
<link href="https://fonts.googleapis.com/css2?family=폰트명&display=swap" rel="stylesheet">
```

---

## 컴포넌트 가이드

### Button (버튼)

```tsx
// 사용 가능한 variant
<Button variant="primary">기본 버튼</Button>
<Button variant="secondary">보조 버튼</Button>
<Button variant="outline">테두리 버튼</Button>
<Button variant="ghost">투명 버튼</Button>
<Button variant="kakao">카카오 버튼</Button>
<Button variant="google">구글 버튼</Button>

// 사용 가능한 size
<Button size="sm">작은 버튼</Button>
<Button size="md">중간 버튼</Button>
<Button size="lg">큰 버튼</Button>

// 전체 너비
<Button fullWidth>전체 너비 버튼</Button>
```

### Input (입력창)

```tsx
<Input
  type="text"
  placeholder="입력하세요"
  fullWidth
/>

// 에러 상태
<Input error="이메일 형식이 올바르지 않습니다" />
```

### Card (카드)

```tsx
<Card padding="md">
  카드 내용
</Card>

// padding 옵션: sm, md, lg
```

### Modal (모달)

```tsx
<Modal
  isOpen={true}
  onClose={handleClose}
  title="모달 제목"
  size="md"  // sm, md, lg
>
  모달 내용
</Modal>
```

---

## 페이지별 구조

### 메인 페이지 (Home.tsx)
```
┌─────────────────────────────┐
│         Header              │
├─────────────────────────────┤
│                             │
│      Hero Section           │
│    (로그인/회원가입 버튼)     │
│                             │
├─────────────────────────────┤
│         Footer              │
└─────────────────────────────┘
```

### 마이스페이스 (MySpace.tsx)
```
┌─────────────────────────────┐
│         Header              │
├─────────────────────────────┤
│  ┌─────────┐  ┌──────────┐  │
│  │ 프로필   │  │ 친구 통계 │  │
│  │ 사진    │  │          │  │
│  │         │  │          │  │
│  ├─────────┤  └──────────┘  │
│  │ 남기는말 │                │
│  └─────────┘                │
├─────────────────────────────┤
│        Navigation           │
│  [일기] [미디어] [친구소식]   │
├─────────────────────────────┤
│                             │
│       Content Area          │
│    (선택한 탭에 따라 변경)    │
│                             │
└─────────────────────────────┘
```

---

## 자주 묻는 질문

### Q: 색상을 변경했는데 반영이 안 돼요
**A**: 브라우저 캐시를 삭제하거나 강력 새로고침(Ctrl+Shift+R)을 해보세요.

### Q: 새 폰트를 추가하고 싶어요
**A**:
1. `client/index.html`에 폰트 링크 추가
2. `client/src/styles/theme.ts`의 `fontFamily.base` 수정

### Q: 반응형 디자인은 어떻게 하나요?
**A**: styled-components에서 미디어 쿼리 사용:
```typescript
const Container = styled.div`
  width: 100%;

  @media (min-width: 768px) {
    width: 50%;
  }
`;
```

### Q: 아이콘을 변경하고 싶어요
**A**: 현재 이모지를 사용 중입니다. 아이콘 라이브러리(예: react-icons) 도입을 원하시면 개발자와 상의해주세요.

### Q: 애니메이션을 추가하고 싶어요
**A**: styled-components에서 CSS 애니메이션 사용:
```typescript
const FadeIn = styled.div`
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
```

### Q: 특정 컴포넌트만 스타일을 변경하고 싶어요
**A**: 해당 컴포넌트 파일을 찾아서 styled-components 부분을 수정하세요. 공통 컴포넌트를 수정하면 전체에 영향이 갑니다.

---

## 연락처

코드 관련 문의나 기술적인 도움이 필요하시면 개발팀에 연락해주세요.

---

## 부록: 주요 크기 정리

| 요소 | 크기 | 파일 위치 |
|------|------|----------|
| 프로필 사진 | 200x255px | ProfileSection.tsx |
| 모달 너비 (sm) | 400px | Modal.tsx |
| 모달 너비 (md) | 500px | Modal.tsx |
| 모달 너비 (lg) | 600px | Modal.tsx |
| 버튼 높이 (sm) | 32px | Button.tsx |
| 버튼 높이 (md) | 40px | Button.tsx |
| 버튼 높이 (lg) | 48px | Button.tsx |
| 입력창 높이 | 44px | Input.tsx |
| 헤더 높이 | 60px | Header.tsx |
| 푸터 높이 | 80px | Footer.tsx |
