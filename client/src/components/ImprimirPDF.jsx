import React from 'react';
import { Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { jsPDF } from 'jspdf';

/**
 * ImprimirPDF.jsx
 * Componente que genera el PDF de la ficha médica y lo envía a imprimir.
 */
const ImprimirPDF = ({ data }) => {
  const handlePrintPDF = () => {
    const doc = generarPDF(data);
    doc.autoPrint();
    const pdfBlob = doc.output('bloburl');
    window.open(pdfBlob);
  };

  // Función para generar el PDF y devolver el objeto jsPDF
  function generarPDF(data) {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = pageWidth - margin * 2;
    const lineHeight = 16;
    let y = margin;
    let pageCount = 1;

    const nuevaPagina = () => {
      doc.addPage();
      pageCount++;
      y = margin;
    };

    const imprimirTexto = (texto, x, yInicial) => {
      const lineas = doc.splitTextToSize(texto, usableWidth);
      let yActual = yInicial;
      lineas.forEach(linea => {
        if (yActual + lineHeight > pageHeight - margin - 20) {
          nuevaPagina();
        }
        doc.text(linea, x, yActual);
        yActual += lineHeight;
      });
      return yActual;
    };

    const agregarSeccion = (titulo, texto) => {
      doc.setFillColor(220, 235, 247);
      doc.rect(margin, y - 4, usableWidth, lineHeight + 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(20, 50, 100);
      doc.text(titulo, margin + 4, y + lineHeight / 2);
      y += lineHeight + 12;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      y = imprimirTexto(texto, margin, y) + 10;
    };

    doc.setFillColor(10, 60, 120);
    doc.rect(0, 0, pageWidth, 60, 'F');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('HISTORIA CLÍNICA', pageWidth / 2, 38, { align: 'center' });
    y = 80;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 50, 100);
    doc.text('1. Datos del paciente', margin, y);
    y += lineHeight;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const dp = data.datos_personales || {};
    const dpFields = [
      ['Nombre', dp.nombre],
      ['Apellido', dp.apellido],
      ['Cédula', dp.cédula],
      ['Sexo', dp.sexo],
      ['Tipo de sangre', dp.tipo_sangre],
      ['F. nacimiento', dp.fecha_nacimiento],
      ['Edad', dp.edad],
      ['Teléfono', dp.teléfono],
      ['Móvil', dp.móvil],
      ['Fecha consulta', dp.fecha_consulta],
    ];
    const cols = 2;
    const colW = usableWidth / cols;
    dpFields.forEach(([label, val], i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = margin + col * colW;
      const yRow = y + row * lineHeight;
      if (yRow > pageHeight - margin - 20) nuevaPagina();
      doc.text(`${label}: ${val || '-'}`, x, yRow);
    });
    y += Math.ceil(dpFields.length / cols) * lineHeight + 20;

    agregarSeccion('2. Motivo de consulta', data.motivo_de_consulta?.motivo || '-');
    agregarSeccion('3. Enfermedad actual', data.enfermedad_actual?.descripción || '-');

    const ant = data.antecedentes || {};
    const antTexto = [
      `Personales: ${ant.personales || '-'}`,
      `Alergias: ${ant.alergias || '-'}`,
      `Medicamentos: ${ant.medicamentos || '-'}`,
      `Familiares: ${ant.familiares || '-'}`,
      `Quirúrgicos: ${ant.intervenciones_quirúrgicas || '-'}`,
      `Coagulación: ${ant.problemas_coagulación || '-'}`,
      `Anestésicos: ${ant.problemas_anestésicos || '-'}`,
      `Cardiovasculares: ${ant.problemas_cardiovasculares || '-'}`,
      `Fuma: ${ant.fuma || '-'}`,
      `Alcohol: ${ant.alcohol || '-'}`,
    ].join('\n');
    agregarSeccion('4. Antecedentes', antTexto);

    const sv = data.signos_vitales || {};
    const svTexto = [
      `Peso (Kg): ${sv.peso_kg || '-'}`,
      `FR (resp): ${sv.frecuencia_respiratoria || '-'}`,
      `FC (lpm): ${sv.frecuencia_cardíaca || '-'}`,
      `Presión: ${sv.presión_arterial || '-'}`,
      `Sat. O2: ${sv.saturación_oxígeno || '-'}`,
      `Temp (°C): ${sv.temperatura_c || '-'}`,
    ].join('\n');
    agregarSeccion('5. Signos vitales', svTexto);

    nuevaPagina();
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 50, 100);
    doc.text('6. Diagnóstico presuntivo', margin, y);
    doc.text('7. Tratamiento', margin + usableWidth / 2, y);
    y += lineHeight;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const dxLines = doc.splitTextToSize(data.diagnóstico_y_tratamiento?.diagnóstico_presuntivo || '-', usableWidth / 2 - 10);
    const txLines = doc.splitTextToSize(data.diagnóstico_y_tratamiento?.tratamiento || '-', usableWidth / 2 - 10);
    const maxL = Math.max(dxLines.length, txLines.length);
    for (let i = 0; i < maxL; i++) {
      const posY = y + i * lineHeight;
      if (posY > pageHeight - margin - 20) {
        nuevaPagina();
      }
      if (dxLines[i]) doc.text(dxLines[i], margin, posY);
      if (txLines[i]) doc.text(txLines[i], margin + usableWidth / 2 + 10, posY);
    }

    const totalPages = pageCount;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 20, { align: 'center' });
    }

    return doc;
  }

  return (
    <Button
      variant="outlined"
      startIcon={<PrintIcon />}
      onClick={handlePrintPDF}
    >
      Imprimir PDF
    </Button>
  );
};

export default ImprimirPDF;
