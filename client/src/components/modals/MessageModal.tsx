/**
 * 남기는 말 관리 모달
 * 새 메시지 작성 + 이력 관리
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal, ModalFooter } from '../common/Modal';
import { Button } from '../common';
import {
  getCurrentMessage,
  getMessageHistory,
  createMessage,
  activateMessage,
  deleteMessage,
  hideCurrentMessage,
  type UserMessage
} from '../../services/messageService';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MAX_MESSAGE_LENGTH = 100;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SectionLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TabContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: none;
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  color: ${({ $active, theme }) => ($active ? 'white' : theme.colors.text.secondary)};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.surface)};
  }
`;

const MessageInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-family: inherit;
  resize: none;
  outline: none;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CharacterCount = styled.div<{ $isOver: boolean }>`
  text-align: right;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ $isOver, theme }) =>
    $isOver ? theme.colors.error : theme.colors.text.tertiary};
`;

const CurrentMessageBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
`;

const CurrentLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CurrentContent = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  line-height: 1.5;
`;

const NoMessageText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-style: italic;
  margin: 0;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-height: 300px;
  overflow-y: auto;
`;

const HistoryItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary + '10' : theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary : 'transparent'};
`;

const HistoryContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const HistoryText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 4px 0;
  word-break: break-word;
`;

const HistoryDate = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const HistoryActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-left: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
`;

const ActionButton = styled.button<{ $variant?: 'activate' | 'delete' }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border: none;
  background: ${({ $variant, theme }) =>
    $variant === 'delete' ? theme.colors.error + '20' : theme.colors.primary + '20'};
  color: ${({ $variant, theme }) =>
    $variant === 'delete' ? theme.colors.error : theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ $variant, theme }) =>
      $variant === 'delete' ? theme.colors.error + '40' : theme.colors.primary + '40'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ActiveBadge = styled.span`
  padding: ${({ theme }) => `2px ${theme.spacing.sm}`};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 10px;
  margin-left: ${({ theme }) => theme.spacing.sm};
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.errorLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const EmptyHistory = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const HideButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  margin-left: auto;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }
`;

type TabType = 'write' | 'history';

const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('write');
  const [content, setContent] = useState('');
  const [currentMessage, setCurrentMessage] = useState<UserMessage | null>(null);
  const [history, setHistory] = useState<UserMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로드
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // 모달 닫힐 때 초기화
  useEffect(() => {
    if (!isOpen) {
      setContent('');
      setActiveTab('write');
      setError(null);
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [currentRes, historyRes] = await Promise.all([
        getCurrentMessage(),
        getMessageHistory()
      ]);

      if (currentRes.success) {
        setCurrentMessage(currentRes.data);
      }
      if (historyRes.success) {
        setHistory(historyRes.data);
      }
    } catch (err) {
      console.error('데이터 로드 오류:', err);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    if (content.length > MAX_MESSAGE_LENGTH) {
      setError(`최대 ${MAX_MESSAGE_LENGTH}자까지 입력 가능합니다.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await createMessage(content.trim());

      if (response.success) {
        setContent('');
        await loadData();
        onSuccess();
      } else {
        setError(response.error || '저장에 실패했습니다.');
      }
    } catch (err) {
      console.error('저장 오류:', err);
      setError('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (messageId: number) => {
    setLoading(true);
    try {
      const response = await activateMessage(messageId);
      if (response.success) {
        await loadData();
        onSuccess();
      }
    } catch (err) {
      console.error('활성화 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (messageId: number) => {
    if (!confirm('이 메시지를 삭제하시겠습니까?')) return;

    setLoading(true);
    try {
      const response = await deleteMessage(messageId);
      if (response.success) {
        await loadData();
        if (currentMessage?.id === messageId) {
          onSuccess();
        }
      }
    } catch (err) {
      console.error('삭제 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHide = async () => {
    if (!confirm('현재 남기는 말을 숨기시겠습니까?')) return;

    setLoading(true);
    try {
      const response = await hideCurrentMessage();
      if (response.success) {
        setCurrentMessage(null);
        await loadData();
        onSuccess();
      }
    } catch (err) {
      console.error('숨기기 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="남기는 말 관리"
      size="md"
      closeOnOverlayClick={!loading}
      closeOnEsc={!loading}
    >
      <Container>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {/* 현재 남기는 말 표시 */}
        <Section>
          <SectionLabel>
            현재 남기는 말
            {currentMessage && (
              <HideButton onClick={handleHide} disabled={loading}>
                숨기기
              </HideButton>
            )}
          </SectionLabel>
          <CurrentMessageBox>
            {currentMessage ? (
              <>
                <CurrentContent>{currentMessage.content}</CurrentContent>
                <CurrentLabel>{formatDate(currentMessage.created_at)}</CurrentLabel>
              </>
            ) : (
              <NoMessageText>아직 작성한 남기는 말이 없습니다.</NoMessageText>
            )}
          </CurrentMessageBox>
        </Section>

        {/* 탭 */}
        <TabContainer>
          <Tab $active={activeTab === 'write'} onClick={() => setActiveTab('write')}>
            새로 작성
          </Tab>
          <Tab $active={activeTab === 'history'} onClick={() => setActiveTab('history')}>
            이력 ({history.length})
          </Tab>
        </TabContainer>

        {/* 탭 컨텐츠 */}
        {activeTab === 'write' ? (
          <Section>
            <SectionLabel>새 남기는 말 (최대 {MAX_MESSAGE_LENGTH}자)</SectionLabel>
            <MessageInput
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="나를 한 문장으로 표현해보세요..."
              maxLength={MAX_MESSAGE_LENGTH + 10}
              disabled={loading}
            />
            <CharacterCount $isOver={content.length > MAX_MESSAGE_LENGTH}>
              {content.length} / {MAX_MESSAGE_LENGTH}
            </CharacterCount>
          </Section>
        ) : (
          <Section>
            <SectionLabel>남기는 말 이력</SectionLabel>
            <HistoryList>
              {history.length === 0 ? (
                <EmptyHistory>아직 작성한 남기는 말이 없습니다.</EmptyHistory>
              ) : (
                history.map((item) => (
                  <HistoryItem key={item.id} $isActive={item.is_active}>
                    <HistoryContent>
                      <HistoryText>
                        {item.content}
                        {item.is_active && <ActiveBadge>현재</ActiveBadge>}
                      </HistoryText>
                      <HistoryDate>{formatDate(item.created_at)}</HistoryDate>
                    </HistoryContent>
                    <HistoryActions>
                      {!item.is_active && (
                        <ActionButton
                          $variant="activate"
                          onClick={() => handleActivate(item.id)}
                          disabled={loading}
                        >
                          사용
                        </ActionButton>
                      )}
                      <ActionButton
                        $variant="delete"
                        onClick={() => handleDelete(item.id)}
                        disabled={loading}
                      >
                        삭제
                      </ActionButton>
                    </HistoryActions>
                  </HistoryItem>
                ))
              )}
            </HistoryList>
          </Section>
        )}
      </Container>

      <ModalFooter>
        <Button variant="outline" onClick={onClose} disabled={loading}>
          닫기
        </Button>
        {activeTab === 'write' && (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || !content.trim() || content.length > MAX_MESSAGE_LENGTH}
          >
            {loading ? '저장 중...' : '저장하기'}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default MessageModal;
