import React from 'react';
import { Stack } from '@mui/material';
import GenerarPDF from '../../../components/GenerarPDF';
import ImprimirPDF from '../../../components/ImprimirPDF';

const PdfSection = ({ data }) => (
  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
    <GenerarPDF data={data} />
    <ImprimirPDF data={data} />
  </Stack>
);

export default PdfSection;
