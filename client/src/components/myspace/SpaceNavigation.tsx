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
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: 0;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.background};
  border: 2px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ $active, theme }) =>
    $active ? '#ffffff' : theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: ${({ $active }) =>
    $active ? '0 4px 12px rgba(51, 51, 51, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.05)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(51, 51, 51, 0.2);
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
          일기
        </Tab>
      </Container>
    );
  }

  // 내 공간일 경우 전체 탭 표시
  return (
    <Container>
      <Tab $active={activeTab === 'diary'} onClick={() => onTabChange('diary')}>
        일기
      </Tab>
      <Tab $active={activeTab === 'friendNews'} onClick={() => onTabChange('friendNews')}>
        친구소식
      </Tab>
      <Tab $active={activeTab === 'friendManage'} onClick={() => onTabChange('friendManage')}>
        친구관리
      </Tab>
      <Tab $active={activeTab === 'friendRequest'} onClick={() => onTabChange('friendRequest')}>
        친구신청
        {pendingRequestCount > 0 && <Badge>{pendingRequestCount}</Badge>}
      </Tab>
    </Container>
  );
};

export default SpaceNavigation;
