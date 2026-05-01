import { expect, test } from "./fixtures";
import type { Page } from "@playwright/test";

// 퍼널을 거쳐 객관식 질문 입력 오버레이까지 이동
async function navigateToMultipleEditor(page: Page) {
  await page.goto("/test/create");

  // name 단계
  await page.getByPlaceholder("테스트 이름").fill("메이트 사용성 테스트");
  await page.getByRole("button", { name: "확인" }).click();

  // summary 단계
  await page.getByPlaceholder("테스트 한줄 소개").fill("사용성 테스트입니다");
  await page.getByRole("button", { name: "확인" }).click();

  // category 단계
  await page.getByLabel("카테고리").click();
  await page.getByText("일상").click();
  await page.getByRole("button", { name: "선택하기" }).click();
  await page.getByRole("button", { name: "다음으로" }).click();

  // service 단계 — 서비스 소개 없이 건너뜀
  await page.getByRole("button", { name: "다음으로" }).click();
  await page.getByRole("button", { name: "다음에" }).click();

  // image 단계 — mock 이미지 주입 후 진행
  await page.evaluate(() => (window as any).__INJECT_MOCK_IMAGE__?.());
  await page.getByRole("button", { name: "다음으로" }).click();

  // register 단계 — 질문 목록 탭으로 전환
  await page.getByRole("tab", { name: "질문 목록" }).click();

  // 객관식 질문 추가
  await page.getByRole("button", { name: "만들기" }).click();
  await page.getByText("객관식").click();
  await page.getByRole("button", { name: "추가하기" }).click();

  // 입력 버튼 클릭 → MultipleCreatePage 오버레이 진입
  await page.getByRole("button", { name: "입력" }).click();
}

test.describe("객관식 질문 생성 화면", () => {
  test("기본 UI가 렌더된다", async ({ page }) => {
    await navigateToMultipleEditor(page);

    await expect(page.getByText("선택지 목록")).toBeVisible();
    await expect(page.getByText("추가하기")).toBeVisible();
    await expect(page.getByRole("button", { name: "취소" })).toBeVisible();
    await expect(page.getByRole("button", { name: "완료하기" })).toBeDisabled();

    const switches = page.getByRole("switch");
    await expect(switches).toHaveCount(2);
  });

  test("스위치를 토글할 수 있다", async ({ page }) => {
    await navigateToMultipleEditor(page);

    const switches = page.getByRole("switch");
    await switches.nth(0).click();
    await expect(switches.nth(0)).toBeChecked();

    await switches.nth(1).click();
    await expect(switches.nth(1)).toBeChecked();
  });

  test("질문 입력 오버레이에서 제목만 입력해도 저장하기가 활성화된다", async ({ page }) => {
    await navigateToMultipleEditor(page);

    await page.getByRole("button", { name: "입력하기" }).click();
    await expect(page.getByText("질문 입력하기")).toBeVisible();

    const saveButton = page.getByRole("button", { name: "저장하기" });
    await expect(saveButton).toBeDisabled();

    await page.getByPlaceholder("질문 제목").fill("더 귀여운거에 선택해주세요");
    await expect(saveButton).toBeEnabled();
  });

  test("선택지 추가 오버레이에서 선택지명만 입력해도 만들기가 활성화된다", async ({ page }) => {
    await navigateToMultipleEditor(page);

    await page.getByText("추가하기").click();
    await expect(page.getByText("선택지 추가하기")).toBeVisible();

    const createButton = page.getByRole("button", { name: "만들기" });
    await expect(createButton).toBeDisabled();

    await page.getByPlaceholder("선택지명").fill("코리락쿠마");
    await expect(createButton).toBeEnabled();
  });

  test("선택지를 만들면 목록에 나타난다", async ({ page }) => {
    await navigateToMultipleEditor(page);

    await page.getByText("추가하기").click();
    await page.getByPlaceholder("선택지명").fill("코리락쿠마");
    await page.getByRole("button", { name: "만들기" }).click();

    await expect(page.getByText("코리락쿠마")).toBeVisible();
  });

  test("제목과 선택지가 모두 있으면 완료하기가 활성화된다", async ({ page }) => {
    await navigateToMultipleEditor(page);

    // 질문 제목 입력
    await page.getByRole("button", { name: "입력하기" }).click();
    await page.getByPlaceholder("질문 제목").fill("더 귀여운거에 선택해주세요");
    await page.getByRole("button", { name: "저장하기" }).click();

    // 선택지 추가
    await page.getByText("추가하기").click();
    await page.getByPlaceholder("선택지명").fill("코리락쿠마");
    await page.getByRole("button", { name: "만들기" }).click();

    await expect(page.getByRole("button", { name: "완료하기" })).toBeEnabled();
  });

  test("완료 후 질문 목록에 제목이 표시되고 버튼이 수정으로 바뀐다", async ({ page }) => {
    await navigateToMultipleEditor(page);

    // 질문 제목 입력
    await page.getByRole("button", { name: "입력하기" }).click();
    await page.getByPlaceholder("질문 제목").fill("더 귀여운거에 선택해주세요");
    await page.getByRole("button", { name: "저장하기" }).click();

    // 선택지 추가
    await page.getByText("추가하기").click();
    await page.getByPlaceholder("선택지명").fill("코리락쿠마");
    await page.getByRole("button", { name: "만들기" }).click();

    // 완료
    await page.getByRole("button", { name: "완료하기" }).click();

    // 질문 목록으로 돌아와 제목과 수정 버튼 확인
    await expect(page.getByText("더 귀여운거에 선택해주세요")).toBeVisible();
    await expect(page.getByRole("button", { name: "수정" })).toBeVisible();
  });

  test("수정 진입 시 이전에 입력한 데이터가 복원된다", async ({ page }) => {
    await navigateToMultipleEditor(page);

    // 질문 제목 입력 후 완료
    await page.getByRole("button", { name: "입력하기" }).click();
    await page.getByPlaceholder("질문 제목").fill("더 귀여운거에 선택해주세요");
    await page.getByRole("button", { name: "저장하기" }).click();

    await page.getByText("추가하기").click();
    await page.getByPlaceholder("선택지명").fill("코리락쿠마");
    await page.getByRole("button", { name: "만들기" }).click();
    await page.getByRole("button", { name: "완료하기" }).click();

    // 수정 재진입
    await page.getByRole("button", { name: "수정" }).click();

    // 기존 데이터 복원 확인
    await expect(page.getByText("더 귀여운거에 선택해주세요")).toBeVisible();
    await expect(page.getByText("코리락쿠마")).toBeVisible();
  });
});
