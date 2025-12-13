/**
 * 로그인 모달 컴포넌트
 * styled-components 기반으로 리팩토링됨
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Button,
  Input,
  FormGroup,
  Text,
  Link,
  KakaoIcon,
  GoogleIcon,
} from '../common';
import { useAuth } from '../../contexts/AuthContext';
import type { User } from '../../types';

// Props 인터페이스
interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess?: (user: User) => void;
  onSignUpClick?: () => void;
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

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.xxxl};
  font-size: ${({ theme }) => theme.typography.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Form = styled.form`
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SocialButtonsContainer = styled.div`
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FooterText = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// 로그인 모달 컴포넌트
const LoginModal: React.FC<LoginModalProps> = ({
  onClose,
  onLoginSuccess,
  onSignUpClick,
}) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 폼 제출 핸들러 - AuthContext의 login 함수 사용
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(username, password);

      if (result.success && result.user) {
        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        } else {
          onClose();
        }
      } else {
        setError(result.error || '로그인 실패');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 소셜 로그인 핸들러
  const handleSocialLogin = (provider: string) => {
    alert(`${provider} 로그인 준비 중입니다.`);
  };

  // 회원가입 클릭 핸들러
  const handleSignUpClick = () => {
    if (onSignUpClick) {
      onSignUpClick();
    } else {
      onClose();
      navigate('/signup');
    }
  };

  return (
    <Container>
      <Title>로그인</Title>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            size="md"
          />
        </FormGroup>

        <FormGroup>
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            size="md"
          />
        </FormGroup>

        {error && (
          <Text color="error" size="sm">
            {error}
          </Text>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          로그인
        </Button>
      </Form>

      <SocialButtonsContainer>
        <Button
          type="button"
          variant="kakao"
          size="lg"
          fullWidth
          onClick={() => handleSocialLogin('카카오')}
          leftIcon={<KakaoIcon />}
        >
          카카오 로그인
        </Button>

        <Button
          type="button"
          variant="google"
          size="lg"
          fullWidth
          onClick={() => handleSocialLogin('구글')}
          leftIcon={<GoogleIcon />}
        >
          구글 로그인
        </Button>
      </SocialButtonsContainer>

      <FooterText>
        계정이 없으신가요?{' '}
        <Link onClick={handleSignUpClick} underline>
          회원가입
        </Link>
      </FooterText>
    </Container>
  );
};

export default LoginModal;
