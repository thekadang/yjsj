/**
 * 공통 FormGroup 컴포넌트
 * 라벨, 입력 필드, 에러 메시지를 포함하는 폼 그룹입니다.
 */

import React from 'react';
import styled from 'styled-components';

// FormGroup Props 인터페이스
export interface FormGroupProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

// 폼 그룹 컨테이너
const FormGroupContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  width: 100%;
`;

// 라벨 스타일
const Label = styled.label<{ $required: boolean }>`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};

  /* 필수 표시 */
  ${({ $required, theme }) =>
    $required &&
    `
    &::after {
      content: ' *';
      color: ${theme.colors.error};
    }
  `}
`;

// 에러 메시지 스타일
const ErrorMessage = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.error};
`;

// 힌트 메시지 스타일
const HintMessage = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.muted};
`;

// FormGroup 컴포넌트
export const FormGroup: React.FC<FormGroupProps> = ({
  label,
  htmlFor,
  error,
  hint,
  required = false,
  children,
  className,
}) => {
  return (
    <FormGroupContainer className={className}>
      {label && (
        <Label htmlFor={htmlFor} $required={required}>
          {label}
        </Label>
      )}
      {children}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!error && hint && <HintMessage>{hint}</HintMessage>}
    </FormGroupContainer>
  );
};

export default FormGroup;
