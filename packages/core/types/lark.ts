/** 绑定到单个 Multica agent 的 Lark Bot 安装记录。
 *
 * 传输结构对应 `server/internal/handler/lark.go` 中的
 * `LarkInstallationResponse`。后端后续新增字段必须保持可选，确保旧版桌面端
 * 仍能解析响应。见 docs/agents/frontend.md「API 响应」。 */
export interface LarkInstallation {
  id: string;
  workspace_id: string;
  agent_id: string;
  app_id: string;
  tenant_key?: string | null;
  bot_open_id: string;
  installer_user_id: string;
  status: "active" | "revoked" | string;
  /** 机器人所在的 Lark 云："feishu"（中国大陆）或 "lark"（国际版）。
   * 安装时自动检测。字段保持可选，使新旧客户端与服务端组合都能在 UI
   * 回退到飞书。见 docs/agents/frontend.md「API 响应」。 */
  region?: "feishu" | "lark" | string;
  installed_at: string;
  created_at: string;
  updated_at: string;
}

export interface ListLarkInstallationsResponse {
  installations: LarkInstallation[];
  /** Whether the deployment has the at-rest secret key configured. When
   * false the Bind button must be disabled and the panel renders an
   * empty / "ask the operator to enable Lark" state. */
  configured: boolean;
  /** Whether new installs via the device-flow scan-to-bind path can
   * complete end-to-end — i.e. the device-flow RegistrationService is
   * wired AND the real Lark HTTP APIClient (not the no-op stub) is in
   * place. When false the install entry points are hidden and the
   * panel surfaces a "coming soon" notice. Optional so older desktop
   * builds receiving a server that does not yet emit the field
   * default to `undefined`, treated as not supported. */
  install_supported?: boolean;
}

/** First half of the device-flow install: the server has opened a
 * registration session against accounts.feishu.cn and returned the QR
 * URL. The frontend renders `qr_code_url` as a QR (and as a clickable
 * link fallback) and starts polling `/install/{session_id}/status` at
 * the supplied cadence until success or terminal failure. */
export interface BeginLarkInstallResponse {
  session_id: string;
  qr_code_url: string;
  expires_in_seconds: number;
  poll_interval_seconds: number;
}

/** Status polling result. `status` is the discriminator. */
export interface LarkInstallStatusResponse {
  status: "pending" | "success" | "error" | string;
  /** Populated when status === "success". The frontend invalidates the
   * installations cache so the new row appears in the Settings tab. */
  installation_id?: string;
  /** Stable code on error — switch on this (NOT error_message) to pick
   * the right copy. Common values: "expired", "access_denied",
   * "lark_protocol_error", "bot_info_failed", "installation_conflict",
   * "installer_bind_failed", "internal_error". */
  error_reason?: string;
  /** Human-readable error tail for debugging; the production UI should
   * surface the copy keyed off error_reason and use this only as a
   * diagnostic tooltip. */
  error_message?: string;
}

export interface RedeemLarkBindingTokenResponse {
  workspace_id: string;
  installation_id: string;
  lark_open_id: string;
}
