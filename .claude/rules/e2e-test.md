---
paths:
  - 'e2e/**'
  - 'playwright.config.ts'
---

# e2e 규칙 (Playwright)

- 설정 `playwright.config.ts`, 공통 fixture `e2e/fixtures.ts`. 뷰포트 390×844 · Chromium
- dev 서버는 `pnpm exec vite`로 자동 실행 (granite dev 아님)
- 명령: `pnpm test:e2e` · `pnpm test:e2e:ui` · `pnpm test:e2e:debug`

## 워크플로

1. 페이지·기능을 고칠 땐 관련 `e2e/*.spec.ts`를 **먼저** 작성·수정
2. 수정 후 "Playwright 테스트를 실행할까요?"를 확인하고 실행
3. 실패하면 **커밋 금지**. 원인 분석 후 수정

## 주의

- `getSafeAreaInsets is not a constant handler` 콘솔 에러는 네이티브 브릿지 부재 때문이며 실패 원인이 아님
- 토스 WebView 전용 네이티브 기능은 Playwright로 검증 불가 → 별도로 표시
