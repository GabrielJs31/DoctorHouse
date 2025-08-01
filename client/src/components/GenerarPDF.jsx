// GenerarPDF.jsx
import React from 'react';
import { Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { jsPDF } from 'jspdf';

const GenerarPDF = ({ data }) => {
  const crearPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = pageWidth - margin * 2;
    const lineHeight = 16;
    let y = margin;
    let pageCount = 1;

    // Añade una nueva página y actualiza el contador y posición Y
    const nuevaPagina = () => {
      doc.addPage();
      pageCount++;
      y = margin;
    };

    // Imprime un bloque de texto ajustado al ancho usable, manejando salto de página
    const imprimirTexto = (texto, x, yInicio) => {
      const lineas = doc.splitTextToSize(texto, usableWidth);
      let yActual = yInicio;
      lineas.forEach(linea => {
        if (yActual + lineHeight > pageHeight - margin - 20) {
          nuevaPagina();
        }
        doc.text(linea, x, yActual);
        yActual += lineHeight;
      });
      return yActual;
    };

    // Dibuja el encabezado de sección y luego el texto
    const agregarSeccion = (titulo, texto) => {
      // Fondo de título
      doc.setFillColor(220, 235, 247);
      doc.rect(margin, y - 4, usableWidth, lineHeight + 8, 'F');
      // Título
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(20, 50, 100);
      doc.text(titulo, margin + 4, y + lineHeight / 2);
      y += lineHeight + 12;
      // Texto de sección
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      y = imprimirTexto(texto, margin, y) + 10;
    };

    // ─── Cabecera ─────────────────────────────────────────────────────────
    doc.setFillColor(10, 60, 120);
    doc.rect(0, 0, pageWidth, 60, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('HISTORIA CLÍNICA', pageWidth / 2, 38, { align: 'center' });
    y = 80;

    // ─── 1. Datos del paciente ────────────────────────────────────────────
    const dp = {
      nombre: data?.datos_personales?.nombre || '-',
      apellido: data?.datos_personales?.apellido || '-',
      cédula: data?.datos_personales?.cédula || '-',
      sexo: data?.datos_personales?.sexo || '-',
      tipo_sangre: data?.datos_personales?.tipo_sangre || '-',
      fecha_nacimiento: data?.datos_personales?.fecha_nacimiento || '-',
      edad: data?.datos_personales?.edad || '-',
      teléfono: data?.datos_personales?.teléfono || '-',
      móvil: data?.datos_personales?.móvil || '-',
      fecha_consulta: data?.datos_personales?.fecha_consulta || '-',
    };
    const dpFields = [
      ['Nombre', dp.nombre],
      ['Apellido', dp.apellido],
      ['Cédula', dp.cédula],
      ['Sexo', dp.sexo],
      ['Tipo de sangre', dp.tipo_sangre],
      ['Fecha nacimiento', dp.fecha_nacimiento],
      ['Edad', dp.edad],
      ['Teléfono', dp.teléfono],
      ['Móvil', dp.móvil],
      ['Fecha consulta', dp.fecha_consulta],
    ];
    // Imprime en dos columnas
    const cols = 2;
    const colW = usableWidth / cols;
    dpFields.forEach(([label, val], i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = margin + col * colW;
      const yRow = y + row * lineHeight;
      if (yRow > pageHeight - margin - 20) nuevaPagina();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(`${label}:`, x, yRow);
      doc.setFont('helvetica', 'normal');
      doc.text(val.toString(), x + 80, yRow);
    });
    y += Math.ceil(dpFields.length / cols) * lineHeight + 20;

    // ─── 2. Motivo de Consulta ────────────────────────────────────────────
    const mc = data?.motivo_consulta || {};
    const mcTexto = [
      `Motivo: ${mc.motivo || '-'}`,
      `Lugar: ${mc.lugar || '-'}`,
    ].join('\n');
    agregarSeccion('2. Motivo de Consulta', mcTexto);

    // ─── 3. Enfermedad Actual ─────────────────────────────────────────────
    const ea = data?.enfermedad_actual || {};
    const eaTexto = [
      `Descripción: ${ea.descripción || '-'}`,
      `Tratamiento: ${ea.tratamiento || '-'}`,
      `Exámenes requeridos: ${ea.examenes_requeridos || '-'}`,
      `Derivación especialista: ${ea.derivacion_especialista || '-'}`,
      `Recomendaciones: ${ea.recomendaciones || '-'}`,
    ].join('\n');
    agregarSeccion('3. Enfermedad Actual', eaTexto);

    // ─── 4. Posibles Enfermedades ─────────────────────────────────────────
    const pe = data?.posibles_enfermedades || {};
    const peTexto =
      Object.entries(pe)
        .map(
          ([key, val]) =>
            [
              `Enfermedad: ${key}`,
              `Descripción: ${val.description || '-'}`,
              `Tratamiento: ${val.tratamiento || '-'}`,
              `Exámenes requeridos: ${val.examenes_requeridos || '-'}`,
              `Derivación especialista: ${val.derivacion_especialista || '-'}`,
              `Recomendaciones: ${val.recomendaciones || '-'}`,
            ].join('\n')
        )
        .join('\n\n') || '-';
    agregarSeccion('4. Posibles Enfermedades', peTexto);

    // ─── 5. Antecedentes ──────────────────────────────────────────────────
    const ant = data?.antecedentes || {};
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
    agregarSeccion('5. Antecedentes', antTexto);

    // ─── 6. Signos Vitales ───────────────────────────────────────────────
    const sv = data?.signos_vitales || {};
    const svTexto = [
      `FR (resp): ${sv.frecuencia_respiratoria || '-'}`,
      `FC (lpm): ${sv.frecuencia_cardíaca || '-'}`,
      `Presión arterial: ${sv.presión_arterial || '-'}`,
      `Sat. O₂: ${sv.saturación_oxígeno || '-'}`,
      `Temp (°C): ${sv.temperatura_c || '-'}`,
    ].join('\n');
    agregarSeccion('6. Signos Vitales', svTexto);

    // ─── 7. Diagnóstico presuntivo & 8. Tratamiento ──────────────────────
    nuevaPagina();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(20, 50, 100);
    doc.text('7. Diagnóstico Presuntivo', margin, y);
    doc.text('8. Tratamiento', margin + usableWidth / 2, y);
    y += lineHeight + 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    const dxLines = doc.splitTextToSize(
      data?.diagnóstico_y_tratamiento?.diagnóstico_presuntivo || '-',
      usableWidth / 2 - 10
    );
    const txLines = doc.splitTextToSize(
      data?.diagnóstico_y_tratamiento?.tratamiento || '-',
      usableWidth / 2 - 10
    );
    const maxL = Math.max(dxLines.length, txLines.length);
    for (let i = 0; i < maxL; i++) {
      const posY = y + i * lineHeight;
      if (posY > pageHeight - margin - 20) nuevaPagina();
      if (dxLines[i]) doc.text(dxLines[i], margin, posY);
      if (txLines[i]) doc.text(txLines[i], margin + usableWidth / 2, posY);
    }

    // ─── Pie de página ───────────────────────────────────────────────────
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 20, {
        align: 'center',
      });
    }

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
