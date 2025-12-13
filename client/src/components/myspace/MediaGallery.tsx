/**
 * 미디어 갤러리 컴포넌트
 * 이미지/오디오 갤러리 표시
 */

import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '../common';
import type { Media } from '../../types';
import { uploadImage, uploadAudio, deleteMedia, downloadAudio } from '../../services/mediaService';

interface MediaGalleryProps {
  media: Media[];
  isOwner: boolean;
  onRefresh?: () => void;
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

const UploadButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TabContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.background};
  color: ${({ $active }) => $active ? 'white' : '#666'};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.border};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const MediaItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.border};
  cursor: pointer;

  &:hover {
    .overlay {
      opacity: 1;
    }
  }
`;

const MediaImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AudioItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const AudioIcon = styled.span`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const AudioName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.secondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
`;

const Overlay = styled.div.attrs({ className: 'overlay' })`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const OverlayButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const OverlayButton = styled.button<{ $variant?: 'delete' | 'download' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ $variant, theme }) => $variant === 'delete' ? theme.colors.error : theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.secondary};
`;

const HiddenInput = styled.input`
  display: none;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 32px;
  cursor: pointer;
`;

type MediaType = 'all' | 'image' | 'audio';

const MediaGallery: React.FC<MediaGalleryProps> = ({
  media,
  isOwner,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<MediaType>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const filteredMedia = activeTab === 'all'
    ? media
    : media.filter(m => m.type === activeTab);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      if (result.success && onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadAudio(file);
      if (result.success && onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('오디오 업로드 실패:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (mediaId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      const result = await deleteMedia(mediaId);
      if (result.success && onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  const handleDownload = (mediaId: number, format: 'opus' | 'mp3', e: React.MouseEvent) => {
    e.stopPropagation();
    downloadAudio(mediaId, format);
  };

  const imageCount = media.filter(m => m.type === 'image').length;
  const audioCount = media.filter(m => m.type === 'audio').length;

  return (
    <Container>
      <Header>
        <Title>🖼️ 미디어 갤러리</Title>
        {isOwner && (
          <UploadButtons>
            <Button
              variant="outline"
              size="sm"
              onClick={() => imageInputRef.current?.click()}
              disabled={isUploading}
            >
              📷 사진 업로드
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => audioInputRef.current?.click()}
              disabled={isUploading}
            >
              🎵 음성 업로드
            </Button>
          </UploadButtons>
        )}
      </Header>

      <HiddenInput
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />
      <HiddenInput
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        onChange={handleAudioUpload}
      />

      <TabContainer>
        <Tab $active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
          전체 ({media.length})
        </Tab>
        <Tab $active={activeTab === 'image'} onClick={() => setActiveTab('image')}>
          사진 ({imageCount})
        </Tab>
        <Tab $active={activeTab === 'audio'} onClick={() => setActiveTab('audio')}>
          음성 ({audioCount})
        </Tab>
      </TabContainer>

      {filteredMedia.length === 0 ? (
        <EmptyState>
          {isOwner
            ? '아직 업로드한 미디어가 없습니다.'
            : '공개된 미디어가 없습니다.'}
        </EmptyState>
      ) : (
        <Grid>
          {filteredMedia.map((item) => (
            <MediaItem
              key={item.id}
              onClick={() => item.type === 'image' && setSelectedImage(item.url)}
            >
              {item.type === 'image' ? (
                <MediaImage
                  src={item.thumbnailUrl || item.url}
                  alt={item.originalName}
                />
              ) : (
                <AudioItem>
                  <AudioIcon>🎵</AudioIcon>
                  <AudioName>{item.originalName}</AudioName>
                </AudioItem>
              )}
              <Overlay>
                <OverlayButtons>
                  {item.type === 'audio' && (
                    <>
                      <OverlayButton
                        $variant="download"
                        onClick={(e) => handleDownload(item.id, 'opus', e)}
                      >
                        📥 다운로드 (Opus)
                      </OverlayButton>
                      <OverlayButton
                        $variant="download"
                        onClick={(e) => handleDownload(item.id, 'mp3', e)}
                      >
                        📥 다운로드 (MP3)
                      </OverlayButton>
                    </>
                  )}
                  {isOwner && (
                    <OverlayButton
                      $variant="delete"
                      onClick={(e) => handleDelete(item.id, e)}
                    >
                      🗑️ 삭제
                    </OverlayButton>
                  )}
                </OverlayButtons>
              </Overlay>
            </MediaItem>
          ))}
        </Grid>
      )}

      {selectedImage && (
        <Modal onClick={() => setSelectedImage(null)}>
          <CloseButton onClick={() => setSelectedImage(null)}>×</CloseButton>
          <ModalImage src={selectedImage} alt="확대 이미지" />
        </Modal>
      )}
    </Container>
  );
};

export default MediaGallery;
