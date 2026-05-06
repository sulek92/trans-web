import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ErpAdaptersService } from './erp-adapters.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('erp-adapters')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ErpAdaptersController {
  constructor(private readonly erpAdaptersService: ErpAdaptersService) {}

  @Post('subiekt/import')
  @Roles('admin', 'customer') // Both admins and customers can import their own data
  @UseInterceptors(FileInterceptor('file'))
  async importSubiekt(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (!file) throw new BadRequestException('File is required');
    
    const content = file.buffer.toString('utf-8');
    return this.erpAdaptersService.processSubiektXml(content, req.user.sub);
  }

  @Post('optima/import')
  @Roles('admin', 'customer')
  @UseInterceptors(FileInterceptor('file'))
  async importOptima(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (!file) throw new BadRequestException('File is required');

    const content = file.buffer.toString('utf-8');
    return this.erpAdaptersService.processOptimaCsv(content, req.user.sub);
  }
}
