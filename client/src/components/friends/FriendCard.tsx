/**
 * FriendCard 컴포넌트
 * 친구 한 명의 정보를 표시하는 카드입니다.
 */

import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '../common';
import type { Friend, RelationshipType } from '../../types';

// Props 인터페이스
interface FriendCardProps {
  friend: Friend;
  relationshipTypes?: RelationshipType[];
  onUpdateRelationship?: (friendId: number, relationshipTypeId: number) => void;
  onDelete?: (friendId: number) => void;
}

// 관계 타입별 색상 - 올드머니 웜톤
const relationshipColors: Record<string, string> = {
  family: '#8a654d',    // 가족 - 다크 캐멀
  bestie: '#b8906d',    // 찐친 - 캐멀 베이지
  friend: '#6d7f6d',    // 친구 - 세이지 그린
};

// 스타일드 컴포넌트
const CardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.fast};
  height: 400px;
  box-sizing: border-box;
  overflow-y: auto;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.sm};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Avatar = styled.div<{ $relationshipName?: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: white;

  ${({ $relationshipName }) => css`
    background-color: ${relationshipColors[$relationshipName || 'friend'] || relationshipColors.friend};
  `}
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const UserName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const RelationshipBadge = styled.span<{ $relationshipName?: string }>`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: white;

  ${({ $relationshipName }) => css`
    background-color: ${relationshipColors[$relationshipName || 'friend'] || relationshipColors.friend};
  `}
`;

const FriendsSince = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SelectWrapper = styled.div`
  position: relative;
`;

const Select = styled.select`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background-color: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

// FriendCard 컴포넌트
export const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  relationshipTypes = [],
  onUpdateRelationship,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedType, setSelectedType] = useState(friend.relationship_type_id);

  // 이름의 첫 글자
  const initial = friend.name?.charAt(0) || friend.username?.charAt(0) || '?';

  // 친구가 된 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 관계 타입 변경 처리
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTypeId = Number(e.target.value);
    setSelectedType(newTypeId);
    onUpdateRelationship?.(friend.friend_id, newTypeId);
    setIsEditing(false);
  };

  // 삭제 확인
  const handleDelete = () => {
    if (window.confirm(`${friend.name}님을 친구 목록에서 삭제하시겠습니까?`)) {
      onDelete?.(friend.friend_id);
    }
  };

  return (
    <CardContainer>
      <UserInfo>
        <Avatar $relationshipName={friend.relationship_name}>
          {initial}
        </Avatar>
        <UserDetails>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserName>{friend.name || friend.username}</UserName>
            <RelationshipBadge $relationshipName={friend.relationship_name}>
              {friend.relationship_display}
            </RelationshipBadge>
          </div>
          <FriendsSince>
            친구가 된 날: {formatDate(friend.friends_since)}
          </FriendsSince>
        </UserDetails>
      </UserInfo>

      <Actions>
        {isEditing ? (
          <SelectWrapper>
            <Select value={selectedType} onChange={handleTypeChange} autoFocus>
              {relationshipTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.display_name}
                </option>
              ))}
            </Select>
          </SelectWrapper>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            관계 변경
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={handleDelete}>
          삭제
        </Button>
      </Actions>
    </CardContainer>
  );
};

export default FriendCard;
