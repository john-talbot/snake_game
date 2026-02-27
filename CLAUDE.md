# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm check          # lint + format check (run before committing)
pnpm check:fix      # auto-fix lint and formatting issues
pnpm lint           # lint only
pnpm format         # format only (writes files)
pnpm dev            # serve the game locally via npx serve
```

There are no automated tests in this project. The game is validated manually in the browser.

## Architecture

This is a vanilla JavaScript snake game with no build step — it runs directly in the browser using ES modules (`type="module"`).

**Entry points:**
- `index.html` — the single page; loads `src/style.css` and `src/main.js`
- `src/main.js` — orchestrates the game loop, wires up DOM events, and holds mutable game state

**Module responsibilities:**
- `src/constants.js` — all magic values: grid size, tick speed, color palette, key→direction map, opposite-direction map
- `src/snake.js` — pure functions for snake state: `createSnake`, `setDirection`, `moveSnake`. Returns new state objects rather than mutating.
- `src/food.js` — `spawnFood` picks a random grid cell not occupied by the snake
- `src/renderer.js` — `render(ctx, snake, food)` redraws the full canvas each tick

**Game loop:** `main.js` uses `setTimeout` (not `requestAnimationFrame`) at a fixed `TICK_INTERVAL_MS` interval. Each tick calls `moveSnake`, updates score, respawns food if eaten, calls `render`, and either reschedules or shows the game-over overlay.

**State flow:** `snake` and `food` are plain objects held in `main.js` locals. `snake.js` functions are pure — they return `{ snake, alive, ateFood }` without side effects. Only `main.js` reassigns these variables.

## Tooling

- **Biome 2.x** handles linting, formatting, and import sorting. Config is in `biome.json`. Indent style is tabs; quotes are double. The `.claude/` directory is excluded via `files.includes`.
- **No bundler** — the project uses native ES module imports in the browser.
