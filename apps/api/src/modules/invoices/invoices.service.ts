import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../db';
import { invoices } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InvoicesService {
  async getInvoice(id: string) {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async createCorrection(originalInvoiceId: string, diffAmountNet: number, reason: string) {
    const original = await this.getInvoice(originalInvoiceId);
    
    const vatRate = 0.23; // Fixed for now, should be dynamic
    const diffVat = diffAmountNet * vatRate;
    const diffBrutto = diffAmountNet + diffVat;

    const [correction] = await db.insert(invoices).values({
      invoiceNumber: `KOR/${original.invoiceNumber}/${Date.now()}`,
      userId: original.userId,
      companyId: original.companyId,
      status: 'PAID', // Usually corrections are balanced automatically
      totalNetto: diffAmountNet.toString(),
      totalVat: diffVat.toString(),
      totalBrutto: diffBrutto.toString(),
      currency: original.currency,
      correctionFor: original.id,
      createdAt: new Date(),
    }).returning();

    return correction;
  }
}
