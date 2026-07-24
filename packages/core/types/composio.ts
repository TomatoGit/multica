/** GET /api/integrations/composio/toolkits 返回的 Composio toolkit。
 *
 * 传输结构对应 `server/internal/handler/integrations_composio.go` 中的
 * `ComposioToolkitResponse`。后端后续新增字段必须保持可选，确保旧版桌面端
 * 仍能解析。见 docs/agents/frontend.md「API 响应」。 */
export interface ComposioToolkit {
  slug: string;
  name: string;
  logo?: string;
  category?: string;
  /** Whether the project has an enabled auth config for this toolkit. Since
   * MUL-4009 the backend only returns connectable toolkits, so this is always
   * true on the wire; the field is kept for backward compatibility with older
   * desktop builds that branch on it. The UI still guards the Connect button on
   * it as a client-side backstop. */
  connectable: boolean;
}

/** A user's Composio connected account, as returned by
 * GET /api/integrations/composio/connections. Mirrors
 * `ComposioConnectionResponse` server-side. */
export interface ComposioConnection {
  id: string;
  toolkit_slug: string;
  /** Connection lifecycle state. `expired` surfaces a Reconnect affordance in
   * the UI; the backend only starts emitting it once Stage 4 webhook handling
   * lands (MUL-3719), but the client renders the branch ahead of that. */
  status: "active" | "expired" | "revoked" | string;
  connected_at: string;
  last_used_at?: string | null;
}

/** Response of POST /api/integrations/composio/connect/init — the hosted
 * Composio Connect Link the browser is redirected to. */
export interface ComposioConnectInitResponse {
  redirect_url: string;
}
