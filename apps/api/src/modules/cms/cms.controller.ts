import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Body,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CmsService } from './cms.service';
import { UpdateCmsPageDto } from './dto/update-cms-page.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CacheControlInterceptor } from '../../common/interceptors/cache-control.interceptor';
import type { Request } from 'express';

type CmsPageInput = {
  slug: string;
  title: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
};

type AuthenticatedRequest = Request & {
  user?: { sub?: string; email?: string };
};

type DeleteMediaBody = {
  url?: string;
};

@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get('pages')
  @UseInterceptors(CacheControlInterceptor)
  async getPages() {
    return this.cmsService.getPages();
  }

  @Get('pages/:slug')
  @UseInterceptors(CacheControlInterceptor)
  async getPage(@Param('slug') slug: string) {
    return this.cmsService.getPageBySlug(slug);
  }

  @Delete('pages/:slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deletePage(@ControllerParam('slug') slug: string, @Req() req: AuthenticatedRequest) {
    // Delete a CMS page and log the action
    return this.cmsService.deletePage(slug, { userId: req.user?.sub, email: req.user?.email });
  }

  @Put('pages/:slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updatePage(
    @Param('slug') slug: string,
    @Body() updateCmsPageDto: UpdateCmsPageDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.cmsService.updatePage(slug, updateCmsPageDto, {
      userId: req.user?.sub,
      email: req.user?.email,
    });
  }

  @Get('articles')
  @UseInterceptors(CacheControlInterceptor)
  async getArticles() {
    return this.cmsService.getArticles();
  }

  @Get('media')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async listMedia() {
    return this.cmsService.listMedia();
  }

  @Post('media/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('Plik jest wymagany.');
    }
    return this.cmsService.uploadMedia(file, {
      userId: req.user?.sub,
      email: req.user?.email,
    });
  }

  @Delete('media')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteMedia(
    @Body() body: DeleteMediaBody,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!body?.url) {
      throw new BadRequestException('URL pliku jest wymagany.');
    }
    return this.cmsService.deleteMedia(body.url, {
      userId: req.user?.sub,
      email: req.user?.email,
    });
  }

  // CMS Page input type moved to top-level for TypeScript validity

  @Post('pages/import')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async importPages(
    @Body() payload: { pages: CmsPageInput[] },
    @Req() req: AuthenticatedRequest,
  ) {
    const pages = payload.pages.map((p) => ({ slug: p.slug, title: p.title, content: p.content, metaTitle: p.metaTitle, metaDescription: p.metaDescription, isPublished: p.isPublished }));
    return this.cmsService.importPages(pages as any, { userId: req.user?.sub, email: req.user?.email });
  }

  @Get('pages/export')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async exportPages() {
    return this.cmsService.exportPages();
  }

  @Post('pages/bulk-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async bulkDeletePages(@Body() payload: { slugs: string[] }, @Req() req: AuthenticatedRequest) {
    const slugs = payload.slugs ?? [];
    return this.cmsService.bulkDeletePages(slugs, { userId: req.user?.sub, email: req.user?.email });
  }
}
