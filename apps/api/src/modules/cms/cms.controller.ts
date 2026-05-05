import { Controller, Get, Body, Param, Put, UseGuards } from '@nestjs/common';
import { CmsService } from './cms.service';
import { UpdateCmsPageDto } from './dto/update-cms-page.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get('pages')
  async getPages() {
    return this.cmsService.getPages();
  }

  @Get('pages/:slug')
  async getPage(@Param('slug') slug: string) {
    return this.cmsService.getPageBySlug(slug);
  }

  @Put('pages/:slug')
  @UseGuards(JwtAuthGuard)
  async updatePage(
    @Param('slug') slug: string,
    @Body() updateCmsPageDto: UpdateCmsPageDto,
  ) {
    return this.cmsService.updatePage(slug, updateCmsPageDto);
  }

  @Get('articles')
  async getArticles() {
    return this.cmsService.getArticles();
  }
}
