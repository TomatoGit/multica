# Desktop 规则

- Workspace session 使用路由；创建 workspace、接受邀请等一次性流程使用 `WindowOverlay`，不加入 `routes.tsx`；失效 tab 自动清理。
- Workspace 路由布局负责设置当前 workspace；离开时显式清空，跨 workspace 导航通过 adapter。
- 删除 workspace 时等待服务端成功；现有 leave 的提前清理是已知债务，不得复用。
- Dashboard shell 外的全窗口视图以 `<DragStrip />` 为首个 flex child；顶部 48px 的交互控件设置 `WebkitAppRegion: "no-drag"`。
