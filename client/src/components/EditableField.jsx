import { useState } from 'react';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const EditableField = ({ label, value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? '');

  const handleSave = () => {
    setIsEditing(false);
    onSave(draft);
  };

  const handleCancel = () => {
    setDraft(value ?? '');
    setIsEditing(false);
  };

  return (
    <Box display="flex" alignItems="center" mb={1}>
      <Typography variant="subtitle2" sx={{ width: 150 }}>
        {label}:
      </Typography>

      {isEditing ? (
        <TextField
          size="small"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
        />
      ) : (
        <Typography variant="body2" sx={{ flex: 1 }}>
          {value ?? '—'}
        </Typography>
      )}

      <IconButton
        size="small"
        onClick={isEditing ? handleSave : () => setIsEditing(true)}
      >
        {isEditing ? <CheckIcon /> : <EditIcon />}
      </IconButton>
      {isEditing && (
        <IconButton size="small" onClick={handleCancel}>
          <CloseIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default EditableField;
