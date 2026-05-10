import { Injectable, Logger } from '@nestjs/common';
import { desc } from 'drizzle-orm';
import { db } from '../../db';
import { auditLogs } from '../../db/schema';

type AuditMetadata = Record<string, unknown> | null;

type AuditEntry = {
  actorUserId?: string | null;
  actorEmail?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: AuditMetadata;
};

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);
  private readonly fallbackEntries: Array<AuditEntry & { createdAt: Date }> =
    [];
  private readonly fallbackLimit = 500;

  private isValidUuid(id: string | null | undefined): boolean {
    if (!id) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      id,
    );
  }

  async record(entry: AuditEntry): Promise<void> {
    const normalized: AuditEntry & { createdAt: Date } = {
      ...entry,
      createdAt: new Date(),
    };

    this.pushFallback(normalized);

    try {
      await db.insert(auditLogs).values({
        actorUserId: this.isValidUuid(entry.actorUserId)
          ? entry.actorUserId
          : null,
        actorEmail: entry.actorEmail ?? null,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId ?? null,
        metadata: entry.metadata ?? null,
      });
    } catch (error) {
      this.logger.warn(
        `Audit log DB insert failed (likely invalid foreign key), using fallback memory store: ${
          error instanceof Error ? error.message : 'unknown'
        }`,
      );
    }
  }

  async recordWithDiff(params: {
    actorUserId?: string;
    actorEmail?: string;
    action: string;
    entityType: string;
    entityId: string;
    oldData?: any;
    newData?: any;
    metadata?: any;
  }): Promise<void> {
    const { oldData, newData, ...rest } = params;
    const diff = this.calculateDiff(oldData, newData);

    await this.record({
      ...rest,
      metadata: {
        ...(rest.metadata || {}),
        diff,
      },
    });
  }

  private calculateDiff(oldData: any, newData: any) {
    if (!oldData || !newData) return null;
    const changes: any = {};
    const keys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
    for (const key of keys) {
      if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
        changes[key] = { from: oldData[key], to: newData[key] };
      }
    }
    return Object.keys(changes).length > 0 ? changes : null;
  }

  async listRecent(limit?: number) {
    const requestedLimit = typeof limit === 'number' ? limit : 50;
    const safeLimit = Math.max(1, Math.min(requestedLimit, 200));
    try {
      return await db
        .select()
        .from(auditLogs)
        .orderBy(desc(auditLogs.createdAt))
        .limit(safeLimit);
    } catch {
      return [...this.fallbackEntries]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, safeLimit);
    }
  }

  private pushFallback(entry: AuditEntry & { createdAt: Date }): void {
    this.fallbackEntries.push(entry);
    if (this.fallbackEntries.length > this.fallbackLimit) {
      this.fallbackEntries.shift();
    }
  }
}
