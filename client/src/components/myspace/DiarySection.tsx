/**
 * 일기 섹션 컴포넌트
 * 일기 목록 및 작성 기능
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../common';

interface DiaryItem {
  id: number;
  content: string;
  audioUrl?: string | null;
  createdAt: string;
  visibility?: string[];
}

interface DiarySectionProps {
  diaries: DiaryItem[];
  isOwner: boolean;
  onCreateDiary?: () => void;
  onViewDiary?: (diaryId: number) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
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

const DiaryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const DiaryCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
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
`;

const DiaryMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.secondary};
`;

const DiaryDate = styled.span``;

const VisibilityBadges = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const VisibilityBadge = styled.span<{ $type: string }>`
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

const AudioIndicator = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.secondary};
`;

const LoadMoreButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.lg};
  width: 100%;
`;

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const DiarySection: React.FC<DiarySectionProps> = ({
  diaries,
  isOwner,
  onCreateDiary,
  onViewDiary,
  onLoadMore,
  hasMore
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleDiaryClick = (diaryId: number) => {
    if (onViewDiary) {
      onViewDiary(diaryId);
    } else {
      setExpandedId(expandedId === diaryId ? null : diaryId);
    }
  };

  return (
    <Container>
      <Header>
        <Title>📖 일기장</Title>
        {isOwner && (
          <Button variant="primary" size="sm" onClick={onCreateDiary}>
            일기 쓰기
          </Button>
        )}
      </Header>

      {diaries.length === 0 ? (
        <EmptyState>
          {isOwner
            ? '아직 작성한 일기가 없습니다. 첫 번째 일기를 작성해보세요!'
            : '공개된 일기가 없습니다.'}
        </EmptyState>
      ) : (
        <>
          <DiaryList>
            {diaries.map((diary) => (
              <DiaryCard key={diary.id} onClick={() => handleDiaryClick(diary.id)}>
                <DiaryContent
                  style={{
                    WebkitLineClamp: expandedId === diary.id ? 'unset' : 3
                  }}
                >
                  {diary.content}
                </DiaryContent>
                <DiaryMeta>
                  <DiaryDate>{formatDate(diary.createdAt)}</DiaryDate>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {diary.audioUrl && (
                      <AudioIndicator>🎵 음성</AudioIndicator>
                    )}
                    {diary.visibility && diary.visibility.length > 0 && (
                      <VisibilityBadges>
                        {diary.visibility.map((v, i) => (
                          <VisibilityBadge key={i} $type={v}>
                            {v}
                          </VisibilityBadge>
                        ))}
                      </VisibilityBadges>
                    )}
                  </div>
                </DiaryMeta>
              </DiaryCard>
            ))}
          </DiaryList>

          {hasMore && (
            <LoadMoreButton variant="outline" onClick={onLoadMore}>
              더 보기
            </LoadMoreButton>
          )}
        </>
      )}
    </Container>
  );
};

export default DiarySection;
