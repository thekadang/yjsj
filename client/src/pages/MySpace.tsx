/**
 * 마이스페이스 페이지
 * 사용자 개인 공간 - 프로필, 일기, 미디어, 친구 관리
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from '../components/layout';
import {
  ProfileSection,
  DiarySection,
  MediaGallery,
  FriendStats,
  SpaceNavigation,
  FriendNewsSection,
} from '../components/myspace';
import type { NavTab } from '../components/myspace';
import { FriendList, FriendRequestList, FriendSearch } from '../components/friends';
import { DiaryWriteModal, DiaryViewModal, MessageModal } from '../components/modals';
import { useAuth } from '../contexts/AuthContext';
import { getMySpace, getUserSpace } from '../services/myspaceService';
import { getMyDiaries } from '../services/diaryService';
import type { MySpaceData, UserSpaceData, Diary } from '../types';

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const SpaceContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const MiniHomepyWindow = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const WindowHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const WindowDot = styled.span<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ color }) => color};
`;

const WindowTitle = styled.span`
  color: white;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-left: ${({ theme }) => theme.spacing.md};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 70vh;
`;

const LeftPanel = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

// 인라인 스타일 대체 - 친구 신청 섹션
const FriendRequestSection = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const RequestSectionTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const RequestSectionDivider = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

// 관계 표시 카드
const RelationshipCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
`;

const RelationshipText = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const MySpace: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<NavTab>('diary');
  const [mySpaceData, setMySpaceData] = useState<MySpaceData | null>(null);
  const [userSpaceData, setUserSpaceData] = useState<UserSpaceData | null>(null);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diaryPage, setDiaryPage] = useState(1);
  const [hasMoreDiaries, setHasMoreDiaries] = useState(false);

  // 모달 상태
  const [showDiaryWriteModal, setShowDiaryWriteModal] = useState(false);
  const [showDiaryViewModal, setShowDiaryViewModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedDiaryId, setSelectedDiaryId] = useState<number | null>(null);

  // 현재 보고 있는 공간이 내 공간인지 확인
  const isOwner = !userId || (user !== null && user.id === parseInt(userId));

  // 데이터 로드
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (isOwner && user) {
        // 내 공간 로드
        const response = await getMySpace();
        if (response.success && response.data) {
          setMySpaceData(response.data);

          // 일기 목록 로드
          const diaryResponse = await getMyDiaries(1, 10);
          if (diaryResponse.success && diaryResponse.data) {
            setDiaries(diaryResponse.data);
            setHasMoreDiaries(
              diaryResponse.pagination
                ? diaryResponse.pagination.page < diaryResponse.pagination.totalPages
                : false
            );
          }
        } else {
          setError(response.error || '데이터를 불러올 수 없습니다.');
        }
      } else if (userId) {
        // 다른 사용자 공간 로드
        const response = await getUserSpace(parseInt(userId));
        if (response.success && response.data) {
          setUserSpaceData(response.data);
        } else {
          setError(response.error || '데이터를 불러올 수 없습니다.');
        }
      } else {
        // 로그인 필요
        navigate('/login');
        return;
      }
    } catch (err) {
      console.error('데이터 로드 오류:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [isOwner, user, userId, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 더 많은 일기 로드
  const loadMoreDiaries = async () => {
    const nextPage = diaryPage + 1;
    const response = await getMyDiaries(nextPage, 10);
    if (response.success && response.data) {
      setDiaries(prev => [...prev, ...response.data!]);
      setDiaryPage(nextPage);
      setHasMoreDiaries(
        response.pagination
          ? response.pagination.page < response.pagination.totalPages
          : false
      );
    }
  };

  // 일기 작성 모달 열기
  const handleCreateDiary = () => {
    setShowDiaryWriteModal(true);
  };

  // 일기 작성 성공
  const handleDiaryWriteSuccess = () => {
    // 일기 목록 새로고침
    setDiaryPage(1);
    loadData();
  };

  // 일기 상세 보기 모달 열기
  const handleViewDiary = (diaryId: number) => {
    setSelectedDiaryId(diaryId);
    setShowDiaryViewModal(true);
  };

  // 일기 삭제 성공
  const handleDiaryDelete = () => {
    // 일기 목록 새로고침
    setDiaryPage(1);
    loadData();
  };

  // 남기는 말 관리 모달 열기
  const handleEpitaphEdit = () => {
    setShowMessageModal(true);
  };

  // 남기는 말 저장 성공
  const handleMessageSuccess = () => {
    loadData();
  };

  // 렌더링할 데이터 결정
  const spaceData = isOwner ? mySpaceData : userSpaceData;
  const profileImage = spaceData?.profileImage || null;
  const userName = isOwner
    ? mySpaceData?.user.name || user?.name || '사용자'
    : userSpaceData?.user.name || '사용자';
  const epitaph = spaceData?.epitaph || null;
  const friendStats = isOwner ? mySpaceData?.friendStats || {} : {};
  const mediaGallery = spaceData?.mediaGallery || [];

  // 일기 데이터 준비
  const displayDiaries = isOwner
    ? diaries.map(d => ({
        id: d.id,
        content: d.content,
        audioUrl: d.audioUrl,
        createdAt: d.createdAt,
        visibility: d.visibility?.map(v => v.display_name) || []
      }))
    : userSpaceData?.accessibleDiaries.map(d => ({
        id: d.id,
        content: d.content,
        audioUrl: null,
        createdAt: d.createdAt,
        visibility: []
      })) || [];

  // 탭 컨텐츠 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case 'diary':
        return (
          <DiarySection
            diaries={displayDiaries}
            isOwner={isOwner}
            onCreateDiary={handleCreateDiary}
            onViewDiary={handleViewDiary}
            onLoadMore={loadMoreDiaries}
            hasMore={hasMoreDiaries}
          />
        );
      case 'friendNews':
        return (
          <FriendNewsSection onViewDiary={handleViewDiary} />
        );
      case 'friendManage':
        return isOwner ? <FriendList /> : null;
      case 'friendRequest':
        return isOwner ? (
          <FriendRequestSection>
            <FriendSearch />
            <RequestSectionDivider>
              <RequestSectionTitle>받은 신청</RequestSectionTitle>
              <FriendRequestList type="received" />
            </RequestSectionDivider>
            <RequestSectionDivider>
              <RequestSectionTitle>보낸 신청</RequestSectionTitle>
              <FriendRequestList type="sent" />
            </RequestSectionDivider>
          </FriendRequestSection>
        ) : null;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Header variant="authenticated" />
        <SpaceContainer>
          <LoadingContainer>로딩 중...</LoadingContainer>
        </SpaceContainer>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Header variant="authenticated" />
        <SpaceContainer>
          <ErrorContainer>
            <span>⚠️</span>
            <span>{error}</span>
          </ErrorContainer>
        </SpaceContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header variant="authenticated" />
      <SpaceContainer>
        <MiniHomepyWindow>
          <WindowHeader>
            <WindowDot color="#ff5f56" />
            <WindowDot color="#ffbd2e" />
            <WindowDot color="#27ca3f" />
            <WindowTitle>
              {userName}님의 공간
            </WindowTitle>
          </WindowHeader>

          <ContentGrid>
            <LeftPanel>
              <ProfileSection
                profileImage={profileImage}
                epitaph={epitaph}
                userName={userName}
                isOwner={isOwner}
                onImageChange={loadData}
                onEpitaphEdit={handleEpitaphEdit}
              />

              {isOwner && (
                <FriendStats stats={friendStats} isOwner={isOwner} />
              )}

              {!isOwner && userSpaceData?.relationship && (
                <RelationshipCard>
                  <RelationshipText>
                    나와의 관계: <strong>{userSpaceData.relationship.displayName}</strong>
                  </RelationshipText>
                </RelationshipCard>
              )}
            </LeftPanel>

            <RightPanel>
              <SpaceNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                pendingRequestCount={0}
                isOwner={isOwner}
              />

              {renderTabContent()}

              {activeTab === 'diary' && (
                <MediaGallery
                  media={mediaGallery}
                  isOwner={isOwner}
                  onRefresh={loadData}
                />
              )}
            </RightPanel>
          </ContentGrid>
        </MiniHomepyWindow>
      </SpaceContainer>

      {/* 일기 작성 모달 */}
      <DiaryWriteModal
        isOpen={showDiaryWriteModal}
        onClose={() => setShowDiaryWriteModal(false)}
        onSuccess={handleDiaryWriteSuccess}
      />

      {/* 일기 상세 보기 모달 */}
      <DiaryViewModal
        isOpen={showDiaryViewModal}
        onClose={() => {
          setShowDiaryViewModal(false);
          setSelectedDiaryId(null);
        }}
        diaryId={selectedDiaryId}
        isOwner={isOwner}
        onDelete={handleDiaryDelete}
      />

      {/* 남기는 말 관리 모달 */}
      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        onSuccess={handleMessageSuccess}
      />
    </PageContainer>
  );
};

export default MySpace;
