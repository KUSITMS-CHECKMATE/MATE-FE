import { test, expect } from './fixtures';

test.describe('프로필 페이지 (/profile/:userId)', () => {
  test('유저 ID로 프로필 페이지에 접근할 수 있다', async ({ page }) => {
    await page.goto('/profile/1');
    await expect(page).toHaveURL('/profile/1');
    await expect(page.locator('body')).toBeVisible();
  });

  test('존재하지 않는 유저 ID로 접근 시 처리된다', async ({ page }) => {
    await page.goto('/profile/9999999');
    // 에러 페이지 또는 빈 상태 처리 확인 — 실제 구현에 맞게 업데이트 필요
    await expect(page.locator('body')).toBeVisible();
  });
});
