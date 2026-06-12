# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

2026 FIFA World Cup website built with **Vite + Vue 3 + Tailwind CSS 4 + Vue I18n + Pinia**. Single-page application with dark theme and gold accent colors. All content is driven by JSON files in `public/data/`.

## Working Directory

All development happens in the **`v2/`** directory. `v1/` is a legacy single-file HTML version (historical reference only).

## Key Commands

```bash
cd v2
npm run dev       # Start dev server (Vite)
npm run build     # Production build → dist/
npm run preview   # Preview production build
```

No lint or test commands are configured.

## Architecture

### Data Flow

All data is fetched at runtime from `/data/*.json` files (served from `public/data/`) via the `useData()` composable. Results are cached in a module-level `Map`. Edit JSON files directly — no rebuild needed for data changes.

```
public/data/*.json → useData() → Vue Components
                       ↓
                  fetch('/data/...')
                       ↓
                module-level cache (Map)
```

### Core Composables

- **`useData(resource)`** — Fetches `public/data/{resource}.json`, caches results. Returns `{ data, loading, error, refetch }`. **Never name an inner function `fetch()` — it shadows the global `fetch` API.**
- **`usePrediction()`** — Manages match predictions stored in `localStorage` (`wc2026_predictions`). Supports two modes:
  - `simulated` — Poisson distribution based on odds (`utils/predictionEngine.js`)
  - `ai` — Calls Claude API. Reads config from `localStorage` keys: `wc2026_claude_base_url`, `wc2026_claude_api_key`, `wc2026_claude_model`. Falls back to `import.meta.env` values, then to simulated mode.
- **`useLiveScores()`** — Polls `live-scores.json` every 30s. Returns `{ scores, getMatchStatus }`.
- **`useCountdown(targetDate)`** — Reactive countdown timer.
- **`useScrollAnimation()`** — IntersectionObserver for fade-in effects.

### Pinia Stores

- **`stores/app.js`** — Nav state (mobile open/close, active section)
- **`stores/settings.js`** — Claude API config (baseUrl, apiKey, model), persisted to localStorage

### Component Structure

- **`components/layout/`** — `NavBar.vue` (fixed nav + language toggle + settings button), `Footer.vue`, `SettingsModal.vue`
- **`components/schedule/`** — `ScheduleSection.vue` (groups matches by Beijing date), `MatchCard.vue` (shows score/prediction/venue/time), `MatchDetail.vue` (modal with AI prediction), `SchedulePhase.vue` (accordion for phase-organized view)
- **`components/hero/`** — Hero section with stadium light beam animations, countdown, key stats
- **Section components** — Each section (groups, odds, cities, players, history, broadcast) has a `*Section.vue` container and `*Card.vue` item
- **`components/shared/`** — Reusable: `SectionHeader`, `FadeInWrapper`, `TeamFlag`, `CountryBadge`

### i18n

- `src/i18n/locales/zh.json` (default) and `en.json`
- Locale stored in `localStorage` (`wc2026_locale`)
- Content data (team names, venues) use `{ "zh": "...", "en": "..." }` objects in JSON data files
- `getLocaleLabel()` helper in `useLiveScores.js` picks the right language

### Design Tokens

Defined in `src/assets/styles/global.css` via Tailwind `@theme`:
- Backgrounds: `bg-primary` (#0a0a12), `bg-secondary` (#12121f), `bg-card` (#1a1a2e)
- Gold: `gold` (#d4a843), `gold-light` (#f0d078), `gold-dark` (#a07828)
- Text: `text-primary` (#f0f0f5), `text-secondary` (#a0a0b8), `text-muted` (#6a6a80)
- Custom animations: `beam-pulse`, `shimmer`, `glow-pulse`
- `.card` base class with hover effect

### JSON Data Files

| File | Key Structure |
|------|---------------|
| `schedule.json` | `{ matches: [...], byDate: {...} }` — each match has `id`, `homeTeam`, `awayTeam`, `homeLabel`, `awayLabel`, `time` (Beijing), `venue` (zh/en), optional `score: { home, away, status }` |
| `groups.json` | `{ groups: [{ letter, teams: [{ name: {zh,en}, code, flag, conf }] }] }` |
| `odds.json` | `{ teams: [{ rank, code, name: {zh,en}, flag, odds }] }` |
| `live-scores.json` | `{ lastUpdated, matches: [{ id, status, minute, homeScore, awayScore }] }` |

Finished matches have `score.status === "FT"` — these show actual scores instead of predictions.

### API Configuration

Claude API is called from `usePrediction.js` using `@anthropic-ai/sdk`. The SDK is dynamically imported to keep bundle size manageable. Configuration priority:
1. `localStorage` (set via Settings modal in UI)
2. `.env` (`VITE_CLAUDE_API_KEY`, `VITE_CLAUDE_BASE_URL`, `VITE_CLAUDE_MODEL`)
3. Falls back to simulated prediction if no API key

### Match Card Display Priority

Scores display in this order: live score > actual score (FT) > AI prediction > VS text.
