import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme, GlobalStyles } from './styles';
import { AuthProvider } from './contexts';
import Home from './pages/Home';
import MySpace from './pages/MySpace';
import Friends from './pages/Friends';
import KakaoCallback from './pages/KakaoCallback';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/myspace" element={<MySpace />} />
            <Route path="/myspace/:userId" element={<MySpace />} />
            <Route path="/friends" element={<Friends />} />
            {/* 소셜 로그인 콜백 */}
            <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
