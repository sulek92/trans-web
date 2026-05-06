import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiKeyService } from './api-key.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'] || request.query['api_key'];

    if (!apiKey) {
      throw new UnauthorizedException('Missing API Key');
    }

    const user = await this.apiKeyService.validateKey(apiKey);
    if (!user) {
      throw new UnauthorizedException('Invalid API Key');
    }

    // Attach user to request for downstream use
    request.user = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };

    return true;
  }
}
