import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures";

// 첫 테스트 완료 시 알림 동의 요청(Notification.requestAgreement)이 뜨는지 검증한다.
// - vite dev 서버에서는 @apps-in-toss/devtools가 SDK를 mock하고, 요청이 들어오면
//   "[@apps-in-toss/devtools] requestNotificationAgreement: <templateCode> → <결과>"를 콘솔에 남긴다.
//   이 로그로 "요청이 나갔는지"를 확인한다. (실제 동의 시트 노출은 토스 앱 QA 항목)

const TEST_ID = 9001;
const TEMPLATE_CODE = "mate-mate-test-approved";

async function mockApis(page: Page, myAnswers: unknown[]) {
  await page.route(`**/api/v1/tests/${TEST_ID}/questions`, (route) =>
    route.fulfill({
      json: {
        success: true,
        data: {
          testId: TEST_ID,
          questions: [
            {
              questionId: 1,
              sequence: 1,
              type: "SUBJECTIVE",
              title: "알림 동의 테스트 질문",
              placeholder: "답변을 입력해주세요",
            },
          ],
        },
      },
    }),
  );
  await page.route("**/api/v1/answers/me", (route) =>
    route.fulfill({
      json: { success: true, data: { totalPromotionReward: 0, answers: myAnswers } },
    }),
  );
  await page.route(`**/api/v1/tests/${TEST_ID}/answers`, (route) =>
    route.fulfill({ json: { success: true } }),
  );
}

function collectConsole(page: Page) {
  const logs: string[] = [];
  page.on("console", (msg) => logs.push(msg.text()));
  return {
    requests: () =>
      logs.filter((l) => l.includes("requestNotificationAgreement:") && l.includes(TEMPLATE_CODE)),
    errors: () => logs.filter((l) => l.includes("requestNotificationAgreement error")),
  };
}

async function completeTest(page: Page) {
  await page.goto(`/test/participate/${TEST_ID}`);
  await page.getByPlaceholder("답변을 입력해주세요").fill("좋아요");
  await page.getByRole("button", { name: "완료하기" }).click();
  await expect(page.getByText("테스트를 제출했어요")).toBeVisible();
}

test.describe("첫 테스트 완료 시 알림 동의 요청", () => {
  test("응답이 0건이면 제출 후 알림 동의를 한 번 요청한다", async ({ page }) => {
    const console_ = collectConsole(page);
    await mockApis(page, []);

    await completeTest(page);

    await expect.poll(() => console_.requests().length).toBe(1);
    // 반환값이 함수가 아닌 환경(devtools mock, 일부 실기기)에서도 에러 없이 끝나야 한다.
    expect(console_.errors()).toEqual([]);
  });

  test("이미 응답한 적이 있으면 알림 동의를 요청하지 않는다", async ({ page }) => {
    const console_ = collectConsole(page);
    await mockApis(page, [{ testId: 1, title: "이전 테스트" }]);

    await completeTest(page);

    // 요청이 나갈 시간을 준 뒤에도 0건이어야 한다.
    await page.waitForTimeout(500);
    expect(console_.requests()).toHaveLength(0);
  });

  test("응답 목록 조회가 실패하면 알림 동의를 요청하지 않고 제출 완료 화면은 정상 노출된다", async ({ page }) => {
    const console_ = collectConsole(page);
    await mockApis(page, []);
    // mockApis 이후에 등록한 route가 우선한다.
    await page.route("**/api/v1/answers/me", (route) => route.fulfill({ status: 500, json: {} }));

    await completeTest(page);

    await page.waitForTimeout(500);
    expect(console_.requests()).toHaveLength(0);
  });
});
