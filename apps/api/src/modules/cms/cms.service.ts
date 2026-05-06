import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { db } from '../../db';
import { cmsPages, cmsArticles } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { UpdateCmsPageDto } from './dto/update-cms-page.dto';
type CmsPageInput = {
  slug: string;
  title: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
};
import { AuditLogService } from '../audit-log/audit-log.service';

type ActorContext = {
  userId?: string;
  email?: string;
};

type CmsMediaItem = {
  url: string;
  fileName: string;
  size: number;
  updatedAt: string;
};

const MEDIA_PUBLIC_PREFIX = '/images/uploads';
const ALLOWED_IMAGE_MIME_TYPES = new Map<string, string>([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif'],
  ['image/gif', 'gif'],
]);

@Injectable()
export class CmsService {
  private readonly mediaDirectory = path.resolve(
    process.cwd(),
    'apps/web/public/images/uploads',
  );

  constructor(private readonly auditLogService: AuditLogService) {}

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

  async updatePage(slug: string, data: UpdateCmsPageDto, actor?: ActorContext) {
    const now = new Date();
    const [updated] = await db
      .update(cmsPages)
      .set({ ...data, updatedAt: now })
      .where(eq(cmsPages.slug, slug))
      .returning();

    if (updated) {
      await this.auditLogService.record({
        actorUserId: actor?.userId,
        actorEmail: actor?.email,
        action: 'cms.page_updated',
        entityType: 'cms_page',
        entityId: updated.id,
        metadata: {
          slug,
          title: data.title,
          isPublished: data.isPublished,
        },
      });

      return updated;
    }

    try {
      const [created] = await db
        .insert(cmsPages)
        .values({
          slug,
          title: data.title,
          content: data.content ?? null,
          metaTitle: data.metaTitle ?? null,
          metaDescription: data.metaDescription ?? null,
          isPublished: data.isPublished ?? true,
          updatedAt: now,
        })
        .returning();

      if (!created) {
        throw new NotFoundException(`Page with slug ${slug} not found`);
      }

      await this.auditLogService.record({
        actorUserId: actor?.userId,
        actorEmail: actor?.email,
        action: 'cms.page_created',
        entityType: 'cms_page',
        entityId: created.id,
        metadata: {
          slug,
          title: data.title,
          isPublished: data.isPublished ?? true,
        },
      });

      return created;
    } catch {
      const [afterConflict] = await db
        .update(cmsPages)
        .set({ ...data, updatedAt: now })
        .where(eq(cmsPages.slug, slug))
        .returning();

      if (!afterConflict) {
        throw new NotFoundException(`Page with slug ${slug} not found`);
      }

      await this.auditLogService.record({
        actorUserId: actor?.userId,
        actorEmail: actor?.email,
        action: 'cms.page_updated',
        entityType: 'cms_page',
        entityId: afterConflict.id,
        metadata: {
          slug,
          title: data.title,
          isPublished: data.isPublished,
        },
      });

      return afterConflict;
    }
  }

  async getArticles() {
    return db.select().from(cmsArticles);
  }

  async listMedia(): Promise<CmsMediaItem[]> {
    await this.ensureMediaDirectory();

    const dirEntries = await fs.readdir(this.mediaDirectory, {
      withFileTypes: true,
    });
    const files = dirEntries.filter((entry) => entry.isFile());

    const withStats = await Promise.all(
      files.map(async (entry) => {
        const absolutePath = path.join(this.mediaDirectory, entry.name);
        const stats = await fs.stat(absolutePath);
        return {
          url: `${MEDIA_PUBLIC_PREFIX}/${entry.name}`,
          fileName: entry.name,
          size: stats.size,
          updatedAt: stats.mtime.toISOString(),
        };
      }),
    );

    return withStats.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }

