/**
 * 공통 Modal 컴포넌트
 * 3D 효과가 적용된 모달 다이얼로그입니다.
 * 기존 Modal3D를 대체합니다.
 */

import React, { useEffect, useCallback } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { createPortal } from 'react-dom';

// Modal 크기 타입
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// Modal Props 인터페이스
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: ModalSize;
  width?: string;
  height?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  title?: string;
  className?: string;
}

// 애니메이션 정의
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: perspective(1000px) rotateX(5deg) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: perspective(1000px) rotateX(1deg) translateY(0);
  }
`;

// 크기별 스타일 정의
const sizeStyles = {
  sm: css`
    width: 400px;
    max-width: 90vw;
  `,
  md: css`
    width: 500px;
    max-width: 90vw;
  `,
  lg: css`
    width: 700px;
    max-width: 90vw;
  `,
  xl: css`
    width: 1280px;
    max-width: 95vw;
  `,
  full: css`
    width: 95vw;
    height: 90vh;
  `,
};

// 오버레이 스타일
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.modalBackdrop};
  background-color: ${({ theme }) => theme.colors.overlayLight};
  animation: ${fadeIn} 0.2s ease;
`;

// 모달 컨테이너 스타일
const ModalContainer = styled.div<{
  $size: ModalSize;
  $customWidth?: string;
  $customHeight?: string;
}>`
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.modal};
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.8);
  transform: perspective(1000px) rotateX(1deg);
  animation: ${slideIn} 0.3s ease;

  /* 크기 스타일 */
  ${({ $size }) => sizeStyles[$size]}

  /* 커스텀 크기 */
  ${({ $customWidth }) =>
    $customWidth &&
    css`
      width: ${$customWidth};
    `}

  ${({ $customHeight }) =>
    $customHeight &&
    css`
      height: ${$customHeight};
    `}
`;

// 모달 헤더
const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

// 모달 타이틀
const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

// 닫기 버튼
const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.xl};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  z-index: 10;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

// 모달 바디
const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

// 모달 푸터
export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

// Modal 컴포넌트
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  width,
  height,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  title,
  className,
}) => {
  // ESC 키로 닫기
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEsc, onClose]
  );

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // 스크롤 복원
    };
  }, [isOpen, handleKeyDown]);

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  // 오버레이 클릭 핸들러
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Portal을 사용하여 body에 렌더링
  return createPortal(
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer
        $size={size}
        $customWidth={width}
        $customHeight={height}
        className={className}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {showCloseButton && (
          <CloseButton onClick={onClose} aria-label="닫기">
            &times;
          </CloseButton>
        )}

        {title && (
          <ModalHeader>
            <ModalTitle id="modal-title">{title}</ModalTitle>
          </ModalHeader>
        )}

        <ModalBody>{children}</ModalBody>
      </ModalContainer>
    </Overlay>,
    document.body
  );
};

export default Modal;
