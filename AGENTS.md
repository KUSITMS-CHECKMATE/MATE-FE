# Codex / 에이전트 — MATE FE

OpenAI Codex 및 기타 `AGENTS.md`를 읽는 도구용. **전체 규칙은 [`AI_RULES.md`](./AI_RULES.md)를 따른다.**

## Project context

- **Apps in Toss** mini-app; not a generic SPA assumption for platform APIs.
- **Before coding:** official Apps in Toss docs → TDS → MCP (Figma/MCP as configured) → then implement. No guessing.

## Stack (must follow)

- Package manager: **pnpm only**
- **Vite + React** (do not use Next.js patterns as default)
- HTTP: **ky**, not raw `fetch` in app code; keep API logic out of UI components
- Server state: **TanStack Query**; avoid `useEffect` data fetching; invalidate after mutations
- Global client state: **Zustand minimally**; do not mirror server data in Zustand
- Styling: **Tailwind**; UI components **TDS first**, Tailwind for gaps
- Routing: **TanStack Router**; no hard-coded route strings scattered—use router patterns/constants
- Layout: **FSD** — `shared`, `features`, `entities`, `pages`
- Question-type features use **`question-{type}` naming** (not `test-{type}`); each has `model/` · `create/` · `answer/` sub-folders. Funnels (`test-create`, `test-participate`) import from these; reverse imports are forbidden.

## UI

Check TDS for buttons, inputs, modals. Consider mobile/webview (touch, scroll).

## Git / PR

Conventional commits (`feat|fix|refactor|chore`). Branches: `type/#issue`. PR titles: `[TYPE] title`. **Squash merge**. PR descriptions readable for Discord webhook.

## Testing (Playwright E2E)

- Tool: **Playwright** · test files in `e2e/*.spec.ts` · config: `playwright.config.ts`
- Viewport: 390×844 (mobile), browser: Chromium, dev server: `pnpm exec vite` (not granite dev)
- Commands: `pnpm test:e2e` / `pnpm test:e2e:ui` / `pnpm test:e2e:debug`
- **Workflow:** write/update spec first → ask to run tests → fix before committing if tests fail
- `getSafeAreaInsets is not a constant handler` console errors = expected in plain browser (no native bridge) — not a test failure

## Do not

Implement UI without checking TDS; use npm/yarn; store server data in Zustand; break FSD; large refactors without scope; ignore Apps in Toss constraints; commit with failing Playwright tests.

For Korean prose norms and full bullet list, read `AI_RULES.md`.
