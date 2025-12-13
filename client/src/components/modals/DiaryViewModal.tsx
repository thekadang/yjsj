/**
 * 일기 상세 보기 모달
 * 일기 내용, 공개 범위, 오디오 재생, 수정/삭제 기능
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Modal, ModalFooter } from '../common/Modal';
import { Button } from '../common';
import { getDiaryById, deleteDiary } from '../../services/diaryService';
import type { Diary } from '../../types';

interface DiaryViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  diaryId: number | null;
  isOwner: boolean;
  onEdit?: (diary: Diary) => void;
  onDelete?: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const DiaryMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const DiaryDate = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const VisibilityBadges = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const VisibilityBadge = styled.span<{ $type: string }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
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
      default: return theme.colors.text.secondary;
    }
  }};
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const AuthorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const AuthorName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const DiaryContent = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: pre-wrap;
  word-break: break-word;
`;

const AudioSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const AudioLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const AudioPlayer = styled.audio`
  flex: 1;
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.error};
`;

const DeleteConfirm = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.errorLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
`;

const DeleteConfirmText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const DeleteConfirmButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  const ampm = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 || 12;

  return `${year}년 ${month}월 ${day}일 ${ampm} ${displayHour}:${minute.toString().padStart(2, '0')}`;
};

const DiaryViewModal: React.FC<DiaryViewModalProps> = ({
  isOpen,
  onClose,
  diaryId,
  isOwner,
  onEdit,
  onDelete,
}) => {
  const [diary, setDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 일기 데이터 로드
  const loadDiary = useCallback(async () => {
    if (!diaryId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getDiaryById(diaryId);
      if (response.success && response.data) {
        setDiary(response.data);
      } else {
        setError(response.error || '일기를 불러올 수 없습니다.');
      }
    } catch (err) {
      console.error('일기 로드 오류:', err);
      setError('일기를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [diaryId]);

  useEffect(() => {
    if (isOpen && diaryId) {
      loadDiary();
    }
  }, [isOpen, diaryId, loadDiary]);

  // 모달 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setDiary(null);
      setError(null);
      setShowDeleteConfirm(false);
    }
  }, [isOpen]);

  const handleEdit = () => {
    if (diary && onEdit) {
      onEdit(diary);
      onClose();
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!diaryId) return;

    setDeleting(true);
    try {
      const response = await deleteDiary(diaryId);
      if (response.success) {
        onDelete?.();
        onClose();
      } else {
        setError(response.error || '일기 삭제에 실패했습니다.');
        setShowDeleteConfirm(false);
      }
    } catch (err) {
      console.error('일기 삭제 오류:', err);
      setError('일기 삭제 중 오류가 발생했습니다.');
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // 로딩 상태
  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="📖 일기" size="lg">
        <LoadingState>로딩 중...</LoadingState>
      </Modal>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="📖 일기" size="lg">
        <ErrorState>
          <span>⚠️</span>
          <span>{error}</span>
        </ErrorState>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            닫기
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  // 일기가 없는 경우
  if (!diary) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="📖 일기" size="lg">
        <ErrorState>
          <span>📭</span>
          <span>일기를 찾을 수 없습니다.</span>
        </ErrorState>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            닫기
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  // 삭제 확인 상태
  if (showDeleteConfirm) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="📖 일기 삭제" size="sm">
        <DeleteConfirm>
          <DeleteConfirmText>
            정말 이 일기를 삭제하시겠습니까?<br />
            삭제된 일기는 복구할 수 없습니다.
          </DeleteConfirmText>
          <DeleteConfirmButtons>
            <Button
              variant="ghost"
              onClick={handleDeleteCancel}
              disabled={deleting}
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteConfirm}
              isLoading={deleting}
              style={{ background: '#e53935' }}
            >
              삭제
            </Button>
          </DeleteConfirmButtons>
        </DeleteConfirm>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📖 일기" size="lg">
      <Container>
        {/* 메타 정보 */}
        <DiaryMeta>
          <DiaryDate>{formatDate(diary.createdAt)}</DiaryDate>
          {diary.visibility && diary.visibility.length > 0 && (
            <VisibilityBadges>
              {diary.visibility.map((v, i) => (
                <VisibilityBadge key={i} $type={v.display_name}>
                  {v.display_name}
                </VisibilityBadge>
              ))}
            </VisibilityBadges>
          )}
        </DiaryMeta>

        {/* 작성자 정보 (본인 일기가 아닌 경우) */}
        {diary.author && !isOwner && (
          <AuthorInfo>
            <AuthorAvatar>
              {diary.author.name?.charAt(0) || '?'}
            </AuthorAvatar>
            <AuthorName>{diary.author.name}님의 일기</AuthorName>
          </AuthorInfo>
        )}

        {/* 내용 */}
        <DiaryContent>{diary.content}</DiaryContent>

        {/* 오디오 */}
        {diary.audioUrl && (
          <AudioSection>
            <AudioLabel>🎵 음성 메시지</AudioLabel>
            <AudioPlayer src={diary.audioUrl} controls />
          </AudioSection>
        )}
      </Container>

      <ModalFooter>
        {isOwner && (
          <>
            <Button variant="outline" onClick={handleDeleteClick}>
              삭제
            </Button>
            <Button variant="ghost" onClick={handleEdit}>
              수정
            </Button>
          </>
        )}
        <Button variant="primary" onClick={onClose}>
          닫기
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DiaryViewModal;
