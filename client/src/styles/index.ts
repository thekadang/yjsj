/**
 * 스타일 시스템 배럴 export
 * 테마, 글로벌 스타일, 유틸리티를 이 파일에서 export합니다.
 *
 * 사용 예시:
 * import { theme, media, mixins } from '@/styles';
 * import { GlobalStyles } from '../styles';
 */

// 테마 및 타입
export {
  theme,
  type Theme,
  type ThemeColors,
  type ThemeSpacing,
} from './theme';

// 디자이너 친화적 유틸리티
export {
  generateCSSVariables,
  media,
  mixins,
} from './theme';

// 글로벌 스타일
export { GlobalStyles } from './GlobalStyles';
