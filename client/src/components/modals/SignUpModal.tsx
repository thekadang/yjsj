/**
 * 회원가입 모달 컴포넌트
 * styled-components 기반으로 리팩토링됨
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Button,
  Input,
  FormGroup,
  Divider,
  Text,
  Link,
  KakaoIcon,
  GoogleIcon,
} from '../common';
import { kakaoAuthService } from '../../services/kakaoAuthService';

// Props 인터페이스
interface SignUpModalProps {
  onClose: () => void;
  onLoginClick: () => void;
}

// 폼 데이터 인터페이스
interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone_number: string;
}

// 스타일 컴포넌트
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SocialButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Form = styled.form``;

const FooterText = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

// 회원가입 모달 컴포넌트
const SignUpModal: React.FC<SignUpModalProps> = ({ onLoginClick }) => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone_number: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 입력 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          name: formData.name,
          phone_number: formData.phone_number,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('회원가입이 완료되었습니다! 로그인 해주세요.');
        onLoginClick();
      } else {
        setError(data.error || '회원가입 실패');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 카카오 로그인 핸들러
  const handleKakaoSignUp = async () => {
    try {
      setIsLoading(true);
      const response = await kakaoAuthService.getAuthUrl();

      if (response.success && response.data?.url) {
        // 카카오 인증 페이지로 리다이렉트
        window.location.href = response.data.url;
      } else {
        console.error('Failed to get Kakao auth URL');
        setError('카카오 로그인을 시작할 수 없습니다.');
      }
    } catch (err) {
      console.error('Kakao login error:', err);
      setError('카카오 로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 구글 로그인 핸들러 (추후 구현)
  const handleGoogleSignUp = () => {
    alert('구글 로그인 준비 중입니다.');
  };

  return (
    <Container>
      <ContentWrapper>
        <Title>회원가입하기</Title>

        {/* 소셜 로그인 버튼 */}
        <SocialButtonsContainer>
          <Button
            type="button"
            variant="kakao"
            size="lg"
            fullWidth
            onClick={handleKakaoSignUp}
            leftIcon={<KakaoIcon />}
            disabled={isLoading}
          >
            카카오로 시작하기
          </Button>

          <Button
            type="button"
            variant="google"
            size="lg"
            fullWidth
            onClick={handleGoogleSignUp}
            leftIcon={<GoogleIcon />}
          >
            구글로 시작하기
          </Button>
        </SocialButtonsContainer>

        <Divider>또는 이메일로 가입</Divider>

        {/* 이메일 회원가입 폼 */}
        <Form onSubmit={handleSubmit}>
          <FormGroup label="아이디" required>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              required
            />
          </FormGroup>

          <FormGroup label="비밀번호" required>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
            />
          </FormGroup>

          <FormGroup label="비밀번호 확인" required>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
            />
          </FormGroup>

          <FormGroup label="이름" required>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </FormGroup>

          <FormGroup label="전화번호" required>
            <Input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="010-0000-0000"
              fullWidth
              required
            />
          </FormGroup>

          {error && (
            <Text color="error" size="sm" align="center">
              {error}
            </Text>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            style={{ marginTop: '16px' }}
          >
            가입하기
          </Button>
        </Form>

        <FooterText>
          이미 계정이 있으신가요?{' '}
          <Link onClick={onLoginClick} $underline>
            로그인
          </Link>
        </FooterText>
      </ContentWrapper>
    </Container>
  );
};

export default SignUpModal;
