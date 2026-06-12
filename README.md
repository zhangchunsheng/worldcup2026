# 2026 FIFA 世界杯

> 🏟️ 美国 · 加拿大 · 墨西哥 | 2026年6月11日 — 7月19日

## 版本

- **v2/** — Vite + Vue 3 + Tailwind CSS 4 + Vue I18n + Pinia（当前版本）
- **v1/** — 纯 HTML/CSS/JS 单文件页面（历史版本）

## v2 开发

```bash
cd v2
npm install
npm run dev     # 开发服务器
npm run build   # 构建生产版本
```

详细文档请参阅 [v2/README.md](../v2/README.md)

## 数据更新

编辑 `v2/public/data/` 下的 JSON 文件即可更新数据，无需重新构建。

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
