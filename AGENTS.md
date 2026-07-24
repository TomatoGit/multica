# 智能体协作规范

## 工作约定

- 项目文档、页面和代码注释默认使用中文；文档和页面以中文为第一语言，未明确要求时不新增或同步其他语言版本。
- 提交应原子化并使用 conventional commit 前缀。
- 内部代码不增加兼容层、双写、旧版适配器或临时兜底；未上线的替代直接删除旧路径。
- 行为变更先在正确归属的包中补失败测试；先运行最窄的相关检查，只声明实际运行通过的检查。
- 修改 CLI、API 字段或内置技能记录的行为时，同步更新 `server/internal/service/builtin_skills/*` 下相关 `SKILL.md` 和 `references/*-source-map.md`。

## 按需读取

- 修改 `apps/web/`、`packages/core/`、`packages/ui/`、`packages/views/`、`e2e/`、根 `package.json` 或 `pnpm-workspace.yaml` 时，读取 `docs/agents/frontend.md`。
- 修改 `apps/desktop/` 时，同时读取 `docs/agents/frontend.md` 和 `docs/agents/desktop.md`。
- 修改 `apps/mobile/` 时，完整读取 `apps/mobile/CLAUDE.md`。
- 修改 `server/` 时，读取 `docs/agents/backend.md`。
- 涉及命名、路由、数据库字段、类型、代码注释、翻译或中文产品文案时，只读取 `apps/docs/content/docs/developers/conventions.zh.mdx` 的相关章节；不重复读取英文译本，忽略仅作跳转的 `packages/views/locales/glossary.md`。

## Agent skills

### Issue tracker

使用 GitHub Issues；见 `docs/agents/issue-tracker.md`。

### Triage labels

使用五个默认同名标签；见 `docs/agents/triage-labels.md`。

### Domain docs

采用 multi-context 布局；见 `docs/agents/domain.md`。
