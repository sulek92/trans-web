import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  ServiceUnavailableException,
  UseGuards,
  Delete,
  Post,
} from '@nestjs/common';
import { db } from '../../db';
import { users, addresses, companies } from '../../db/schema';
import { eq, ne, and } from 'drizzle-orm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import type { Request } from 'express';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuthService } from '../auth/auth.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { UpdateUserDto, BulkUpdateUserStatusDto } from './dto/user.dto';
import { sql } from 'drizzle-orm';

type AuthenticatedRequest = Request & {
  user?: { sub?: string; email?: string; role?: string };
};

type UpdateUserStatusPayload = {
  status: 'ACTIVE' | 'PENDING' | 'BLOCKED';
};

@Controller('users')
export class UsersController {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getUsers() {
    try {
      const rows = await db
        .select({
          id: users.id,
          email: users.email,
          role: users.role,
          isVerified: users.isVerified,
          companyName: companies.name,
          nip: companies.nip,
          firstName: users.firstName,
          lastName: users.lastName,
        })
        .from(users)
        .leftJoin(companies, eq(users.companyId, companies.id))
        .where(ne(users.role, 'superadmin'));

      return rows.map((row) => ({
        id: row.id,
        email: row.email,
        role: row.role,
        companyName: row.companyName,
        nip: row.nip,
        firstName: row.firstName,
        lastName: row.lastName,
        status: row.isVerified ? 'ACTIVE' : 'PENDING',
      }));
    } catch {
      return [
        {
          id: 'fallback-admin',
          email: process.env.ADMIN_EMAIL || 'admin@paletbroker.pl',
          role: 'admin',
          companyName: null,
          nip: null,
          status: 'ACTIVE',
        },
        {
          id: 'fallback-customer',
          email: process.env.DEMO_USER_EMAIL || 'user@paletbroker.pl',
          role: 'customer',
          companyName: null,
          nip: null,
          status: 'ACTIVE',
        },
      ];
    }
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateUserStatusPayload,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!['ACTIVE', 'PENDING', 'BLOCKED'].includes(body.status)) {
      throw new BadRequestException('Invalid status');
    }

    const isVerified = body.status === 'ACTIVE';
    const [targetUser] = await db.select().from(users).where(eq(users.id, id));

    if (!targetUser) throw new BadRequestException('User not found');

    // Protect superadmin from standard admin
    if (targetUser.role === 'superadmin' && req.user?.role !== 'superadmin') {
      throw new BadRequestException('Cannot modify superadmin account');
    }

    let updated:
      | {
          id: string;
          email: string;
          role: string;
          isVerified: boolean | null;
        }
      | undefined;
    try {
      [updated] = await db
        .update(users)
        .set({
          isVerified,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning({
          id: users.id,
          email: users.email,
          role: users.role,
          isVerified: users.isVerified,
        });
    } catch {
      throw new ServiceUnavailableException(
        'User status update is temporarily unavailable',
      );
    }

    if (!updated) {
      throw new BadRequestException('User not found');
    }

    await this.auditLogService.record({
      actorUserId: req.user?.sub,
      actorEmail: req.user?.email,
      action: 'user.status_updated',
      entityType: 'user',
      entityId: updated.id,
      metadata: {
        status: body.status,
        isVerified,
      },
    });

    return {
      id: updated.id,
      email: updated.email,
      role: updated.role,
      status: updated.isVerified ? 'ACTIVE' : body.status,
    };
  }

  @Post('bulk-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async bulkUpdateStatus(
    @Body() body: BulkUpdateUserStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const isVerified = body.status === 'ACTIVE';

    const targetUsers = await db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(sql`${users.id} = ANY(${body.ids})`);

    if (
      targetUsers.some((u) => u.role === 'superadmin') &&
      req.user?.role !== 'superadmin'
    ) {
      throw new BadRequestException(
        'Cannot modify superadmin accounts via bulk action',
      );
    }

    const updated = await db
      .update(users)
      .set({
        isVerified,
        updatedAt: new Date(),
      })
      .where(sql`${users.id} = ANY(${body.ids})` as any)
      .returning({
        id: users.id,
        email: users.email,
      });

    await this.auditLogService.record({
      actorUserId: req.user?.sub,
      actorEmail: req.user?.email,
      action: 'user.bulk_status_updated',
      entityType: 'user',
      entityId: 'multiple',
      metadata: {
        ids: body.ids,
        status: body.status,
        count: updated.length,
      },
    });

    return {
      count: updated.length,
      status: body.status,
    };
  }

  @Get('me/addresses')
  @UseGuards(JwtAuthGuard)
  async getMyAddresses(@Req() req: AuthenticatedRequest) {
    const userId = req.user?.sub || (req.user as any)?.id;
    if (!userId) {
      return [];
    }
    return db.select().from(addresses).where(eq(addresses.userId, userId));
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: AuthenticatedRequest) {
    const userPayload = req.user;
    if (!userPayload) {
      return null;
    }

    const identity = this.authService.me(userPayload);
    if (!identity) return null;

    try {
      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, identity.id));
      if (dbUser) return dbUser;
    } catch {
      // Ignore DB errors in fallback mode
    }

