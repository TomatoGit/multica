# 后端规则

## 数据库迁移

- 禁止数据库外键和级联操作；关系校验与清理由应用层完成，需要原子性时使用事务。
- 所有索引使用 `CREATE [UNIQUE] INDEX CONCURRENTLY`，每个索引单独占用一个仅含该语句的迁移文件。

## Handler 与访问边界

- `server/internal/handler/` 中，可读 ID/UUID 路径参数先经 loader 解析；请求 UUID 用 `parseUUIDOrBadRequest`，可信回环用 `parseUUID`，handler 外用 `util.ParseUUID` 并检查错误。
- 查询按 `workspace_id` 过滤，成员资格控制访问，`X-Workspace-ID` 选择 workspace。
- Issue assignee 由 `assignee_type` 与 `assignee_id` 共同标识。

## Agent CLI 测试

- 默认测试不得解析或执行用户安装的 Agent CLI；测试 Agent 子进程时传入由测试创建的假可执行路径或不存在的路径。
- 真实 Agent 冒烟测试必须使用 `agentintegration` build tag，并在查找可执行文件或访问账号前检查 `MULTICA_RUN_REAL_AGENT_SMOKE=1`。
- 只有获得明确授权后，才能运行 `(cd server && MULTICA_RUN_REAL_AGENT_SMOKE=1 go test -tags=agentintegration ./pkg/agent -run '<test-name>' -count=1 -v)`；该命令会访问已认证账号并可能消耗额度。
- 新增默认 Agent 命令时同步更新 `scripts/agent-cli-command-names.txt`；Linux/macOS 的常规测试入口会阻止意外调用环境中的 Agent CLI。
