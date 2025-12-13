/**
 * 통합 Footer 컴포넌트
 * styled-components 기반
 */

import React from 'react';
import styled from 'styled-components';

// Props 인터페이스
interface FooterProps {
  variant?: 'default' | 'minimal';
  siteName?: string;
  copyrightText?: string;
}

// 스타일 컴포넌트
const FooterContainer = styled.footer`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: auto;
`;

const FooterInner = styled.div<{ $minimal?: boolean }>`
  max-width: ${({ theme }) => theme.sizes.container.lg};
  margin: 0 auto;
  padding: ${({ theme, $minimal }) =>
    $minimal
      ? `${theme.spacing.md} ${theme.spacing.xl}`
      : `${theme.spacing.xl} ${theme.spacing.xl}`};
  text-align: center;
`;

const SiteName = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const Copyright = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

// Footer 컴포넌트
const Footer: React.FC<FooterProps> = ({
  variant = 'default',
  siteName = '친애',
  copyrightText,
}) => {
  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} 모든 권리 보유`;

  return (
    <FooterContainer>
      <FooterInner $minimal={variant === 'minimal'}>
        {variant === 'default' && <SiteName>{siteName}</SiteName>}
        <Copyright>{copyrightText || defaultCopyright}</Copyright>
      </FooterInner>
    </FooterContainer>
  );
};

export default Footer;
