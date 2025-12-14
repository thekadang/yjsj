/**
 * 카카오 OAuth 콜백 페이지
 * 카카오 로그인 후 인가 코드를 받아 처리
 */

import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts';
import { kakaoAuthService } from '../services/kakaoAuthService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid ${({ theme }) => theme.colors.border};
  border-top-color: #FEE500;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Message = styled.p`
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.secondary};
`;

const ErrorMessage = styled.p`
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  max-width: 400px;
`;

const KakaoCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { socialLogin } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // React Strict Mode에서 useEffect 중복 실행 방지
  const isProcessingRef = useRef(false);

  useEffect(() => {
    const processKakaoLogin = async () => {
      // 이미 처리 중이면 중복 실행 방지
      if (isProcessingRef.current) {
        console.log('⏭️ 이미 카카오 로그인 처리 중, 중복 실행 방지');
        return;
      }
      isProcessingRef.current = true;

      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');

      // 에러 파라미터가 있는 경우 (사용자가 취소한 경우 등)
      if (errorParam) {
        const errorDescription = searchParams.get('error_description') || '로그인이 취소되었습니다.';
        setError(errorDescription);
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      // 인가 코드가 없는 경우
      if (!code) {
        setError('인가 코드가 없습니다.');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        console.log('🔄 카카오 로그인 처리 중...');

        // 백엔드로 인가 코드 전송
        const response = await kakaoAuthService.login(code);

        if (response.success && response.data) {
          const { token, user, isNewUser } = response.data;
          console.log('✅ 카카오 로그인 성공:', { userId: user.id, isNewUser });

          // AuthContext의 socialLogin 함수 호출
          socialLogin(user, token);

          // 신규 사용자인 경우 추가 정보 입력 안내
          if (isNewUser) {
            // 추가 정보 입력이 필요하다는 플래그 저장
            sessionStorage.setItem('needsAdditionalInfo', 'true');
            sessionStorage.setItem('kakaoNewUser', 'true');
          }

          // 메인 페이지로 이동
          navigate('/');
        } else {
          console.error('❌ 카카오 로그인 실패:', response.error);
          setError(response.error || '로그인 처리 중 오류가 발생했습니다.');
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (err) {
        console.error('❌ 카카오 로그인 오류:', err);
        setError('로그인 처리 중 오류가 발생했습니다.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    processKakaoLogin();
  }, [searchParams, socialLogin, navigate]);

  return (
    <Container>
      {error ? (
        <>
          <ErrorMessage>{error}</ErrorMessage>
          <Message>잠시 후 메인 페이지로 이동합니다...</Message>
        </>
      ) : (
        <>
          <LoadingSpinner />
          <Message>카카오 로그인 처리 중...</Message>
        </>
      )}
    </Container>
  );
};

export default KakaoCallback;
