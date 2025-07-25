// home.jsx: Orquesta las secciones de la demo
import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import AudioSection from './sections/AudioSection';
import PreviewSection from './sections/PreviewSection';
import PdfSection from './sections/PdfSection';

const Home = () => {
  const [ficha, setFicha] = useState(null); // guarda la ficha médica

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography 
        variant="h4" 
        align="center" 
        sx={{ fontWeight: 'bold' }} 
        gutterBottom
      >
        Demo Historia Clínica
      </Typography>

      <AudioSection onData={setFicha} />

      {ficha && (
        <>
          <PreviewSection data={ficha} />
          <PdfSection data={ficha} />
        </>
      )}
    </Container>
  );
};

export default Home;
