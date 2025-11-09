const PDFDocument = require('pdfkit');

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const buildInvoiceStream = (order, user) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  const createdDate = order?.createdAt ? new Date(order.createdAt) : new Date();
  const items = Array.isArray(order?.items) ? order.items : [];
  const buyerName = user?.name || 'Valued Customer';
  const buyerEmail = user?.email || 'Unavailable';

  doc.fontSize(22).text('Handcrafted Marketplace (Demo)', { align: 'left' });
  doc.moveDown(0.2);
  doc.fontSize(12).fillColor('#374151').text(`Invoice No: INV-${order?.id || 'N/A'}`);
  doc.text(`Date: ${createdDate.toLocaleDateString()}`);
  doc.moveDown();

  doc.fillColor('#000000').font('Helvetica-Bold').text('Seller');
  doc.font('Helvetica').text('Handcrafted Marketplace (Demo)');
  doc.moveDown(0.5);

  doc.font('Helvetica-Bold').text('Buyer');
  doc.font('Helvetica').text(buyerName);
  doc.text(buyerEmail);
  doc.moveDown(1);

  const startY = doc.y;
  const columnPositions = {
    index: 50,
    item: 80,
    price: 330,
    qty: 400,
    total: 470,
  };

  doc.font('Helvetica-Bold');
  doc.text('#', columnPositions.index, startY, { width: 30 });
  doc.text('Item', columnPositions.item, startY, { width: 240 });
  doc.text('Price', columnPositions.price, startY, { width: 70, align: 'right' });
  doc.text('Qty', columnPositions.qty, startY, { width: 50, align: 'right' });
  doc.text('Line Total', columnPositions.total, startY, { width: 90, align: 'right' });
  doc.moveDown(0.5);
  doc.font('Helvetica');

  items.forEach((item, idx) => {
    const rowY = doc.y;
    doc.text(String(idx + 1), columnPositions.index, rowY, { width: 30 });
    doc.text(item?.name || 'Item unavailable', columnPositions.item, rowY, { width: 240 });
    doc.text(formatCurrency(item?.price), columnPositions.price, rowY, { width: 70, align: 'right' });
    doc.text(String(item?.qty || 0), columnPositions.qty, rowY, { width: 50, align: 'right' });
    doc.text(formatCurrency(item?.lineTotal), columnPositions.total, rowY, {
      width: 90,
      align: 'right',
    });
    doc.moveDown(0.35);
  });

  doc.moveDown(0.75);
  const subtotal = Number(order?.total || 0);
  doc.text(`Subtotal: ${formatCurrency(subtotal)}`, { align: 'right' });
  doc.text('Tax: $0.00', { align: 'right' });
  doc.font('Helvetica-Bold').text(`Grand Total: ${formatCurrency(subtotal)}`, { align: 'right' });
  doc.font('Helvetica');

  doc.moveDown(2);
  doc.fontSize(10).text('Thank you for your purchase.', { align: 'left' });
  doc.text(`Order reference: ${order?.id}`);

  doc.end();
  return doc;
};

module.exports = { buildInvoiceStream };
