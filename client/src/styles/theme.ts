/**
 * 애플리케이션 테마 정의
 * 모든 색상, 간격, 타이포그래피 등은 이 파일에서 관리합니다.
 */

export const theme = {
  // 색상 팔레트
  colors: {
    // 기본 색상
    primary: '#333333',
    primaryHover: '#555555',
    secondary: '#666666',

    // 배경 색상
    background: '#ffffff',
    surface: '#f9f9f9',
    surfaceHover: '#f0f0f0',

    // 테두리 및 구분선
    border: '#dddddd',
    borderLight: '#eeeeee',
    divider: '#dddddd',

    // 상태 색상
    error: '#f44336',
    errorLight: '#ffebee',
    success: '#4caf50',
    successLight: '#e8f5e9',
    warning: '#ff9800',
    warningLight: '#fff3e0',
    info: '#2196f3',
    infoLight: '#e3f2fd',

    // 텍스트 색상
    text: {
      primary: '#333333',
      secondary: '#666666',
      tertiary: '#999999',
      muted: '#888888',
      disabled: '#aaaaaa',
      inverse: '#ffffff',
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
    },

    // 소셜 로그인 색상
    kakao: '#FEE500',
    kakaoText: '#000000',
    kakaoHover: '#e6cf00',
    google: '#ffffff',
    googleText: '#757575',
    googleBorder: '#dddddd',
    googleHover: '#f5f5f5',

    // 오버레이
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
  },

  // 간격 시스템 (4px 기반)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
    xxxxl: '40px',
  },

  // 테두리 반경
  borderRadius: {
    xs: '4px',
    sm: '5px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '50%',
    pill: '9999px',
  },

  // 타이포그래피
  typography: {
    fontFamily: {
      primary: "'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      monospace: "'Fira Code', 'Monaco', monospace",
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      md: '1rem',        // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      xxl: '1.5rem',     // 24px
      xxxl: '2rem',      // 32px
      xxxxl: '2.5rem',   // 40px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // 그림자
  shadows: {
    none: 'none',
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 8px rgba(0, 0, 0, 0.12)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.15)',
    xl: '0 16px 32px rgba(0, 0, 0, 0.2)',
    modal: '0 20px 50px rgba(0, 0, 0, 0.5), 0 10px 20px rgba(0, 0, 0, 0.2)',
    card: '0 4px 15px rgba(0, 0, 0, 0.1)',
    dropdown: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },

  // 트랜지션
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
    // 구체적인 트랜지션
    color: 'color 0.15s ease',
    background: 'background-color 0.15s ease',
    border: 'border-color 0.15s ease',
    transform: 'transform 0.3s ease',
    opacity: 'opacity 0.3s ease',
    all: 'all 0.3s ease',
  },

  // Z-인덱스 레이어
  zIndex: {
    base: 0,
    dropdown: 100,
    header: 200,
    sticky: 200,
    fixed: 300,
    modalBackdrop: 400,
    modal: 500,
    popover: 600,
    tooltip: 700,
  },

  // 브레이크포인트 (모바일 퍼스트)
  breakpoints: {
    xs: '0px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  },

  // 컴포넌트별 크기
  sizes: {
    // 입력 필드 높이
    inputHeight: {
      sm: '36px',
      md: '44px',
      lg: '52px',
    },
    // 버튼 높이
    buttonHeight: {
      sm: '32px',
      md: '44px',
      lg: '52px',
    },
    // 아이콘 크기
    icon: {
      sm: '16px',
      md: '20px',
      lg: '24px',
      xl: '32px',
    },
    // 모달 너비
    modal: {
      sm: '400px',
      md: '500px',
      lg: '600px',
      xl: '800px',
    },
    // 컨테이너 최대 너비
    container: {
      sm: '540px',
      md: '720px',
      lg: '960px',
      xl: '1140px',
      xxl: '1320px',
    },
  },
} as const;

// 테마 타입 export
export type Theme = typeof theme;

// 색상 타입 헬퍼
export type ThemeColors = typeof theme.colors;
export type ThemeSpacing = typeof theme.spacing;

// =====================
// 디자이너 친화적 유틸리티
// =====================

/**
 * 테마 값을 CSS 변수로 변환하는 헬퍼
 * 디자이너가 CSS 변수를 쉽게 사용할 수 있게 해줍니다.
 *
 * @example
 * // GlobalStyles에서 사용
 * :root {
 *   ${generateCSSVariables(theme)}
 * }
 *
 * // 결과
 * --color-primary: #333333;
 * --spacing-md: 12px;
 */
