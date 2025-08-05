import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import Auth from '../apps/auth/auth';

export default function LoginModal({ open, onClose, disableClose = false }) {
  const { t } = useTranslation('auth');

  const handleClose = (_, reason) => {
    if (disableClose && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
      return;
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown={disableClose}
      keepMounted
      maxWidth="xs"
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Typography variant="h6">{t('dialogTitle')}</Typography>
        {!disableClose && (
          <IconButton
            aria-label={t('close')}
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent dividers>
        <Auth onLoginSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}
