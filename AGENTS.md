# Repository Guidelines

>This repository contains a zero‑dependency browser library that converts images into CSS gradients, plus a lightweight demo UI for local testing.

## Project Structure & Module Organization
- `src/img2css.js`: Core ES module exposing the `img2css` class (rows/columns/hybrid processing, optional auto‑optimize). Keep the class name as `img2css` for API stability.
- `src/example-ui.html`: Demo UI to experiment with settings and preview CSS output.
- Root docs/media: `README.md`, `CHANGELOG.md`, `demo-visual.png`.

## Build, Test, and Development Commands
- `npm run dev` or `npm start`: Serve the repo at `http://localhost:8000` via Python `http.server`. Open `src/example-ui.html` in your browser.
- `npm test`: Placeholder (returns success). If you add tests, update this script to run them (e.g., Jest).

## Coding Style & Naming Conventions
- JavaScript: ES Modules, 2‑space indent, semicolons, single quotes, descriptive identifiers. Prefer small, pure helpers.
- Files: Lowercase with hyphens when adding new files; keep existing names (e.g., `img2css.js`).
- Dependencies: Avoid adding runtime deps; preserve browser‑only usage and small bundle footprint.

## Testing Guidelines
- Framework: Jest with `jsdom` is recommended for DOM/canvas‑adjacent logic.
- Scope: Unit‑test palette extraction, scaling, and mode selection; use small fixtures. Avoid large image assets in git.
- Layout: Place tests in `tests/` using `*.test.js` names.
- Example setup: `npm i -D jest jest-environment-jsdom` and set `"test": "jest"` in `package.json`.

## Commit & Pull Request Guidelines
- Commits: Imperative, concise subjects (≤72 chars). Example: `Fix demo image generator` or `Add hybrid processing mode`.
- PRs: Include summary, rationale, before/after screenshots from the demo UI, any API changes, and linked issues.
- Checks: Verify the demo still loads in a static server and that generated CSS applies via a class selector.

## Security & Configuration Tips
- CORS: When loading remote images, use CORS‑enabled sources or data URLs to avoid canvas tainting (the library sets `crossOrigin='anonymous'`).
- Assets: Do not commit large binaries. Use small samples or link externally.
