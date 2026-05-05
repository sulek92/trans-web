import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { db } from '../../db';
import { users, addresses, companies } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import type { Request } from 'express';

type AuthenticatedRequest = Request & {
  user?: { sub?: string };
};

@Controller('users')
export class UsersController {
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getUsers() {
    return db.select().from(users);
  }

  @Get('me/addresses')
  @UseGuards(JwtAuthGuard)
  async getMyAddresses(@Req() req: AuthenticatedRequest) {
    const userId = req.user?.sub;
    if (!userId) {
      return [];
    }
    return db.select().from(addresses).where(eq(addresses.userId, userId));
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: AuthenticatedRequest) {
    const userId = req.user?.sub;
    if (!userId) {
      return null;
    }
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user;
  }

  @Get('me/company')
  @UseGuards(JwtAuthGuard)
  async getMyCompany(@Req() req: AuthenticatedRequest) {
    const userId = req.user?.sub;
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
}
