/**
 * Divider 컴포넌트
 * 텍스트와 함께 사용할 수 있는 구분선입니다.
 */

import React from 'react';
import styled from 'styled-components';

// Divider Props 인터페이스
export interface DividerProps {
  children?: React.ReactNode;
  className?: string;
}

// 구분선 컨테이너
const DividerContainer = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

// 구분선
const Line = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.divider};
`;

// 텍스트
const Text = styled.span`
  padding: 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.muted};
  white-space: nowrap;
`;

// Divider 컴포넌트
export const Divider: React.FC<DividerProps> = ({ children, className }) => {
  if (!children) {
    return <Line className={className} />;
  }

  return (
    <DividerContainer className={className}>
      <Line />
      <Text>{children}</Text>
      <Line />
    </DividerContainer>
  );
};

export default Divider;
