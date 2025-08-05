import { useState } from 'react';
import {
  Box,
  Divider,
  Stack,
  Button,
  Typography,
  Avatar
} from '@mui/material';
import GoogleIcon   from '@mui/icons-material/Google';
import GitHubIcon   from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import PersonIcon   from '@mui/icons-material/Person';
import { useAuth }  from '../../services/firebase/AuthContext';
import { useTranslation } from 'react-i18next';

import LoginForm    from './sections/LoginForm';
import RegisterForm from './sections/RegisterForm';
import ResetForm    from './sections/ResetForm';

export default function Auth({ onLoginSuccess }) {
  const { t } = useTranslation('auth');
  const {
    user,
    loginWithGoogle,
    loginWithGithub,
    loginWithFacebook,
    logout
  } = useAuth();

  const [view, setView] = useState('login');

  const handleSocial = fn =>
    fn().then(onLoginSuccess).catch(console.error);

  // **Nueva sección: usuario logeado**
  if (user) {
    return (
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Stack spacing={2} alignItems="center">
          <Avatar
            src={user.photoURL || undefined}
            sx={{
              width: 80,
              height: 80,
              border: theme => `2px solid ${theme.palette.primary.main}`
            }}
          >
            {!user.photoURL && <PersonIcon sx={{ fontSize: 48 }} />}
          </Avatar>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            {t('welcome', { name: user.displayName ?? user.email })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: theme => theme.palette.primary.main,
              color: 'common.white',
              textTransform: 'none',
              mt: 1
            }}
            onClick={logout}
          >
            {t('logout')}
          </Button>
        </Stack>
      </Box>
    );
  }

  // **Vista de login / register / reset**
  return (
    <Box sx={{ width: '100%', maxWidth: 360, p: 2 }}>
      {view === 'login' && (
        <LoginForm onSuccess={onLoginSuccess} onSwitch={setView} />
      )}
      {view === 'register' && (
        <RegisterForm
          onSuccess={() => setView('login')}
          onSwitch={setView}
        />
      )}
      {view === 'reset' && (
        <ResetForm
          onSuccess={() => setView('login')}
          onSwitch={setView}
        />
      )}

      <Divider sx={{ my: 2 }}>{t('or')}</Divider>
      <Stack spacing={1}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={() => handleSocial(loginWithGoogle)}
          sx={{ textTransform: 'none' }}
        >
          {t('providers.google')}
        </Button>
        <Button
          variant="contained"
          fullWidth
          startIcon={<GitHubIcon />}
          onClick={() => handleSocial(loginWithGithub)}
          sx={{ textTransform: 'none' }}
        >
          {t('providers.github')}
        </Button>
        <Button
          variant="contained"
          fullWidth
          startIcon={<FacebookIcon />}
          onClick={() => handleSocial(loginWithFacebook)}
          sx={{ textTransform: 'none' }}
        >
          {t('providers.facebook')}
        </Button>
      </Stack>
    </Box>
  );
}