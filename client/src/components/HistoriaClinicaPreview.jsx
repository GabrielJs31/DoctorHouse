/**
 * HistoriaClinicaPreview.jsx
 * Vista animada de la historia clínica usando MUI + Framer Motion
 */
import React from 'react';
import { motion } from 'framer-motion';
import {
  CardContent,
  Grid,
  Typography,
  Box
} from '@mui/material';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

// Variantes para animar el contenedor y los ítems
const container = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, duration: 0.6 }
  }
};
const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

// ─── HistoriaClinicaPreview.jsx  (sustituye SOLO esta parte) ───────────────────
const renderValue = (v) => {
  // Si el valor es un objeto (p.ej. datos_personales), desglósalo campo-a-campo
  if (v && typeof v === 'object') {
    return Object.entries(v).map(([k, val]) => (
      <Typography variant="body2" key={k}>
        • <strong>{k.replace('_', ' ')}:</strong> {val ?? '—'}
      </Typography>
    ));
  }
  // Si es primitivo, muéstralo tal cual
  return v ?? '—';
};

const HistoriaClinicaPreview = ({ data }) => (
  <motion.div variants={container} initial="hidden" animate="visible">
    {/* …header y otros elementos… */}
    <CardContent>
      <Grid container spacing={3}>
        {Object.entries(data).map(([key, value]) => (
          <Grid item xs={12} sm={6} key={key}>
            <motion.div variants={item}>
              <Box display="flex" alignItems="center" mb={0.5}>
                <MedicalInformationIcon sx={{ mr: 1, color: 'primary.main' }} fontSize="small" />
                <Typography variant="subtitle2" color="textSecondary">
                  {key.replace('_', ' ')}
                </Typography>
              </Box>

              {/* ⬇️ Usa la función segura */}
              {renderValue(value)}
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </motion.div>
);
// ────────────────────────────────────────────────────────────────────────────────


export default HistoriaClinicaPreview;
