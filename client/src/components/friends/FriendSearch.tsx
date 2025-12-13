/**
 * FriendSearch 컴포넌트
 * 친구 검색 및 신청 기능을 제공합니다.
 */

import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Button, Input } from '../common';
import { friendService } from '../../services/friendService';
import type { SearchedUser, RelationshipType } from '../../types';

// Props 인터페이스
interface FriendSearchProps {
  onRequestSent?: () => void;
}

// 스타일드 컴포넌트
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const SearchForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const SearchField = styled.div`
  flex: 1;
  min-width: 150px;
`;

const SearchLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SearchButton = styled(Button)`
  align-self: flex-end;
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ResultCard = styled.div`
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

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background-color: ${({ theme }) => theme.colors.gray[400]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: white;
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

const UserPhone = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const StatusBadge = styled.span<{ $isFriend?: boolean; $isPending?: boolean }>`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

  ${({ $isFriend, $isPending, theme }) => {
    if ($isFriend) {
      return css`
        background-color: ${theme.colors.successLight};
        color: ${theme.colors.success};
      `;
    }
    if ($isPending) {
      return css`
        background-color: ${theme.colors.warningLight};
        color: ${theme.colors.warning};
      `;
    }
    return '';
  }}
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Select = styled.select`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background-color: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  outline: none;
  min-width: 100px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const HelpText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0;
`;

// FriendSearch 컴포넌트
export const FriendSearch: React.FC<FriendSearchProps> = ({ onRequestSent }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [results, setResults] = useState<SearchedUser[]>([]);
  const [relationshipTypes, setRelationshipTypes] = useState<RelationshipType[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<Record<number, number>>({});
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // 검색 실행
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() && !phone.trim()) {
      alert('이름 또는 연락처를 입력해주세요.');
      return;
    }

    setSearching(true);
    setHasSearched(true);

    try {
      // 관계 타입 로드 (처음만)
      if (relationshipTypes.length === 0) {
        const typesRes = await friendService.getRelationshipTypes();
        if (typesRes.success && typesRes.data) {
          const data = typesRes.data as { types?: RelationshipType[] };
          setRelationshipTypes(data.types || []);
        }
      }

      // 검색 실행
      const searchParams: { name?: string; phone?: string } = {};
      if (name.trim()) searchParams.name = name.trim();
      if (phone.trim()) searchParams.phone = phone.trim();

      const res = await friendService.searchUsers(searchParams);
      if (res.success && res.data) {
        const data = res.data as { users?: SearchedUser[] };
        setResults(data.users || []);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  // 친구 신청
  const handleSendRequest = async (userId: number) => {
    const relationshipTypeId = selectedTypes[userId];
    if (!relationshipTypeId) {
      alert('관계 타입을 선택해주세요.');
      return;
    }

    setSending(userId);
    try {
      const result = await friendService.sendFriendRequest(userId, relationshipTypeId);
      if (result.success) {
        // 결과 업데이트
        setResults((prev) =>
          prev.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  pendingRequest: { id: 0, status: 'PENDING', direction: 'sent' as const },
                }
              : user
          )
        );
        onRequestSent?.();
      } else {
        alert(result.error || '친구 신청에 실패했습니다.');
      }
    } catch (err) {
      console.error('Send request error:', err);
    } finally {
      setSending(null);
    }
  };

  // 연락처 마스킹
  const maskPhone = (phone?: string) => {
    if (!phone) return '';
    if (phone.length > 4) {
      return phone.slice(0, -4) + '****';
    }
    return phone;
  };

  return (
    <Container>
      <SearchForm onSubmit={handleSearch}>
        <SearchField>
          <SearchLabel>이름</SearchLabel>
          <Input
            type="text"
            placeholder="친구 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
        </SearchField>
        <SearchField>
          <SearchLabel>연락처</SearchLabel>
          <Input
            type="tel"
            placeholder="010-XXXX-XXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
          />
        </SearchField>
        <SearchButton type="submit" variant="primary" isLoading={searching}>
          검색
        </SearchButton>
      </SearchForm>

      <HelpText>이름과 연락처를 함께 검색하면 더 정확한 결과를 얻을 수 있습니다.</HelpText>

      {hasSearched && (
        <ResultsContainer>
          {results.length === 0 ? (
            <EmptyState>검색 결과가 없습니다.</EmptyState>
          ) : (
            results.map((user) => (
              <ResultCard key={user.id}>
                <UserInfo>
                  <Avatar>{user.name?.charAt(0) || user.username?.charAt(0) || '?'}</Avatar>
                  <UserDetails>
                    <UserName>{user.name || user.username}</UserName>
                    <UserPhone>{maskPhone(user.phone_number)}</UserPhone>
                  </UserDetails>
                </UserInfo>

                <Actions>
                  {user.isFriend ? (
                    <StatusBadge $isFriend>이미 친구</StatusBadge>
                  ) : user.pendingRequest ? (
                    <StatusBadge $isPending>
                      {user.pendingRequest.direction === 'sent' ? '신청 중' : '요청 받음'}
                    </StatusBadge>
                  ) : (
                    <>
                      <Select
                        value={selectedTypes[user.id] || ''}
                        onChange={(e) =>
                          setSelectedTypes((prev) => ({
                            ...prev,
                            [user.id]: Number(e.target.value),
                          }))
                        }
                      >
                        <option value="">관계 선택</option>
                        {relationshipTypes.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.display_name}
                          </option>
                        ))}
                      </Select>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSendRequest(user.id)}
                        disabled={sending === user.id || !selectedTypes[user.id]}
                        isLoading={sending === user.id}
                      >
                        친구 신청
                      </Button>
                    </>
                  )}
                </Actions>
              </ResultCard>
            ))
          )}
        </ResultsContainer>
      )}
    </Container>
  );
};

export default FriendSearch;
