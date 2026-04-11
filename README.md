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

### 本地开发

先复制环境变量模板：

```bash
cp .env.example .env.local
```

然后把 `.env.local` 里的值改成你自己的：

```bash
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-5.2-chat-latest
```

`OPENAI_MODEL` 可选，不填时默认会使用 `gpt-5.2-chat-latest`。

### 线上部署

不要把 `.env.local` 提交到 GitHub。

部署到 Vercel 时，请在项目后台分别配置环境变量：

- `OPENAI_API_KEY`
- `OPENAI_MODEL`（可选）

建议至少区分：

- Development
- Preview
- Production

### 当前已加的安全措施

- OpenAI key 仅在服务端读取，不会暴露到前端
- 浏览器只请求本站 `/api/voice-plan`，不会直接请求 OpenAI
- `.env*` 已被 `.gitignore` 忽略
- `/api/voice-plan` 已增加基础来源校验
- `/api/voice-plan` 已增加简易限流
- `/api/voice-plan` 已增加输入长度限制
- 上游错误细节不会直接返回给前端

未配置服务端环境变量时，前端会自动回退到本地规则解析。

## 校验

```bash
pnpm lint
pnpm build
```
