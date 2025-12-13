/**
 * 공통 Button 컴포넌트
 *
 * 다양한 변형(variant)과 크기(size)를 지원하는 재사용 가능한 버튼입니다.
 *
 * @example
 * // 기본 사용법
 * <Button>확인</Button>
 *
 * // 변형 사용
 * <Button variant="primary">저장</Button>
 * <Button variant="secondary">취소</Button>
 * <Button variant="kakao">카카오 로그인</Button>
 * <Button variant="google">구글 로그인</Button>
 * <Button variant="outline">더보기</Button>
 * <Button variant="ghost">닫기</Button>
 *
 * // 크기 조절
 * <Button size="sm">작은 버튼</Button>
 * <Button size="md">중간 버튼</Button>
 * <Button size="lg">큰 버튼</Button>
 *
 * // 전체 너비
 * <Button fullWidth>전체 너비 버튼</Button>
 *
 * // 로딩 상태
 * <Button isLoading>처리 중...</Button>
 *
 * // 아이콘과 함께
 * <Button leftIcon={<Icon />}>아이콘 버튼</Button>
 *
 * @module components/common/Button
 */

import React from 'react';
import styled, { css } from 'styled-components';

/**
 * 버튼 변형 타입
 * - primary: 주요 액션용 (진한 배경)
 * - secondary: 보조 액션용 (연한 배경)
 * - kakao: 카카오 로그인용 (노란색)
 * - google: 구글 로그인용 (흰색 + 테두리)
 * - outline: 아웃라인 스타일
 * - ghost: 배경 없는 스타일
 */
export type ButtonVariant = 'primary' | 'secondary' | 'kakao' | 'google' | 'outline' | 'ghost';

/**
 * 버튼 크기 타입
 * - sm: 작은 버튼 (32px)
 * - md: 중간 버튼 (44px) - 기본값
 * - lg: 큰 버튼 (52px)
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button 컴포넌트 Props
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 스타일 변형 @default 'primary' */
  variant?: ButtonVariant;
  /** 버튼 크기 @default 'md' */
  size?: ButtonSize;
  /** 전체 너비 사용 여부 @default false */
  fullWidth?: boolean;
  /** 로딩 상태 표시 여부 @default false */
  isLoading?: boolean;
  /** 왼쪽에 표시할 아이콘 */
  leftIcon?: React.ReactNode;
  /** 오른쪽에 표시할 아이콘 */
  rightIcon?: React.ReactNode;
}

// 변형별 스타일 정의
const variantStyles = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.inverse};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primaryHover};
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text.primary};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.surfaceHover};
    }
  `,
  kakao: css`
    background-color: ${({ theme }) => theme.colors.kakao};
    color: ${({ theme }) => theme.colors.kakaoText};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.kakaoHover};
    }
  `,
  google: css`
    background-color: ${({ theme }) => theme.colors.google};
    color: ${({ theme }) => theme.colors.googleText};
    border: 1px solid ${({ theme }) => theme.colors.googleBorder};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.googleHover};
    }
  `,
  outline: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme }) => theme.colors.border};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.surface};
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text.primary};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.surface};
    }
  `,
};

// 크기별 스타일 정의
const sizeStyles = {
  sm: css`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    min-height: ${({ theme }) => theme.sizes.buttonHeight.sm};
  `,
  md: css`
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    min-height: ${({ theme }) => theme.sizes.buttonHeight.md};
  `,
  lg: css`
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    min-height: ${({ theme }) => theme.sizes.buttonHeight.lg};
  `,
};

// 스타일드 버튼 컴포넌트
const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $isLoading: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-family: inherit;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  text-decoration: none;
  outline: none;

  /* 변형 스타일 적용 */
  ${({ $variant }) => variantStyles[$variant]}

  /* 크기 스타일 적용 */
  ${({ $size }) => sizeStyles[$size]}

  /* 전체 너비 */
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  /* 비활성화 상태 */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* 로딩 상태 */
  ${({ $isLoading }) =>
    $isLoading &&
    css`
      pointer-events: none;
      opacity: 0.7;
    `}
`;

// 로딩 스피너
const LoadingSpinner = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Button 컴포넌트
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $isLoading={isLoading}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </StyledButton>
  );
};

export default Button;
