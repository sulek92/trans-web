import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuthSessionService } from './auth-session.service';

import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { AzureADStrategy } from './strategies/azure-ad.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret:
        process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'local-secret',
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthSessionService,
    JwtAuthGuard,
    RolesGuard,
    GoogleStrategy,
    AzureADStrategy,
  ],
  exports: [AuthService, AuthSessionService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
