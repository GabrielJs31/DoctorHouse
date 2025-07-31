import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Button,
  Stack,
  TextField
} from '@mui/material';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

// Formatea títulos en Title Case: 'datos_personales' → 'Datos Personales'
const formatTitle = (str) =>
  str
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

// Animaciones para despliegue de contenido
const container = {
  hidden: { opacity: 0, height: 0, overflow: 'hidden', y: -20 },
  visible: {
    opacity: 1,
    height: 'auto',
    y: 0,
    transition: { staggerChildren: 0.1, duration: 0.6 }
  }
};
const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

// ─── HistoriaClinicaPreview.jsx ───────────────────────────────────────────────
const HistoriaClinicaPreview = ({ data, onSave }) => {
  const [showReport, setShowReport] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    if (data) {
      setEditedData(data);
      setEditMode(false);
    }
  }, [data]);

  if (!data) return null;

  // Maneja cambio de valor primitivo
  const handlePrimitiveChange = (key, value) => {
    setEditedData(prev => ({ ...prev, [key]: value }));
  };
  // Maneja cambio de valor anidado
  const handleNestedChange = (parentKey, childKey, value) => {
    setEditedData(prev => ({
      ...prev,
      [parentKey]: { ...prev[parentKey], [childKey]: value }
    }));
  };

  const handleSaveAll = () => {
    setEditMode(false);
    if (onSave) onSave(editedData);
  };

  const handleCancel = () => {
    setEditedData(data);
    setEditMode(false);
  };

  return (
    <>
      {/* Controles de mostrar/ocultar y editar */}
      <Box display="flex" justifyContent="center" mt={2} mb={2}>
        <Stack
          component={motion.div}
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          direction="row"
          spacing={2}
        >
          <motion.div layout>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowReport(prev => !prev)}
            >
              {showReport ? 'Ocultar Historia Clínica' : 'Ver Historia Clínica'}
            </Button>
          </motion.div>

          <AnimatePresence initial={false} mode="popLayout">
            {showReport && !editMode && (
              <motion.div
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <Button variant="outlined" onClick={() => setEditMode(true)}>
                  Editar Reporte
                </Button>
              </motion.div>
            )}
            {showReport && editMode && (
              <>
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <Button variant="outlined" onClick={handleSaveAll}>
                    Guardar Cambios
                  </Button>
                </motion.div>
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <Button variant="text" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </Stack>
      </Box>

      {/* Reporte con estilo de Card para alineación */}
      <AnimatePresence initial={false}>
        {showReport && (
          <motion.div
            key="historia-report"
            variants={container}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{ overflow: 'hidden' }}
          >
            <Card sx={{ maxWidth: 1200, mx: 'auto', p: 2, my: 2 }}>
              <CardContent>
                <Grid container spacing={4}>
                  {Object.entries(editedData).map(([key, value]) => (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                      <motion.div variants={item}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <MedicalInformationIcon sx={{ mr: 1, color: 'primary.main' }} fontSize="small" />
                          <Typography variant="subtitle2" color="textSecondary">
                            {formatTitle(key)}
                          </Typography>
                        </Box>

                        {/* Renderiza inputs con responsive y multiline */}
                        {value && typeof value === 'object' ? (
                          <Stack spacing={2}>
                            {Object.entries(value).map(([childKey, childVal]) => (
                              <TextField
                                key={childKey}
                                fullWidth
                                variant="outlined"
                                size="small"
                                multiline
                                minRows={2}
                                maxRows={4}
                                label={formatTitle(childKey)}
                                value={childVal || ''}
                                onChange={e => handleNestedChange(key, childKey, e.target.value)}
                                disabled={!editMode}
                              />
                            ))}
                          </Stack>
                        ) : (
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            multiline={false}
                            label={formatTitle(key)}
                            value={value || ''}
                            onChange={e => handlePrimitiveChange(key, e.target.value)}
                            disabled={!editMode}
                          />
                        )}
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HistoriaClinicaPreview;
