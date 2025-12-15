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
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
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
    background: rgba(248, 245, 239, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(41, 37, 36, 0.08);
  }
`;

const NavLeft = styled.nav`
  a {
    color: ${({ theme }) => theme.colors.white[100]};
    text-decoration: none;
    font-size: 16px;
    letter-spacing: 1px;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.white[200]};
    }
  }
`;

const Logo = styled.div`
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.white[100]};
`;

const NavRight = styled.nav`
  display: flex;
  gap: 20px;

  span {
    color: ${({ theme }) => theme.colors.white[100]};
    font-size: 16px;
    letter-spacing: 1px;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.white[200]};
    }
  }
`;

// Hero 섹션
const HeroSection = styled.section`
  position: relative;
  width: 100%;
  height: 800px;
  max-height: 800px;
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(41, 37, 36, 0.5);
`;

const HeroTitle = styled.div`
  position: absolute;
  bottom: 80px;
  left: 40px;
  right: 40px;
  z-index: 10;
  text-align: left;
  color: ${({ theme }) => theme.colors.white[100]};
  max-width: 900px;
  
  h2 {
    font-size: 4.5rem;
    font-weight: 700;
    margin-bottom: 30px;
    line-height: 1.2;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  p {
    font-size: 1.4rem;
    opacity: 0.95;
    max-width: 750px;
    line-height: 1.8;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
`;

// 메인 배너 섹션
const GreenBanner = styled.section`
  background: ${({ theme }) => theme.colors.main[100]};
  padding: 100px 40px;
  text-align: center;
`;

const BannerTitle = styled.h2`
  font-size: 3.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.black[700]};
  margin-bottom: 30px;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const BannerSubtitle = styled.p`
  font-size: 1.15rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 650px;
  margin: 0 auto;
  line-height: 1.9;
`;

// 2컬럼 섹션
const TwoColumnSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100px;

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
  min-height: 400px;
  background: ${({ $bgColor, $bgImage, theme }) =>
    $bgImage ? `linear-gradient(rgba(41, 37, 36, 0.4), rgba(41, 37, 36, 0.4)), url(${$bgImage})` :
    $bgColor || theme.colors.black[800]};
  background-size: cover;
  background-position: center;
  color: ${({ $dark, theme }) => $dark ? theme.colors.black[700] : theme.colors.white[100]};
`;

const IconWrapper = styled.div`
  margin-bottom: 20px;
  
  svg {
    width: 60px;
    height: 60px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

// SVG 아이콘 컴포넌트들
const BookIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

const FrameIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <path d="M21 15l-5-5L5 21"></path>
  </svg>
);

const MicIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

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

  ${({ $variant, theme }) => $variant === 'filled' ? `
    background: ${theme.colors.primary};
    color: ${theme.colors.white[100]};
    border: none;

    &:hover {
      background: ${theme.colors.primaryHover};
    }
  ` : `
    background: transparent;
    color: inherit;
    border: 1px solid currentColor;

    &:hover {
      background: rgba(184, 144, 109, 0.1);
    }
  `}
`;

// 이벤트 배너 섹션
const EventBanner = styled.section`
  position: relative;
  padding: 120px 40px;
  text-align: center;
  overflow: hidden;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const EventVideo = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 100vh;
  transform: translate(-50%, -50%);
  z-index: 0;

  iframe {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }
`;

const EventOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(41, 37, 36, 0.65);
  z-index: 1;
`;

const EventTitle = styled.h2`
  font-size: 2.6rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white[100]};
  margin-bottom: 20px;
  line-height: 1.3;
  z-index: 2;
  position: relative;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const EventDescription = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.white[100]};
  max-width: 500px;
  margin: 0 auto 30px;
  line-height: 1.7;
  z-index: 2;
  position: relative;
  opacity: 0.95;
`;

// 풀와이드 섹션
const FullWidthSection = styled.section<{ $bgImage?: string }>`
  position: relative;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 120px 40px;
  background: ${({ $bgImage, theme }) =>
    $bgImage ? `linear-gradient(rgba(41, 37, 36, 0.5), rgba(41, 37, 36, 0.5)), url(${$bgImage})` : theme.colors.black[800]};
  background-size: cover;
  background-position: center;
  text-align: center;
`;

const FullWidthTitle = styled.h2`
  font-size: 3.8rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 25px;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const FullWidthSubtitle = styled.p`
  font-size: 1.3rem;
  color: rgba(255,255,255,0.9);
  max-width: 550px;
  line-height: 1.8;
`;

// Footer
const FooterSection = styled.footer`
  background: ${({ theme }) => theme.colors.black[900]};
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
    color: ${({ theme }) => theme.colors.text.tertiary};
    margin-bottom: 20px;
  }

  a, p {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.white[200]};
    text-decoration: none;
    display: block;
    margin-bottom: 10px;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
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
    border: 1px solid ${({ theme }) => theme.colors.black[700]};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.white[200]};
    transition: all 0.3s ease;

    &:hover {
      background: ${({ theme }) => theme.colors.primary};
      border-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.white[100]};
    }
  }
