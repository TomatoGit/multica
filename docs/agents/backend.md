# 后端规则

## 数据库迁移

- 禁止数据库外键和级联操作；关系校验与清理由应用层完成，需要原子性时使用事务。
- 所有索引使用 `CREATE [UNIQUE] INDEX CONCURRENTLY`，每个索引单独占用一个仅含该语句的迁移文件。

## Handler 与访问边界

- `server/internal/handler/` 中，可读 ID/UUID 路径参数先经 loader 解析；请求 UUID 用 `parseUUIDOrBadRequest`，可信回环用 `parseUUID`，handler 外用 `util.ParseUUID` 并检查错误。
- 查询按 `workspace_id` 过滤，成员资格控制访问，`X-Workspace-ID` 选择 workspace。
- Issue assignee 由 `assignee_type` 与 `assignee_id` 共同标识。
