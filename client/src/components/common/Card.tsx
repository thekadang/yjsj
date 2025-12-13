/**
 * 공통 Card 컴포넌트
 * 콘텐츠를 감싸는 카드 형태의 컨테이너입니다.
 */

import React from 'react';
import styled, { css } from 'styled-components';

// Card 변형 타입
export type CardVariant = 'default' | 'outlined' | 'elevated';

// Card Props 인터페이스
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  hoverable?: boolean;
  children: React.ReactNode;
}

// 변형별 스타일 정의
const variantStyles = {
  default: css`
    background-color: ${({ theme }) => theme.colors.surface};
    border: none;
  `,
  outlined: css`
    background-color: ${({ theme }) => theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.border};
  `,
  elevated: css`
    background-color: ${({ theme }) => theme.colors.background};
    border: none;
    box-shadow: ${({ theme }) => theme.shadows.card};
  `,
};

// 패딩 스타일 정의
const paddingStyles = {
  none: css`
    padding: 0;
  `,
  sm: css`
    padding: ${({ theme }) => theme.spacing.md};
  `,
  md: css`
    padding: ${({ theme }) => theme.spacing.lg};
  `,
  lg: css`
    padding: ${({ theme }) => theme.spacing.xl};
  `,
};

// 스타일드 Card
const StyledCard = styled.div<{
  $variant: CardVariant;
  $padding: 'none' | 'sm' | 'md' | 'lg';
  $fullWidth: boolean;
  $hoverable: boolean;
}>`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.normal};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  /* 변형 스타일 */
  ${({ $variant }) => variantStyles[$variant]}

  /* 패딩 스타일 */
  ${({ $padding }) => paddingStyles[$padding]}

  /* 호버 효과 */
  ${({ $hoverable, theme }) =>
    $hoverable &&
    css`
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.lg};
      }
    `}
`;

// Card Header
export const CardHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

// Card Title
export const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

// Card Description
export const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: ${({ theme }) => theme.spacing.xs} 0 0 0;
`;

// Card Body
export const CardBody = styled.div``;

// Card Footer
export const CardFooter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

// Card 컴포넌트
export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  fullWidth = false,
  hoverable = false,
  children,
  ...props
}) => {
  return (
    <StyledCard
      $variant={variant}
      $padding={padding}
      $fullWidth={fullWidth}
      $hoverable={hoverable}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

export default Card;
