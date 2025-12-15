/**
 * 일기 작성 모달
 * 일기 내용 작성 + 공개 범위 선택 + 음성 녹음 기능
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Modal, ModalFooter } from '../common/Modal';
import { Button } from '../common';
import { createDiary } from '../../services/diaryService';
import { uploadAudio } from '../../services/mediaService';

interface DiaryWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MAX_CONTENT_LENGTH = 20000;

// 공개 범위 옵션 정의
type VisibilityOption = 'private' | 'family' | 'close_friend' | 'friend' | 'public';

interface VisibilityType {
  id: VisibilityOption;
  display_name: string;
  description: string;
  isExclusive: boolean; // 비공개, 전체공개는 단독 선택
}

const VISIBILITY_OPTIONS: VisibilityType[] = [
  { id: 'private', display_name: '비공개', description: '나만 볼 수 있어요', isExclusive: true },
  { id: 'family', display_name: '가족', description: '가족으로 등록된 친구만', isExclusive: false },
  { id: 'close_friend', display_name: '찐친', description: '찐친으로 등록된 친구만', isExclusive: false },
  { id: 'friend', display_name: '친구', description: '친구로 등록된 사람만', isExclusive: false },
  { id: 'public', display_name: '전체공개', description: '모든 사람이 볼 수 있어요', isExclusive: true },
];

// 펄스 애니메이션 (녹음 중 표시)
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

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
`;

const ContentTextarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-family: inherit;
  resize: vertical;
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

const VisibilitySection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const VisibilityCheckbox = styled.label<{ $checked: boolean; $type: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px solid;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  ${({ $checked, $type, theme }) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      '비공개': {
        bg: $checked ? '#78716c20' : 'transparent',
        border: $checked ? '#78716c' : theme.colors.border,
        text: $checked ? '#78716c' : theme.colors.text.secondary,
      },
      '가족': {
        bg: $checked ? '#8a654d20' : 'transparent',
        border: $checked ? '#8a654d' : theme.colors.border,
        text: $checked ? '#8a654d' : theme.colors.text.secondary,
      },
      '찐친': {
        bg: $checked ? '#b8906d40' : 'transparent',
        border: $checked ? '#b8906d' : theme.colors.border,
        text: $checked ? '#b8906d' : theme.colors.text.secondary,
      },
      '친구': {
        bg: $checked ? '#6d7f6d20' : 'transparent',
        border: $checked ? '#6d7f6d' : theme.colors.border,
        text: $checked ? '#6d7f6d' : theme.colors.text.secondary,
      },
      '전체공개': {
        bg: $checked ? '#a8a29e20' : 'transparent',
        border: $checked ? '#a8a29e' : theme.colors.border,
        text: $checked ? '#a8a29e' : theme.colors.text.secondary,
      },
    };
    const style = colors[$type] || colors['친구'];

    return css`
      background-color: ${style.bg};
      border-color: ${style.border};
      color: ${style.text};
    `;
  }}

  input {
    display: none;
  }
`;

const CheckIcon = styled.span<{ $checked: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;

  ${({ $checked }) =>
    $checked &&
    css`
      &::after {
        content: '✓';
      }
    `}
`;

const AudioSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const AudioControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const RecordButton = styled.button<{ $isRecording: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all ${({ theme }) => theme.transitions.fast};

  ${({ $isRecording, theme }) =>
    $isRecording
      ? css`
          background: ${theme.colors.error};
          color: white;
          animation: ${pulse} 1s ease-in-out infinite;
        `
      : css`
          background: ${theme.colors.primary};
          color: white;

          &:hover {
            transform: scale(1.05);
          }
        `}
`;

const RecordingTime = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: monospace;
`;

const AudioPreview = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const AudioPlayer = styled.audio`
  flex: 1;
`;

const DeleteAudioButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.error + '20'};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: ${({ theme }) => theme.colors.error + '40'};
  }
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.errorLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const HelperText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0;
`;

const DiaryWriteModal: React.FC<DiaryWriteModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // 폼 상태
  const [content, setContent] = useState('');
  const [selectedVisibility, setSelectedVisibility] = useState<VisibilityOption[]>([]);

  // 오디오 녹음 상태
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // UI 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 녹음 관련 ref
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // 모달 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setContent('');
      setSelectedVisibility([]);
      setAudioBlob(null);
      setAudioUrl(null);
      setRecordingTime(0);
      setIsRecording(false);
      setError(null);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [isOpen]);

  // 공개 범위 토글 (비공개/전체공개는 단독 선택, 나머지는 다중 선택)
  const handleVisibilityToggle = (option: VisibilityType) => {
    const optionId = option.id;

    if (option.isExclusive) {
      // 비공개 또는 전체공개 선택 시 → 다른 모든 선택 해제
      if (selectedVisibility.includes(optionId)) {
        setSelectedVisibility([]);
      } else {
        setSelectedVisibility([optionId]);
      }
    } else {
      // 가족, 찐친, 친구 선택 시 → 비공개/전체공개 해제 후 토글
      setSelectedVisibility(prev => {
        // 먼저 exclusive 옵션들 제거
        const filtered = prev.filter(id => id !== 'private' && id !== 'public');

        // 토글
        if (filtered.includes(optionId)) {
          return filtered.filter(id => id !== optionId);
        } else {
          return [...filtered, optionId];
        }
      });
    }
  };

  // 녹음 시작
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // 타이머 시작
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('녹음 시작 실패:', err);
      setError('마이크에 접근할 수 없습니다. 마이크 권한을 확인해주세요.');
    }
  }, []);

  // 녹음 중지
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  // 오디오 삭제
  const deleteAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
  };

  // 시간 포맷팅
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 일기 저장
  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('일기 내용을 입력해주세요.');
      return;
    }

    if (selectedVisibility.length === 0) {
      setError('공개 범위를 최소 1개 이상 선택해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let uploadedAudioUrl: string | undefined;

      // 오디오가 있으면 먼저 업로드
      if (audioBlob) {
        const audioFile = new File([audioBlob], 'diary_audio.webm', {
          type: 'audio/webm',
        });
        const uploadResponse = await uploadAudio(audioFile);
        if (uploadResponse.success && uploadResponse.data) {
          uploadedAudioUrl = `/uploads/${uploadResponse.data.filename}`;
        }
      }

      // 일기 저장 (공개 범위를 문자열 배열로 전달)
      const response = await createDiary(
        content.trim(),
        uploadedAudioUrl,
        selectedVisibility
      );

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.error || '일기 저장에 실패했습니다.');
      }
    } catch (err) {
      console.error('일기 저장 오류:', err);
      setError('일기 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 공개 범위 설명 텍스트
  const getVisibilityHelpText = () => {
    if (selectedVisibility.length === 0) {
      return '공개 범위를 선택해주세요.';
    }
    if (selectedVisibility.includes('private')) {
      return '이 일기는 나만 볼 수 있습니다.';
    }
    if (selectedVisibility.includes('public')) {
      return '이 일기는 모든 사람이 볼 수 있습니다.';
    }
    const selected = VISIBILITY_OPTIONS
      .filter(opt => selectedVisibility.includes(opt.id))
      .map(opt => opt.display_name);
    return `${selected.join(', ')}으로 등록된 친구만 볼 수 있습니다.`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="일기 쓰기"
      size="lg"
      closeOnOverlayClick={!loading}
      closeOnEsc={!loading}
    >
      <Container>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {/* 내용 입력 */}
        <Section>
          <SectionLabel>오늘의 이야기</SectionLabel>
          <ContentTextarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘 하루는 어땠나요? 소중한 순간을 기록해보세요..."
            maxLength={MAX_CONTENT_LENGTH}
            disabled={loading}
          />
          <CharacterCount $isOver={content.length > MAX_CONTENT_LENGTH}>
            {content.length} / {MAX_CONTENT_LENGTH}
          </CharacterCount>
        </Section>

        {/* 공개 범위 선택 */}
        <Section>
          <SectionLabel>공개 범위</SectionLabel>
          <HelperText>{getVisibilityHelpText()}</HelperText>
          <VisibilitySection>
            {VISIBILITY_OPTIONS.map((option) => (
              <VisibilityCheckbox
                key={option.id}
                $checked={selectedVisibility.includes(option.id)}
                $type={option.display_name}
              >
                <input
                  type="checkbox"
                  checked={selectedVisibility.includes(option.id)}
                  onChange={() => handleVisibilityToggle(option)}
                  disabled={loading}
                />
                <CheckIcon $checked={selectedVisibility.includes(option.id)} />
                {option.display_name}
                {!option.isExclusive && <span style={{ fontSize: '10px', marginLeft: '4px', opacity: 0.7 }}>✓다중</span>}
              </VisibilityCheckbox>
            ))}
          </VisibilitySection>
        </Section>

        {/* 음성 녹음 */}
        <Section>
          <SectionLabel>음성 메시지 (선택)</SectionLabel>
          <HelperText>목소리로 오늘의 감정을 담아보세요.</HelperText>
          <AudioSection>
            {!audioUrl ? (
              <AudioControls>
                <RecordButton
                  $isRecording={isRecording}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={loading}
                  type="button"
                >
                  {isRecording ? '■' : '●'}
                </RecordButton>
                <div>
                  {isRecording ? (
                    <>
                      <RecordingTime>{formatTime(recordingTime)}</RecordingTime>
                      <HelperText>녹음 중... 버튼을 누르면 중지됩니다.</HelperText>
                    </>
                  ) : (
                    <HelperText>버튼을 눌러 녹음을 시작하세요.</HelperText>
                  )}
                </div>
              </AudioControls>
            ) : (
              <AudioPreview>
                <AudioPlayer src={audioUrl} controls />
                <DeleteAudioButton onClick={deleteAudio} type="button">
                  ×
                </DeleteAudioButton>
              </AudioPreview>
            )}
          </AudioSection>
        </Section>
      </Container>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          취소
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          isLoading={loading}
          disabled={!content.trim() || selectedVisibility.length === 0}
        >
          저장
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DiaryWriteModal;
