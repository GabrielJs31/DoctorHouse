// src/components/Toolbar.jsx
import React from 'react';
import {
  AppBar,
  Toolbar as MuiToolbar,
  Typography,
  Button,
  Box
} from '@mui/material';
import { useAuth } from '../services/firebase/AuthContext';

export default function Toolbar() {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <MuiToolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          DoctorHouse
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user.displayName || user.email}
            </Typography>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        )}
      </MuiToolbar>
    </AppBar>
  );
}