    return {
      id: identity.id,
      email: identity.email,
      role: identity.role,
      isVerified: true,
    };
  }

  @Get('me/company')
  @UseGuards(JwtAuthGuard)
  async getMyCompany(@Req() req: AuthenticatedRequest) {
    const userId = req.user?.sub || (req.user as any)?.id;
    if (!userId) {
      return null;
    }
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (user?.companyId) {
      const [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.id, user.companyId));
      return company;
    }

    return null;
  }

  @Post('me/addresses')
  @UseGuards(JwtAuthGuard)
  async addAddress(
    @Body() dto: CreateAddressDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.sub || (req.user as any)?.id;
    if (!userId) throw new BadRequestException();

    if (dto.isDefaultSender) {
      await db
        .update(addresses)
        .set({ isDefaultSender: false })
        .where(eq(addresses.userId, userId));
    }
    if (dto.isDefaultRecipient) {
      await db
        .update(addresses)
        .set({ isDefaultRecipient: false })
        .where(eq(addresses.userId, userId));
    }

    const [newAddress] = await db
      .insert(addresses)
      .values({
        ...dto,
        userId,
      })
      .returning();
    return newAddress;
  }

  @Put('me/addresses/:id')
  @UseGuards(JwtAuthGuard)
  async updateAddress(
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.sub || (req.user as any)?.id;
    if (!userId) throw new BadRequestException();

    if (dto.isDefaultSender) {
      await db
        .update(addresses)
        .set({ isDefaultSender: false })
        .where(eq(addresses.userId, userId));
    }
    if (dto.isDefaultRecipient) {
      await db
        .update(addresses)
        .set({ isDefaultRecipient: false })
        .where(eq(addresses.userId, userId));
    }

    const [updated] = await db
      .update(addresses)
      .set(dto)
      .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
      .returning();

    if (!updated) throw new BadRequestException('Address not found');
    return updated;
  }

  @Delete('me/addresses/:id')
  @UseGuards(JwtAuthGuard)
  async deleteAddress(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.sub || (req.user as any)?.id;
    if (!userId) throw new BadRequestException();

    const [deleted] = await db
      .delete(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
      .returning();

    if (!deleted) throw new BadRequestException('Address not found');
    return { success: true };
  }

  @Put('me/company')
  @UseGuards(JwtAuthGuard)
  async updateMyCompany(@Body() dto: any, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.sub || (req.user as any)?.id;
    if (!userId) throw new BadRequestException();

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user?.companyId)
      throw new BadRequestException('No company associated');

    const [updated] = await db
      .update(companies)
      .set(dto)
      .where(eq(companies.id, user.companyId))
      .returning();

    return updated;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (dto.email) updateData.email = dto.email;
    if (dto.role) updateData.role = dto.role;
    if (dto.firstName) updateData.firstName = dto.firstName;
    if (dto.lastName) updateData.lastName = dto.lastName;
    if (dto.password) {
      updateData.passwordHash = await this.authService.hashPassword(
        dto.password,
      );
    }

    const [targetUser] = await db.select().from(users).where(eq(users.id, id));

    if (!targetUser) throw new BadRequestException('User not found');

    // Protect superadmin from standard admin
    if (targetUser.role === 'superadmin' && req.user?.role !== 'superadmin') {
      throw new BadRequestException('Cannot modify superadmin account');
    }

    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    if (!updated) throw new BadRequestException('User not found');

    await this.auditLogService.record({
      actorUserId: req.user?.sub,
      actorEmail: req.user?.email,
      action: 'user.updated_by_admin',
      entityType: 'user',
      entityId: updated.id,
      metadata: {
        updatedFields: Object.keys(dto),
        newRole: dto.role,
      },
    });

    return updated;
  }
}
