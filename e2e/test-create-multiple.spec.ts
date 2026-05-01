import { expect, test } from "./fixtures";

test.describe("객관식 테스트 생성 화면", () => {
  test("기본 UI가 렌더되고 스위치를 토글할 수 있다", async ({ page }) => {
    await page.goto("/test/create-multiple");

    await expect(page.getByText("객관식")).toBeVisible();
    await expect(page.getByText("제목이 없어요")).toBeVisible();
    await expect(page.getByText("설명이 없어요")).toBeVisible();
    await expect(page.getByText("선택지 목록")).toBeVisible();
    await expect(page.getByText("추가하기")).toBeVisible();
    await expect(page.getByRole("button", { name: "취소" })).toBeVisible();
    await expect(page.getByRole("button", { name: "완료하기" })).toBeDisabled();

    const switches = page.getByRole("switch");
    await expect(switches).toHaveCount(2);

    await switches.nth(0).click();
    await expect(switches.nth(0)).toBeChecked();

    await switches.nth(1).click();
    await expect(switches.nth(1)).toBeChecked();
  });

  test("입력하기 오버레이에서 질문 제목만 입력해도 저장하기가 활성화된다", async ({ page }) => {
    await page.goto("/test/create-multiple");

    await page.getByRole("button", { name: "입력하기" }).click();
    await expect(page.getByText("질문 입력하기")).toBeVisible();

    const saveButton = page.getByRole("button", { name: "저장하기" });
    await expect(saveButton).toBeDisabled();

    await page.getByPlaceholder("질문 제목").fill("더 귀여운거에 선택해주세요");
    await expect(saveButton).toBeEnabled();
  });

  test("추가하기 오버레이에서 선택지명만 입력해도 만들기가 활성화된다", async ({ page }) => {
    await page.goto("/test/create-multiple");

    await page.getByText("추가하기").click();
    await expect(page.getByText("선택지 추가하기")).toBeVisible();

    const createButton = page.getByRole("button", { name: "만들기" });
    await expect(createButton).toBeDisabled();

    await page.getByPlaceholder("선택지명").fill("코리락쿠마");
    await expect(createButton).toBeEnabled();
  });

  test("선택지를 만들면 추가하기 아래에 선택지 row가 생긴다", async ({ page }) => {
    await page.goto("/test/create-multiple");

    await page.getByText("추가하기").click();
    await page.getByPlaceholder("선택지명").fill("코리락쿠마");
    await page.getByRole("button", { name: "만들기" }).click();

    await expect(page.getByText("코리락쿠마")).toBeVisible();
  });
});
