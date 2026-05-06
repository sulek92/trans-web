import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AddressBookService } from './address-book.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('address-book')
@UseGuards(JwtAuthGuard)
export class AddressBookController {
  constructor(private readonly addressBookService: AddressBookService) {}

  @Get()
  async getMyAddresses(@Req() req: any) {
    return this.addressBookService.getMyAddresses(req.user.sub);
  }

  @Post()
  async addAddress(@Body() data: any, @Req() req: any) {
    return this.addressBookService.addAddress(req.user.sub, data);
  }

  @Post('bulk')
  async bulkAddAddresses(@Body() data: any[], @Req() req: any) {
    return this.addressBookService.bulkAddAddresses(req.user.sub, data);
  }

  @Delete(':id')
  async deleteAddress(@Param('id') id: string, @Req() req: any) {
    return this.addressBookService.deleteAddress(req.user.sub, id);
  }
}
