/**
 * Friends 페이지
 * 친구 검색, 신청, 관리 기능을 제공하는 페이지입니다.
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { Header, Footer } from '../components/layout';
import { FriendSearch, FriendList, FriendRequestList } from '../components/friends';

// 탭 타입
type TabType = 'friends' | 'received' | 'sent';

// 스타일드 컴포넌트
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const MainContent = styled.main`
  flex: 1;
  max-width: ${({ theme }) => theme.sizes.container.lg};
  width: 100%;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xl} 0;
`;

const SearchSection = styled.section`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
`;

const TabsContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled.button<{ $isActive: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;

  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary : theme.colors.text.secondary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary : 'transparent'};
    transition: background-color ${({ theme }) => theme.transitions.fast};
  }
`;

// TabBadge - 향후 알림 배지에 사용 예정
// const TabBadge = styled.span`
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   min-width: 20px;
//   height: 20px;
//   padding: 0 6px;
//   margin-left: ${({ theme }) => theme.spacing.sm};
//   background-color: ${({ theme }) => theme.colors.error};
//   color: white;
//   font-size: ${({ theme }) => theme.typography.fontSize.xs};
//   font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
//   border-radius: ${({ theme }) => theme.borderRadius.pill};
// `;

const TabContent = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

// Friends 페이지 컴포넌트
const Friends: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('friends');
  const [refreshKey, setRefreshKey] = useState(0);

  // 새로고침 트리거
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <PageContainer>
      <Header variant="authenticated" />

      <MainContent>
        <PageTitle>친구 관리</PageTitle>

        {/* 검색 섹션 */}
        <SearchSection>
          <SectionTitle>친구 찾기</SectionTitle>
          <FriendSearch onRequestSent={handleRefresh} />
        </SearchSection>

        {/* 탭 컨테이너 */}
        <TabsContainer>
          <TabList>
            <Tab
              $isActive={activeTab === 'friends'}
              onClick={() => setActiveTab('friends')}
            >
              내 친구
            </Tab>
            <Tab
              $isActive={activeTab === 'received'}
              onClick={() => setActiveTab('received')}
            >
              받은 요청
            </Tab>
            <Tab
              $isActive={activeTab === 'sent'}
              onClick={() => setActiveTab('sent')}
            >
              보낸 요청
            </Tab>
          </TabList>

          <TabContent key={refreshKey}>
            {activeTab === 'friends' && (
              <FriendList onFriendDeleted={handleRefresh} />
            )}
            {activeTab === 'received' && (
              <FriendRequestList type="received" onRequestHandled={handleRefresh} />
            )}
            {activeTab === 'sent' && (
              <FriendRequestList type="sent" onRequestHandled={handleRefresh} />
            )}
          </TabContent>
        </TabsContainer>
      </MainContent>

      <Footer />
    </PageContainer>
  );
};

export default Friends;
