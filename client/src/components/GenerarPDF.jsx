// GenerarPDF.jsx (subtítulos en negrita y Posibles Enfermedades numeradas correctamente)
import React from 'react';
import { Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const GenerarPDF = ({ data }) => {
  const crearPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = margin;

    // Cabecera
    doc.setFillColor(10, 60, 120);
    doc.rect(0, 0, pageWidth, 60, 'F');
    doc.setTextColor(255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('HISTORIA CLÍNICA', pageWidth / 2, 38, { align: 'center' });
    y += 30;

    // 1. Datos del paciente (tabla)
    const dp = data.datos_personales || {};
    const dpRows = [
      ['Nombre', dp.nombre || '-'],
      ['Apellido', dp.apellido || '-'],
      ['Cédula', dp.cédula || '-'],
      ['Sexo', dp.sexo || '-'],
      ['Tipo de sangre', dp.tipo_sangre || '-'],
      ['Fecha nacimiento', dp.fecha_nacimiento || '-'],
      ['Edad', dp.edad || '-'],
      ['Teléfono', dp.teléfono || '-'],
      ['Móvil', dp.móvil || '-'],
      ['Fecha consulta', dp.fecha_consulta || '-'],
    ];
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Campo', 'Valor']],
      body: dpRows,
      theme: 'grid',
      headStyles: { fillColor: [220, 235, 247], textColor: [20, 50, 100], fontStyle: 'bold' },
      styles: { fontSize: 11, cellPadding: 4 },
      columnStyles: { 0: { cellWidth: 120, fontStyle: 'bold' }, 1: { cellWidth: 'auto' } },
    });
    y = doc.lastAutoTable.finalY + 20;

    // Helper: sección con fondo y separación
    const agregarSeccion = (titulo, texto) => {
      const usableWidth = pageWidth - margin * 2;
      const lineHeight = 14;

      doc.setDrawColor(200);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      doc.setFillColor(220, 235, 247);
      doc.rect(margin, y - lineHeight, usableWidth, lineHeight + 6, 'F');
      doc.setTextColor(20, 50, 100);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(titulo, margin + 4, y);
      y += lineHeight + 10;

      doc.setTextColor(0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(texto, usableWidth);
      lines.forEach(line => {
        if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });
      y += 10;
    };

    // 2. Motivo de Consulta
    agregarSeccion(
      '2. Motivo de Consulta',
      `Motivo: ${data.motivo_consulta?.motivo || '-'}\nLugar: ${data.motivo_consulta?.lugar || '-'}`
    );

    // 3. Enfermedad Actual
    agregarSeccion(
      '3. Enfermedad Actual',
      `Descripción: ${data.enfermedad_actual?.descripción || '-'}\nTratamiento: ${data.enfermedad_actual?.tratamiento || '-'}\nExámenes: ${data.enfermedad_actual?.examenes_requeridos || '-'}\nDerivación: ${data.enfermedad_actual?.derivacion_especialista || '-'}\nRecomendaciones: ${data.enfermedad_actual?.recomendaciones || '-'}`
    );

    // 4. Posibles Enfermedades (numeradas)
    const peEntries = Object.values(data.posibles_enfermedades || {});
    const peTexto = peEntries.length
      ? peEntries.map((v, idx) =>
          `Posible Enfermedad ${idx + 1}: ${v.description || '-'}\nTratamiento: ${v.tratamiento || '-'}\nExámenes: ${v.examenes_requeridos || '-'}\nDerivación: ${v.derivacion_especialista || '-'}\nRecomendaciones: ${v.recomendaciones || '-'}`
        ).join('\n\n')
      : '-';
    agregarSeccion('4. Posibles Enfermedades', peTexto);

    // 5. Antecedentes
    agregarSeccion(
      '5. Antecedentes',
      `Personales: ${data.antecedentes?.personales || '-'}\nAlergias: ${data.antecedentes?.alergias || '-'}\nMedicamentos: ${data.antecedentes?.medicamentos || '-'}\nFamiliares: ${data.antecedentes?.familiares || '-'}\nQuirúrgicos: ${data.antecedentes?.intervenciones_quirúrgicas || '-'}\nCoagulación: ${data.antecedentes?.problemas_coagulación || '-'}\nAnestésicos: ${data.antecedentes?.problemas_anestésicos || '-'}\nCardiovasculares: ${data.antecedentes?.problemas_cardiovasculares || '-'}\nFuma: ${data.antecedentes?.fuma || '-'}\nAlcohol: ${data.antecedentes?.alcohol || '-'}`
    );

    // 6. Signos Vitales
    agregarSeccion(
      '6. Signos Vitales',
      `FR: ${data.signos_vitales?.frecuencia_respiratoria || '-'}\nFC: ${data.signos_vitales?.frecuencia_cardíaca || '-'}\nPA: ${data.signos_vitales?.presión_arterial || '-'}\nSat O₂: ${data.signos_vitales?.saturación_oxígeno || '-'}\nTemp: ${data.signos_vitales?.temperatura_c || '-'}`
    );

    // 7. Examen Físico
    const ef = data.examen_físico || {};
    agregarSeccion(
      '7. Examen Físico',
      `Peso (kg): ${ef.peso_kg || '-'}\nAltura (cm): ${ef.altura_cm || '-'}\nCabeza y cuello: ${ef.cabeza_cuello || '-'}\nTórax: ${ef.tórax || '-'}\nRSCS: ${ef.rscs || '-'}\nAbdomen: ${ef.abdomen || '-'}\nExtremidades: ${ef.extremidades || '-'}`
    );

    // 8. Índice de Masa Corporal
    const imc = data.IMC || {};
    agregarSeccion(
      '8. Índice de Masa Corporal',
      `Valor: ${imc.valor || '-'}\nClasificación: ${imc.clasificación || '-'}`
    );

    // 9. Diagnóstico y Tratamiento lado a lado
    doc.addPage();
    y = margin;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(14);
    doc.text('9. Diagnóstico Presuntivo', margin, y);
    doc.text('10. Tratamiento', pageWidth / 2 + margin, y);
    y += 20;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
    const dx = doc.splitTextToSize(data.diagnóstico_y_tratamiento?.diagnóstico_presuntivo || '-', (pageWidth/2) - margin);
    const tx = doc.splitTextToSize(data.diagnóstico_y_tratamiento?.tratamiento || '-', (pageWidth/2) - margin);
    const maxL = Math.max(dx.length, tx.length);
    for (let i = 0; i < maxL; i++) {
      let posY = y + i * 14;
      if (posY > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage(); y = margin; posY = y + i * 14;
      }
      if (dx[i]) doc.text(dx[i], margin, posY);
      if (tx[i]) doc.text(tx[i], pageWidth / 2 + margin, posY);
    }

    // Pie de página
    const pageCount = doc.internal.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(150);
      doc.text(`Página ${p} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 20, { align: 'center' });
    }

    doc.save('historia_clinica.pdf');
  };

  return (
    <Button variant="contained" startIcon={<PictureAsPdfIcon />} onClick={crearPDF} sx={{ mt: 2 }}>
      Descargar PDF
    </Button>
  );
};

export default GenerarPDF;
