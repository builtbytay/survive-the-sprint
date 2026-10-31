# Automated regression tests

The browser suite uses Playwright (Chromium) and axe-core. It is layered on the **security branch**, which itself includes accessibility PR #5. No production source is changed by the test suite.

## Run locally
Requires Node.js 22+, Python 3, and browser installation:

```sh
npm install
npx playwright install chromium
npm test
```

For interactive debugging: `npm run test:ui`. Reports: `playwright-report/`; failure screenshots/traces: `test-results/`.

## What is covered
- Game startup, basic dialog and keyboard focus, sprintboard priority state.
- Pause settings persistence and disabling single-key shortcuts.
- Semantic meters/progress and axe-core scans of intro and sprintboard.
- Portrait and landscape responsive layouts, reduced motion.
- Accelerated real game-time progression from Monday through Friday.
- Browser-side security-header assertions against a **deployed** preview when explicitly configured.

To exercise deployed headers (not available in the simple local Python server), set `SECURITY_PREVIEW_URL=https://<cloudflare-preview-host>/` then run `npm test`. The preview test skips locally when not configured.

## Test limitations
- Axe-core checks detectable automated rules; manual NVDA/VoiceOver/TalkBack testing is still required to validate announcements and game experience.
- The CI server uses Python's static server, which does not process Cloudflare `_headers`. Production CSP behavior and real deployment headers must be verified against a Cloudflare preview.
- Visual appearance and all alternative gameplay strategies are not exhaustively covered. Review screenshots and test the mobile preview manually.
- CI failing assertions are **findings**, not a reason to modify the game blindly.
- This suite intentionally does not alter production game code or the existing security workflow.
