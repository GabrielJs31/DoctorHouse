// PdfSection.jsx: sección que genera y descarga el PDF
import React from 'react';
import GenerarPDF from '../../../components/GenerarPDF';

const PdfSection = ({ data }) => (
  <GenerarPDF data={data} />
);

export default PdfSection;
