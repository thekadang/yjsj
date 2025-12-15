/**
 * 친구 소식 섹션 컴포넌트
 * 친구들의 최신 일기 피드 표시
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Button } from '../common';
import { getFriendsFeed } from '../../services/diaryService';
import type { FeedDiary } from '../../types';

interface FriendNewsSectionProps {
  onViewDiary?: (diaryId: number) => void;
}

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const FeedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FeedCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 400px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const AuthorSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;
`;

const AuthorAvatar = styled.div<{ $imageUrl?: string | null }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $imageUrl }) =>
    $imageUrl
      ? `url(${$imageUrl}) center/cover`
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const AuthorInfo = styled.div`
  flex: 1;
`;

const AuthorName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const RelationshipBadge = styled.span<{ $type: string }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  background: ${({ $type, theme }) => {
    switch ($type) {
      case '가족': return theme.colors.error + '20';
      case '찐친': return theme.colors.kakao + '40';
      case '친구': return theme.colors.primary + '20';
      default: return theme.colors.border;
    }
  }};
  color: ${({ $type, theme }) => {
    switch ($type) {
      case '가족': return theme.colors.error;
      case '찐친': return '#B8860B';
      case '친구': return theme.colors.primary;
      default: return theme.colors.secondary;
    }
  }};
`;

const DiaryContent = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

const DiaryMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.secondary};
`;

const DiaryDate = styled.span``;

const AudioIndicator = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.secondary};
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmptyTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EmptyDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const LoadMoreButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.lg};
  width: 100%;
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.secondary};
`;

const ErrorState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.error};
`;

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes < 1 ? '방금 전' : `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  }
};

const FriendNewsSection: React.FC<FriendNewsSectionProps> = ({ onViewDiary }) => {
  const [feed, setFeed] = useState<FeedDiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // 피드 데이터 로드
  const loadFeed = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await getFriendsFeed(pageNum, 10);
      if (response.success && response.data) {
        if (append) {
          setFeed(prev => [...prev, ...response.data!]);
        } else {
          setFeed(response.data);
        }
        setHasMore(
          response.pagination
            ? response.pagination.page < response.pagination.totalPages
            : false
        );
        setPage(pageNum);
      } else {
        setError(response.error || '피드를 불러올 수 없습니다.');
      }
    } catch (err) {
      console.error('피드 로드 오류:', err);
      setError('피드를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  // 더 보기 클릭
  const handleLoadMore = () => {
    loadFeed(page + 1, true);
  };

  // 일기 클릭
  const handleDiaryClick = (diaryId: number) => {
    if (onViewDiary) {
      onViewDiary(diaryId);
    }
  };

  if (loading) {
    return (
      <Container>
        <Header>
        <Title>친구 소식</Title>
        </Header>
        <LoadingState>로딩 중...</LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
        <Title>친구 소식</Title>
        </Header>
        <ErrorState>{error}</ErrorState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>📰 친구 소식</Title>
      </Header>

      {feed.length === 0 ? (
        <EmptyState>
          <EmptyIcon>-</EmptyIcon>
          <EmptyTitle>아직 친구 소식이 없습니다</EmptyTitle>
          <EmptyDescription>
            친구가 일기를 공유하면 여기에 표시됩니다.
            <br />
            먼저 친구를 추가해보세요!
          </EmptyDescription>
        </EmptyState>
      ) : (
        <>
          <FeedList>
            {feed.map((diary) => (
              <FeedCard key={diary.id} onClick={() => handleDiaryClick(diary.id)}>
                <AuthorSection>
                  <AuthorAvatar $imageUrl={diary.author.profileImage}>
                    {!diary.author.profileImage && diary.author.name?.charAt(0)}
                  </AuthorAvatar>
                  <AuthorInfo>
                    <AuthorName>{diary.author.name}님의 일기</AuthorName>
                  </AuthorInfo>
                  <RelationshipBadge $type={diary.relationshipToMe}>
                    {diary.relationshipToMe}
                  </RelationshipBadge>
                </AuthorSection>

                <DiaryContent>{diary.content}</DiaryContent>

                <DiaryMeta>
                  <DiaryDate>{formatDate(diary.createdAt)}</DiaryDate>
                  {diary.audioUrl && (
                    <AudioIndicator>음성</AudioIndicator>
                  )}
                </DiaryMeta>
              </FeedCard>
            ))}
          </FeedList>

          {hasMore && (
            <LoadMoreButton
              variant="outline"
              onClick={handleLoadMore}
              isLoading={loadingMore}
            >
              더 보기
            </LoadMoreButton>
          )}
        </>
      )}
    </Container>
  );
};

export default FriendNewsSection;
