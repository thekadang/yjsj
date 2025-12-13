/**
 * FriendRequestList 컴포넌트
 * 받은/보낸 친구 신청 목록을 표시합니다.
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '../common';
import { friendService } from '../../services/friendService';
import type { ReceivedFriendRequest, SentFriendRequest, RelationshipType } from '../../types';

// Props 인터페이스
interface FriendRequestListProps {
  type: 'received' | 'sent';
  onRequestHandled?: () => void;
}

// 스타일드 컴포넌트
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const RequestCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Avatar = styled.div<{ $isReceived?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: white;

  ${({ $isReceived }) =>
    $isReceived
      ? css`
          background-color: #3498db;
        `
      : css`
          background-color: #9b59b6;
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

const ProposedRelationship = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const RequestDate = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

  ${({ $status, theme }) => {
    switch ($status) {
      case 'ACCEPTED':
        return css`
          background-color: ${theme.colors.successLight};
          color: ${theme.colors.success};
        `;
      case 'REJECTED':
        return css`
          background-color: ${theme.colors.errorLight};
          color: ${theme.colors.error};
        `;
      default:
        return css`
          background-color: ${theme.colors.warningLight};
          color: ${theme.colors.warning};
        `;
    }
  }}
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const SelectLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Select = styled.select`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background-color: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  outline: none;
  min-width: 120px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
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

// FriendRequestList 컴포넌트
export const FriendRequestList: React.FC<FriendRequestListProps> = ({
  type,
  onRequestHandled,
}) => {
  const [receivedRequests, setReceivedRequests] = useState<ReceivedFriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<SentFriendRequest[]>([]);
  const [relationshipTypes, setRelationshipTypes] = useState<RelationshipType[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  // 데이터 로드 함수
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // 관계 타입 로드
      const typesRes = await friendService.getRelationshipTypes();
      if (typesRes.success && typesRes.data) {
        const data = typesRes.data as { types?: RelationshipType[] };
        setRelationshipTypes(data.types || []);
      }

      // 요청 목록 로드
      if (type === 'received') {
        const res = await friendService.getReceivedRequests();
        if (res.success && res.data) {
          const data = res.data as { requests?: ReceivedFriendRequest[] };
          setReceivedRequests(data.requests || []);
        }
      } else {
        const res = await friendService.getSentRequests();
        if (res.success && res.data) {
          const data = res.data as { requests?: SentFriendRequest[] };
          setSentRequests(data.requests || []);
        }
      }
    } catch (err) {
      console.error('Load requests error:', err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  // 데이터 로드 실행
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // 친구 신청 수락
  const handleAccept = async (requestId: number) => {
    const relationshipTypeId = selectedTypes[requestId];
    if (!relationshipTypeId) {
      alert('관계 타입을 선택해주세요.');
      return;
    }

    setProcessing(requestId);
    try {
      const result = await friendService.respondToRequest(requestId, 'accept', relationshipTypeId);
      if (result.success) {
        setReceivedRequests((prev) => prev.filter((r) => r.id !== requestId));
        onRequestHandled?.();
      }
    } catch (err) {
      console.error('Accept request error:', err);
    } finally {
      setProcessing(null);
    }
  };

  // 친구 신청 거절
  const handleReject = async (requestId: number) => {
    if (!window.confirm('친구 신청을 거절하시겠습니까?')) return;

    setProcessing(requestId);
    try {
      const result = await friendService.respondToRequest(requestId, 'reject');
      if (result.success) {
        setReceivedRequests((prev) => prev.filter((r) => r.id !== requestId));
        onRequestHandled?.();
      }
    } catch (err) {
      console.error('Reject request error:', err);
    } finally {
      setProcessing(null);
    }
  };

  // 친구 신청 취소
  const handleCancel = async (requestId: number) => {
    if (!window.confirm('친구 신청을 취소하시겠습니까?')) return;

    setProcessing(requestId);
    try {
      const result = await friendService.cancelFriendRequest(requestId);
      if (result.success) {
        setSentRequests((prev) => prev.filter((r) => r.id !== requestId));
        onRequestHandled?.();
      }
    } catch (err) {
      console.error('Cancel request error:', err);
    } finally {
      setProcessing(null);
    }
  };

  // 로딩 상태
  if (loading) {
    return <LoadingState>목록을 불러오는 중...</LoadingState>;
  }

  // 받은 친구 신청
  if (type === 'received') {
    if (receivedRequests.length === 0) {
      return (
        <EmptyState>
          <EmptyIcon>📬</EmptyIcon>
          <EmptyText>받은 친구 신청이 없습니다.</EmptyText>
        </EmptyState>
      );
    }

    return (
      <Container>
        {receivedRequests.map((request) => (
          <RequestCard key={request.id}>
            <UserInfo>
              <Avatar $isReceived>{request.sender_name?.charAt(0) || '?'}</Avatar>
              <UserDetails>
                <UserName>{request.sender_name || request.sender_username}</UserName>
                <ProposedRelationship>
                  {request.proposed_relationship}(으)로 친구 신청
                </ProposedRelationship>
                <RequestDate>{formatDate(request.created_at)}</RequestDate>
              </UserDetails>
            </UserInfo>

            <Actions>
              <SelectWrapper>
                <SelectLabel>나에게 이 친구는:</SelectLabel>
                <Select
                  value={selectedTypes[request.id] || ''}
                  onChange={(e) =>
                    setSelectedTypes((prev) => ({
                      ...prev,
                      [request.id]: Number(e.target.value),
                    }))
                  }
                >
                  <option value="">선택하세요</option>
                  {relationshipTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.display_name}
                    </option>
                  ))}
                </Select>
              </SelectWrapper>
              <ActionRow>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAccept(request.id)}
                  disabled={processing === request.id || !selectedTypes[request.id]}
                  isLoading={processing === request.id}
                >
                  수락
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReject(request.id)}
                  disabled={processing === request.id}
                >
                  거절
                </Button>
              </ActionRow>
            </Actions>
          </RequestCard>
        ))}
      </Container>
    );
  }

  // 보낸 친구 신청
  if (sentRequests.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>📤</EmptyIcon>
        <EmptyText>보낸 친구 신청이 없습니다.</EmptyText>
      </EmptyState>
    );
  }

  return (
    <Container>
      {sentRequests.map((request) => (
        <RequestCard key={request.id}>
          <UserInfo>
            <Avatar $isReceived={false}>
              {request.receiver_name?.charAt(0) || '?'}
            </Avatar>
            <UserDetails>
              <UserName>{request.receiver_name || request.receiver_username}</UserName>
              <ProposedRelationship>
                {request.proposed_relationship}(으)로 신청함
              </ProposedRelationship>
              <RequestDate>{formatDate(request.created_at)}</RequestDate>
            </UserDetails>
          </UserInfo>

          <Actions>
            {request.status === 'PENDING' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancel(request.id)}
                disabled={processing === request.id}
                isLoading={processing === request.id}
              >
                신청 취소
              </Button>
            ) : (
              <StatusBadge $status={request.status}>
                {request.status === 'ACCEPTED' ? '수락됨' : '거절됨'}
              </StatusBadge>
            )}
          </Actions>
        </RequestCard>
      ))}
    </Container>
  );
};

export default FriendRequestList;
