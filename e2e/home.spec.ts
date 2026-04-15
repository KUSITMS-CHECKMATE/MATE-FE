import { test, expect } from './fixtures';

test.describe('홈 페이지 (/)', () => {
  test('페이지가 정상적으로 로드된다', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
    // 페이지 타이틀 또는 핵심 요소 확인 — 실제 구현에 맞게 업데이트 필요
    await expect(page.locator('body')).toBeVisible();
  });
});
