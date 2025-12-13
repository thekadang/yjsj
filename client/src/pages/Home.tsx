/**
 * 메인 홈페이지 - 리디자인 버전
 * 참고 이미지 기반 모던 레이아웃
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from '../components/common';
import { LoginModal, SignUpModal, SignUpInfoModal, ProfileModal, MySpaceModal } from '../components/modals';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types';

// ============================================
// Styled Components
// ============================================

// 전체 컨테이너
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #ffffff;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
`;

// 헤더
const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: transparent;
  transition: background 0.3s ease;

  &.scrolled {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const NavLeft = styled.nav`
  a {
    color: #ffffff;
    text-decoration: none;
    font-size: 14px;
    letter-spacing: 1px;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
`;

const NavRight = styled.nav`
  display: flex;
  gap: 20px;

  span {
    color: #ffffff;
    font-size: 14px;
    letter-spacing: 1px;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }
`;

// Hero 섹션
const HeroSection = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const HeroVideo = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  iframe {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }
`;

const HeroOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(to top, #1a1a1a, transparent);
`;

// 그린 배너 섹션
const GreenBanner = styled.section`
  background: #a4d65e;
  padding: 100px 40px;
  text-align: center;
`;

const BannerTitle = styled.h2`
  font-size: 3.2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 30px;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const BannerSubtitle = styled.p`
  font-size: 1.15rem;
  color: #333;
  max-width: 650px;
  margin: 0 auto;
  line-height: 1.9;
`;

// 2컬럼 섹션
const TwoColumnSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 70vh;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

interface ColumnProps {
  $bgImage?: string;
  $bgColor?: string;
  $dark?: boolean;
}

const Column = styled.div<ColumnProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 40px;
  min-height: 50vh;
  background: ${({ $bgColor, $bgImage }) =>
    $bgImage ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${$bgImage})` :
    $bgColor || '#2a2a2a'};
  background-size: cover;
  background-position: center;
  color: ${({ $dark }) => $dark ? '#1a1a1a' : '#ffffff'};
`;

const ColumnTitle = styled.h3`
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const ColumnSubtitle = styled.p`
  font-size: 1.05rem;
  opacity: 0.85;
  text-align: center;
  max-width: 280px;
  line-height: 1.6;
`;

const ActionButton = styled.button<{ $variant?: 'outline' | 'filled' }>`
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;

  ${({ $variant }) => $variant === 'filled' ? `
    background: #a4d65e;
    color: #1a1a1a;
    border: none;

    &:hover {
      background: #8bc34a;
    }
  ` : `
    background: transparent;
    color: inherit;
    border: 1px solid currentColor;

    &:hover {
      background: rgba(255,255,255,0.1);
    }
  `}
`;

// 이벤트 배너 섹션
const EventBanner = styled.section`
  background: #a4d65e;
  padding: 80px 40px;
  text-align: center;
`;

const EventTitle = styled.h2`
  font-size: 2.6rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const EventDescription = styled.p`
  font-size: 1.1rem;
  color: #333;
  max-width: 500px;
  margin: 0 auto 30px;
  line-height: 1.7;
`;

// 풀와이드 섹션
const FullWidthSection = styled.section<{ $bgImage?: string }>`
  position: relative;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 40px;
  background: ${({ $bgImage }) =>
    $bgImage ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${$bgImage})` : '#1a1a1a'};
  background-size: cover;
  background-position: center;
  text-align: center;
`;

const FullWidthTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const FullWidthSubtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255,255,255,0.85);
  max-width: 450px;
  line-height: 1.7;
`;

// 새로운 Footer
const FooterSection = styled.footer`
  background: #0a0a0a;
  padding: 60px 40px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const FooterColumn = styled.div`
  h4 {
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #888;
    margin-bottom: 20px;
  }

  a, p {
    font-size: 14px;
    color: #fff;
    text-decoration: none;
    display: block;
    margin-bottom: 10px;

    &:hover {
      color: #a4d65e;
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;

  @media (max-width: 768px) {
    justify-content: center;
  }

  a {
    width: 40px;
    height: 40px;
    border: 1px solid #333;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    transition: all 0.3s ease;

    &:hover {
      background: #a4d65e;
      border-color: #a4d65e;
      color: #1a1a1a;
    }
  }
`;

// 빅 로고 섹션
const BigLogoSection = styled.section`
  background: #0a0a0a;
  padding: 100px 40px;
  text-align: center;
  border-top: 1px solid #222;
`;

const BigLogo = styled.h1`
  font-size: 6rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 8px;

  @media (max-width: 768px) {
    font-size: 3.5rem;
    letter-spacing: 4px;
  }
`;

// Blur 효과용 래퍼
const BlurWrapper = styled.div<{ $blur: boolean }>`
  filter: ${({ $blur }) => $blur ? 'blur(5px)' : 'none'};
  transition: filter 0.3s ease;
`;

// ============================================
// Component
// ============================================

const Home: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  // 모달 상태
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isSignUpInfoModalOpen, setIsSignUpInfoModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMySpaceOpen, setIsMySpaceOpen] = useState(false);

  // 핸들러들
  const handleLoginSuccess = (loggedInUser: User) => {
    setIsLoginModalOpen(false);
    if (loggedInUser && !loggedInUser.birthdate) {
      setTimeout(() => setIsSignUpInfoModalOpen(true), 100);
    }
  };

  const handleLogout = () => logout();
  const handleMySpaceClick = () => setIsMySpaceOpen(true);
  const handleProfileClick = () => {
    if (isAuthenticated && user) {
      setIsProfileModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const openSignUp = () => {
    setIsLoginModalOpen(false);
    setTimeout(() => setIsSignUpModalOpen(true), 300);
  };

  const openLogin = () => {
    setIsSignUpModalOpen(false);
    setTimeout(() => setIsLoginModalOpen(true), 300);
  };

  const isAnyModalOpen = isLoginModalOpen || isSignUpModalOpen || isSignUpInfoModalOpen || isProfileModalOpen || isMySpaceOpen;

  return (
    <PageContainer>
      <BlurWrapper $blur={isAnyModalOpen}>
        {/* Header */}
        <Header>
          <NavLeft>
            <a href="/">Home</a>
          </NavLeft>
          <Logo>친애</Logo>
          <NavRight>
            {isAuthenticated ? (
              <>
                <span onClick={handleMySpaceClick}>내 공간</span>
                <span onClick={handleProfileClick}>내 정보</span>
                <span onClick={handleLogout}>로그아웃</span>
              </>
            ) : (
              <>
                <span onClick={() => setIsLoginModalOpen(true)}>Login</span>
                <span onClick={() => setIsSignUpModalOpen(true)}>Join</span>
              </>
            )}
          </NavRight>
        </Header>

        {/* Hero Section */}
        <HeroSection>
          <HeroVideo>
            <iframe
              src="https://www.youtube.com/embed/o0tvAUjeklU?controls=0&rel=0&playsinline=1&enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=o0tvAUjeklU"
              title="Background Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </HeroVideo>
          <HeroOverlay />
        </HeroSection>

        {/* Green Banner - 슬로건 */}
        <GreenBanner>
          <BannerTitle>
            내 사람들을 위한<br />나의 준비
          </BannerTitle>
          <BannerSubtitle>
            내가 원하는 나의 모습으로... 내가 준비한 것들을 쉽게 알 수 있도록...<br />
            내가 내 사람들을 어떻게 생각했는지... 나는 평소에 어떻게 지내왔는지...<br />
            내사람들이 내가 생각날 때 쉽게 찾아올 수 있도록...
          </BannerSubtitle>
        </GreenBanner>

        {/* 2컬럼: 나의 일기장 | 나의 영정사진 */}
        <TwoColumnSection>
          <Column $bgImage="/images/diary-bg.jpg">
            <ColumnTitle>나의<br />일기장</ColumnTitle>
            <ColumnSubtitle>내가 남기는 나의 이야기</ColumnSubtitle>
          </Column>
          <Column $bgImage="/images/portrait-bg.jpg">
            <ColumnTitle>나의<br />영정사진</ColumnTitle>
            <ColumnSubtitle>내가 원하는 나의 마지막 모습</ColumnSubtitle>
          </Column>
        </TwoColumnSection>

        {/* 이벤트 배너 - 친애 소개 */}
        <EventBanner>
          <EventTitle>영원히 정말로<br />사랑해, 진짜</EventTitle>
          <EventDescription>
            당신의 마지막 안부를 보관합니다.<br />
            지금부터 친애와 함께 시작하세요.
          </EventDescription>
          {!isAuthenticated && (
            <ActionButton
              $variant="outline"
              style={{ color: '#1a1a1a', borderColor: '#1a1a1a' }}
              onClick={() => setIsSignUpModalOpen(true)}
            >
              시작하기
            </ActionButton>
          )}
        </EventBanner>

        {/* 2컬럼: 내가 하고픈 말 | 나의 사전준비 */}
        <TwoColumnSection>
          <Column $bgImage="/images/sunset-bg.jpg">
            <ColumnTitle>내가<br />하고픈 말</ColumnTitle>
            <ColumnSubtitle>내가 진짜 하고싶은 말</ColumnSubtitle>
          </Column>
          <Column $bgImage="/images/prepare-bg.jpg">
            <ColumnTitle>나의<br />사전준비</ColumnTitle>
            <ColumnSubtitle>남은 이들을 위한 나의 준비</ColumnSubtitle>
          </Column>
        </TwoColumnSection>

        {/* 풀와이드: 나의 공간 */}
        <FullWidthSection $bgImage="/images/space-bg.jpg">
          <FullWidthTitle>그리고..나의 공간..</FullWidthTitle>
          <FullWidthSubtitle>
            내가 떠난 후에도 내사람들이 찾아와 남길 수 있는 방명록
          </FullWidthSubtitle>
        </FullWidthSection>

        {/* Footer */}
        <FooterSection>
          <FooterContent>
            <FooterColumn>
              <h4>Links</h4>
              <a href="/">hello@chinae.com</a>
              <h4 style={{ marginTop: '30px' }}>Sponsors</h4>
              <a href="/">hello@chinae.com</a>
            </FooterColumn>
            <FooterColumn>
              <h4>Socials</h4>
              <SocialIcons>
                <a href="#" title="Instagram">📷</a>
                <a href="#" title="YouTube">▶</a>
                <a href="#" title="Facebook">f</a>
              </SocialIcons>
            </FooterColumn>
            <FooterColumn>
              <h4>Our Newsletter</h4>
              <p>
                친애 뉴스레터를 통해<br />
                새로운 소식과 업데이트를<br />
                받아보세요.
              </p>
            </FooterColumn>
          </FooterContent>
        </FooterSection>

        {/* Big Logo */}
        <BigLogoSection>
          <BigLogo>친애</BigLogo>
        </BigLogoSection>
      </BlurWrapper>

      {/* Modals */}
      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} size="sm">
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          onSignUpClick={openSignUp}
        />
      </Modal>

      <Modal isOpen={isSignUpModalOpen} onClose={() => setIsSignUpModalOpen(false)} size="md">
        <SignUpModal
          onClose={() => setIsSignUpModalOpen(false)}
          onLoginClick={openLogin}
        />
      </Modal>

      <Modal isOpen={isSignUpInfoModalOpen} onClose={() => {}} size="md" closeOnOverlayClick={false}>
        {user && (
          <SignUpInfoModal
            onClose={() => setIsSignUpInfoModalOpen(false)}
            onComplete={() => setIsSignUpInfoModalOpen(false)}
            userId={user.id}
          />
        )}
      </Modal>

      {isProfileModalOpen && user && (
        <ProfileModal
          onClose={() => setIsProfileModalOpen(false)}
          userId={user.id}
        />
      )}

      {/* 내 공간 모달 */}
      <MySpaceModal
        isOpen={isMySpaceOpen}
        onClose={() => setIsMySpaceOpen(false)}
      />
    </PageContainer>
  );
};

export default Home;
