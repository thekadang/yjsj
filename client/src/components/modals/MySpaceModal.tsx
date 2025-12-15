/**
 * 마이스페이스 모달 - 올드머니 디자인
 * Home에서 "내 공간" 클릭 시 열리는 모달
 * designSystem.ts 기반 세련된 웜톤 디자인
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Modal } from '../common';
import { FriendList, FriendRequestList, FriendSearch } from '../friends';
import DiaryWriteModal from './DiaryWriteModal';
import DiaryViewModal from './DiaryViewModal';
import MessageModal from './MessageModal';
import { useAuth } from '../../contexts/AuthContext';
import { getMySpace } from '../../services/myspaceService';
import { getMyDiaries } from '../../services/diaryService';
import { uploadImage } from '../../services/mediaService';
import type { MySpaceData, Diary } from '../../types';

interface MySpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 탭 타입
type TabType = 'diary' | 'friendNews' | 'friendManage' | 'friendRequest';

// 모달 내부 컨테이너 (패딩 제거)
const ModalInner = styled.div`
  margin: -20px;
`;

// 올드머니 스타일
const ElementorStyles = styled.div`
  font-family: 'Pretendard Variable', 'Pretendard', sans-serif;
  color: #292524;
  /* 프로필 이미지 영역 - 영정사진 표준 비율 11:14 */
  .profile-image-container {
    width: 200px;
    height: 255px;
    margin: 0 auto 15px;
    border-radius: 16px;
    overflow: hidden;
    border: 3px solid #ebe0d1;
    cursor: pointer;
    position: relative;
    box-shadow: 0 8px 24px rgba(41, 37, 36, 0.1);
    transition: all 0.3s ease;

    &:hover {
      border-color: #b8906d;
      box-shadow: 0 12px 32px rgba(184, 144, 109, 0.2);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f8f5ef;
      color: #a8a29e;

      .icon {
        font-size: 48px;
        margin-bottom: 10px;
      }
    }

    &:hover .overlay {
      opacity: 1;
    }

    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(41, 37, 36, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fefdfb;
      opacity: 0;
      transition: all 0.3s ease;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
  }

  /* 탭 네비게이션 */
  .tab-navigation {
    display: flex;
    border-bottom: 1px solid #d6d3d1;
    margin-bottom: 20px;
    gap: 8px;

    .tab {
      padding: 12px 24px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
      transition: all 0.3s ease;
      color: #78716c;
      font-weight: 500;
      letter-spacing: 0.3px;

      &:hover {
        color: #b8906d;
        background: rgba(184, 144, 109, 0.05);
        border-radius: 12px 12px 0 0;
      }

      &.active {
        color: #b8906d;
        border-bottom-color: #b8906d;
        font-weight: 600;
      }
    }
  }

  /* 일기 목록 */
  .diary-list {
    .diary-item {
      padding: 20px;
      border: 1px solid #e7e5e4;
      border-radius: 16px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #fdfcf9;

      &:hover {
        border-color: #b8906d;
        box-shadow: 0 4px 12px rgba(184, 144, 109, 0.15);
        transform: translateY(-2px);
      }

      .diary-date {
        font-size: 13px;
        color: #a8a29e;
        margin-bottom: 8px;
        font-weight: 500;
      }

      .diary-content {
        color: #292524;
        line-height: 1.6;
        font-size: 15px;
      }

      .diary-visibility {
        display: flex;
        gap: 6px;
        margin-top: 12px;

        .badge {
          font-size: 12px;
          padding: 4px 12px;
          border-radius: 12px;
          background: #f5f0e8;
          color: #8a654d;
          font-weight: 500;
        }
      }
    }

    .empty-message {
      text-align: center;
      padding: 40px;
      color: #a8a29e;
      font-size: 15px;
      line-height: 1.6;
    }

    /* 페이지네이션 */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e7e5e4;

      .page-btn {
        padding: 8px 16px;
        border: 1px solid #d6d3d1;
        border-radius: 12px;
        background: #fdfcf9;
        color: #b8906d;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s ease;

        &:hover:not(:disabled) {
          background: #b8906d;
          color: #fefdfb;
          border-color: #b8906d;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(184, 144, 109, 0.2);
        }

        &:disabled {
          border-color: #e7e5e4;
          color: #d6d3d1;
          cursor: not-allowed;
          background: #f8f5ef;
        }
      }

      .page-info {
        font-size: 14px;
        color: #57534e;
        font-weight: 600;
      }
    }
  }

  /* 버튼 스타일 */
  .action-button {
    padding: 10px 20px;
    border: 1px solid #b8906d;
    border-radius: 12px;
    background: #fdfcf9;
    color: #b8906d;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    letter-spacing: 0.3px;

    &:hover {
      background: #b8906d;
      color: #fefdfb;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(184, 144, 109, 0.2);
    }

    &.primary {
      background: #b8906d;
      color: #fefdfb;

      &:hover {
        background: #a67c5d;
        box-shadow: 0 6px 16px rgba(184, 144, 109, 0.3);
      }
    }
  }

  /* 남기는 말 영역 - 프로필 사진과 동일한 가로 크기 */
  .epitaph-section {
    width: 200px;
    margin: 15px auto 0;
    padding: 16px;
    background: linear-gradient(135deg, #fdfcf9 0%, #f5f0e8 100%);
    border: 1px solid #ebe0d1;
    border-radius: 16px;
    box-sizing: border-box;
    box-shadow: 0 2px 8px rgba(41, 37, 36, 0.05);

    .epitaph-label {
      font-weight: 600;
      margin-bottom: 10px;
      color: #292524;
      font-size: 14px;
      letter-spacing: 0.3px;
    }

    .epitaph-content {
      color: #57534e;
      line-height: 1.7;
      min-height: 60px;
      font-size: 14px;
    }

    .epitaph-placeholder {
      color: #a8a29e;
      font-style: italic;
      font-size: 13px;
    }
  }

  /* 친구 통계 - 프로필 사진과 동일한 가로 크기 */
  .friend-stats {
    width: 200px;
    margin: 15px auto 0;
    display: flex;
    justify-content: space-around;
    padding: 16px;
    background: linear-gradient(135deg, #fdfcf9 0%, #f5f0e8 100%);
    border: 1px solid #ebe0d1;
    border-radius: 16px;
    box-sizing: border-box;
    box-shadow: 0 2px 8px rgba(41, 37, 36, 0.05);

    .stat-item {
      text-align: center;

      .stat-count {
        font-size: 28px;
        font-weight: 700;
        color: #b8906d;
        line-height: 1.2;
      }

      .stat-label {
        font-size: 12px;
        color: #78716c;
        margin-top: 6px;
        font-weight: 500;
        letter-spacing: 0.3px;
      }
    }
  }

  /* 미디어 갤러리 */
  .media-gallery {
    margin-top: 20px;

    .gallery-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      h4 {
        margin: 0;
        font-size: 16px;
        color: #292524;
        font-weight: 600;
      }

      .upload-buttons {
        display: flex;
        gap: 10px;
      }
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;

      .media-item {
        aspect-ratio: 1;
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        border: 2px solid #ebe0d1;
        transition: all 0.3s ease;

        &:hover {
          border-color: #b8906d;
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(184, 144, 109, 0.2);
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    .gallery-empty {
      text-align: center;
      padding: 40px;
      color: #a8a29e;
      border: 2px dashed #d6d3d1;
      border-radius: 16px;
      background: #fdfcf9;
      font-size: 14px;
    }
  }

  /* 닫기 버튼 */
  .close-button {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 36px;
    height: 36px;
    border: none;
    background: #a8a29e;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fefdfb;
    font-size: 20px;
    transition: all 0.3s ease;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(41, 37, 36, 0.15);

    &:hover {
      transform: scale(1.1) rotate(90deg);
      background: #78716c;
      box-shadow: 0 4px 12px rgba(41, 37, 36, 0.25);
    }
  }

  /* 타이틀 중앙 정렬 */
  .elementor-element-b741582 {
    text-align: center;
  }

  /* 프로필 이미지 너비 100% */
  .profile-image-container {
    width: 100%;
    max-width: 200px;
  }

  /* 남기는 말 너비 100% */
  .epitaph-section {
    width: 100%;
    max-width: none;
  }

  /* 친구 통계 너비 100% */
  .friend-stats {
    width: 100%;
    max-width: none;
  }
`;

// 파일 입력 숨기기
const HiddenInput = styled.input`
  display: none;
`;

const MySpaceModal: React.FC<MySpaceModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('diary');
  const [mySpaceData, setMySpaceData] = useState<MySpaceData | null>(null);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diaryPage, setDiaryPage] = useState(1);
  const [totalDiaryPages, setTotalDiaryPages] = useState(1);
  const DIARIES_PER_PAGE = 4;

  // 일기 모달 상태
  const [showDiaryWriteModal, setShowDiaryWriteModal] = useState(false);
  const [showDiaryViewModal, setShowDiaryViewModal] = useState(false);
  const [selectedDiaryId, setSelectedDiaryId] = useState<number | null>(null);

  // 남기는 말 모달 상태
  const [showMessageModal, setShowMessageModal] = useState(false);

  // 파일 입력 ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // 데이터 로드
  const loadData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getMySpace();
      if (response.success && response.data) {
        setMySpaceData(response.data);

        const diaryResponse = await getMyDiaries(1, DIARIES_PER_PAGE);
        if (diaryResponse.success && diaryResponse.data) {
          setDiaries(diaryResponse.data);
          setDiaryPage(1);
          setTotalDiaryPages(diaryResponse.pagination?.totalPages || 1);
        }
      } else {
        setError(response.error || '데이터를 불러올 수 없습니다.');
      }
    } catch (err) {
      console.error('데이터 로드 오류:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen && user) {
      loadData();
    }
  }, [isOpen, user, loadData]);

  useEffect(() => {
    if (!isOpen) {
      setActiveTab('diary');
      setShowDiaryWriteModal(false);
      setShowDiaryViewModal(false);
      setShowMessageModal(false);
      setSelectedDiaryId(null);
    }
  }, [isOpen]);

  // 일기 페이지 이동
  const goToDiaryPage = async (page: number) => {
    if (page < 1 || page > totalDiaryPages) return;

    const response = await getMyDiaries(page, DIARIES_PER_PAGE);
    if (response.success && response.data) {
      setDiaries(response.data);
      setDiaryPage(page);
      setTotalDiaryPages(response.pagination?.totalPages || 1);
    }
  };

  // 일기 작성 모달
  const handleCreateDiary = () => setShowDiaryWriteModal(true);
  const handleDiaryWriteSuccess = () => {
    setDiaryPage(1);
    loadData();
  };

  // 일기 상세 보기
  const handleViewDiary = (diaryId: number) => {
    setSelectedDiaryId(diaryId);
    setShowDiaryViewModal(true);
  };

  // 일기 삭제
  const handleDiaryDelete = () => {
    setDiaryPage(1);
    loadData();
  };

  // 프로필 이미지 변경
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await uploadImage(file);
      if (response.success) {
        loadData();
      }
    } catch (err) {
      console.error('이미지 업로드 오류:', err);
    }
  };

  // 날짜 포맷
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 데이터 준비
  const profileImage = mySpaceData?.profileImage || null;
  const userName = mySpaceData?.user.name || user?.name || '사용자';
  const epitaph = mySpaceData?.epitaph || null;
  const friendStats = mySpaceData?.friendStats || {};
  const mediaGallery = mySpaceData?.mediaGallery || [];

  // 탭 콘텐츠 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case 'diary':
        return (
          <div className="diary-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0 }}>일기장</h4>
              <button className="action-button primary" onClick={handleCreateDiary}>
                일기 쓰기
              </button>
            </div>
            <div className="diary-list">
              {diaries.length > 0 ? (
                <>
                  {diaries.map(diary => (
                    <div
                      key={diary.id}
                      className="diary-item"
                      onClick={() => handleViewDiary(diary.id)}
                    >
                      <div className="diary-date">{formatDate(diary.createdAt)}</div>
                      <div className="diary-content">
                        {diary.content.length > 100
                          ? diary.content.substring(0, 100) + '...'
                          : diary.content}
                      </div>
                      {diary.visibility && diary.visibility.length > 0 && (
                        <div className="diary-visibility">
                          {diary.visibility.map((v, idx) => (
                            <span key={idx} className="badge">{v.display_name}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {/* 페이지네이션 */}
                  {totalDiaryPages > 1 && (
                    <div className="pagination">
                      <button
                        className="page-btn"
                        onClick={() => goToDiaryPage(diaryPage - 1)}
                        disabled={diaryPage === 1}
                      >
                        ◀ 이전
                      </button>
                      <span className="page-info">
                        {diaryPage} / {totalDiaryPages}
                      </span>
                      <button
                        className="page-btn"
                        onClick={() => goToDiaryPage(diaryPage + 1)}
                        disabled={diaryPage === totalDiaryPages}
                      >
                        다음 ▶
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-message">
                  아직 작성한 일기가 없습니다.<br />첫 번째 일기를 작성해보세요!
                </div>
              )}
            </div>

            {/* 미디어 갤러리 */}
            <div className="media-gallery">
              <div className="gallery-header">
                <h4>미디어 갤러리</h4>
              </div>
              {mediaGallery.length > 0 ? (
                <div className="gallery-grid">
                  {mediaGallery.slice(0, 8).map((media, idx) => (
                    <div key={idx} className="media-item">
                      <img src={media.thumbnailUrl || media.url} alt={media.filename} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="gallery-empty">
                  아직 업로드한 미디어가 없습니다.
                </div>
              )}
            </div>
          </div>
        );

      case 'friendNews':
        return (
          <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
            친구들의 최신 소식이 여기에 표시됩니다.
          </div>
        );

      case 'friendManage':
        return <FriendList />;

      case 'friendRequest':
        return (
          <div>
            <FriendSearch />
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ marginBottom: '10px', textAlign: 'left' }}>받은 신청</h4>
              <FriendRequestList type="received" />
            </div>
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ marginBottom: '10px', textAlign: 'left' }}>보낸 신청</h4>
              <FriendRequestList type="sent" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // 로딩/에러 상태
  if (loading && isOpen) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="full" showCloseButton={false}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
          로딩 중...
        </div>
      </Modal>
    );
  }

  if (error && isOpen) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="full" showCloseButton={false}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', color: 'red' }}>
          {error}
        </div>
      </Modal>
    );
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="full" showCloseButton={false}>
        <ModalInner>
          <ElementorStyles>
            {/* 기존 Elementor 디자인 구조 유지 */}
            <div className="elementor elementor-33">
              <div className="elementor-element elementor-element-e779b6b e-flex e-con-boxed e-con e-parent" style={{ position: 'relative' }}>
                {/* 닫기 버튼 */}
                <button className="close-button" onClick={onClose}>×</button>

                <div className="e-con-inner">
                  {/* 제목 */}
                  <div className="elementor-element elementor-element-b741582 elementor-widget elementor-widget-heading">
                    <h2 className="elementor-heading-title elementor-size-default">
                      {userName}님의 공간
                    </h2>
                  </div>

                  {/* 2컬럼 레이아웃 */}
                  <div className="elementor-element elementor-element-3b60109 e-con-full e-flex e-con e-child">
                    {/* 왼쪽 패널: 프로필 */}
                    <div className="elementor-element elementor-element-9bff52b e-con-full e-flex e-con e-child">
                      {/* 프로필 이미지 */}
                      <div className="profile-image-container" onClick={handleImageClick}>
                        {profileImage ? (
                          <>
                            <img src={profileImage.thumbnailUrl || profileImage.url} alt="프로필" />
                          </>
                        ) : (
                          <div className="placeholder">
                            <span className="icon"></span>
                            <span>프로필 사진</span>
                          </div>
                        )}
                      </div>
                      <HiddenInput
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />

                      <div className="elementor-element elementor-element-01d3117 elementor-widget elementor-widget-text-editor">
                        <button 
                          className="action-button" 
                          onClick={handleImageClick}
                          style={{ 
                            width: '100%', 
                            marginTop: '12px',
                            padding: '10px 20px',
                            fontSize: '14px'
                          }}
                        >
                          사진 변경
                        </button>
                      </div>

                      {/* 남기는 말 */}
                      <div className="epitaph-section">
                        <div className="epitaph-label">남기는 말</div>
                        {epitaph ? (
                          <div className="epitaph-content">{epitaph}</div>
                        ) : (
                          <div className="epitaph-placeholder">
                            나를 표현하는 한 마디를 남겨보세요.<br />
                            (최대 100자)
                          </div>
                        )}
                        <button
                          className="action-button"
                          style={{ marginTop: '10px', width: '100%' }}
                          onClick={() => setShowMessageModal(true)}
                        >
                          남기는 말 관리
                        </button>
                      </div>

                      {/* 친구 통계 */}
                      <div className="friend-stats">
                        <div className="stat-item">
                          <div className="stat-count">{friendStats.family || 0}</div>
                          <div className="stat-label">가족</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-count">{friendStats.bestFriend || 0}</div>
                          <div className="stat-label">찐친</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-count">{friendStats.friend || 0}</div>
                          <div className="stat-label">친구</div>
                        </div>
                      </div>
                    </div>

                    {/* 오른쪽 패널: 콘텐츠 */}
                    <div className="elementor-element elementor-element-8b6855b e-con-full e-flex e-con e-child">
                      {/* 탭 네비게이션 */}
                      <div className="tab-navigation">
                        <div
                          className={`tab ${activeTab === 'diary' ? 'active' : ''}`}
                          onClick={() => setActiveTab('diary')}
                        >
                          일기
                        </div>
                        <div
                          className={`tab ${activeTab === 'friendNews' ? 'active' : ''}`}
                          onClick={() => setActiveTab('friendNews')}
                        >
                          친구소식
                        </div>
                        <div
                          className={`tab ${activeTab === 'friendManage' ? 'active' : ''}`}
                          onClick={() => setActiveTab('friendManage')}
                        >
                          친구관리
                        </div>
                        <div
                          className={`tab ${activeTab === 'friendRequest' ? 'active' : ''}`}
                          onClick={() => setActiveTab('friendRequest')}
                        >
                          친구신청
                        </div>
                      </div>

                      {/* 탭 콘텐츠 */}
                      <div className="elementor-element elementor-element-4564ea1 elementor-widget elementor-widget-text-editor" style={{ padding: '15px' }}>
                        {renderTabContent()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ElementorStyles>
        </ModalInner>
      </Modal>

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
        isOwner={true}
        onDelete={handleDiaryDelete}
      />

      {/* 남기는 말 관리 모달 */}
      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        onSuccess={loadData}
      />
    </>
  );
};

export default MySpaceModal;