  async uploadMedia(file: Express.Multer.File, actor?: ActorContext) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Plik jest wymagany.');
    }

    const fileExtension = ALLOWED_IMAGE_MIME_TYPES.get(file.mimetype);
    if (!fileExtension) {
      throw new BadRequestException(
        'Nieobsługiwany typ pliku. Dozwolone: JPG, PNG, WEBP, AVIF, GIF.',
      );
    }

    await this.ensureMediaDirectory();

    const originalBase = path.parse(file.originalname || 'media').name;
    const safeBaseName = this.toSafeFileBaseName(originalBase);
    const fileName = `${Date.now()}-${Math.round(
      Math.random() * 1_000_000,
    )}-${safeBaseName}.${fileExtension}`;
    const absoluteTargetPath = path.join(this.mediaDirectory, fileName);

    await fs.writeFile(absoluteTargetPath, file.buffer);

    const result = {
      url: `${MEDIA_PUBLIC_PREFIX}/${fileName}`,
      fileName,
      size: file.size,
      mimeType: file.mimetype,
    };

    await this.auditLogService.record({
      actorUserId: actor?.userId,
      actorEmail: actor?.email,
      action: 'cms.media_uploaded',
      entityType: 'cms_media',
      entityId: fileName,
      metadata: {
        url: result.url,
        size: result.size,
        mimeType: result.mimeType,
      },
    });

    return result;
  }

  async deleteMedia(url: string, actor?: ActorContext) {
    const trimmed = (url || '').trim();
    if (!trimmed.startsWith(`${MEDIA_PUBLIC_PREFIX}/`)) {
      throw new BadRequestException('Nieprawidłowy URL pliku.');
    }

    const fileName = path.basename(trimmed);
    if (!fileName) {
      throw new BadRequestException('Nieprawidłowa nazwa pliku.');
    }

    const absolutePath = path.resolve(this.mediaDirectory, fileName);
    if (!absolutePath.startsWith(this.mediaDirectory)) {
      throw new BadRequestException('Niedozwolona ścieżka pliku.');
    }

    try {
      await fs.unlink(absolutePath);
    } catch (error) {
      throw new NotFoundException(
        error instanceof Error
          ? `Plik nie istnieje: ${fileName}`
          : 'Plik nie istnieje.',
      );
    }

    await this.auditLogService.record({
      actorUserId: actor?.userId,
      actorEmail: actor?.email,
      action: 'cms.media_deleted',
      entityType: 'cms_media',
      entityId: fileName,
      metadata: { url: trimmed },
    });

    return { success: true, deleted: trimmed };
  }

  async importPages(pages: CmsPageInput[], actor?: ActorContext) {
    const now = new Date();
    const results: any[] = [];
    for (const p of pages) {
      const existing = await db
        .select()
        .from(cmsPages)
        .where(eq(cmsPages.slug, p.slug));

      if (existing && existing.length > 0) {
        const [updated] = await db
          .update(cmsPages)
          .set({ title: p.title, content: p.content ?? null, metaTitle: p.metaTitle ?? null, metaDescription: p.metaDescription ?? null, isPublished: p.isPublished ?? true, updatedAt: now })
          .where(eq(cmsPages.slug, p.slug))
          .returning();
        if (updated) {
          await this.auditLogService.record({
            actorUserId: actor?.userId,
            actorEmail: actor?.email,
            action: 'cms.page_updated',
            entityType: 'cms_page',
            entityId: updated.id,
            metadata: { slug: p.slug, title: p.title, isPublished: p.isPublished },
          });
          results.push(updated);
        }
      } else {
        const [created] = await db
          .insert(cmsPages)
          .values({ slug: p.slug, title: p.title, content: p.content ?? null, metaTitle: p.metaTitle ?? null, metaDescription: p.metaDescription ?? null, isPublished: p.isPublished ?? true, updatedAt: now })
          .returning();
        if (created) {
          await this.auditLogService.record({
            actorUserId: actor?.userId,
            actorEmail: actor?.email,
            action: 'cms.page_created',
            entityType: 'cms_page',
            entityId: created.id,
            metadata: { slug: p.slug, title: p.title, isPublished: p.isPublished },
          });
          results.push(created);
        }
      }
    }
    return results;
  }

  async deletePage(slug: string, actor?: ActorContext) {
    // Check if page exists
    const [existing] = await db
      .select()
      .from(cmsPages)
      .where(eq(cmsPages.slug, slug));
    if (!existing) {
      throw new NotFoundException(`Page with slug ${slug} not found`);
    }

    await db.delete(cmsPages).where(eq(cmsPages.slug, slug));

    await this.auditLogService.record({
      actorUserId: actor?.userId,
      actorEmail: actor?.email,
      action: 'cms.page_deleted',
      entityType: 'cms_page',
      entityId: existing.id,
      metadata: { slug },
    });

    return { slug, deleted: true };
  }

  async bulkDeletePages(slugs: string[], actor?: ActorContext) {
    const results: { slug: string; deleted: boolean; error?: string }[] = [];
    for (const slug of slugs) {
      try {
        const [existing] = await db
          .select()
          .from(cmsPages)
          .where(eq(cmsPages.slug, slug));
        if (!existing) {
          results.push({ slug, deleted: false, error: 'not_found' });
          continue;
        }
        await db.delete(cmsPages).where(eq(cmsPages.slug, slug));
        await this.auditLogService.record({
          actorUserId: actor?.userId,
          actorEmail: actor?.email,
          action: 'cms.page_deleted',
          entityType: 'cms_page',
          entityId: existing.id,
          metadata: { slug },
        });
        results.push({ slug, deleted: true });
      } catch {
        results.push({ slug, deleted: false, error: 'error' });
      }
    }
    return results;
  }

  private async ensureMediaDirectory(): Promise<void> {
    await fs.mkdir(this.mediaDirectory, { recursive: true });
  }

  private toSafeFileBaseName(input: string): string {
    const normalized = input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48);
    return normalized || 'media';
  }
}
