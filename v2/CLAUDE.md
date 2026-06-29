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
- **`useStandings()`** — 基于 `groups.json` 和 `schedule.json` 计算小组积分榜、前两名及 8 个最佳第三名。被 `GroupStandingsSection` 和 `RoundOf32Section` 共享使用。
- **`useLiveScores()`** — 每 30 秒轮询 `live-scores.json`。返回 `{ scores, getMatchStatus }`。
- **`useCountdown(targetDate)`** — 响应式倒计时。
- **`useScrollAnimation()`** — IntersectionObserver 滚动渐入效果。

### Pinia Stores

- **`stores/app.js`** — 导航栏状态（移动端展开/收起、当前区域）
- **`stores/settings.js`** — Claude API 配置（baseUrl、apiKey、model），持久化到 localStorage

### 组件结构

- **`components/layout/`** — `NavBar.vue`（固定导航 + 语言切换 + 设置按钮）、`Footer.vue`、`SettingsModal.vue`
- **`components/schedule/`** — `ScheduleSection.vue`（按北京时间日期分组）、`MatchCard.vue`（显示比分/预测/场地/时间/阶段标签）、`MatchDetail.vue`（AI 预测弹窗）、`SchedulePhase.vue`（按阶段手风琴展开）
- **`components/groups/`** — `GroupsSection.vue`（12 个小组球队展示）、`GroupCard.vue`、`GroupStandingsSection.vue`（小组积分榜）
- **`components/knockout/`** — `RoundOf32Section.vue`（32 强晋级形势 + 淘汰赛对阵图）、`KnockoutBracket.vue`（完整淘汰赛对阵图）、`BracketMatch.vue`（对阵图比赛卡片）
- **`components/hero/`** — 首页 Hero 区域，含体育场光束动画、多阶段倒计时/时钟、关键数据
- **区域组件** — 每个区域（分组、积分、32 强、赔率、城市、球星、历史、转播）都有 `*Section.vue` 容器和 `*Card.vue` 卡片
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
| `schedule.json` | `{ matches: [...], byDate: {...} }` — 小组赛每场比赛含 `id`、`homeTeam`、`awayTeam`、`homeLabel`、`awayLabel`、`time`（北京时间）、`venue`（zh/en）、可选 `score: { home, away, status }` |
| `groups.json` | `{ groups: [{ letter, teams: [{ name: {zh,en}, code, flag, conf }] }] }` |
| `knockout.json` | `{ roundOf32: [...], roundOf16: [...], quarterFinals: [...], semiFinals: [...], thirdPlace: {...}, final: {...} }` — 淘汰赛完整对阵。32 强比赛含固定 `homeTeam`/`awayTeam`；后续轮次使用 `homeFrom`/`awayFrom` 指向上轮比赛 `id`，决赛用 `{ id, result: 'winner' }`，季军赛用 `{ id, result: 'loser' }` |
| `odds.json` | `{ teams: [{ rank, code, name: {zh,en}, flag, odds }] }` |
| `live-scores.json` | `{ lastUpdated, matches: [{ id, status, minute, homeScore, awayScore }] }` |

已结束的比赛 `score.status === "FT"` — 这些显示实际比分和预测比分。
进行的比赛 `score.status === "Playing"` — 这些显示进行中比分和预测比分。

淘汰赛晋级规则：读取 `knockout.json` 中各轮 `score`，胜者自动填充到 `homeFrom`/`awayFrom` 指向的下一轮；半决赛败者自动进入季军赛。

### API 配置

Claude API 在 `usePrediction.js` 中通过 `@anthropic-ai/sdk` 调用。SDK 使用动态导入以控制打包体积。配置优先级：
1. `localStorage`（通过页面设置界面配置）
2. `.env` 文件（`VITE_CLAUDE_API_KEY`、`VITE_CLAUDE_BASE_URL`、`VITE_CLAUDE_MODEL`）
3. 无 API Key 时回退到模拟预测

### 比赛卡片比分显示优先级

比分按以下顺序显示：实时比分 > 实际比分（FT）> AI 预测 > VS 文字。

### 首页倒计时阶段

`CountdownTimer.vue` 根据当前时间自动切换显示：
- 开赛前：倒计时到开幕战
- 赛会期间：已开赛天数
- 决赛日：决赛开球时间（ET + 北京时间）
- 决赛后：实时时钟

### 页面导航

`NavBar.vue` 包含以下锚点：`#hero`、`#schedule`、`#group-standings`、`#groups`、`#round-of-32`、`#odds`、`#cities`、`#players`、`#history`、`#broadcast`。

### 新增/修改历史（便于快速定位）

- 2026-06: 新增 `GroupStandingsSection` 与 `#group-standings` 板块
- 2026-06: 新增 `RoundOf32Section` 与 `#round-of-32` 板块
- 2026-06: 新增淘汰赛对阵图 `KnockoutBracket` / `BracketMatch`
- 2026-06: 新增共享 `useStandings` composable
- 2026-06: `CountdownTimer` 改为多阶段显示
- 2026-06: `groups.json` 已按官方抽签结果修正分组
- 2026-06: `odds.json` 已按最新赔率更新
