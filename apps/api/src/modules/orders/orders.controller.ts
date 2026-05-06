import {
  Controller,
  Post,
  Put,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';

type AuthenticatedRequest = Request & {
  user?: { sub?: string };
};

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    // If user is logged in (token provided), req.user will be populated
    // Note: This requires the route to be processed by a strategy but not blocked
    return this.ordersService.createOrder(createOrderDto, req.user?.sub);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyOrders(@Req() req: AuthenticatedRequest) {
    const userId = req.user?.sub;
    if (!userId) {
      return [];
    }
    return this.ordersService.getMyOrders(userId);
  }

  @Get('my/:id')
  @UseGuards(JwtAuthGuard)
  async getMyOrder(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.sub;
    if (!userId) throw new BadRequestException();
    return this.ordersService.getMyOrder(id, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(id);
  }

  @Get('export/csv')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async exportCsv(@Res() res: Response) {
    const orders = await this.ordersService.getAllOrders();

    const escapeCsv = (str: string) => {
      if (!str) return '""';
      const escaped = str.toString().replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const header =
      'ID,Nr Zamowienia,Data,Klient,Firma,Przewoznik,Status,Kwota Netto,Kwota Brutto\n';
    const rows = orders
      .map((o) => {
        const sender = (o.senderAddress as any) || {};
        return [
          o.id,
          o.orderNumber,
          new Date(o.createdAt).toISOString(),
          escapeCsv(sender.name),
          escapeCsv(sender.companyName),
          o.carrierCode,
          o.status,
          o.priceNetto,
          o.priceBrutto,
        ].join(',');
      })
      .join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=zamowienia.csv');
    return res.send('\ufeff' + header + rows); // Add BOM for Excel UTF-8 support
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }

  @Post(':id/generate-label')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async generateLabel(@Param('id') id: string) {
    return this.ordersService.generateLabel(id);
  }

  @Get('my/:id/invoice')
  @UseGuards(JwtAuthGuard)
  async getMyOrderInvoice(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) throw new BadRequestException();

    const pdf = await this.ordersService.getOrderInvoicePdf(id, userId);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=faktura-${id}.pdf`);
    return res.send(pdf);
  }

  @Post('bulk-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async bulkUpdateStatus(@Body() data: { ids: string[]; status: string }) {
    return this.ordersService.bulkUpdateStatus(data.ids, data.status);
  }
}
