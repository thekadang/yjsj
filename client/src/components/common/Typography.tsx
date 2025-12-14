/**
 * Typography 컴포넌트
 * 텍스트 스타일링을 위한 유틸리티 컴포넌트입니다.
 */

import styled, { css } from 'styled-components';

// 공통 텍스트 스타일
const textBase = css`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

// 제목 스타일
export const Heading1 = styled.h1`
  ${textBase}
  font-size: ${({ theme }) => theme.typography.fontSize.xxxxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

export const Heading2 = styled.h2`
  ${textBase}
  font-size: ${({ theme }) => theme.typography.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

export const Heading3 = styled.h3`
  ${textBase}
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

export const Heading4 = styled.h4`
  ${textBase}
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

export const Heading5 = styled.h5`
  ${textBase}
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

export const Heading6 = styled.h6`
  ${textBase}
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

// 본문 텍스트
export const Text = styled.p<{
  size?: 'xs' | 'sm' | 'md' | 'lg';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'error' | 'success';
  align?: 'left' | 'center' | 'right';
}>`
  ${textBase}
  font-size: ${({ theme, size = 'md' }) => theme.typography.fontSize[size]};
  font-weight: ${({ theme, weight = 'normal' }) => theme.typography.fontWeight[weight]};
  color: ${({ theme, color = 'primary' }) => {
    if (color === 'error') return theme.colors.error;
    if (color === 'success') return theme.colors.success;
    return theme.colors.text[color];
  }};
  text-align: ${({ align = 'left' }) => align};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

// 작은 텍스트
export const Small = styled.small`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.muted};
`;

// 강조 텍스트
export const Strong = styled.strong`
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

// 링크 텍스트 ($underline: transient prop으로 DOM 전달 방지)
export const Link = styled.a<{ $underline?: boolean }>`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: ${({ $underline }) => ($underline ? 'underline' : 'none')};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
    text-decoration: underline;
  }
`;

// 라벨 텍스트
export const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export default {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Text,
  Small,
  Strong,
  Link,
  Label,
};
