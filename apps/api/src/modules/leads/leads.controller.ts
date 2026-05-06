import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadStatusDto } from './dto/lead.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import type { Request, Response } from 'express';

type AuthenticatedRequest = Request & {
  user?: { sub?: string; email?: string };
};

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  async createLead(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.createLead(createLeadDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getLeads() {
    return this.leadsService.getLeads();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getLead(@Param('id') id: string) {
    return this.leadsService.getLeadById(id);
  }

  @Get('export/csv')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async exportCsv(@Res() res: Response) {
    const leads = await this.leadsService.getLeads();
    const header = 'ID,Data,Imie i Nazwisko,Email,Firma,Status\n';
    const rows = leads.map(l => 
      `${l.id},${new Date(l.createdAt).toLocaleDateString()},${l.name},${l.email},${l.company},${l.status}`
    ).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leady.csv');
    return res.send(header + rows);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateLeadStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.leadsService.updateLeadStatus(id, updateStatusDto, {
      userId: req.user?.sub,
      email: req.user?.email,
    });
  }

  @Put(':id/notes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateNotes(
    @Param('id') id: string,
    @Body('notes') notes: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.leadsService.updateLeadNotes(id, notes, {
      userId: req.user?.sub,
      email: req.user?.email,
    });
  }
}
