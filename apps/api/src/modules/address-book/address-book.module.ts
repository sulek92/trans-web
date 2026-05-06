import { Module } from '@nestjs/common';
import { AddressBookController } from './address-book.controller';
import { AddressBookService } from './address-book.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AddressBookController],
  providers: [AddressBookService],
  exports: [AddressBookService],
})
export class AddressBookModule {}
