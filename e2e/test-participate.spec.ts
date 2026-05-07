import { test, expect } from "./fixtures";

test.describe("테스트 참여 퍼널", () => {
  test("A/B 테스트에서 선택한 값이 이전으로 돌아와도 유지된다", async ({ page }) => {
    // testId=2 는 첫 번째 질문이 A/B 테스트입니다.
    await page.goto("/test/participate/2");

    // 첫 번째 질문: 누가 더 귀엽나요?
    await expect(page.getByText("누가 더 귀엽나요?")).toBeVisible();

    // 선택하기 버튼 클릭 (바텀시트 오픈)
    await page.getByRole("button", { name: "선택하기" }).click();

    // 바텀시트 안에서 A안 선택
    const optionA = page.getByRole("checkbox", { name: "A안" });
    await optionA.click();

    // 확인 버튼 눌러서 다음 질문으로 이동
    // FixedBottomCTA의 '확인' 버튼인지 BottomSheet의 '확인' 버튼인지 구분하기 위해
    // 바텀 시트 내의 확인 버튼을 찾습니다.
    await page.getByRole("button", { name: "확인" }).click();

    // 다음 질문 화면 (척도 질문: 이 서비스가 전반적으로 사용하기 편리했나요?)
    await expect(page.getByText("이 서비스가 전반적으로 사용하기 편리했나요?")).toBeVisible();

    // 이전 버튼 클릭
    await page.getByRole("button", { name: "이전" }).click();

    // 다시 A/B 테스트 화면인지 확인
    await expect(page.getByText("누가 더 귀엽나요?")).toBeVisible();

    // 다시 선택하기 버튼 클릭
    await page.getByRole("button", { name: "선택하기" }).click();

    // A안이 여전히 선택된 상태(aria-checked="true")인지 확인
    await expect(page.getByRole("checkbox", { name: "A안" })).toHaveAttribute("aria-checked", "true");
  });

  test("모든 질문 유형을 성공적으로 답변하고 완료할 수 있다", async ({ page }) => {
    test.setTimeout(80000); // 5초 테스트 대기시간 포함

    await page.goto("/test/participate/1");

    // 1. 주관식
    await expect(page.getByText("오늘의 기분이 어떤지 작성해주세요").first()).toBeVisible();
    await page.getByPlaceholder("답변 쓰는중임").fill("아주 좋아요");
    await page.getByRole("button", { name: "다음" }).click();

    // 2. 객관식 (다중 선택 1~3)
    await expect(page.getByText("선호하는 색상을 모두 골라주세요").first()).toBeVisible();
    await page.getByText("빨강").click();
    await page.getByText("초록").click();
    await page.getByRole("button", { name: "다음" }).click();

    // 3. 트리 테스트
    await expect(page.getByText("내 프로필 사진을 수정하려면 어디로 가야할까요?")).toBeVisible();
    await page.getByText("설정").click();
    await page.getByRole("button", { name: "다음" }).click();

    // 4. 척도 질문 (5점)
    await expect(page.getByText("이 서비스가 2030 여성으로서 도움이 되고 편리하다고 느껴지셨나요?")).toBeVisible();
    await page.getByText("4", { exact: true }).click();
    await page.getByRole("button", { name: "다음" }).click();

    // 5. 척도 질문 (7점)
    await expect(page.getByText("전반적인 만족도를 7점 척도로 평가해주세요.")).toBeVisible();
    await page.getByText("6", { exact: true }).click();
    await page.getByRole("button", { name: "다음" }).click();

    // 6. 척도 질문 (5점, 이미지 있음)
    await expect(page.getByText("이 디자인이 브랜드 이미지와 잘 어울린다고 생각하시나요?")).toBeVisible();
    await page.getByText("5", { exact: true }).click();
    await page.getByRole("button", { name: "다음" }).click();

    // 7. A/B 테스트
    await expect(page.getByText("누가 더 귀엽나요?")).toBeVisible();
    await page.getByRole("button", { name: "선택하기" }).click();
    await page.getByRole("checkbox", { name: "B안" }).click();
    await page.getByRole("button", { name: "확인" }).click();

    // 8. 카드 소팅
    await expect(page.getByText("카드를 적절한 카테고리로 분류해주세요")).toBeVisible();
    const placeCard = async (cardName: string, categoryName: string) => {
      await page.getByText(cardName).click();
      await page.getByText(categoryName, { exact: true }).click();
    };
    await placeCard("셔츠", "상의");
    await placeCard("가디건", "상의");
    await placeCard("슬랙스", "하의");
    await placeCard("청바지", "하의");
    await placeCard("운동화", "신발");
    await placeCard("구두", "신발");
    await page.getByRole("button", { name: "다음" }).click();

    // 9. 객관식 (단일 선택)
    await expect(page.getByText("오늘의 기분이 어떤지 체크해주세요")).toBeVisible();
    await page.getByText("행복함").click();
    await page.getByRole("button", { name: "다음" }).click();

    // 10. 객관식 (다중 선택 1~3)
    await expect(page.getByText("선호하는 색상을 모두 골라주세요").last()).toBeVisible();
    await page.getByText("파랑").click();
    await page.getByRole("button", { name: "다음" }).click();

    // 11. 주관식
    await expect(page.getByText("오늘의 기분이 어떤지 작성해주세요").last()).toBeVisible();
    await page.getByPlaceholder("답변을 작성해주세요").fill("좋습니다");
    await page.getByRole("button", { name: "다음" }).click();

    // 12. 주관식
    await expect(page.getByText("이 이미지를 보고 느낀 점을 작성해주세요")).toBeVisible();
    await page.getByPlaceholder("답변을 작성해주세요").fill("느낌이 좋네요");
    await page.getByRole("button", { name: "다음" }).click();

    // 13. 5초 테스트 (객관식 - 다중 선택): ready → 다음 → preview(눌러서 확인하기) → countdown → answer
    await expect(page.getByRole("button", { name: "다음" })).toBeVisible();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByText("눌러서 확인하기").click();
    await expect(page.getByText("5초 안에 떠오르는 것을 골라주세요")).toBeVisible({ timeout: 8000 });
    await page.getByText("사과").click();
    await page.getByRole("button", { name: "다음" }).click();

    // 14. 5초 테스트 (객관식 - 단일 선택): ready → 이전 있으므로 오른쪽 다음 → preview → countdown → answer
    await expect(page.getByRole("button", { name: "다음" }).last()).toBeVisible();
    await page.getByRole("button", { name: "다음" }).last().click();
    await page.getByText("눌러서 확인하기").click();
    await expect(page.getByText("이 이미지를 보고 가장 먼저 떠오르는 단어를 선택해주세요")).toBeVisible({ timeout: 8000 });
    await page.getByText("편안함").click();
    await page.getByRole("button", { name: "다음" }).click();

    // 15. 5초 테스트 (주관식): ready → 오른쪽 다음 → preview → countdown → answer
    await expect(page.getByRole("button", { name: "다음" }).last()).toBeVisible();
    await page.getByRole("button", { name: "다음" }).last().click();
    await page.getByText("눌러서 확인하기").click();
    await expect(page.getByText("사진을 보고 느낀 점을 알려주세요")).toBeVisible({ timeout: 8000 });
    await page.getByPlaceholder("답변을 작성해주세요").fill("괜찮은 것 같습니다.");
    await page.getByRole("button", { name: "완료하기" }).click();

    // 완료 후 Discovery 페이지 등으로 이동하는지 확인
    await expect(page).toHaveURL(/.*\/discovery/);
  });
});
