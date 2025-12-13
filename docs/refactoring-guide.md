# 코드 리팩토링 가이드

> **작성일**: 2025-12-13
> **목적**: 프론트엔드 코드 품질 개선 및 확장성 확보

---

## 📋 목차

1. [현재 상태 요약](#1-현재-상태-요약)
2. [개선 필요 사항](#2-개선-필요-사항)
3. [리팩토링 계획](#3-리팩토링-계획)
4. [상세 구현 가이드](#4-상세-구현-가이드)
5. [마이그레이션 체크리스트](#5-마이그레이션-체크리스트)

---

## 1. 현재 상태 요약

### 1.1 종합 평가

| 영역 | 점수 | 상태 |
|------|------|------|
| 폴더 구조 | 70/100 | ⚠️ 양호하나 확장 필요 |
| 컴포넌트화 | 50/100 | ❌ 중복 많음, 공통 컴포넌트 부재 |
| CSS 스타일링 | 30/100 | ❌ 인라인 스타일 남용 |
| 확장성 | 55/100 | ⚠️ 백엔드 양호, 프론트 개선 필요 |
| 타입 안전성 | 65/100 | ⚠️ 기본 사용, any 사용 있음 |

### 1.2 주요 문제점

#### ❌ CSS 스타일링 (가장 심각)
- **인라인 스타일 90%+**: 모든 컴포넌트에서 `style={{}}` 직접 사용
- **스타일 중복**: LoginModal, SignUpModal, SignUpInfoModal에서 동일 스타일 반복
- **테마 시스템 부재**: 색상, 간격, 폰트 크기 등 하드코딩
- **Elementor 레거시**: 14개 CSS 파일 불필요하게 유지

```tsx
// ❌ 현재 (나쁜 예시)
<input style={{
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem'
}} />
```

#### ❌ 중복 컴포넌트
```
Header 계열: Header.tsx, LoginHeader.tsx, MySpaceHeader.tsx, OriginalHeader.tsx (4개!)
Footer 계열: Footer.tsx, OriginalFooter.tsx (2개)
LinkInBio 계열: LinkInBio.tsx, OriginalLinkInBio.tsx (2개)
```

#### ❌ 공통 컴포넌트 부재
- Button, Input, Card 등 기본 UI 없음
- 각 컴포넌트에서 동일한 UI 요소 반복 구현

#### ⚠️ 상태 관리 미흡
- useState만 사용, 전역 상태 관리 없음
- 인증 상태가 localStorage에만 의존
- API 호출 로직이 각 컴포넌트에 분산

---

## 2. 개선 필요 사항

### 2.1 CSS 스타일링 전환

**현재 → 목표:**
| 현재 | 목표 |
|------|------|
| 인라인 스타일 90% | styled-components 100% |
| Elementor CSS 의존 | 완전 제거 |
| 하드코딩 색상/크기 | 테마 시스템 |
| Tailwind 미사용 | 선택적 유틸리티 사용 |

### 2.2 컴포넌트 구조 개선

**권장 폴더 구조:**
```
client/src/
├── components/
│   ├── common/           # 🆕 공통 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── FormGroup.tsx
│   │   ├── Modal.tsx
│   │   └── index.ts
│   │
│   ├── layout/           # 🆕 레이아웃 컴포넌트
│   │   ├── Header.tsx    # 통합된 헤더
│   │   ├── Footer.tsx    # 통합된 푸터
│   │   └── index.ts
│   │
│   ├── modals/           # 🆕 모달 컴포넌트
│   │   ├── LoginModal.tsx
│   │   ├── SignUpModal.tsx
│   │   ├── SignUpInfoModal.tsx
│   │   └── index.ts
│   │
│   └── myspace/          # 기존 유지
│       ├── MySpacePre.tsx
│       ├── MySpacePost.tsx
│       ├── FriendSpacePre.tsx
│       └── FriendSpacePost.tsx
│
├── contexts/             # 🆕 React Context
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
│
├── hooks/                # 🆕 커스텀 훅
│   ├── useAuth.ts
│   ├── useFetch.ts
│   └── useModal.ts
│
├── services/             # 🆕 API 서비스
│   ├── api.ts
│   ├── authService.ts
│   └── userService.ts
│
├── styles/               # 🆕 스타일 시스템
│   ├── theme.ts
│   ├── GlobalStyles.ts
│   └── styled.d.ts
│
├── types/                # 🆕 타입 정의
│   ├── user.ts
│   ├── api.ts
│   └── index.ts
│
├── pages/
├── App.tsx
└── main.tsx
```

### 2.3 테마 시스템

```typescript
// styles/theme.ts
export const theme = {
  colors: {
    primary: '#333333',
    primaryHover: '#555555',
    secondary: '#666666',
    background: '#ffffff',
    surface: '#f9f9f9',
    border: '#dddddd',
    error: '#f44336',
    success: '#4caf50',
    // 소셜 로그인
    kakao: '#FEE500',
    kakaoText: '#000000',
    google: '#ffffff',
    googleText: '#757575',
    googleBorder: '#dddddd',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '30px',
  },
  borderRadius: {
    sm: '5px',
    md: '8px',
    lg: '15px',
    round: '50%',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.1rem',
    xl: '1.5rem',
    xxl: '2rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    bold: 700,
  },
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 15px rgba(0,0,0,0.2)',
    lg: '0 20px 50px rgba(0,0,0,0.5)',
    modal: '0 20px 50px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.2)',
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
};

export type Theme = typeof theme;
```

---

## 3. 리팩토링 계획

### Phase 1: 기반 구축 (우선순위 🔴)

| 순서 | 작업 | 예상 시간 |
|------|------|----------|
| 1-1 | styled-components 설치 | 5분 |
| 1-2 | 테마 파일 생성 (styles/theme.ts) | 30분 |
| 1-3 | 글로벌 스타일 생성 (styles/GlobalStyles.ts) | 20분 |
| 1-4 | ThemeProvider 설정 (App.tsx) | 10분 |

### Phase 2: 공통 컴포넌트 (우선순위 🔴)

| 순서 | 작업 | 예상 시간 |
|------|------|----------|
| 2-1 | Button 컴포넌트 | 30분 |
| 2-2 | Input 컴포넌트 | 30분 |
| 2-3 | FormGroup 컴포넌트 | 20분 |
| 2-4 | Card 컴포넌트 | 20분 |
| 2-5 | Modal 컴포넌트 (Modal3D 대체) | 30분 |

### Phase 3: 모달 리팩토링 (우선순위 🟡)

| 순서 | 작업 | 예상 시간 |
|------|------|----------|
| 3-1 | LoginModal 리팩토링 | 40분 |
| 3-2 | SignUpModal 리팩토링 | 40분 |
| 3-3 | SignUpInfoModal 리팩토링 | 50분 |

### Phase 4: 레이아웃 통합 (우선순위 🟡)

| 순서 | 작업 | 예상 시간 |
|------|------|----------|
| 4-1 | Header 통합 (4개 → 1개) | 1시간 |
| 4-2 | Footer 통합 (2개 → 1개) | 30분 |
| 4-3 | Original* 컴포넌트 삭제 | 20분 |

### Phase 5: 상태 관리 (우선순위 🟢)

| 순서 | 작업 | 예상 시간 |
|------|------|----------|
| 5-1 | AuthContext 생성 | 1시간 |
| 5-2 | API 서비스 레이어 생성 | 1시간 |
| 5-3 | 커스텀 훅 생성 | 30분 |

### Phase 6: 정리 (우선순위 🟢)

| 순서 | 작업 | 예상 시간 |
|------|------|----------|
| 6-1 | Elementor CSS 제거 | 30분 |
| 6-2 | 타입 파일 분리 | 30분 |
| 6-3 | 불필요한 파일 정리 | 20분 |

---

## 4. 상세 구현 가이드

### 4.1 styled-components 설치

```bash
cd client
npm install styled-components
npm install -D @types/styled-components
```

### 4.2 테마 타입 선언

```typescript
// styles/styled.d.ts
import 'styled-components';
import { Theme } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
```

### 4.3 글로벌 스타일

```typescript
// styles/GlobalStyles.ts
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Noto Sans KR', sans-serif;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.background};
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  input, select, textarea {
    font-family: inherit;
  }
`;
```

### 4.4 Button 컴포넌트 예시

```typescript
// components/common/Button.tsx
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'kakao' | 'google' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
}

const variantStyles = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primaryHover};
    }
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.primary};
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.border};
    }
  `,
  kakao: css`
    background-color: ${({ theme }) => theme.colors.kakao};
    color: ${({ theme }) => theme.colors.kakaoText};
  `,
  google: css`
    background-color: ${({ theme }) => theme.colors.google};
    color: ${({ theme }) => theme.colors.googleText};
    border: 1px solid ${({ theme }) => theme.colors.googleBorder};
  `,
  outline: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.border};
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.surface};
    }
  `,
};

