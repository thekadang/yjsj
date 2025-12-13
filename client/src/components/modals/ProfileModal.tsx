/**
 * 프로필 모달 컴포넌트
 * 확장 가능한 설정 기반 구조로 구현됨
 * 추후 필드 추가/변경 시 PROFILE_SECTIONS 설정만 수정하면 됨
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  Button,
  Input,
  FormGroup,
  Card,
  Text,
} from '../common';
import { userService } from '../../services/userService';
import type { ProfileData, ProfileUpdateData } from '../../services/userService';

// =====================
// 타입 정의
// =====================

// 필드 타입
type FieldType = 'text' | 'tel' | 'date' | 'select' | 'readonly';

// 선택 옵션 인터페이스
interface SelectOption {
  value: string;
  label: string;
}

// 필드 설정 인터페이스
interface FieldConfig {
  key: keyof ProfileData;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];  // select 타입일 때 사용
  showWhen?: {              // 조건부 표시
    field: keyof ProfileData;
    value: string | string[];
  };
  format?: (value: unknown) => string;  // 표시 형식 변환
}

// 섹션 설정 인터페이스
interface SectionConfig {
  id: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
  collapsible?: boolean;  // 접을 수 있는 섹션
}

// Props 인터페이스
interface ProfileModalProps {
  onClose: () => void;
  userId: number;
  initialEditMode?: boolean;
}

// =====================
// 프로필 섹션 설정 (확장 가능한 구조)
// 새 필드 추가 시 여기만 수정하면 됨
// =====================

const PROFILE_SECTIONS: SectionConfig[] = [
  {
    id: 'basic',
    title: '기본 정보',
    fields: [
      { key: 'username', label: '아이디', type: 'readonly' },
      { key: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요' },
      { key: 'phone_number', label: '연락처', type: 'tel', placeholder: '010-0000-0000' },
      { key: 'birthdate', label: '생년월일', type: 'date' },
    ],
  },
  {
    id: 'address',
    title: '주소 정보',
    collapsible: true,
    fields: [
      { key: 'zipcode', label: '우편번호', type: 'text', placeholder: '우편번호' },
      { key: 'address', label: '기본 주소', type: 'text', placeholder: '기본 주소를 입력하세요' },
      { key: 'detail_address', label: '상세 주소', type: 'text', placeholder: '상세 주소를 입력하세요' },
    ],
  },
  {
    id: 'insurance',
    title: '보험/상조 정보',
    collapsible: true,
    fields: [
      {
        key: 'insurance_status',
        label: '가입 상태',
        type: 'select',
        options: [
          { value: 'not_joined', label: '미가입' },
          { value: 'joined', label: '가입함' },
          { value: 'consultation_requested', label: '상담 요청' },
        ],
      },
      {
        key: 'insurance_name',
        label: '가입 상품/회사',
        type: 'text',
        placeholder: '가입한 상품명 또는 회사명',
        showWhen: { field: 'insurance_status', value: 'joined' },
      },
    ],
  },
  {
    id: 'certifier1',
    title: '사망 확인인 1',
    description: '본인의 사망 소식을 확인해 줄 지인 정보입니다.',
    collapsible: true,
    fields: [
      { key: 'death_certifier_1_name', label: '이름', type: 'text', placeholder: '이름' },
      { key: 'death_certifier_1_phone', label: '연락처', type: 'tel', placeholder: '연락처' },
      { key: 'death_certifier_1_relation', label: '관계', type: 'text', placeholder: '예: 가족, 친구' },
    ],
  },
  {
    id: 'certifier2',
    title: '사망 확인인 2',
    collapsible: true,
    fields: [
      { key: 'death_certifier_2_name', label: '이름', type: 'text', placeholder: '이름' },
      { key: 'death_certifier_2_phone', label: '연락처', type: 'tel', placeholder: '연락처' },
      { key: 'death_certifier_2_relation', label: '관계', type: 'text', placeholder: '예: 가족, 친구' },
    ],
  },
  {
    id: 'account',
    title: '계정 정보',
    fields: [
      {
        key: 'created_at',
        label: '가입일',
        type: 'readonly',
        format: (value) => {
          if (!value) return '-';
          return new Date(value as string).toLocaleDateString('ko-KR');
        },
      },
    ],
  },
];

// =====================
// 스타일 컴포넌트
// =====================

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 1;
`;

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing.xs};
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.div<{ $collapsible?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  cursor: ${({ $collapsible }) => ($collapsible ? 'pointer' : 'default')};
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CollapseIcon = styled.span<{ $collapsed: boolean }>`
  font-size: 12px;
  transition: transform 0.2s ease;
  transform: rotate(${({ $collapsed }) => ($collapsed ? '0deg' : '180deg')});
`;

const SectionContent = styled.div<{ $collapsed: boolean }>`
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'block')};
`;

const SectionDescription = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FieldRow = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }
`;

const ReadOnlyField = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-family: inherit;
  background-color: ${({ theme }) => theme.colors.background};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.background};
`;

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
`;

const ErrorCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

// =====================
// 메인 컴포넌트
// =====================

const ProfileModal: React.FC<ProfileModalProps> = ({
  onClose,
  userId,
  initialEditMode = false,
}) => {
  // 상태 관리
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // 프로필 데이터 로드
  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError('');

    const response = await userService.getProfile(userId);

    if (response.success && response.data) {
      setProfile(response.data);
      setFormData(response.data);
    } else {
      setError(response.error || '프로필을 불러오는데 실패했습니다.');
    }

    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 초기 데이터 로드에 필요한 패턴
    loadProfile();
  }, [loadProfile]);

  // 입력 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 섹션 토글
  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // 수정 모드 토글
  const handleEditToggle = () => {
    if (isEditMode) {
      // 취소 시 원래 데이터로 복원
      setFormData(profile || {});
    }
    setIsEditMode(!isEditMode);
    setError('');
  };

  // 저장 처리
  const handleSave = async () => {
    setIsSaving(true);
    setError('');

    // readonly 필드 제외하고 업데이트 데이터 구성
    const updateData: ProfileUpdateData = {};
    PROFILE_SECTIONS.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.type !== 'readonly') {
          const value = formData[field.key];
          if (value !== undefined) {
            (updateData as Record<string, unknown>)[field.key] = value;
          }
        }
      });
    });

    const response = await userService.updateProfile(userId, updateData);

    if (response.success && response.data) {
      setProfile(response.data);
      setFormData(response.data);
      setIsEditMode(false);
      alert('프로필이 저장되었습니다.');
    } else {
      setError(response.error || '저장에 실패했습니다.');
    }

    setIsSaving(false);
  };

  // 필드가 보여야 하는지 확인
  const shouldShowField = (field: FieldConfig): boolean => {
    if (!field.showWhen) return true;

    const currentValue = formData[field.showWhen.field];
    const targetValue = field.showWhen.value;

    if (Array.isArray(targetValue)) {
      return targetValue.includes(currentValue as string);
    }
    return currentValue === targetValue;
  };

  // 필드 값 가져오기 (표시용)
  const getDisplayValue = (field: FieldConfig): string => {
    const value = formData[field.key];

    if (value === null || value === undefined || value === '') {
      return '-';
    }

    if (field.format) {
      return field.format(value);
    }

    if (field.type === 'select' && field.options) {
      const option = field.options.find((opt) => opt.value === value);
      return option ? option.label : String(value);
    }

    return String(value);
  };

  // 필드 렌더링
  const renderField = (field: FieldConfig) => {
    if (!shouldShowField(field)) return null;

    const value = formData[field.key] ?? '';

    // 읽기 모드
    if (!isEditMode) {
      return (
        <FieldRow key={field.key}>
          <FormGroup label={field.label}>
            <ReadOnlyField>{getDisplayValue(field)}</ReadOnlyField>
          </FormGroup>
        </FieldRow>
      );
    }

    // 수정 모드
    if (field.type === 'readonly') {
      return (
        <FieldRow key={field.key}>
          <FormGroup label={field.label}>
            <ReadOnlyField>{getDisplayValue(field)}</ReadOnlyField>
          </FormGroup>
        </FieldRow>
      );
    }

    if (field.type === 'select' && field.options) {
      return (
        <FieldRow key={field.key}>
          <FormGroup label={field.label} required={field.required}>
            <Select
              name={field.key}
              value={String(value)}
              onChange={handleChange}
            >
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </FormGroup>
        </FieldRow>
      );
    }

    return (
      <FieldRow key={field.key}>
        <FormGroup label={field.label} required={field.required}>
          <Input
            type={field.type}
            name={field.key}
            placeholder={field.placeholder}
            value={String(value)}
            onChange={handleChange}
            fullWidth
          />
        </FormGroup>
      </FieldRow>
    );
  };

  // 섹션 렌더링
  const renderSection = (section: SectionConfig) => {
    const isCollapsed = collapsedSections.has(section.id);
    const visibleFields = section.fields.filter(shouldShowField);

    if (visibleFields.length === 0) return null;

    return (
      <Section key={section.id}>
        <SectionHeader
          $collapsible={section.collapsible}
          onClick={() => section.collapsible && toggleSection(section.id)}
        >
          <SectionTitle>{section.title}</SectionTitle>
          {section.collapsible && (
            <CollapseIcon $collapsed={isCollapsed}>▼</CollapseIcon>
          )}
        </SectionHeader>

        <SectionContent $collapsed={section.collapsible ? isCollapsed : false}>
          {section.description && (
            <SectionDescription>{section.description}</SectionDescription>
          )}
          {section.fields.map(renderField)}
        </SectionContent>
      </Section>
    );
  };

  // 오버레이 클릭 핸들러
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>내 정보</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>

        <Content>
          {isLoading ? (
            <LoadingOverlay>
              <Text>로딩 중...</Text>
            </LoadingOverlay>
          ) : error && !profile ? (
            <ErrorCard variant="default" padding="lg">
              <Text color="error" align="center">
                {error}
              </Text>
              <Button
                variant="secondary"
                onClick={loadProfile}
                style={{ marginTop: '16px' }}
                fullWidth
              >
                다시 시도
              </Button>
            </ErrorCard>
          ) : (
            <>
              {error && (
                <ErrorCard variant="default" padding="md">
                  <Text color="error" size="sm">
                    {error}
                  </Text>
                </ErrorCard>
              )}
              {PROFILE_SECTIONS.map(renderSection)}
            </>
          )}
        </Content>

        {!isLoading && profile && (
          <Footer>
            {isEditMode ? (
              <>
                <Button variant="secondary" onClick={handleEditToggle}>
                  취소
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  isLoading={isSaving}
                >
                  저장
                </Button>
              </>
            ) : (
              <Button variant="primary" onClick={handleEditToggle}>
                수정하기
              </Button>
            )}
          </Footer>
        )}
      </ModalContainer>
    </Overlay>
  );
};

export default ProfileModal;
