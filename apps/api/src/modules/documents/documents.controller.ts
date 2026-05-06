import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get('label/:orderId')
  @UseGuards(JwtAuthGuard)
  async getLabel(@Param('orderId') orderId: string, @Res() res: Response) {
    const buffer = await this.documentsService.generateOrderLabel(orderId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=label-${orderId}.pdf`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('invoice/:orderId')
  @UseGuards(JwtAuthGuard)
  async getInvoice(@Param('orderId') orderId: string, @Res() res: Response) {
    const buffer =
      await this.documentsService.generateInvoicePlaceholder(orderId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice-${orderId}.pdf`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
