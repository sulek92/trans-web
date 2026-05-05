import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../db';
import { cmsPages, cmsArticles } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { UpdateCmsPageDto } from './dto/update-cms-page.dto';

@Injectable()
export class CmsService {
  async getPages() {
    return db.select().from(cmsPages);
  }

  async getPageBySlug(slug: string) {
    const [page] = await db
      .select()
      .from(cmsPages)
      .where(eq(cmsPages.slug, slug));
    if (!page) throw new NotFoundException(`Page with slug ${slug} not found`);
    return page;
  }

  async updatePage(slug: string, data: UpdateCmsPageDto) {
    const [updated] = await db
      .update(cmsPages)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(cmsPages.slug, slug))
      .returning();

    if (!updated)
      throw new NotFoundException(`Page with slug ${slug} not found`);
    return updated;
  }

  async getArticles() {
    return db.select().from(cmsArticles);
  }
}
