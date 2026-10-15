import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures";

type MockTest = {
  id: number;
  title: string;
  reward: number;
  categories: string[];
  isLiked?: boolean;
};

const makeTests = (count: number): MockTest[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `참여 테스트 ${i + 1}`,
    reward: 300,
    categories: ["PUBLIC_ADMIN", "COMMUNITY", "BUSINESS"],
  }));

const toSummary = (t: MockTest) => ({ description: "", thumbnailUrl: null, likeCount: 0, isLiked: false, ...t });

// GET /api/v1/tests — page/size 페이지네이션
async function mockListTests(page: Page, tests: MockTest[]) {
  await page.route(
    (url) => url.pathname === "/api/v1/tests",
    (route) => {
      const params = new URL(route.request().url()).searchParams;
      const pageNo = Number(params.get("page") ?? 1);
      const size = Number(params.get("size") ?? 3);
      const start = (pageNo - 1) * size;
      route.fulfill({
        json: {
          success: true,
          code: "OK",
          message: "",
          data: {
            testCount: tests.length,
            page: pageNo,
            size,
            hasNext: start + size < tests.length,
            tests: tests.slice(start, start + size).map(toSummary),
          },
        },
      });
    },
  );
}

// GET /api/v1/tests/completed — 발견 탭은 size=4 첫 페이지만 사용
async function mockCompletedTests(page: Page, tests: MockTest[]) {
  await page.route(
    (url) => url.pathname === "/api/v1/tests/completed",
    (route) => {
      const size = Number(new URL(route.request().url()).searchParams.get("size") ?? 4);
      route.fulfill({
        json: {
          success: true,
          code: "OK",
          message: "",
          data: {
            hasNext: tests.length > size,
            nextCursor: tests.length > size ? "next" : null,
            tests: tests.slice(0, size).map(toSummary),
          },
        },
      });
    },
  );
}

const availableCards = (page: Page) => page.getByTestId("available-test-card");

test.describe("발견 탭 (/discovery)", () => {
  test.beforeEach(async ({ page }) => {
    await mockCompletedTests(page, []);
  });

  test("배너 밑에 리워드 캐러셀이 보이고 넘길 수 있다", async ({ page }) => {
    await mockListTests(page, makeTests(3));
    await page.goto("/discovery");

    await expect(page.getByText("1분 응답하고")).toBeVisible();
    await expect(page.getByText("1/5")).toBeVisible();

    await page.getByRole("button", { name: "다음 배너" }).click();
    await expect(page.getByText("2/5")).toBeVisible();

    await page.getByRole("button", { name: "이전 배너" }).click();
    await expect(page.getByText("1/5")).toBeVisible();
  });

  test("참여 가능 테스트는 3개씩 보이고 더 보기로 3개씩 추가된다", async ({ page }) => {
    await mockListTests(page, makeTests(7));
    await page.goto("/discovery");

    await expect(page.getByText("리워드는 토스뱅크에 바로 지급돼요")).toBeVisible();
    await expect(availableCards(page)).toHaveCount(3);

    const moreButton = page.getByRole("button", { name: "더 보기" });
    await moreButton.click();
    await expect(availableCards(page)).toHaveCount(6);

    await moreButton.click();
    await expect(availableCards(page)).toHaveCount(7);
    await expect(moreButton).toBeHidden();
  });

  test("참여 가능 테스트가 3개 이하면 더 보기가 없다", async ({ page }) => {
    await mockListTests(page, makeTests(3));
    await page.goto("/discovery");

    await expect(availableCards(page)).toHaveCount(3);
    await expect(page.getByRole("button", { name: "더 보기" })).toBeHidden();
  });

  test("카테고리 코드가 한글 라벨로 보인다", async ({ page }) => {
    await mockListTests(page, makeTests(1));
    await page.goto("/discovery");

    const card = availableCards(page).first();
    await expect(card.getByText("공공·행정")).toBeVisible();
    await expect(card.getByText("커뮤니티")).toBeVisible();
    await expect(card.getByText("비즈니스")).toBeVisible();
  });

  test("참여 가능 테스트가 없으면 빈 상태가 보인다", async ({ page }) => {
    await mockListTests(page, []);
    await page.goto("/discovery");

    await expect(page.getByText("참여할 수 있는 테스트가 없어요")).toBeVisible();
  });

  test("참여 가능 테스트 카드를 누르면 상세로 이동한다", async ({ page }) => {
    await mockListTests(page, makeTests(3));
    await page.goto("/discovery");

    await availableCards(page).first().click();
    await expect(page).toHaveURL("/discovery/1");
  });

  test("종료 테스트는 최대 4개 그리드로 보이고, 더 있으면 더 보기가 보인다", async ({ page }) => {
    await mockListTests(page, makeTests(3));
    await mockCompletedTests(page, makeTests(6));
    await page.goto("/discovery");

    await expect(page.getByText("다양한 서비스 구경해요")).toBeVisible();
    await expect(page.getByTestId("closed-test-card")).toHaveCount(4);
    await expect(page.getByRole("button", { name: "더 보기" })).toHaveCount(1);
  });

  test("종료 테스트가 4개 이하면 종료 섹션에 더 보기가 없다", async ({ page }) => {
    await mockListTests(page, makeTests(3));
    await mockCompletedTests(page, makeTests(4));
    await page.goto("/discovery");

    await expect(page.getByTestId("closed-test-card")).toHaveCount(4);
    await expect(page.getByRole("button", { name: "더 보기" })).toBeHidden();
  });

  test("종료 테스트가 없으면 종료 섹션을 숨긴다", async ({ page }) => {
    await mockListTests(page, makeTests(3));
    await mockCompletedTests(page, []);
    await page.goto("/discovery");

    await expect(availableCards(page)).toHaveCount(3);
    await expect(page.getByText("다양한 서비스 구경해요")).toBeHidden();
    await expect(page.getByTestId("closed-test-card")).toHaveCount(0);
  });
});
