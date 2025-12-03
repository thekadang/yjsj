import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
    onClose: () => void;
    onLoginSuccess?: (user: any) => void;
    onSignUpClick?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess, onSignUpClick }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                if (onLoginSuccess) {
                    onLoginSuccess(data.user);
                } else {
                    onClose();
                    navigate('/login');
                }
            } else {
                setError(data.error || '로그인 실패');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('서버 오류가 발생했습니다.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            fontFamily: "'Noto Sans KR', sans-serif",
        }}>
            <h2 style={{ marginBottom: '30px', fontSize: '2rem', fontWeight: 'bold' }}>로그인</h2>

            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="아이디"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontSize: '1rem'
                    }}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontSize: '1rem'
                    }}
                />

                {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#333',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1.1rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        marginBottom: '20px'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#555'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#333'}
                >
                    로그인
                </button>
            </form>

            <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <button
                    type="button"
                    onClick={() => alert('카카오 로그인 준비 중입니다.')}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#FEE500',
                        color: '#000',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3C5.925 3 1 6.925 1 11.775C1 14.85 3.025 17.55 6.05 19.075L4.925 23.25C4.825 23.625 5.25 23.925 5.575 23.725L10.55 20.425C11.025 20.5 11.5 20.55 12 20.55C18.075 20.55 23 16.625 23 11.775C23 6.925 18.075 3 12 3Z" />
                    </svg>
                    카카오 로그인
                </button>

                <button
                    type="button"
                    onClick={() => alert('구글 로그인 준비 중입니다.')}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#fff',
                        color: '#757575',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    구글 로그인
                </button>
            </div>

            <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
                계정이 없으신가요? <span
                    style={{ color: '#333', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => {
                        if (onSignUpClick) {
                            onSignUpClick();
                        } else {
                            onClose();
                            navigate('/signup');
                        }
                    }}
                >
                    회원가입
                </span>
            </div>
        </div>
    );
};

export default LoginModal;
