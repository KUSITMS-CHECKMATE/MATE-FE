import { test, expect } from './fixtures';

test.describe('토스 로그인 테스트 페이지 (/login)', () => {
  test('페이지가 정상적으로 로드되고 로그인 버튼이 보인다', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('토스 로그인 테스트')).toBeVisible();
    await expect(page.getByRole('button', { name: '토스 로그인' })).toBeVisible();
  });

  // appLogin()은 토스 앱 네이티브 브릿지가 필요해 Playwright(브라우저)로는 검증 불가.
  // authorizationCode 획득 동작은 토스앱(.ait) 빌드 후 직접 확인.
});
