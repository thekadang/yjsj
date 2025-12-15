/**
 * 올드머니 디자인 시스템
 * 
 * 🎨 디자이너 페르소나
 * "너는 10년차 UI/UX 전문디자이너야. 2025년 트렌드의 앞장서서 수상까지 한 
 * 트렌디한 디자이너야. 상품의 성격에 맞는 디자인으로 기획력이 탁월해."
 * 
 * 모든 새로운 디자인 스타일을 한 곳에서 관리
 */

import { css } from 'styled-components';

// ============================================
// 컬러 팔레트 (4단계)
// ============================================

export const colors = {
  // 메인 컬러 - 캐멀/베이지 (따뜻하고 세련된)
  main: {
    50: '#faf8f5',
    100: '#f5f0e8',
    200: '#ebe0d1',
    300: '#dcc9b0',
    400: '#c9aa85',
    500: '#b8906d',  // 메인 컬러
    600: '#a67c5d',
    700: '#8a654d',
    800: '#715243',
    900: '#5d4438',
  },

  // 서브 컬러 - 세이지 그린 (차분하고 우아한)
  sub: {
    50: '#f6f7f6',
    100: '#e8ebe8',
    200: '#d4dbd4',
    300: '#b3c0b3',
    400: '#8fa08f',
    500: '#6d7f6d',  // 서브 컬러
    600: '#5a6a5a',
    700: '#4a564a',
    800: '#3d473d',
    900: '#333b33',
  },

  // 흑 - 부드러운 차콜 (순수한 검정이 아닌 따뜻한 느낌)
  black: {
    50: '#f5f5f4',
    100: '#e7e5e4',
    200: '#d6d3d1',
    300: '#a8a29e',
    400: '#78716c',
    500: '#57534e',
    600: '#44403c',
    700: '#292524',  // 주로 사용할 검정
    800: '#1c1917',
    900: '#0f0e0d',
  },

  // 백 - 크림 화이트 (순백이 아닌 따뜻한 아이보리)
  white: {
    50: '#ffffff',
    100: '#fefdfb',
    200: '#fdfcf9',
    300: '#fcfaf6',
    400: '#faf7f2',
    500: '#f8f5ef',  // 주로 사용할 배경색
    600: '#f5f1e9',
    700: '#f2ede3',
    800: '#efe8dc',
    900: '#ebe3d4',
  },

  // 시맨틱 컬러
  primary: '#b8906d',
  primaryHover: '#a67c5d',
  secondary: '#6d7f6d',
  secondaryHover: '#5a6a5a',
  background: '#f8f5ef',
  surface: '#fdfcf9',
  text: {
    primary: '#292524',
    secondary: '#57534e',
    tertiary: '#78716c',
    inverse: '#fefdfb',
  },
};

// ============================================
// 타이포그래피
// ============================================

export const typography = {
  fontFamily: {
    primary: "'Pretendard Variable', 'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: "'Playfair Display', 'Georgia', serif",
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
    '4xl': '2.5rem',  // 40px
    '5xl': '3rem',    // 48px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// ============================================
// 간격 시스템
// ============================================

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '48px',
  '6xl': '64px',
};

// ============================================
// 레이아웃 높이
// ============================================

export const heights = {
  hero: '800px',
  section: '400px',
  compact: '150px',
};

// ============================================
// 그림자
// ============================================

export const shadows = {
  sm: '0 2px 4px rgba(41, 37, 36, 0.08)',
  md: '0 4px 8px rgba(41, 37, 36, 0.12)',
  lg: '0 8px 16px rgba(41, 37, 36, 0.15)',
  xl: '0 16px 32px rgba(41, 37, 36, 0.2)',
};

// ============================================
// 트랜지션
// ============================================

export const transitions = {
  fast: '0.15s ease',
  normal: '0.3s ease',
  slow: '0.5s ease',
  smooth: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

// ============================================
// Border Radius
// ============================================

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  pill: '9999px',
};

// ============================================
// 믹스인 (재사용 가능한 스타일)
// ============================================

// 글래스모피즘 효과
export const glassmorphism = css`
  background: rgba(253, 252, 249, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(184, 144, 109, 0.1);
`;

// 호버 효과
export const hoverLift = css`
  transition: transform ${transitions.normal}, box-shadow ${transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
  }
`;

// 버튼 기본 스타일
export const buttonBase = css`
  padding: 12px 24px;
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.semibold};
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all ${transitions.normal};
  border: none;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// 버튼 - Primary
export const buttonPrimary = css`
  ${buttonBase}
  background: ${colors.primary};
  color: ${colors.white[100]};
  
  &:hover:not(:disabled) {
    background: ${colors.primaryHover};
    transform: translateY(-1px);
    box-shadow: ${shadows.md};
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

// 버튼 - Outline
export const buttonOutline = css`
  ${buttonBase}
  background: transparent;
  color: ${colors.text.primary};
  border: 1px solid ${colors.black[200]};
  
  &:hover:not(:disabled) {
    background: rgba(184, 144, 109, 0.1);
    border-color: ${colors.primary};
    color: ${colors.primary};
  }
`;

// 인풋 기본 스타일
export const inputBase = css`
  padding: 12px 16px;
  border: 1px solid ${colors.black[200]};
  border-radius: ${borderRadius.sm};
  font-size: ${typography.fontSize.base};
  font-family: ${typography.fontFamily.primary};
  color: ${colors.text.primary};
  background: ${colors.white[100]};
  transition: all ${transitions.normal};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(184, 144, 109, 0.1);
  }
  
  &::placeholder {
    color: ${colors.text.tertiary};
  }
  
  &:disabled {
    background: ${colors.white[600]};
    cursor: not-allowed;
  }
`;

// 카드 스타일
export const card = css`
  background: ${colors.white[100]};
  border-radius: ${borderRadius.lg};
  padding: ${spacing['3xl']};
  box-shadow: ${shadows.sm};
  transition: all ${transitions.normal};
  
  &:hover {
    box-shadow: ${shadows.md};
  }
`;

// 섹션 오버레이
export const sectionOverlay = css`
  background: linear-gradient(
    rgba(41, 37, 36, 0.4),
    rgba(41, 37, 36, 0.4)
  );
`;

// 헤더 스크롤 스타일
export const headerScrolled = css`
  background: rgba(248, 245, 239, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: ${shadows.sm};
`;

// ============================================
// Export all
// ============================================

export const designSystem = {
  colors,
  typography,
  spacing,
  heights,
  shadows,
  transitions,
  borderRadius,
  mixins: {
    glassmorphism,
    hoverLift,
    buttonBase,
    buttonPrimary,
    buttonOutline,
    inputBase,
    card,
    sectionOverlay,
    headerScrolled,
  },
};

export default designSystem;
