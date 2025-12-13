/**
 * FriendList 컴포넌트
 * 친구 목록을 관계 타입별로 그룹화하여 표시합니다.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FriendCard } from './FriendCard';
import { friendService } from '../../services/friendService';
import type { Friend, RelationshipType, GroupedFriends } from '../../types';

// Props 인터페이스
interface FriendListProps {
  onFriendDeleted?: () => void;
}

// 스타일드 컴포넌트
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const GroupSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const GroupHeader = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const GroupCount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-left: ${({ theme }) => theme.spacing.sm};
`;

const FriendCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxxxl};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  margin: 0;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxxxl};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.error};
  background-color: ${({ theme }) => theme.colors.errorLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

// FriendList 컴포넌트
export const FriendList: React.FC<FriendListProps> = ({ onFriendDeleted }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [grouped, setGrouped] = useState<GroupedFriends>({});
  const [relationshipTypes, setRelationshipTypes] = useState<RelationshipType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // 친구 목록과 관계 타입 동시 로드
      const [friendsRes, typesRes] = await Promise.all([
        friendService.getFriends(),
        friendService.getRelationshipTypes(),
      ]);

      if (friendsRes.success && friendsRes.data) {
        const data = friendsRes.data as { friends?: Friend[]; grouped?: GroupedFriends };
        setFriends(data.friends || []);
        setGrouped(data.grouped || {});
      }

      if (typesRes.success && typesRes.data) {
        const data = typesRes.data as { types?: RelationshipType[] };
        setRelationshipTypes(data.types || []);
      }
    } catch (err) {
      setError('친구 목록을 불러오는데 실패했습니다.');
      console.error('Load friends error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 관계 타입 변경
  const handleUpdateRelationship = async (friendId: number, relationshipTypeId: number) => {
    try {
      const result = await friendService.updateFriendship(friendId, relationshipTypeId);
      if (result.success) {
        // 목록 새로고침
        loadData();
      }
    } catch (err) {
      console.error('Update friendship error:', err);
    }
  };

  // 친구 삭제
  const handleDelete = async (friendId: number) => {
    try {
      const result = await friendService.deleteFriend(friendId);
      if (result.success) {
        // 로컬 상태에서 제거
        setFriends((prev) => prev.filter((f) => f.friend_id !== friendId));
        // 그룹 재계산
        loadData();
        onFriendDeleted?.();
      }
    } catch (err) {
      console.error('Delete friend error:', err);
    }
  };

  // 로딩 상태
  if (loading) {
    return <LoadingState>친구 목록을 불러오는 중...</LoadingState>;
  }

  // 에러 상태
  if (error) {
    return <ErrorState>{error}</ErrorState>;
  }

  // 빈 상태
  if (friends.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>👥</EmptyIcon>
        <EmptyText>아직 친구가 없습니다.</EmptyText>
        <EmptyText style={{ fontSize: '14px', marginTop: '8px' }}>
          상단 검색에서 친구를 찾아 추가해보세요!
        </EmptyText>
      </EmptyState>
    );
  }

  // 그룹별 표시 순서
  const groupOrder = ['가족', '찐친', '친구'];

  return (
    <Container>
      {groupOrder.map((groupName) => {
        const groupFriends = grouped[groupName] || [];
        if (groupFriends.length === 0) return null;

        return (
          <GroupSection key={groupName}>
            <GroupHeader>
              {groupName}
              <GroupCount>({groupFriends.length}명)</GroupCount>
            </GroupHeader>
            <FriendCards>
              {groupFriends.map((friend) => (
                <FriendCard
                  key={friend.friend_id}
                  friend={friend}
                  relationshipTypes={relationshipTypes}
                  onUpdateRelationship={handleUpdateRelationship}
                  onDelete={handleDelete}
                />
              ))}
            </FriendCards>
          </GroupSection>
        );
      })}
    </Container>
  );
};

export default FriendList;
