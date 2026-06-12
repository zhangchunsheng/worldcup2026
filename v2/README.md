# 2026 FIFA 世界杯

> 🏟️ 美国 · 加拿大 · 墨西哥 | 2026年6月11日 — 7月19日

## 概览

2026年世界杯是首届 **48支球队** 参赛的世界杯，由美国、加拿大和墨西哥三国联合主办。赛事横跨北美三大国，共 **16座主办城市**，在 **39天** 内进行 **104场** 比赛。

- **赛制**：12个小组 × 4队，小组前二 + 8个最佳第三名晋级淘汰赛
- **开幕战**：墨西哥城 · 阿兹特克体育场
- **决赛**：纽约 · MetLife体育场

## 功能

| 功能 | 说明 |
|------|------|
| 📅 赛程 | 开幕战至决赛完整赛程，手风琴展开 |
| 📋 分组 | 全部12个小组、48支球队 |
| 🔮 比分预测 | 模拟预测（基于赔率）/ Claude AI 预测，可切换 |
| 📊 夺冠赔率 | 12支热门球队赔率 |
| 🌆 主办城市 | 16座主办城市信息 |
| ⭐ 球星 | 焦点球星展示 |
| 📜 历史 | 历届冠军历史 |
| 📺 转播 | 观赛指南 |
| 🔄 实时比分 | 通过 JSON 文件更新，刷新页面生效 |
| 🌐 多语言 | 中文默认 / 英文切换 |

## 技术

| 项目 | 说明 |
|------|------|
| 技术栈 | Vite + Vue 3 + Tailwind CSS 4 + Vue I18n + Pinia |
| 数据驱动 | JSON 文件，可通过编辑 `public/data/*.json` 更新 |
| 设计 | 暗色主题 + 金杯色调 + 体育场灯光动效 |
| 适配 | 响应式设计（桌面端 + 移动端） |
| 部署 | 静态部署（GitHub Pages / Vercel / 任意静态托管） |
| 语言 | 简体中文（默认）+ 英文 |

## 开发

```bash
cd v2
npm install
npm run dev     # 开发服务器
npm run build   # 构建生产版本
npm run preview # 预览生产构建
```

## 数据更新

所有数据位于 `public/data/` 目录，编辑对应 JSON 文件即可更新：

| 文件 | 内容 |
|------|------|
| `groups.json` | 12个小组分组 |
| `schedule.json` | 赛程安排 |
| `odds.json` | 夺冠赔率 |
| `cities.json` | 主办城市 |
| `players.json` | 球星资料 |
| `history.json` | 历届冠军 |
| `broadcast.json` | 转播信息 |
| `live-scores.json` | 实时比分（编辑后刷新页面生效） |

## 比分预测

预测功能支持两种模式：
1. **模拟预测**（默认）：基于赔率的泊松分布算法，无需 API Key
2. **AI 预测**：调用 Claude API，需配置 `.env` 中的 `VITE_CLAUDE_API_KEY`

```bash
cp .env.example .env
# 编辑 .env 填入 API Key
```

## 项目结构

```
v2/
├── public/data/        # JSON 数据文件
├── src/
│   ├── components/     # Vue 组件
│   ├── composables/    # 组合式函数
│   ├── utils/          # 工具函数
│   ├── i18n/           # 国际化
│   └── stores/         # 状态管理
└── README.md
```

## 许可

[MIT License](../LICENSE)

> ⚽ 本站仅为信息展示，与国际足联（FIFA）无关。FIFA World Cup™ 是国际足联的注册商标。
