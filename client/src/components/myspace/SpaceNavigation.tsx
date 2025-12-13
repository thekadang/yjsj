/**
 * 마이스페이스 네비게이션 컴포넌트
 * - 내 공간: 일기, 친구소식, 친구관리, 친구신청
 * - 친구 공간: 일기만 표시 (친구 신청 버튼은 별도)
 */

import React from 'react';
import styled from 'styled-components';

export type NavTab = 'diary' | 'friendNews' | 'friendManage' | 'friendRequest';

interface SpaceNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  pendingRequestCount?: number;
  isOwner?: boolean;
}

const Container = styled.div`
  display: flex;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: none;
  border: none;
  border-bottom: 3px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ $active }) => $active ? 600 : 400};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.background};
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${({ theme }) => theme.colors.error};
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
`;

const SpaceNavigation: React.FC<SpaceNavigationProps> = ({
  activeTab,
  onTabChange,
  pendingRequestCount = 0,
  isOwner = true
}) => {
  // 친구 공간일 경우 일기 탭만 표시
  if (!isOwner) {
    return (
      <Container>
        <Tab $active={activeTab === 'diary'} onClick={() => onTabChange('diary')}>
          📖 일기
        </Tab>
      </Container>
    );
  }

  // 내 공간일 경우 전체 탭 표시
  return (
    <Container>
      <Tab $active={activeTab === 'diary'} onClick={() => onTabChange('diary')}>
        📖 일기
      </Tab>
      <Tab $active={activeTab === 'friendNews'} onClick={() => onTabChange('friendNews')}>
        📰 친구소식
      </Tab>
      <Tab $active={activeTab === 'friendManage'} onClick={() => onTabChange('friendManage')}>
        👥 친구관리
      </Tab>
      <Tab $active={activeTab === 'friendRequest'} onClick={() => onTabChange('friendRequest')}>
        ✉️ 친구신청
        {pendingRequestCount > 0 && <Badge>{pendingRequestCount}</Badge>}
      </Tab>
    </Container>
  );
};

export default SpaceNavigation;
