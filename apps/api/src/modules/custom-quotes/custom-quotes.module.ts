import { Module } from '@nestjs/common';
import { CustomQuotesController } from './custom-quotes.controller';
import { CustomQuotesService } from './custom-quotes.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CustomQuotesController],
  providers: [CustomQuotesService],
  exports: [CustomQuotesService],
})
export class CustomQuotesModule {}
