/**
 * 친구 통계 컴포넌트
 * 관계 타입별 친구 수 표시
 */

import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

interface FriendStatsProps {
  stats: Record<string, number>;
  isOwner: boolean;
}

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatItem = styled.div<{ $type: string }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ $type, theme }) => {
    switch ($type) {
      case '가족': return theme.colors.error + '10';
      case '찐친': return theme.colors.kakao + '20';
      case '친구': return theme.colors.primary + '10';
      default: return theme.colors.background;
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StatCount = styled.div<{ $type: string }>`
  font-size: 28px;
  font-weight: 700;
  color: ${({ $type, theme }) => {
    switch ($type) {
      case '가족': return theme.colors.error;
      case '찐친': return '#B8860B';
      case '친구': return theme.colors.primary;
      default: return theme.colors.secondary;
    }
  }};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div<{ $type: string }>`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ $type, theme }) => {
    switch ($type) {
      case '가족': return theme.colors.error;
      case '찐친': return '#B8860B';
      case '친구': return theme.colors.primary;
      default: return theme.colors.secondary;
    }
  }};
`;

const ManageLink = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FriendStats: React.FC<FriendStatsProps> = ({ stats, isOwner }) => {
  const navigate = useNavigate();

  const defaultStats = {
    '가족': stats['가족'] || 0,
    '찐친': stats['찐친'] || 0,
    '친구': stats['친구'] || 0
  };

  const total = Object.values(defaultStats).reduce((a, b) => a + b, 0);

  return (
    <Container>
      <Title>👥 친구 ({total}명)</Title>
      <StatsGrid>
        {Object.entries(defaultStats).map(([type, count]) => (
          <StatItem key={type} $type={type} onClick={() => navigate('/friends')}>
            <StatCount $type={type}>{count}</StatCount>
            <StatLabel $type={type}>{type}</StatLabel>
          </StatItem>
        ))}
      </StatsGrid>
      {isOwner && (
        <ManageLink>
          <LinkButton onClick={() => navigate('/friends')}>
            친구 관리 →
          </LinkButton>
        </ManageLink>
      )}
    </Container>
  );
};

export default FriendStats;
