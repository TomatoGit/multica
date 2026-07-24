# 领域文档

本文件规定工程技能在探索代码库时如何读取本仓库的领域文档。

## 探索前需要读取的文档

- 读取仓库根目录的 `CONTEXT-MAP.md`，根据其中的索引找到与当前任务有关的上下文。
- 读取每个相关上下文目录下的 `CONTEXT.md`。
- 读取根目录 `docs/adr/` 中与当前工作相关的系统级 ADR。
- 读取相关上下文目录下 `docs/adr/` 中的上下文级 ADR。

如果这些文件尚不存在，应静默继续，不要把缺失视为错误，也不要预先建议创建。`/domain-modeling` 技能会在领域术语或架构决策真正形成时按需创建这些文件。

## 多上下文布局

本仓库采用 multi-context 布局，目标结构如下：

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                         ← 跨上下文、系统级决策
├── server/
│   ├── CONTEXT.md                   ← 后端、API、数据与服务领域
│   └── docs/adr/                    ← 后端上下文决策
├── packages/
│   ├── core/
│   │   ├── CONTEXT.md               ← 共享业务逻辑、API 客户端与客户端状态
│   │   └── docs/adr/
│   └── views/
│       ├── CONTEXT.md               ← Web/Desktop 共享业务界面
│       └── docs/adr/
└── apps/
    └── mobile/
        ├── CONTEXT.md               ← 独立移动端上下文
        └── docs/adr/
```

`apps/web/` 与 `apps/desktop/` 主要承担平台接线。处理其中的任务时，应根据改动范围读取 `packages/core/CONTEXT.md`、`packages/views/CONTEXT.md` 以及相关系统级 ADR。

## 使用领域词汇表中的术语

当输出内容需要命名领域概念时，例如 Issue 标题、重构建议、假设或测试名称，应使用相关 `CONTEXT.md` 定义的术语，不要改用词汇表明确排除的同义词。

如果所需概念尚未出现在词汇表中，应先判断是否引入了项目并未使用的新语言；如果确实存在领域空白，则记录下来，交由 `/domain-modeling` 处理。

## 标记与 ADR 的冲突

如果输出内容与现有 ADR 冲突，必须明确指出，而不是静默覆盖。例如：

> 与 ADR-0007（事件溯源订单）冲突，但值得重新讨论，因为……
