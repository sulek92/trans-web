import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class DocumentsService {
  constructor(
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
  ) {}

  async generateOrderLabel(orderId: string): Promise<Buffer> {
    const order = await this.ordersService.getOrder(orderId);
    if (!order) throw new NotFoundException('Order not found');

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A6', margin: 20 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err: Error) => reject(err));

      // Draw Label Content
      doc.rect(0, 0, doc.page.width, doc.page.height).stroke();

      doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .text('PALETBROKER.PL', { align: 'center' });
      doc.moveDown();

      doc.fontSize(10).font('Helvetica-Bold').text('NADAWCA:');
      const sender = order.senderAddress as any;
      doc.fontSize(9).font('Helvetica').text(`${sender.name}`);
      if (sender.companyName) doc.text(`${sender.companyName}`);
      doc.text(`${sender.addressLine}`);
      doc.text(`${sender.postalCode} ${sender.city}`);
      doc.text(`Tel: ${sender.phone}`);

      doc.moveDown();
      doc.fontSize(10).font('Helvetica-Bold').text('ODBIORCA:');
      const recipient = order.recipientAddress as any;
      doc.fontSize(12).font('Helvetica-Bold').text(`${recipient.name}`);
      doc.fontSize(10).font('Helvetica').text(`${recipient.addressLine}`);
      doc.text(`${recipient.postalCode} ${recipient.city}`);
      doc.text(`Tel: ${recipient.phone}`);

      doc.moveDown(2);
      doc
        .fontSize(8)
        .text('PRZEWOŹNIK:', { continued: true })
        .font('Helvetica-Bold')
        .text(` ${order.carrierCode}`);
      doc
        .font('Helvetica')
        .text('USŁUGA:', { continued: true })
        .font('Helvetica-Bold')
        .text(` ${order.carrierService || 'Standard'}`);

      doc.moveDown();
      doc.rect(20, doc.y, doc.page.width - 40, 40).stroke();
      doc
        .fontSize(14)
        .text(order.orderNumber, 20, doc.y + 12, { align: 'center' });

      doc.end();
    });
  }

  async generateInvoicePlaceholder(orderId: string): Promise<Buffer> {
    const order = await this.ordersService.getOrder(orderId);
    if (!order) throw new NotFoundException('Order not found');

    const currency = order.currency || 'PLN';

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // Invoice Header
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('INVOICE / FAKTURA', { align: 'right' });
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(`Number: FV/${order.orderNumber}`, { align: 'right' });
      doc.text(`Date / Data: ${new Date().toLocaleDateString('pl-PL')}`, {
        align: 'right',
      });

      doc.moveDown(2);

      const startY = doc.y;
      doc.fontSize(10).font('Helvetica-Bold').text('Seller / Sprzedawca:');
      doc.font('Helvetica').text('PaletBroker Sp. z o.o.');
      doc.text('ul. Logistyczna 1');
      doc.text('00-001 Warszawa, Poland');
      doc.text('VAT ID / NIP: 1234567890');

      doc.text('Buyer / Nabywca:', 300, startY, { align: 'left' });
      const sender = order.senderAddress as any;
      doc.font('Helvetica').text(sender.companyName || sender.name, 300, doc.y);
      doc.text(sender.addressLine, 300, doc.y);
      doc.text(`${sender.postalCode} ${sender.city}`, 300, doc.y);
      if (sender.country) doc.text(sender.country, 300, doc.y);

      doc.moveDown(4);

      // Table Header
      const tableTop = doc.y;
      doc.font('Helvetica-Bold');
      doc.text('Service / Usługa', 50, tableTop);
      doc.text('Qty / Il.', 280, tableTop);
      doc.text('Net / Netto', 330, tableTop);
      doc.text('VAT', 420, tableTop);
      doc.text('Gross / Brutto', 480, tableTop);

      doc
        .moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke();

      // Table Row
      const rowY = tableTop + 25;
      doc.font('Helvetica');
      doc.text(`Pallet Transport - ${order.carrierCode}`, 50, rowY);
      doc.text('1', 280, rowY);
      doc.text(`${order.priceNetto} ${currency}`, 330, rowY);
      doc.text('23%', 420, rowY);
      doc.text(`${order.priceBrutto} ${currency}`, 480, rowY);

      doc.moveDown(5);
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text(`TOTAL / DO ZAPŁATY: ${order.priceBrutto} ${currency}`, {
          align: 'right',
        });

      doc.moveDown(2);
      doc
        .fontSize(8)
        .font('Helvetica')
        .text('Generated automatically by PaletBroker Platform.', {
          align: 'center',
        });

      doc.end();
    });
  }

  async generateInvoicePdf(invoiceId: string): Promise<Buffer> {
    const { invoices, companies } = await import('../../db/schema.js');
    const { sql } = await import('drizzle-orm');
    const { db } = await import('../../db/index.js');

    const [invoice] = (await db
      .select()
      .from(invoices)
      .where(sql`${invoices.id} = ${invoiceId}` as any));
    if (!invoice) throw new NotFoundException('Invoice not found');

    let buyer: any = null;
    if (invoice.companyId) {
      [buyer] = await db
        .select()
        .from(companies)
        .where(sql`${companies.id} = ${invoice.companyId}` as any);
    }

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      const isCorrection = !!invoice.correctionFor;

      // Header
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text(isCorrection ? 'CORRECTION / KOREKTA' : 'INVOICE / FAKTURA', {
          align: 'right',
        });
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(`Number: ${invoice.invoiceNumber}`, { align: 'right' });
      doc.text(
        `Date / Data: ${new Date(invoice.createdAt || '').toLocaleDateString('pl-PL')}`,
        { align: 'right' },
      );

      doc.moveDown(2);

      const startY = doc.y;
      doc.fontSize(10).font('Helvetica-Bold').text('Seller / Sprzedawca:');
      doc.font('Helvetica').text('PaletBroker Sp. z o.o.');
      doc.text('ul. Logistyczna 1');
      doc.text('00-001 Warszawa, Poland');
      doc.text('VAT ID / NIP: 1234567890');

      if (buyer) {
        doc.text('Buyer / Nabywca:', 300, startY, { align: 'left' });
        doc.font('Helvetica').text(buyer.name, 300, doc.y);
        doc.text(`${buyer.addressLine || ''}`, 300, doc.y);
        doc.text(`${buyer.postalCode || ''} ${buyer.city || ''}`, 300, doc.y);
        if (buyer.nip) doc.text(`NIP: ${buyer.nip}`, 300, doc.y);
      }

      doc.moveDown(4);

      // Table
      const tableTop = doc.y;
      doc.font('Helvetica-Bold');
      doc.text('Service / Usługa', 50, tableTop);
      doc.text('Net / Netto', 330, tableTop);
      doc.text('VAT', 420, tableTop);
      doc.text('Gross / Brutto', 480, tableTop);

      doc
        .moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke();

      const rowY = tableTop + 25;
      doc.font('Helvetica');
      doc.text(
        isCorrection
          ? `Correction for ${invoice.correctionFor}`
          : 'Transport Services',
        50,
        rowY,
      );
      doc.text(`${invoice.totalNetto} ${invoice.currency}`, 330, rowY);
      doc.text('23%', 420, rowY);
      doc.text(`${invoice.totalBrutto} ${invoice.currency}`, 480, rowY);

      doc.moveDown(5);
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text(
          `TOTAL / DO ZAPŁATY: ${invoice.totalBrutto} ${invoice.currency}`,
          { align: 'right' },
        );

      doc.end();
    });
  }
}
