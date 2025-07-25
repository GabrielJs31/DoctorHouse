// src/components/AudioUploader.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import useFileValidation from '../apps/home/hooks/useFileValidation';
import { procesarAudio } from '../services/doctorHouseService';
import LoadingModal from './LoadingModal';

// ──────────────────────────────────────────────────────────────
// util: icono según MIME
// ──────────────────────────────────────────────────────────────
const getFileIcon = (file) => {
  const { type } = file;
  if (type === 'audio/mpeg') return <MusicNoteIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />;
  if (type === 'audio/wav') return <GraphicEqIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />;
  if (type.startsWith('audio/')) return <AudiotrackIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />;
  return <InsertDriveFileIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />;
};

// ──────────────────────────────────────────────────────────────
// animaciones
// ──────────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const dropZoneVariants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

// ──────────────────────────────────────────────────────────────
// componente
// ──────────────────────────────────────────────────────────────
const AudioUploader = ({ onData }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // validación (5 MB máx)
  const { valid, error: validationError } = useFileValidation(file, {
    types: ['audio/wav', 'audio/mpeg', 'audio/mp3'],
    maxSize: 5 * 1024 * 1024, // 5 MB en bytes
  });

  // ─── selección de archivo ────────────────────────────────
  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  // ─── subida y llamada al backend ──────────────────────────
  const handleUpload = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo de audio');
      return;
    }
    if (!valid) {
      setError(validationError || 'Archivo no válido');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // procesarAudio devuelve el objeto extraído (JSON)
      const extracted = await procesarAudio(file);
      onData(extracted); // entrega al componente padre
    } catch (err) {
      setError(err.message ?? 'Error al procesar el audio');
    } finally {
      setLoading(false);
    }
  };

  // ─── JSX ──────────────────────────────────────────────────
  return (
    <>
      {/* modal de carga */}
      <LoadingModal open={loading} />

      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ marginTop: 24 }}>
        <Card sx={{ boxShadow: 4, borderRadius: 2 }}>
          <CardHeader
            avatar={<UploadFileIcon color="primary" fontSize="large" />}
            title={<Typography variant="h6">Subir Audio</Typography>}
            sx={{ pb: 0 }}
          />

          <CardContent>
            {/* zona de soltar / seleccionar */}
            <motion.label htmlFor="audio-upload" variants={dropZoneVariants} whileHover="hover" whileTap="tap">
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: file ? 'primary.main' : 'grey.400',
                  borderRadius: 1,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: file ? 'action.selected' : 'transparent',
                }}
              >
                <input
                  accept="audio/*"
                  id="audio-upload"
                  type="file"
                  hidden
                  onChange={handleChange}
                />

                {file ? (
                  <Box display="flex" flexDirection="column" alignItems="center">
                    {getFileIcon(file)}
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                      {file.name}
                    </Typography>
                  </Box>
                ) : (
                  <Typography>Haz clic o arrastra tu archivo aquí</Typography>
                )}
              </Box>
            </motion.label>

            {/* errores */}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </CardContent>

          <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!file || loading}
              startIcon={<UploadFileIcon />}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Subir y procesar'}
            </Button>
          </CardActions>
        </Card>
      </motion.div>
    </>
  );
};

export default AudioUploader;
