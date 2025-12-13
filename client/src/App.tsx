import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme, GlobalStyles } from './styles';
import { AuthProvider } from './contexts';
import Home from './pages/Home';
import MySpace from './pages/MySpace';
import Friends from './pages/Friends';

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
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
