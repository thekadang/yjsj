/**
 * styled-components 타입 선언 파일
 * DefaultTheme을 확장하여 테마 타입 자동 완성을 활성화합니다.
 */

import 'styled-components';
import { Theme } from './theme';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
