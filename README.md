# 训练记录

这个项目用于记录训练计划、训练过程和历史数据。

## 启动

```bash
pnpm install
pnpm dev
```

默认地址：

```bash
http://localhost:3000
```

## 页面结构

- `/` 总览
- `/planner` 训练计划编辑、补录、语音/文本导入
- `/workout` 训练中流程
- `/history` 历史记录、导入导出、对比上次
- `/analytics` 趋势和频率分析

## 数据保存

训练记录、计划编辑状态、进行中的训练会话都会写入浏览器 `localStorage`。

刷新页面后会保留：

- 当前选中的训练部位
- 每个部位的动作计划
- 历史记录
- 进行中的训练会话
- 语音识别后的计划预览

同时会尝试从旧版项目遗留的 `records` 和 `draft` 本地数据自动迁移。

## AI 语音解析

如果要启用服务端 AI 解析，请配置 OpenAI：

```bash
OPENAI_API_KEY=your_key
```

可选：

```bash
OPENAI_MODEL=gpt-5.2-chat-latest
```

默认会直接使用 OpenAI 当前的最新 ChatGPT 风格模型 `gpt-5.2-chat-latest`，并通过官方更推荐的 Responses API 调用。

未配置时，前端会自动回退到本地规则解析。

## 校验

```bash
pnpm lint
pnpm build
```
