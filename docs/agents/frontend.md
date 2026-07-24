# Web/Desktop 前端规则

## 包边界

- 共享包导出源码；依赖方向固定为 `views -> core + ui`，`core` 与 `ui` 相互独立。
- `packages/core/` 禁止使用 `react-dom`、`localStorage`、`process.env` 和 UI 库；持久化通过 `StorageAdapter`。
- `packages/ui/` 禁止导入 `@multica/core` 或承载业务逻辑；`packages/views/` 禁止导入 `next/*`、`react-router-dom` 或定义 store。
- Next.js API 只能出现在 `apps/web/platform/`；桌面路由接线只能出现在 `apps/desktop/src/renderer/src/platform/`；共享路由使用 `NavigationAdapter`、`useNavigation()` 和 `<AppLink>`。
- 每个 pnpm workspace 包在自身 `package.json` 声明直接依赖；共享依赖使用 `catalog:`。

## 状态与实时事件

- TanStack Query 管理服务端状态；Zustand 只管理客户端状态，共享 stores 只能放在 `packages/core/`。当前 workspace 由路由决定，只为平台接线镜像。
- React Context 仅用于平台接线。除 auth/workspace stores 外，服务端交互放在 Query/mutation；workspace query key 包含 `wsId`，相关 hook 接收 `wsId`。
- 仅在结果可预测、不导航、失败少且易回滚时使用乐观更新；创建、删除、离开等流程等待服务端成功后再清理或跳转。消息发送使用可见 pending 状态和失败重试。
- WebSocket 只 patch 或 invalidate Query cache，不把服务端 payload 镜像到 Zustand；清理客户端指针必须由单一 responder 执行，并带自发事件保护。
- 只持久化长期偏好、草稿和布局；不持久化服务端或瞬时状态。Zustand selector 必须返回稳定引用。

## API 响应

- 网络响应通过 `parseWithFallback` 和 Zod schema 解析，不直接断言为业务类型；新增或修改 endpoint 时同步 schema 和 malformed-response 测试。
- UI 为缺失字段和未知枚举提供安全默认值；枚举分支有 `default`，布尔值优先 `=== true`，关键入口不只依赖单一服务端布尔值。

## 共享与路由

- Web/Desktop 共享页面放在 `packages/views/<domain>/` 并补齐两端接线；平台专属逻辑留在 app 层。
- 共享 CSS 使用 `packages/ui/styles/` 的语义 token。

## 测试

- 共享逻辑测试放 `packages/core/`，共享页面/组件测试放 `packages/views/`，平台接线放对应 app，E2E 放 `e2e/`。
- 不在 app 测试中重复验证共享组件；`packages/views/` 测试不 mock `next/*` 或 `react-router-dom`。
- mock core store 时保持 Zustand callable-store 形状并提供 `getState`；API mock `@multica/core/api`；E2E setup/teardown 使用 `TestApiClient`。
