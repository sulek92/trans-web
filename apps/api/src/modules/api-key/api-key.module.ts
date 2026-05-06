import { Module, Global } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';

@Global()
@Module({
  providers: [ApiKeyService],
  exports: [ApiKeyService],
})
export class ApiKeyModule {}
