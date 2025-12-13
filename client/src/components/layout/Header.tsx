/**
 * 통합 Header 컴포넌트
 * variant로 guest/authenticated/minimal 모드 지원
 * styled-components 기반
 */

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Props 인터페이스
interface HeaderProps {
  variant?: 'guest' | 'authenticated' | 'minimal';
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  onMySpaceClick?: () => void;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
  logoText?: string;
  description?: string;
}

// 스타일 컴포넌트
const HeaderContainer = styled.header`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.header || 100};
`;

const HeaderInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: ${({ theme }) => theme.sizes.container.lg};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  min-height: 60px;
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const LogoTitle = styled(Link)`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: none;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const LogoDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const NavSection = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const NavLink = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
`;

const Divider = styled.span`
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0 ${({ theme }) => theme.spacing.xs};
`;

// Header 컴포넌트
const Header: React.FC<HeaderProps> = ({
  variant = 'guest',
  onLoginClick,
  onSignUpClick,
  onMySpaceClick,
  onProfileClick,
  onLogoutClick,
  logoText = '친애',
  description = '영원히 정말로 사랑해, 진짜',
}) => {
  // 네비게이션 렌더링
  const renderNavigation = () => {
    switch (variant) {
      case 'guest':
        return (
          <>
            <NavLink onClick={onLoginClick}>로그인</NavLink>
            <Divider>|</Divider>
            <NavLink onClick={onSignUpClick}>회원가입</NavLink>
          </>
        );
      case 'authenticated':
        return (
          <>
            <NavLink onClick={onMySpaceClick}>내 공간</NavLink>
            <Divider>|</Divider>
            <NavLink onClick={onProfileClick}>내 정보</NavLink>
            <Divider>|</Divider>
            <NavLink onClick={onLogoutClick}>로그아웃</NavLink>
          </>
        );
      case 'minimal':
      default:
        return null;
    }
  };

  return (
    <HeaderContainer>
      <HeaderInner>
        <LogoSection>
          <LogoTitle to="/" title="홈">
            {logoText}
          </LogoTitle>
          {variant === 'minimal' && (
            <LogoDescription>{description}</LogoDescription>
          )}
        </LogoSection>

        {variant !== 'minimal' && (
          <NavSection>{renderNavigation()}</NavSection>
        )}
      </HeaderInner>
    </HeaderContainer>
  );
};

export default Header;
