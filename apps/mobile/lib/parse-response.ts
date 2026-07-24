/**
 * Mobile 自有的 parseWithFallback，对应 packages/core/api/schema.ts。
 * 它是已安装应用应对 schema 漂移的边界防线，规则见 apps/mobile/CLAUDE.md
 *「Data layer helpers」。
 *
 * Why we mirror instead of import: keeps mobile fully decoupled and lets
 * us route the warning into mobile's own logger instead of the core
 * schemaLogger singleton. Behavior is identical: safeParse → on success
 * return parsed; on failure log + return fallback (never throw into UI).
 */
import { type ZodType } from "zod";

export interface ParseOptions {
  endpoint: string;
}

export function parseWithFallback<T>(
  data: unknown,
  schema: ZodType,
  fallback: T,
  opts: ParseOptions,
): T {
  const result = schema.safeParse(data);
  if (result.success) return result.data as T;
  console.warn(`[api] schema validation failed: ${opts.endpoint}`, {
    issues: result.error.issues,
    received: data,
  });
  return fallback;
}
