import React from 'react';
import { Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { jsPDF } from 'jspdf';

/**
 * GenerarPDF.jsx
 * Componente que genera un PDF estilizado con la ficha médica,
 * paginación automática, sección de encabezado con color y pie de página.
 */
const GenerarPDF = ({ data }) => {

  /**
   * crearPDF: arma y descarga el PDF completo.
   */
  const crearPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = pageWidth - margin * 2;
    const lineHeight = 16;
    let y = margin;
    let pageCount = 1;

    // Helper: salto de página y actualizar contador
    const nuevaPagina = () => {
      doc.addPage();
      pageCount++;
      y = margin;
    };

    // Helper: imprime texto con ajuste y salto de página
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

    // Helper: sección con fondo de color y título
    const agregarSeccion = (titulo, texto) => {
      // fondo semitransparente
      doc.setFillColor(220, 235, 247);
      doc.rect(margin, y - 4, usableWidth, lineHeight + 8, 'F');
      // título
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(20, 50, 100);
      doc.text(titulo, margin + 4, y + lineHeight / 2);
      y += lineHeight + 12;
      // contenido
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      y = imprimirTexto(texto, margin, y) + 10;
    };

    // ─── Cabecera Decorada ───────────────────────────────────────────────
    // fondo azul oscuro
    doc.setFillColor(10, 60, 120);
    doc.rect(0, 0, pageWidth, 60, 'F');
    // logo (si tuvieras imagen en base64, la usarías aquí)
    // doc.addImage(logoData, 'PNG', margin, 10, 40, 40);
    // título blanco
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('HISTORIA CLÍNICA', pageWidth / 2, 38, { align: 'center' });
    y = 80;

    // ─── Datos del paciente ──────────────────────────────────────────────
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

    // ─── Secciones textuales ─────────────────────────────────────────────
    agregarSeccion('2. Motivo de consulta', data.motivo_de_consulta?.motivo || '-');
    agregarSeccion('3. Enfermedad actual', data.enfermedad_actual?.descripción || '-');

    // Antecedentes agrupados
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

    // ─── Diagnóstico y tratamiento ───────────────────────────────────────
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

    // ─── Pie de página con numeración ───────────────────────────────────
    const totalPages = pageCount;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 20, { align: 'center' });
    }

    // Guardar archivo
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
