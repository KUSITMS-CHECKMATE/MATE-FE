import { test, expect } from "./fixtures";

test.describe("테스트 생성 퍼널", () => {
  test("이름 → 한줄 소개 → 카테고리 → 테스트 등록 단계로 진입한다", async ({ page }) => {
    await page.goto("/");

    // 1. 이름 입력
    const nameField = page.getByPlaceholder("테스트 이름");
    await nameField.click();
    await nameField.fill("샘플 테스트");
    await page.getByRole("button", { name: "확인" }).click();

    // 2. 한줄 소개 입력
    const summaryField = page.getByPlaceholder("테스트 한줄 소개");
    await expect(summaryField).toBeVisible();
    await summaryField.click();
    await summaryField.fill("샘플 한줄 소개");
    await page.getByRole("button", { name: "확인" }).click();

    // 3. 카테고리 시트 열기 → 선택 → 선택하기
    await page.locator('button:has-text("카테고리")').first().click();
    await expect(page.getByText("카테고리를 선택해주세요")).toBeVisible();
    await page.getByRole("checkbox", { name: /일상/ }).click();
    await page.getByRole("button", { name: "선택하기" }).click();

    // 4. 다음으로 → 테스트 등록 단계로 진입
    await page.getByRole("button", { name: "다음으로" }).click();

    // 테스트 등록 화면의 시그니처 요소 확인
    await expect(page.getByText("등록한 질문이 없어요")).toBeVisible();
    await expect(page.getByText("질문을 등록하고 테스트를 구성해봐요")).toBeVisible();
    await expect(page.getByRole("button", { name: "테스트 만들기" })).toBeVisible();
    await expect(page.getByRole("button", { name: "테스트 만들기" })).toBeDisabled();
  });

  test("테스트 등록 화면에서 탭 전환이 가능하다", async ({ page }) => {
    await page.goto("/");

    // 빠르게 register 단계까지 진입
    const nameField = page.getByPlaceholder("테스트 이름");
    await nameField.click();
    await nameField.fill("샘플");
    await page.getByRole("button", { name: "확인" }).click();

    const summaryField = page.getByPlaceholder("테스트 한줄 소개");
    await summaryField.click();
    await summaryField.fill("샘플 한줄");
    await page.getByRole("button", { name: "확인" }).click();

    await page.locator('button:has-text("카테고리")').first().click();
    await page.getByRole("checkbox", { name: /일상/ }).click();
    await page.getByRole("button", { name: "선택하기" }).click();
    await page.getByRole("button", { name: "다음으로" }).click();

    // 기본 활성 탭(질문 목록)에서 "만들기" 보임
    await expect(page.getByText("만들기", { exact: true })).toBeVisible();

    // 테스트 정보 탭으로 전환
    await page.getByText("테스트 정보").click();
    await expect(page.getByText("등록한 질문이 없어요")).not.toBeVisible();
  });
});
