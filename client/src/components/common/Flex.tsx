/**
 * Flex 유틸리티 컴포넌트
 * 플렉스박스 레이아웃을 쉽게 사용할 수 있습니다.
 */

import styled, { css } from 'styled-components';

// Flex Props 인터페이스
export interface FlexProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: string;
  fullWidth?: boolean;
  fullHeight?: boolean;
}

// Flex 컴포넌트
export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  justify-content: ${({ justify = 'flex-start' }) => justify};
  align-items: ${({ align = 'stretch' }) => align};
  flex-wrap: ${({ wrap = 'nowrap' }) => wrap};
  gap: ${({ gap, theme }) => gap || theme.spacing.md};

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  ${({ fullHeight }) =>
    fullHeight &&
    css`
      height: 100%;
    `}
`;

// Stack 컴포넌트 (세로 방향 Flex)
export const Stack = styled(Flex).attrs<FlexProps>((props) => ({
  direction: props.direction || 'column',
}))``;

// HStack 컴포넌트 (가로 방향 Flex)
export const HStack = styled(Flex).attrs<FlexProps>((props) => ({
  direction: props.direction || 'row',
  align: props.align || 'center',
}))``;

// VStack 컴포넌트 (세로 방향 Flex, 중앙 정렬)
export const VStack = styled(Flex).attrs<FlexProps>((props) => ({
  direction: props.direction || 'column',
  align: props.align || 'center',
}))``;

// Center 컴포넌트 (중앙 정렬)
export const Center = styled(Flex)`
  justify-content: center;
  align-items: center;
`;

export default Flex;
