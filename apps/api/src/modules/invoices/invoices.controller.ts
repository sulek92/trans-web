import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { DocumentsService } from '../documents/documents.service';
import type { Response } from 'express';
import archiver from 'archiver';
import { db } from '../../db';
import { invoices } from '../../db/schema';
import { gte, lte, and } from 'drizzle-orm';

@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly documentsService: DocumentsService,
  ) {}

  @Post('correction')
  async createCorrection(
    @Body()
    body: {
      originalInvoiceId: string;
      diffAmountNet: number;
      reason: string;
    },
  ) {
    return this.invoicesService.createCorrection(
      body.originalInvoiceId,
      body.diffAmountNet,
      body.reason,
    );
  }

  @Get('export/zip')
  async exportZip(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const list = await db
      .select()
      .from(invoices)
      .where(and(gte(invoices.createdAt, start), lte(invoices.createdAt, end)));

    if (list.length === 0) {
      return res.status(404).send('No invoices found for this range');
    }

    const archive = archiver('zip', { zlib: { level: 9 } });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=faktury-${startDate}-${endDate}.zip`,
    );

    archive.pipe(res);

    for (const inv of list) {
      try {
        const pdf = await this.documentsService.generateInvoicePdf(inv.id);
        const filename = `${inv.invoiceNumber.replace(/\//g, '_')}.pdf`;
        archive.append(pdf, { name: filename });
      } catch (err) {
        console.error(`Failed to generate PDF for invoice ${inv.id}:`, err);
      }
    }

    await archive.finalize();
  }
}
