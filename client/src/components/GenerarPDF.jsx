import React from 'react';
import { Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { jsPDF } from 'jspdf';

/**
 * GenerarPDF.jsx
 * Genera y descarga un PDF con la ficha médica.
 */
const GenerarPDF = ({ data }) => {
  const crearPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - margin * 2;
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
    doc.setFont('helvetica', 'bold');
    doc.text('Datos del paciente', margin, y);
    y += lineHeight;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const dp = data.datos_personales || {};
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
    const dpCols = 2;
    const dpColWidth = usableWidth / dpCols;
    dpFields.forEach(([label, value], i) => {
      const col = i % dpCols;
      const row = Math.floor(i / dpCols);
      const x = margin + col * dpColWidth;
      const yRow = y + row * lineHeight;
      doc.text(`${label}: ${value || ''}`, x, yRow);
    });
    y += Math.ceil(dpFields.length / dpCols) * lineHeight + 20;

    // Motivo de consulta
    doc.setFont('helvetica', 'bold');
    doc.text('Motivo de consulta', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    const mc = data.motivo_de_consulta?.motivo || '';
    doc.text(mc, margin, y, { maxWidth: usableWidth });
    y += doc.splitTextToSize(mc, usableWidth).length * lineHeight + 10;

    // Enfermedad actual
    doc.setFont('helvetica', 'bold');
    doc.text('Enfermedad actual', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    const ea = data.enfermedad_actual?.descripción || '';
    doc.text(ea, margin, y, { maxWidth: usableWidth });
    y += doc.splitTextToSize(ea, usableWidth).length * lineHeight + 10;

    // Antecedentes
    doc.setFont('helvetica', 'bold');
    doc.text('Antecedentes', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    const ant = data.antecedentes || {};
    const antFields = [
      ['Personales', ant.personales],
      ['Alergias', ant.alergias],
      ['Medicamentos', ant.medicamentos],
      ['Familiares', ant.familiares],
      ['Quirúrgicos', ant.intervenciones_quirúrgicas],
      ['Coagulación', ant.problemas_coagulación],
      ['Anestésicos', ant.problemas_anestésicos],
      ['Cardiovasculares', ant.problemas_cardiovasculares],
      ['Fuma', ant.fuma],
      ['Alcohol', ant.alcohol],
    ];
    const antCols = 2;
    const antColWidth = usableWidth / antCols;
    antFields.forEach(([label, value], i) => {
      const col = i % antCols;
      const row = Math.floor(i / antCols);
      const x = margin + col * antColWidth;
      const yRow = y + row * lineHeight;
      doc.text(`${label}: ${value || ''}`, x, yRow);
    });
    y += Math.ceil(antFields.length / antCols) * lineHeight + 10;

    // Signos vitales
    doc.setFont('helvetica', 'bold');
    doc.text('Signos vitales', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    const sv = data.signos_vitales || {};
    const svFields = [
      ['Peso (Kg.)', sv.peso_kg],
      ['FR (resp)', sv.frecuencia_respiratoria],
      ['FC (lpm)', sv.frecuencia_cardíaca],
      ['Presión', sv.presión_arterial],
      ['Sat. O2', sv.saturación_oxígeno],
      ['Temp (C°)', sv.temperatura_c],
    ];
    svFields.forEach(([label, value], i) => {
      const col = i % dpCols;
      const row = Math.floor(i / dpCols);
      const x = margin + col * dpColWidth;
      const yRow = y + row * lineHeight;
      doc.text(`${label}: ${value || ''}`, x, yRow);
    });
    y += Math.ceil(svFields.length / dpCols) * lineHeight + 20;

    // Página 2: Diagnóstico y tratamiento
    // doc.addPage();
    // y = margin;
    // doc.setFont('helvetica', 'bold');
    // doc.text('Diagnóstico presuntivo', margin, y);
    // doc.text('Tratamiento', margin + usableWidth / 2, y);
    // y += lineHeight;
    // doc.setFont('helvetica', 'normal');
    // const dt = data.diagnóstico_y_tratamiento || {};
    // const dx = dt.diagnóstico_presuntivo || '';
    // const tx = dt.tratamiento || '';
    // doc.text(dx, margin, y, { maxWidth: usableWidth / 2 - 10 });
    // doc.text(tx, margin + usableWidth / 2 + 10, y, { maxWidth: usableWidth / 2 - 10 });
    
    // ─── Página 2: Diagnóstico y tratamiento ───────────────────────────
  doc.addPage();
  y = margin;

  // Encabezados en negrita
  doc.setFont('helvetica', 'bold');
  doc.text('Diagnóstico presuntivo', margin, y);
  doc.text('Tratamiento', margin + usableWidth / 2, y);
  y += lineHeight;

  // Texto en normal
  doc.setFont('helvetica', 'normal');

  // Extraemos del JSON la sección diagnóstico_y_tratamiento
  const dt = data['diagnóstico_y_tratamiento'] || {};

  // Creamos un arreglo análogo a svFields, pero con tus dos campos
  const dtFields = [
    ['Diagnóstico presuntivo', dt['diagnóstico_presuntivo']],
    ['Tratamiento',            dt.tratamiento],
  ];
  const dtCols = 2;
  const dtColWidth = usableWidth / dtCols;

  // Dibujamos cada par etiqueta–valor en su columna correspondiente
  dtFields.forEach(([label, val], i) => {
    const col = i % dtCols;
    const row = Math.floor(i / dtCols);
    const x = margin + col * dtColWidth;
    const yRow = y + row * lineHeight;
    doc.text(`${label}: ${val || ''}`, x, yRow);
  });

  // Avanzamos el cursor vertical para no pisar más contenido
  y += Math.ceil(dtFields.length / dtCols) * lineHeight + 20;

// … aquí seguiría el resto de tu lógica o doc.save() …

      // Guardar PDF
    doc.save('historia_clinica.pdf');
  };

  return (
    <Button
      variant="contained"
      startIcon={<PictureAsPdfIcon />}
      onClick={crearPDF}
      sx={{ mt: 2 }}
    >
      Descargar PDF
    </Button>
  );
};

export default GenerarPDF;
