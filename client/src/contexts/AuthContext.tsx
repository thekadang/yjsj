/**
 * 인증 컨텍스트
 * 전역 인증 상태 관리
 */

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

// 사용자 인터페이스
export interface User {
  id: number;
  username: string;
  name: string;
  phone_number?: string;
  birthdate?: string;
  address?: string;
  detail_address?: string;
  zipcode?: string;
  death_certifier_1_name?: string;
  death_certifier_1_phone?: string;
  death_certifier_1_relation?: string;
  death_certifier_2_name?: string;
  death_certifier_2_phone?: string;
  death_certifier_2_relation?: string;
  insurance_status?: 'not_joined' | 'joined' | 'consultation_requested';
  insurance_name?: string;
  created_at?: string;
  updated_at?: string;
}

// 로그인 응답 인터페이스
interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

// 회원가입 응답 인터페이스
interface RegisterResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// 프로필 업데이트 응답 인터페이스
interface ProfileUpdateResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// 컨텍스트 값 인터페이스
interface AuthContextValue {
  // 상태
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 액션
  login: (username: string, password: string) => Promise<LoginResponse>;
  register: (data: RegisterData) => Promise<RegisterResponse>;
  logout: () => void;
  updateProfile: (userId: number, data: ProfileData) => Promise<ProfileUpdateResponse>;
  clearError: () => void;
  checkProfileComplete: () => boolean;
}

// 회원가입 데이터 인터페이스
interface RegisterData {
  username: string;
  password: string;
  name: string;
  phone_number: string;
}

// 프로필 데이터 인터페이스
interface ProfileData {
  birthdate?: string;
  address?: string;
  detail_address?: string;
  zipcode?: string;
  death_certifier_1_name?: string;
  death_certifier_1_phone?: string;
  death_certifier_1_relation?: string;
  death_certifier_2_name?: string;
  death_certifier_2_phone?: string;
  death_certifier_2_relation?: string;
  insurance_status?: 'not_joined' | 'joined' | 'consultation_requested';
  insurance_name?: string;
}

// 컨텍스트 생성
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// 로컬 스토리지 키
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;

// Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider 컴포넌트
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 초기화: 로컬 스토리지에서 사용자 정보 복원
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        // 손상된 데이터 정리
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 로그인
  const login = useCallback(async (username: string, password: string): Promise<LoginResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data: LoginResponse = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
        }
      } else {
        setError(data.error || '로그인에 실패했습니다.');
      }

      return data;
    } catch (err) {
      const errorMessage = '서버 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('Login error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 회원가입
  const register = useCallback(async (data: RegisterData): Promise<RegisterResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: RegisterResponse = await response.json();

      if (!result.success) {
        setError(result.error || '회원가입에 실패했습니다.');
      }

      return result;
    } catch (err) {
      const errorMessage = '서버 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('Register error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 로그아웃
  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }, []);

  // 프로필 업데이트
  const updateProfile = useCallback(async (
    userId: number,
    data: ProfileData
  ): Promise<ProfileUpdateResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/users/${userId}/profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      const result: ProfileUpdateResponse = await response.json();

      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
      } else {
        setError(result.error || '프로필 업데이트에 실패했습니다.');
      }

      return result;
    } catch (err) {
      const errorMessage = '서버 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('Profile update error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 에러 클리어
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 프로필 완성 여부 확인
  const checkProfileComplete = useCallback((): boolean => {
    if (!user) return false;
    return Boolean(user.birthdate);
  }, [user]);

  // 컨텍스트 값
  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    checkProfileComplete,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth 훅
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 인증 필수 컴포넌트 래퍼
interface RequireAuthProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  fallback = null,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // 또는 로딩 스피너
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default AuthContext;
