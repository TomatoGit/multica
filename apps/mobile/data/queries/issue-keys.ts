/**
 * Centralised TanStack Query keys for issue-domain queries on mobile.
 *
 * Prefix shape mirrors web's `packages/core/issues/queries.ts` so the same
 * WS invalidation surface（如
 * `invalidateQueries({ queryKey: issueKeys.myAll(wsId) })`）最终可同时驱动
 * 两端。key 按 workspace 划分；切换 workspace 会改变 wsId，缓存随之自动
 * 切换。见 apps/mobile/CLAUDE.md「Query / mutation factory pattern」。
 */
import type { ListIssuesParams } from "@multica/core/types";

export type MyIssuesScope = "assigned" | "created" | "agents";

export type MyIssuesFilter = Pick<
  ListIssuesParams,
  "assignee_id" | "assignee_ids" | "creator_id" | "involves_user_id"
>;

export const issueKeys = {
  all: (wsId: string | null) => ["issues", wsId] as const,
  list: (wsId: string | null) => [...issueKeys.all(wsId), "list"] as const,
  myAll: (wsId: string | null) => [...issueKeys.all(wsId), "my"] as const,
  myList: (
    wsId: string | null,
    scope: MyIssuesScope,
    filter: MyIssuesFilter,
  ) => [...issueKeys.myAll(wsId), scope, filter] as const,
  detail: (wsId: string | null, id: string) =>
    [...issueKeys.all(wsId), "detail", id] as const,
  timeline: (wsId: string | null, id: string) =>
    [...issueKeys.all(wsId), "timeline", id] as const,
  // Currently-running tasks for an issue (queued/dispatched/running). Drives
  // the "Working" state of the AgentActivityRow inside IssueHeaderCard.
  activeTasks: (wsId: string | null, id: string) =>
    [...issueKeys.all(wsId), "active-tasks", id] as const,
  // All tasks (any status) for an issue — drives the Runs history sheet.
  tasks: (wsId: string | null, id: string) =>
    [...issueKeys.all(wsId), "tasks", id] as const,
  // File attachments hooked to an issue (and its comments). Used by the
  // markdown renderer to resolve `mc://file/<id>` URIs to download_url.
  attachments: (wsId: string | null, id: string) =>
    [...issueKeys.all(wsId), "attachments", id] as const,
};
