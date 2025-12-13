/**
 * 공통 Input 컴포넌트
 * 텍스트, 비밀번호, 이메일, 날짜 등 다양한 입력 유형을 지원합니다.
 */

import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';

// Input 크기 타입
export type InputSize = 'sm' | 'md' | 'lg';

// Input Props 인터페이스
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  fullWidth?: boolean;
  hasError?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// 크기별 스타일 정의
const sizeStyles = {
  sm: css`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    min-height: ${({ theme }) => theme.sizes.inputHeight.sm};
  `,
  md: css`
    padding: ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    min-height: ${({ theme }) => theme.sizes.inputHeight.md};
  `,
  lg: css`
    padding: ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    min-height: ${({ theme }) => theme.sizes.inputHeight.lg};
  `,
};

// Input 래퍼 (아이콘 지원용)
const InputWrapper = styled.div<{ $fullWidth: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

// 아이콘 컨테이너
const IconContainer = styled.span<{ $position: 'left' | 'right' }>`
  position: absolute;
  ${({ $position }) => ($position === 'left' ? 'left: 12px;' : 'right: 12px;')}
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.muted};
  pointer-events: none;
`;

// 스타일드 Input
const StyledInput = styled.input<{
  $size: InputSize;
  $fullWidth: boolean;
  $hasError: boolean;
  $hasLeftIcon: boolean;
  $hasRightIcon: boolean;
}>`
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  border: 1px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: inherit;
  transition: border-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  /* 크기 스타일 */
  ${({ $size }) => sizeStyles[$size]}

  /* 아이콘 패딩 조정 */
  ${({ $hasLeftIcon }) =>
    $hasLeftIcon &&
    css`
      padding-left: 40px;
    `}

  ${({ $hasRightIcon }) =>
    $hasRightIcon &&
    css`
      padding-right: 40px;
    `}

  /* 포커스 상태 */
  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${({ theme, $hasError }) =>
        $hasError
          ? `${theme.colors.error}20`
          : `${theme.colors.primary}20`};
  }

  /* 플레이스홀더 */
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }

  /* 비활성화 상태 */
  &:disabled {
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
  }

  /* 에러 상태 */
  ${({ $hasError, theme }) =>
    $hasError &&
    css`
      border-color: ${theme.colors.error};

      &:focus {
        border-color: ${theme.colors.error};
      }
    `}
`;

// Input 컴포넌트
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      fullWidth = false,
      hasError = false,
      leftIcon,
      rightIcon,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <InputWrapper $fullWidth={fullWidth} className={className}>
        {leftIcon && <IconContainer $position="left">{leftIcon}</IconContainer>}
        <StyledInput
          ref={ref}
          $size={size}
          $fullWidth={fullWidth}
          $hasError={hasError}
          $hasLeftIcon={!!leftIcon}
          $hasRightIcon={!!rightIcon}
          {...props}
        />
        {rightIcon && (
          <IconContainer $position="right">{rightIcon}</IconContainer>
        )}
      </InputWrapper>
    );
  }
);

Input.displayName = 'Input';

export default Input;
