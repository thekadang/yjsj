/**
 * 전역 스타일 정의
 * CSS 리셋 및 기본 스타일을 설정합니다.
 */

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* CSS Reset */
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* HTML & Body 기본 설정 */
  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background};
    min-height: 100vh;
  }

  /* 링크 기본 스타일 */
  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  /* 버튼 리셋 */
  button {
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    border: none;
    background: none;
    outline: none;

    &:disabled {
      cursor: not-allowed;
    }
  }

  /* 입력 필드 리셋 */
  input,
  textarea,
  select {
    font-family: inherit;
    font-size: inherit;
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background-color: ${({ theme }) => theme.colors.background};

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.text.muted};
    }

    &:disabled {
      background-color: ${({ theme }) => theme.colors.surface};
      cursor: not-allowed;
    }
  }

  /* 리스트 리셋 */
  ul,
  ol {
    list-style: none;
  }

  /* 이미지 리셋 */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* 테이블 리셋 */
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  /* 제목 태그 */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize.xxxxl};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize.xxxl};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  }

  h4 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }

  h5 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }

  h6 {
    font-size: ${({ theme }) => theme.typography.fontSize.md};
  }

  /* 문단 */
  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  /* 선택 영역 스타일 */
  ::selection {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
  }

  /* 스크롤바 스타일 (Webkit 브라우저) */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.pill};

    &:hover {
      background: ${({ theme }) => theme.colors.text.muted};
    }
  }

  /* 포커스 스타일 (접근성) */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* 숨김 텍스트 (스크린 리더용) */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* 애니메이션 줄이기 선호 사용자 대응 */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

export default GlobalStyles;
