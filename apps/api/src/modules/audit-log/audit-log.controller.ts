import { Controller, Get, Post, Res, Body, UseGuards, Query } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../auth/role.enum';
import { AuditLogService } from './audit-log.service';

/**
 * Controller exposing audit log data for administrative users.
 * All endpoints are protected by JWT authentication and RBAC (admin role).
 */
@ApiTags('audit-log')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin/audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  /**
   * Returns the most recent audit log entries.
   * Query param `limit` can be provided to adjust number of records (default 50, max 200).
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve recent audit logs' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of audit log entries' })
  async getRecent(@Res() res: Response, @Query('limit') limit?: number) {
    const entries = await this.auditLogService.listRecent(limit);
    return res.json(entries);
  }

  /**
   * Exports audit logs as CSV file.
   * For simplicity we stream a basic CSV containing selected fields.
   */
  @Post('export')
  @ApiOperation({ summary: 'Export audit logs as CSV' })
  @ApiResponse({ status: 200, description: 'CSV file download' })
  async exportCsv(@Res() res: Response) {
    const entries = await this.auditLogService.listRecent(200);
    const header = 'createdAt,actorUserId,actorEmail,action,entityType,entityId,metadata\n';
    const rows = entries
      .map((e) => {
        const meta = e.metadata ? JSON.stringify(e.metadata).replace(/\n/g, ' ') : '';
        return `${e.createdAt.toISOString()},${e.actorUserId ?? ''},${e.actorEmail ?? ''},${e.action},${e.entityType},${e.entityId ?? ''},"${meta}"`;
      })
      .join('\n');
    const csv = header + rows;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="audit-logs.csv"');
    return res.send(csv);
  }
}
