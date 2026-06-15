# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

2026 FIFA 世界杯网站，技术栈：**Vite + Vue 3 + Tailwind CSS 4 + Vue I18n + Pinia**。单页应用，暗色主题 + 金杯配色。所有内容数据由 `public/data/` 下的 JSON 文件驱动。

## 工作目录

所有开发在 **`v2/`** 目录下进行。`v1/` 是历史版本的单文件 HTML 页面（仅供参考）。

## 常用命令

```bash
cd v2
npm run dev       # 启动开发服务器（Vite）
npm run build     # 生产构建 → dist/
npm run preview   # 预览生产构建
```

未配置 lint 和测试命令。

## 架构

### 数据流

所有数据在运行时通过 `useData()` 组合式函数从 `/data/*.json` 文件（由 `public/data/` 提供）获取。结果缓存在模块级的 `Map` 中。直接编辑 JSON 文件即可 — 数据变更无需重新构建。

```
public/data/*.json → useData() → Vue 组件
                         ↓
                    fetch('/data/...')
                         ↓
                  模块级缓存 (Map)
```

### 核心 Composables

- **`useData(resource)`** — 获取 `public/data/{resource}.json`，缓存结果。返回 `{ data, loading, error, refetch }`。**内部函数绝不能命名为 `fetch()` — 会遮蔽全局 `fetch` API。**
- **`usePrediction()`** — 管理比赛预测，存储在 `localStorage`（key: `wc2026_predictions`）。支持两种模式：
  - `simulated`（模拟）— 基于赔率的泊松分布算法（`utils/predictionEngine.js`）
  - `ai` — 调用 Claude API。从 `localStorage` 读取配置：`wc2026_claude_base_url`、`wc2026_claude_api_key`、`wc2026_claude_model`。回退到 `import.meta.env` 值，最终回退到模拟模式。
- **`useLiveScores()`** — 每 30 秒轮询 `live-scores.json`。返回 `{ scores, getMatchStatus }`。
- **`useCountdown(targetDate)`** — 响应式倒计时。
- **`useScrollAnimation()`** — IntersectionObserver 滚动渐入效果。

### Pinia Stores

- **`stores/app.js`** — 导航栏状态（移动端展开/收起、当前区域）
- **`stores/settings.js`** — Claude API 配置（baseUrl、apiKey、model），持久化到 localStorage

### 组件结构

- **`components/layout/`** — `NavBar.vue`（固定导航 + 语言切换 + 设置按钮）、`Footer.vue`、`SettingsModal.vue`
- **`components/schedule/`** — `ScheduleSection.vue`（按北京时间日期分组）、`MatchCard.vue`（显示比分/预测/场地/时间）、`MatchDetail.vue`（AI 预测弹窗）、`SchedulePhase.vue`（按阶段手风琴展开）
- **`components/hero/`** — 首页 Hero 区域，含体育场光束动画、倒计时、关键数据
- **区域组件** — 每个区域（分组、赔率、城市、球星、历史、转播）都有 `*Section.vue` 容器和 `*Card.vue` 卡片
- **`components/shared/`** — 可复用组件：`SectionHeader`、`FadeInWrapper`、`TeamFlag`、`CountryBadge`

### 国际化（i18n）

- `src/i18n/locales/zh.json`（默认）和 `en.json`
- 语言偏好存储在 `localStorage`（key: `wc2026_locale`）
- 内容数据（球队名、场地名）在 JSON 数据文件中使用 `{ "zh": "...", "en": "..." }` 对象
- `getLocaleLabel()` 辅助函数在 `useLiveScores.js` 中，根据当前语言选择对应文本

### 设计令牌

定义在 `src/assets/styles/global.css`，通过 Tailwind `@theme`：
- 背景色：`bg-primary` (#0a0a12)、`bg-secondary` (#12121f)、`bg-card` (#1a1a2e)
- 金色：`gold` (#d4a843)、`gold-light` (#f0d078)、`gold-dark` (#a07828)
- 文字色：`text-primary` (#f0f0f5)、`text-secondary` (#a0a0b8)、`text-muted` (#6a6a80)
- 自定义动画：`beam-pulse`（光束脉冲）、`shimmer`（闪光）、`glow-pulse`（发光脉冲）
- `.card` 基础类带 hover 效果

### JSON 数据文件

| 文件 | 关键结构 |
|------|----------|
| `schedule.json` | `{ matches: [...], byDate: {...} }` — 每场比赛含 `id`、`homeTeam`、`awayTeam`、`homeLabel`、`awayLabel`、`time`（北京时间）、`venue`（zh/en）、可选 `score: { home, away, status }` |
| `groups.json` | `{ groups: [{ letter, teams: [{ name: {zh,en}, code, flag, conf }] }] }` |
| `odds.json` | `{ teams: [{ rank, code, name: {zh,en}, flag, odds }] }` |
| `live-scores.json` | `{ lastUpdated, matches: [{ id, status, minute, homeScore, awayScore }] }` |

已结束的比赛 `score.status === "FT"` — 这些显示实际比分和预测比分。
进行的比赛 `score.status === "Playing"` — 这些显示进行中比分和预测比分。

### API 配置

Claude API 在 `usePrediction.js` 中通过 `@anthropic-ai/sdk` 调用。SDK 使用动态导入以控制打包体积。配置优先级：
1. `localStorage`（通过页面设置界面配置）
2. `.env` 文件（`VITE_CLAUDE_API_KEY`、`VITE_CLAUDE_BASE_URL`、`VITE_CLAUDE_MODEL`）
3. 无 API Key 时回退到模拟预测

### 比赛卡片比分显示优先级

比分按以下顺序显示：实时比分 > 实际比分（FT）> AI 预测 > VS 文字。
