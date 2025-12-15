/**
 * 프로필 섹션 컴포넌트
 * 프로필 이미지 및 남기는 말 표시
 */

import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '../common';
import { uploadImage } from '../../services/mediaService';

interface ProfileSectionProps {
  profileImage: {
    url: string;
    thumbnailUrl: string;
  } | null;
  epitaph: string | null;
  userName: string;
  isOwner: boolean;
  onImageChange?: () => void;
  onEpitaphEdit?: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ImageContainer = styled.div`
  position: relative;
  width: 200px;
  height: 255px; /* 11:14 비율 - 영정사진 표준 (200 * 14/11 ≈ 255) */
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${({ theme }) => theme.spacing.sm};
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  opacity: 0;
  transition: opacity 0.2s ease;

  ${ImageContainer}:hover & {
    opacity: 1;
  }
`;

const UserName = styled.h2`
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const EpitaphContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  max-width: 100%;
  text-align: center;
`;

const EpitaphLabel = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EpitaphText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
`;

const EpitaphPlaceholder = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary};
  font-style: italic;
`;

const EditButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const HiddenInput = styled.input`
  display: none;
`;

const ProfileSection: React.FC<ProfileSectionProps> = ({
  profileImage,
  epitaph,
  userName,
  isOwner,
  onImageChange,
  onEpitaphEdit
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (isOwner && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      if (result.success && onImageChange) {
        onImageChange();
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container>
      <ImageContainer onClick={handleImageClick}>
        {profileImage ? (
          <ProfileImage
            src={profileImage.thumbnailUrl || profileImage.url}
            alt={`${userName}의 프로필`}
          />
        ) : (
          <PlaceholderImage>
            <span></span>
            <span>프로필 사진</span>
          </PlaceholderImage>
        )}
        {isOwner && (
          <ImageOverlay>
            {isUploading ? '업로드 중...' : '사진 변경'}
          </ImageOverlay>
        )}
      </ImageContainer>

      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <UserName>{userName}</UserName>

      <EpitaphContainer>
        <EpitaphLabel>남기는 말</EpitaphLabel>
        {epitaph ? (
          <EpitaphText>{epitaph}</EpitaphText>
        ) : (
          <EpitaphPlaceholder>
            {isOwner
              ? '나를 표현하는 한 마디를 남겨보세요. (최대 100자)'
              : '아직 남기는 말이 없습니다.'}
          </EpitaphPlaceholder>
        )}
        {isOwner && (
          <EditButton variant="outline" size="sm" onClick={onEpitaphEdit}>
            {epitaph ? '수정하기' : '작성하기'}
          </EditButton>
        )}
      </EpitaphContainer>
    </Container>
  );
};

export default ProfileSection;
