import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  CircularProgress
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './styles/theme';
import { AuthProvider, useAuth } from './services/firebase/AuthContext';
import Home from './apps/home/home';
import LoginModal from './components/LoginModal';
import Toolbar from './components/Toolbar';
import './i18n';

function App() {
  const { user, loading } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  // Al completar loading, abre modal si no hay user
  useEffect(() => {
    if (!loading) {
      setModalOpen(!user);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Toolbar />
      <Router>
        <Routes>
          <Route path="/*" element={<Home />} />
        </Routes>
      </Router>
      <LoginModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        disableClose={true}
      />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
