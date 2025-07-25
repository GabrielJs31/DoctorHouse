// src/apps/home/sections/PreviewSection.jsx
import React from 'react';
// IMPORTA exactamente el nombre de tu fichero sin “.jsx”
import HistoriaClinicaPreview from '../../../components/HistoriaClinicaPreview';

const PreviewSection = ({ data }) => (
  <HistoriaClinicaPreview data={data} />
);

export default PreviewSection;
