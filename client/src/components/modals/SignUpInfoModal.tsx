/**
 * 회원가입 추가 정보 입력 모달 컴포넌트
 * 3단계 스텝 폼으로 구성됨
 * styled-components 기반으로 리팩토링됨
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Button,
  Input,
  FormGroup,
  Card,
  Text,
} from '../common';

// Props 인터페이스
interface SignUpInfoModalProps {
  onClose: () => void;
  onComplete: () => void;
  userId: number;
}

// 폼 데이터 인터페이스
interface FormData {
  birthdate: string;
  address: string;
  detail_address: string;
  zipcode: string;
  death_certifier_1_name: string;
  death_certifier_1_phone: string;
  death_certifier_1_relation: string;
  death_certifier_2_name: string;
  death_certifier_2_phone: string;
  death_certifier_2_relation: string;
  insurance_status: 'not_joined' | 'joined' | 'consultation_requested';
  insurance_name: string;
}

// 스타일 컴포넌트
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  padding: ${({ theme }) => theme.spacing.xl};
  overflow-y: auto;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SectionTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CertifierCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const CertifierTitle = styled.h4`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
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
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

// 회원가입 추가 정보 모달 컴포넌트
const SignUpInfoModal: React.FC<SignUpInfoModalProps> = ({
  onComplete,
  userId,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    birthdate: '',
    address: '',
    detail_address: '',
    zipcode: '',
    death_certifier_1_name: '',
    death_certifier_1_phone: '',
    death_certifier_1_relation: '',
    death_certifier_2_name: '',
    death_certifier_2_phone: '',
    death_certifier_2_relation: '',
    insurance_status: 'not_joined',
    insurance_name: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 입력 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 다음 단계로 이동
  const handleNext = () => {
    if (step === 1) {
      if (!formData.birthdate || !formData.address) {
        setError('필수 정보를 모두 입력해주세요.');
        return;
      }
    } else if (step === 2) {
      if (
        !formData.death_certifier_1_name ||
        !formData.death_certifier_1_phone ||
        !formData.death_certifier_2_name ||
        !formData.death_certifier_2_phone
      ) {
        setError('사망 확인인 2명의 정보를 모두 입력해주세요.');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  // 이전 단계로 이동
  const handlePrev = () => {
    setError('');
    setStep(step - 1);
  };

  // 폼 제출
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('정보가 성공적으로 저장되었습니다.');
        onComplete();
      } else {
        setError(data.error || '저장에 실패했습니다.');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: 기본 정보
  const renderStep1 = () => (
    <>
      <SectionTitle>기본 정보</SectionTitle>

      <FormGroup label="생년월일" required>
        <Input
          type="date"
          name="birthdate"
          value={formData.birthdate}
          onChange={handleChange}
          fullWidth
        />
      </FormGroup>

      <FormGroup label="주소" required>
        <Input
          type="text"
          name="address"
          placeholder="기본 주소"
          value={formData.address}
          onChange={handleChange}
          fullWidth
        />
      </FormGroup>

      <FormGroup label="상세 주소">
        <Input
          type="text"
          name="detail_address"
          placeholder="상세 주소"
          value={formData.detail_address}
          onChange={handleChange}
          fullWidth
        />
      </FormGroup>
    </>
  );

  // Step 2: 사망 확인인 정보
  const renderStep2 = () => (
    <>
      <SectionTitle>사망 확인인 정보 (필수)</SectionTitle>

      <Text size="sm" color="secondary" style={{ marginBottom: '16px' }}>
        본인의 사망 소식을 확인해 줄 지인 2명의 정보를 입력해주세요.
        <br />이 분들의 확인이 있어야 유언 및 메시지가 전달됩니다.
      </Text>

      <CertifierCard variant="default" padding="md">
        <CertifierTitle>확인인 1</CertifierTitle>

        <FormGroup>
          <Input
            type="text"
            name="death_certifier_1_name"
            placeholder="이름"
            value={formData.death_certifier_1_name}
            onChange={handleChange}
            fullWidth
          />
        </FormGroup>

        <FormGroup>
          <Input
            type="tel"
            name="death_certifier_1_phone"
            placeholder="연락처"
            value={formData.death_certifier_1_phone}
            onChange={handleChange}
            fullWidth
          />
        </FormGroup>

        <FormGroup>
          <Input
            type="text"
            name="death_certifier_1_relation"
            placeholder="관계 (예: 가족, 친구)"
            value={formData.death_certifier_1_relation}
            onChange={handleChange}
            fullWidth
          />
        </FormGroup>
      </CertifierCard>

      <CertifierCard variant="default" padding="md">
        <CertifierTitle>확인인 2</CertifierTitle>

        <FormGroup>
          <Input
            type="text"
            name="death_certifier_2_name"
            placeholder="이름"
            value={formData.death_certifier_2_name}
            onChange={handleChange}
            fullWidth
          />
        </FormGroup>

        <FormGroup>
          <Input
            type="tel"
            name="death_certifier_2_phone"
            placeholder="연락처"
            value={formData.death_certifier_2_phone}
            onChange={handleChange}
            fullWidth
          />
        </FormGroup>

        <FormGroup>
          <Input
            type="text"
            name="death_certifier_2_relation"
            placeholder="관계 (예: 가족, 친구)"
            value={formData.death_certifier_2_relation}
            onChange={handleChange}
            fullWidth
          />
        </FormGroup>
      </CertifierCard>
    </>
  );

  // Step 3: 보험/상조 정보
  const renderStep3 = () => (
    <>
      <SectionTitle>보험/상조 가입 여부 (선택)</SectionTitle>

      <FormGroup label="가입 상태">
        <Select
          name="insurance_status"
          value={formData.insurance_status}
          onChange={handleChange}
        >
          <option value="not_joined">미가입</option>
          <option value="joined">가입함</option>
          <option value="consultation_requested">상담 요청</option>
        </Select>
      </FormGroup>

      {formData.insurance_status === 'joined' && (
        <FormGroup label="가입 상품명/회사">
          <Input
            type="text"
            name="insurance_name"
            value={formData.insurance_name}
            onChange={handleChange}
            fullWidth
          />
        </FormGroup>
      )}
    </>
  );

  return (
    <Container>
      <ContentWrapper>
        <Title>추가 정보 입력 ({step}/3)</Title>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {error && (
          <Text color="error" size="sm" align="center">
            {error}
          </Text>
        )}

        <ButtonGroup>
          {step > 1 && (
            <Button variant="secondary" size="lg" onClick={handlePrev} fullWidth>
              이전
            </Button>
          )}
          {step < 3 ? (
            <Button variant="primary" size="lg" onClick={handleNext} fullWidth>
              다음
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              isLoading={isLoading}
              fullWidth
            >
              완료
            </Button>
          )}
        </ButtonGroup>
      </ContentWrapper>
    </Container>
  );
};

export default SignUpInfoModal;
