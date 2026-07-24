/**
 * Mirror of `packages/views/agents/components/tabs/task-failure.ts:failureReasonLabel`.
 *
 * 之所以镜像：根据 apps/mobile/CLAUDE.md
 *「What mobile may import from packages」，Mobile 不能导入 packages/views。
 * 枚举本身通过 type-only 从 packages/core/types 导入，只有展示文案归 Mobile。
 *
 * 用于 destructive chat bubble。default 分支处理枚举漂移：未知取值显示通用
 * “Failed”，而不是崩溃或直接展示原始枚举字符串。见 apps/mobile/CLAUDE.md
 *「Behavioral parity with web/desktop」。
 */
import type { TaskFailureReason } from "@multica/core/types";

const LABELS: Record<TaskFailureReason, string> = {
  agent_error: "Agent execution error",
  timeout: "Task timed out",
  codex_semantic_inactivity: "Codex semantic inactivity timeout",
  runtime_offline: "Daemon offline",
  runtime_recovery: "Daemon restarted",
  manual: "Cancelled by user",
};

export function failureReasonLabel(
  reason: TaskFailureReason | string | null | undefined,
): string {
  if (!reason) return "Failed";
  if (reason in LABELS) {
    return LABELS[reason as TaskFailureReason];
  }
  return "Failed";
}
