# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: profile.spec.ts >> 프로필 페이지 (/profile/:userId) >> 존재하지 않는 유저 ID로 접근 시 처리된다
- Location: e2e/profile.spec.ts:10:3

# Error details

```
Error: browserType.launch: Executable doesn't exist at /var/folders/dr/y14pqrt15ljg1dml6471gt_r0000gp/T/cursor-sandbox-cache/0bc13efd752b672cfcc99bfeb96f5a06/playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-x64/chrome-headless-shell
╔════════════════════════════════════════════════════════════╗
║ Looks like Playwright was just installed or updated.       ║
║ Please run the following command to download new browsers: ║
║                                                            ║
║     pnpm exec playwright install                           ║
║                                                            ║
║ <3 Playwright Team                                         ║
╚════════════════════════════════════════════════════════════╝
```