const sizeStyles = {
  sm: css`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.fontSize.sm};
  `,
  md: css`
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.fontSize.md};
  `,
  lg: css`
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
    font-size: ${({ theme }) => theme.fontSize.lg};
  `,
};

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  transition: all ${({ theme }) => theme.transitions.normal};

  ${({ variant = 'primary' }) => variantStyles[variant]}
  ${({ size = 'md' }) => sizeStyles[size]}
  ${({ fullWidth }) => fullWidth && css`width: 100%;`}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
```

### 4.5 Input 컴포넌트 예시

```typescript
// components/common/Input.tsx
import styled from 'styled-components';

interface InputProps {
  hasError?: boolean;
  fullWidth?: boolean;
}

export const Input = styled.input<InputProps>`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme, hasError }) =>
    hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  transition: border-color ${({ theme }) => theme.transitions.fast};
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;
```

### 4.6 App.tsx 수정 예시

```typescript
// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import Home from './pages/Home';
import Login from './pages/Login';
import MySpace from './pages/MySpace';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/myspace" element={<MySpace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
```

---

## 5. 마이그레이션 체크리스트

### Phase 1: 기반 구축
- [ ] styled-components 설치
- [ ] @types/styled-components 설치
- [ ] styles/theme.ts 생성
- [ ] styles/styled.d.ts 생성 (타입 선언)
- [ ] styles/GlobalStyles.ts 생성
- [ ] App.tsx에 ThemeProvider 적용

