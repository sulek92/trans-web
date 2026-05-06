import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// @ts-expect-error: no type declarations for passport-azure-ad-oauth2
import { Strategy } from 'passport-azure-ad-oauth2';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class AzureADStrategy extends PassportStrategy(Strategy, 'azure-ad') {
  constructor() {
    super({
      clientID: process.env.AZURE_CLIENT_ID || 'dummy-client-id',
      clientSecret: process.env.AZURE_CLIENT_SECRET || 'dummy-client-secret',
      callbackURL: `${process.env.API_URL || 'http://localhost:4000'}/api/auth/azure/callback`,
      tenant: process.env.AZURE_TENANT_ID || 'common',
    });
  }

  async validate(accessToken: string): Promise<any> {
    const decoded: any = jwtDecode(accessToken);
    return {
      externalId: decoded.oid || decoded.sub,
      email: decoded.email || decoded.upn,
      name: decoded.name,
      provider: 'azure-ad',
      accessToken,
    };
  }
}
