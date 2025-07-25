/**
 * GenerarPDF.jsx
 * Genera y descarga un PDF con la ficha médica usando el layout del ejemplo:
 * - Espacio superior para logo
 * - Título centrado “Historia General”
 * - Sección “Datos del paciente” en 4 columnas
 * - “Motivo de consulta” y “Enfermedad actual”
 * - “Antecedentes” en dos columnas
 * - “Signos vitales” en 4 columnas + salto de página
 * - “Examen Físico” en texto multilineal
 * - “Diagnóstico presuntivo” y “Tratamiento” lado a lado
 */
import React from 'react';
import { Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { jsPDF } from 'jspdf';

const GenerarPDF = ({ data }) => {
  const crearPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - 2 * margin;
    let y = margin;
    const lineHeight = 14;

    // Espacio reservado para logo
    doc.rect(margin, y, usableWidth, 60);
    y += 80;

    // Título centrado
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Historia General', pageWidth / 2, y, { align: 'center' });
    y += 30;

    // Datos del paciente
    doc.setFontSize(14);
    doc.text('Datos del paciente', margin, y);
    y += lineHeight;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const dp = data.datos_personales; // :contentReference[oaicite:3]{index=3}
    const dpFields = [
      ['Nombre', dp.nombre],
      ['Apellido', dp.apellido],
      ['Cédula', dp.cédula],
      ['Sexo', dp.sexo],
      ['Tipo de sangre', dp.tipo_sangre],
      ['Fecha de nacimiento', dp.fecha_nacimiento],
      ['Edad', dp.edad],
      ['Teléfono', dp.teléfono],
      ['Móvil', dp.móvil],
      ['Fecha', dp.fecha_consulta],
    ];
    const cols = 4;
    const colWidth = usableWidth / cols;
    dpFields.forEach((field, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = margin + col * colWidth;
      const yRow = y + row * lineHeight;
      doc.text(`${field[0]}: ${field[1]}`, x, yRow);
    });
    y += Math.ceil(dpFields.length / cols) * lineHeight + 10;

    // Motivo de consulta
    doc.setFont('helvetica', 'bold');
    doc.text('Motivo de consulta', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    const mc = data.motivo_de_consulta.motivo;
    doc.text(mc, margin, y, { maxWidth: usableWidth });
    y += doc.splitTextToSize(mc, usableWidth).length * lineHeight + 10;

    // Enfermedad actual
    doc.setFont('helvetica', 'bold');
    doc.text('Enfermedad actual', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    const ea = data.enfermedad_actual.descripción;
    doc.text(ea, margin, y, { maxWidth: usableWidth });
    y += doc.splitTextToSize(ea, usableWidth).length * lineHeight + 10;

    // Antecedentes
    doc.setFont('helvetica', 'bold');
    doc.text('Antecedentes', margin, y);
    y += lineHeight;
    const ant = data.antecedentes;
    const left = [
      ['Personales', ant.personales],
      ['Alergias', ant.alergias],
      ['Medicamentos', ant.medicamentos],
      ['Cardiovasculares', ant.problemas_cardiovasculares],
      ['Fuma', ant.fuma],
    ];
    const right = [
      ['Familiares', ant.familiares],
      ['Intervenciones', ant.intervenciones_quirúrgicas],
      ['Coagulación', ant.problemas_coagulación],
      ['Anestésicos', ant.problemas_anestésicos],
      ['Alcohol', ant.alcohol],
    ];
    const half = usableWidth / 2;
    doc.setFont('helvetica', 'bold');
    left.forEach((f, i) => {
      doc.text(`${f[0]}:`, margin, y + i * lineHeight);
      doc.setFont('helvetica', 'normal');
      doc.text(f[1] || '-', margin + 80, y + i * lineHeight);
      doc.setFont('helvetica', 'bold');
    });
    right.forEach((f, i) => {
      doc.text(`${f[0]}:`, margin + half, y + i * lineHeight);
      doc.setFont('helvetica', 'normal');
      doc.text(f[1] || '-', margin + half + 100, y + i * lineHeight);
      doc.setFont('helvetica', 'bold');
    });
    y += Math.max(left.length, right.length) * lineHeight + 10;

    // Signos vitales
    doc.setFont('helvetica', 'bold');
    doc.text('Signos vitales', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    const sv = data.signos_vitales;
    const svFields = [
      ['Peso (Kg.)', sv.peso_kg],
      ['Respiratoria', sv.frecuencia_respiratoria],
      ['Cardíaca (lpm)', sv.frecuencia_cardíaca],
      ['Presión', sv.presión_arterial],
      ['Sat. Oxígeno', sv.saturación_oxígeno],
      ['Temp. (C°)', sv.temperatura_c],
    ];
    svFields.forEach((f, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = margin + col * colWidth;
      const yRow = y + row * lineHeight;
      doc.text(`${f[0]}: ${f[1]}`, x, yRow);
    });

    // Página 2
    doc.addPage();
    y = margin;

    // Examen Físico
    doc.setFont('helvetica', 'bold');
    doc.text('Examen Físico', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    const ex = data.examen_físico;
    const exText = [
      ex.cabeza_cuello,
      `Tórax: ${ex.tórax}`,
      `RsCs: ${ex.rscs}`,
      `Abdomen: ${ex.abdomen}`,
      `Extremidades: ${ex.extremidades}`,
    ].join('\n');
    doc.text(exText, margin, y, { maxWidth: usableWidth });
    y += exText.split('\n').length * lineHeight + 10;

    // Diagnóstico y Tratamiento
    doc.setFont('helvetica', 'bold');
    doc.text('Diagnóstico presuntivo', margin, y);
    doc.text('Tratamiento', margin + half, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    const dt = data.diagnóstico_y_tratamiento;
    doc.text(dt.diagnóstico_presuntivo, margin, y, { maxWidth: half - 10 });
    doc.text(dt.tratamiento, margin + half, y, { maxWidth: half - 10 });

    // Descargar
    doc.save('historia_clinica.pdf');
  };

  return (
    <Button variant="contained" startIcon={<PictureAsPdfIcon />} sx={{ mt: 2 }} onClick={crearPDF}>
      Descargar PDF
    </Button>
  );
};

export default GenerarPDF;
