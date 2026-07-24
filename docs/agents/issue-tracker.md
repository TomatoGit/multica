# 问题跟踪器：GitHub

本仓库的问题与 PRD 存放在 GitHub Issues 中。所有操作均使用 `gh` CLI。

## 约定

- **确认仓库**：首次操作运行 `gh repo view --json nameWithOwner,hasIssuesEnabled`；结果不符时用 `--repo` 指定，未启用 Issues 时停止。
- **判定裸编号**：收到未注明类型的 `#<编号>` 时，先运行 `gh pr view <编号>`；成功则按 PR 流程处理，失败后再运行 `gh issue view <编号>`。
- **检索重复 Issue**：创建前运行 `gh issue list --state all --limit 100 --search "<关键词> in:title,body" --json number,title,state,url`。
- **创建 Issue**：使用 `gh issue create --title "..." --label "..." --body-file - <<'EOF'`，正文结束后以独占一行的 `EOF` 收尾。Bug/Feature 应覆盖对应 `.github/ISSUE_TEMPLATE/*.yml` 的必填信息；其他工单至少包含背景、目标和验收标准。记录命令返回的 Issue URL。
- **读取 Issue**：运行 `gh issue view <编号> --json number,title,body,state,stateReason,labels,assignees,comments,url --jq '{number,title,state,stateReason,body,labels:[.labels[].name],assignees:[.assignees[].login],comments:[.comments[].body],url}'`。
- **列出 Issue**：运行 `gh issue list --state open --limit 100 --json number,title,state,labels,assignees,url`，并按任务添加 `--search`、`--label` 或 `--state`；需要正文或评论时再逐条读取。
- **评论 Issue**：单行使用 `gh issue comment <编号> --body "..."`，多行使用 `--body-file -` 和 heredoc。
- **添加或移除标签**：`gh issue edit <编号> --add-label "..."` / `--remove-label "..."`
- **关闭 Issue**：`gh issue close <编号> --comment "..."`

## 当技能要求“发布到问题跟踪器”

创建一个 GitHub Issue。

## 当技能要求“获取相关工单”

运行 `gh issue view <编号> --comments`。

## Wayfinding 操作

供 `/wayfinder` 使用。**地图**是一个主 Issue，**子工单**是其下属 Issue。

- **地图**：使用带有 `wayfinder:map` 标签的单个 Issue，正文维护 Notes、Decisions-so-far 和 Fog。通过 `gh issue create --label wayfinder:map` 创建。
- **子工单**：使用 GitHub sub-issue API 将 Issue 关联到地图。若仓库未启用 sub-issue，则将子工单加入地图正文的任务列表，并在子工单正文顶部写入 `Part of #<地图编号>`。标签使用 `wayfinder:<类型>`，类型为 `research`、`prototype`、`grilling` 或 `task`。工单被领取后，将其分配给负责推进的开发者。
- **阻塞关系**：优先使用 GitHub 原生 Issue dependencies。通过 `gh api --method POST repos/<所有者>/<仓库>/issues/<子工单>/dependencies/blocked_by -F issue_id=<阻塞工单数据库ID>` 添加关系。数据库 ID 通过 `gh api repos/<所有者>/<仓库>/issues/<编号> --jq .id` 获取，不能使用 Issue 编号或 `node_id`。若依赖功能不可用，则在子工单正文顶部使用 `Blocked by: #<编号>, #<编号>`。所有阻塞工单关闭后，子工单才解除阻塞。
- **查询可执行工单**：按地图中的顺序列出仍开放的子工单，排除存在开放阻塞项或已有负责人者，取第一个符合条件的工单。
- **领取工单**：运行 `gh issue edit <编号> --add-assignee @me`；这是会话中的首次写操作。
- **完成工单**：先通过 `gh issue comment <编号> --body "<结论>"` 记录答案，再关闭 Issue，最后把上下文指针及其链接追加到地图的 Decisions-so-far。
