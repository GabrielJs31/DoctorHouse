/**
 * HistoriaClinicaPreview.jsx
 * Vista animada de la historia clínica usando MUI + Framer Motion
 */
import React from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
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

const HistoriaClinicaPreview = ({ data }) => (
  <motion.div variants={container} initial="hidden" animate="visible">
    <Card sx={{ mt: 4, boxShadow: 4, borderRadius: 2 }}>
      {/* Header con espacio para logo + título */}
      <CardHeader
        avatar={<MedicalInformationIcon color="primary" fontSize="large" />}
        title={<Typography variant="h5">Historia Clínica</Typography>}
        sx={{ pb: 0 }}
      />
      <Divider sx={{ my: 1 }} />

      {/* Campos en dos columnas, cada uno animado */}
      <CardContent>
        <Grid container spacing={3}>
          {Object.entries(data).map(([key, value]) => (
            <Grid item xs={12} sm={6} key={key}>
              <motion.div variants={item}>
                <Box display="flex" alignItems="center" mb={0.5}>
                  <MedicalInformationIcon
                    sx={{ mr: 1, color: 'primary.main' }}
                    fontSize="small"
                  />
                  <Typography variant="subtitle2" color="textSecondary">
                    {key}
                  </Typography>
                </Box>
                <Typography variant="body1">{value || '-'}</Typography>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  </motion.div>
);

export default HistoriaClinicaPreview;