export const generateCSSVariables = (themeObj: typeof theme): string => {
  const variables: string[] = [];

  // 색상 변수
  Object.entries(themeObj.colors).forEach(([key, value]) => {
    if (typeof value === 'string') {
      variables.push(`--color-${key}: ${value};`);
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        variables.push(`--color-${key}-${subKey}: ${subValue};`);
      });
    }
  });

  // 간격 변수
  Object.entries(themeObj.spacing).forEach(([key, value]) => {
    variables.push(`--spacing-${key}: ${value};`);
  });

  // 테두리 반경 변수
  Object.entries(themeObj.borderRadius).forEach(([key, value]) => {
    variables.push(`--radius-${key}: ${value};`);
  });

  // 타이포그래피 변수
  Object.entries(themeObj.typography.fontSize).forEach(([key, value]) => {
    variables.push(`--font-size-${key}: ${value};`);
  });

  // 그림자 변수
  Object.entries(themeObj.shadows).forEach(([key, value]) => {
    variables.push(`--shadow-${key}: ${value};`);
  });

  // z-index 변수
  Object.entries(themeObj.zIndex).forEach(([key, value]) => {
    variables.push(`--z-${key}: ${value};`);
  });

  return variables.join('\n  ');
};

/**
 * 반응형 미디어 쿼리 헬퍼
 * 일관된 브레이크포인트 사용을 위한 유틸리티
 *
 * @example
 * const Container = styled.div`
 *   width: 100%;
 *
 *   ${media.md} {
 *     width: 720px;
 *   }
 *
 *   ${media.lg} {
 *     width: 960px;
 *   }
 * `;
 */
export const media = {
  xs: `@media (min-width: ${theme.breakpoints.xs})`,
  sm: `@media (min-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.md})`,
  lg: `@media (min-width: ${theme.breakpoints.lg})`,
  xl: `@media (min-width: ${theme.breakpoints.xl})`,
  xxl: `@media (min-width: ${theme.breakpoints.xxl})`,
  // max-width 버전
  maxXs: `@media (max-width: ${theme.breakpoints.sm})`,
  maxSm: `@media (max-width: ${theme.breakpoints.md})`,
  maxMd: `@media (max-width: ${theme.breakpoints.lg})`,
  maxLg: `@media (max-width: ${theme.breakpoints.xl})`,
  maxXl: `@media (max-width: ${theme.breakpoints.xxl})`,
} as const;

/**
 * 공통 스타일 믹스인
 * 자주 사용되는 스타일 패턴을 재사용 가능한 형태로 제공
 *
 * @example
 * const Card = styled.div`
 *   ${mixins.flexCenter}
 *   ${mixins.cardStyle}
 * `;
 */
export const mixins = {
  // Flexbox 유틸리티
  flexCenter: `
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  flexBetween: `
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  flexColumn: `
    display: flex;
    flex-direction: column;
  `,
  flexColumnCenter: `
    display: flex;
    flex-direction: column;
    align-items: center;
  `,

  // 카드 스타일
  cardStyle: `
    background-color: ${theme.colors.background};
    border-radius: ${theme.borderRadius.lg};
    box-shadow: ${theme.shadows.card};
    padding: ${theme.spacing.lg};
  `,

  // 입력 필드 기본 스타일
  inputBase: `
    padding: ${theme.spacing.md};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    font-size: ${theme.typography.fontSize.md};
    transition: border-color ${theme.transitions.fast};

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary};
    }

    &::placeholder {
      color: ${theme.colors.text.tertiary};
    }
  `,

  // 버튼 기본 스타일
  buttonBase: `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing.sm};
    border: none;
    border-radius: ${theme.borderRadius.md};
    font-weight: ${theme.typography.fontWeight.medium};
    cursor: pointer;
    transition: all ${theme.transitions.normal};

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,

  // 텍스트 잘림 (한 줄)
  textEllipsis: `
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,

  // 텍스트 잘림 (여러 줄)
  lineClamp: (lines: number) => `
    display: -webkit-box;
    -webkit-line-clamp: ${lines};
    -webkit-box-orient: vertical;
    overflow: hidden;
  `,

  // 스크롤바 숨기기
  hideScrollbar: `
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  `,

  // 커스텀 스크롤바
  customScrollbar: `
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: ${theme.colors.surface};
    }
    &::-webkit-scrollbar-thumb {
      background: ${theme.colors.gray[400]};
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${theme.colors.gray[500]};
    }
  `,

  // 포커스 링
  focusRing: `
    &:focus-visible {
      outline: 2px solid ${theme.colors.primary};
      outline-offset: 2px;
    }
  `,

  // 오버레이
  overlay: `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${theme.colors.overlay};
    z-index: ${theme.zIndex.modalBackdrop};
  `,
} as const;
