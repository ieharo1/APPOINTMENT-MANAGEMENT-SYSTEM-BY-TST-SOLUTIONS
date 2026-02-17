import PDFDocument from 'pdfkit';

export const buildIncomeReportPdf = ({ businessName, from, to, total, rows }) => {
  const doc = new PDFDocument({ margin: 40 });
  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));

  doc.fontSize(18).text(`Reporte de Ingresos - ${businessName}`);
  doc.moveDown().fontSize(12).text(`Rango: ${from} a ${to}`);
  doc.moveDown().text(`Total: $${total.toFixed(2)}`);
  doc.moveDown().text('Detalle de citas completadas pagadas:');

  rows.forEach((row) => {
    doc.text(`• ${row.date} ${row.time} - ${row.service} - $${row.price}`);
  });

  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });
};