`;

// 빅 로고 섹션
const BigLogoSection = styled.section`
  background: ${({ theme }) => theme.colors.black[900]};
  padding: 100px 40px;
  text-align: center;
  border-top: 1px solid ${({ theme }) => theme.colors.black[700]};
`;

const BigLogo = styled.h1`
  font-size: 6rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white[100]};
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
              src="https://www.youtube.com/embed/3tbnYkLZPYk?controls=0&rel=0&playsinline=1&enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=3tbnYkLZPYk&start=5"
              title="Background Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </HeroVideo>
          <HeroOverlay />
          <HeroTitle>
            <h2>
              내 사람들을 위한<br />나의 준비
            </h2>
            <p>
              내가 원하는 나의 모습으로... 내가 준비한 것들을 쉽게 알 수 있도록...<br />
              내가 내 사람들을 어떻게 생각했는지... 나는 평소에 어떻게 지내왔는지...<br />
              내사람들이 내가 생각날 때 쉽게 찾아올 수 있도록...
            </p>
          </HeroTitle>
        </HeroSection>

        {/* 2컬럼: 나의 일기장 | 나의 영정사진 */}
        <TwoColumnSection>
          <Column $bgImage="/images/diary-bg.jpg">
            <IconWrapper><BookIcon /></IconWrapper>
            <ColumnTitle>나의<br />일기장</ColumnTitle>
            <ColumnSubtitle>내가 남기는 나의 이야기</ColumnSubtitle>
            <ActionButton $variant="outline" style={{ marginTop: '20px' }}>더 알아보기</ActionButton>
          </Column>
          <Column $bgColor="#b8906d" $dark>
            <IconWrapper><FrameIcon /></IconWrapper>
            <ColumnTitle>나의<br />영정사진</ColumnTitle>
            <ColumnSubtitle>내가 원하는 나의 마지막 모습</ColumnSubtitle>
            <ActionButton $variant="outline" style={{ marginTop: '20px', color: '#292524', borderColor: '#292524' }}>더 알아보기</ActionButton>
          </Column>
        </TwoColumnSection>

        {/* 이벤트 배너 - 친애 소개 */}
        <EventBanner>
          <EventVideo>
            <iframe
              src="https://www.youtube.com/embed/oYc9xhKPD8A?controls=0&rel=0&playsinline=1&enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=oYc9xhKPD8A&start=5"
              title="Event Background Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </EventVideo>
          <EventOverlay />
          <EventTitle>영원히 정말로<br />사랑해, 진짜</EventTitle>
          <EventDescription>
            당신의 마지막 안부를 보관합니다.<br />
            지금부터 친애와 함께 시작하세요.
          </EventDescription>
          {!isAuthenticated && (
            <ActionButton
              $variant="outline"
              style={{ color: '#ffffff', borderColor: '#ffffff', position: 'relative', zIndex: 2 }}
              onClick={() => setIsSignUpModalOpen(true)}
            >
              시작하기
            </ActionButton>
          )}
        </EventBanner>

        {/* 2컬럼: 내가 하고픈 말 | 나의 사전준비 */}
        <TwoColumnSection>
          <Column $bgColor="#6d7f6d" $dark>
            <IconWrapper><MicIcon /></IconWrapper>
            <ColumnTitle>내가<br />하고픈 말</ColumnTitle>
            <ColumnSubtitle>내가 진짜 하고싶은 말</ColumnSubtitle>
            <ActionButton $variant="outline" style={{ marginTop: '20px', color: '#292524', borderColor: '#292524' }}>더 알아보기</ActionButton>
          </Column>
          <Column $bgImage="/images/prepare-bg.jpg">
            <IconWrapper><BriefcaseIcon /></IconWrapper>
            <ColumnTitle>나의<br />사전준비</ColumnTitle>
            <ColumnSubtitle>남은 이들을 위한 나의 준비</ColumnSubtitle>
            <ActionButton $variant="outline" style={{ marginTop: '20px' }}>더 알아보기</ActionButton>
          </Column>
        </TwoColumnSection>

        {/* 풀와이드: 나의 공간 */}
        <FullWidthSection $bgImage="/images/myspace-bg.jpg">
          <FullWidthTitle>그리고..나의 공간..</FullWidthTitle>
          <FullWidthSubtitle>
            내가 떠난 후에도 내사람들이 찾아와 남길 수 있는 방명록
          </FullWidthSubtitle>
          {isAuthenticated && (
            <ActionButton
              $variant="outline"
              onClick={handleMySpaceClick}
              style={{ marginTop: '20px', color: '#ffffff', borderColor: '#ffffff', fontSize: '1.1rem', padding: '14px 35px' }}
            >
              나의 공간 바로가기
            </ActionButton>
          )}
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
                <a href="#" title="Instagram">IG</a>
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