### Phase 2: 공통 컴포넌트
- [ ] components/common/ 폴더 생성
- [ ] Button.tsx 생성
- [ ] Input.tsx 생성
- [ ] FormGroup.tsx 생성
- [ ] Card.tsx 생성
- [ ] Modal.tsx 생성 (Modal3D 대체)
- [ ] index.ts (배럴 export) 생성

### Phase 3: 모달 리팩토링
- [ ] LoginModal.tsx 리팩토링
- [ ] SignUpModal.tsx 리팩토링
- [ ] SignUpInfoModal.tsx 리팩토링
- [ ] Modal3D.tsx 삭제

### Phase 4: 레이아웃 통합
- [ ] components/layout/ 폴더 생성
- [ ] Header.tsx 통합
- [ ] Footer.tsx 통합
- [ ] OriginalHeader.tsx 삭제
- [ ] OriginalFooter.tsx 삭제
- [ ] OriginalLinkInBio.tsx 삭제
- [ ] LoginHeader.tsx 삭제
- [ ] MySpaceHeader.tsx 삭제

### Phase 5: 상태 관리
- [ ] contexts/ 폴더 생성
- [ ] AuthContext.tsx 생성
- [ ] services/ 폴더 생성
- [ ] api.ts 생성 (fetch 래퍼)
- [ ] authService.ts 생성
- [ ] hooks/ 폴더 생성
- [ ] useAuth.ts 생성

### Phase 6: 정리
- [ ] Elementor CSS 파일들 삭제 (client/public/css/)
- [ ] types/ 폴더 생성
- [ ] 타입 정의 파일 분리
- [ ] 불필요한 파일 삭제
- [ ] 문서 업데이트 (structure.md)

---

## 📎 참고 문서

- [styled-components 공식 문서](https://styled-components.com/)
- [React Context API](https://react.dev/reference/react/useContext)
- [TypeScript with styled-components](https://styled-components.com/docs/api#typescript)

---

## 📝 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2025-12-13 | 1.0 | 최초 작성 |
