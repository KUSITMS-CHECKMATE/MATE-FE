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
  test("서버 응답의 isDuplicate 객관식은 복수 선택으로 표시되고 여러 개 선택할 수 있다", async ({ page }) => {
    // Swagger 스펙(GET /api/v1/tests/{testId}/questions)과 동일한 필드명으로 응답을 모킹한다.
    await page.route("**/api/v1/tests/*/questions", async (route) => {
      if (route.request().method() !== "GET") return route.fallback();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          code: "200",
          message: "문항을 조회했습니다.",
          data: {
            testId: 99,
            questions: [
              {
                questionId: 1,
                objectiveId: 1,
                type: "OBJECTIVE",
                sequence: 1,
                title: "복수 선택 문항입니다",
                description: "",
                isDuplicate: true,
                minSelect: 1,
                maxSelect: 2,
                isOther: false,
                options: [
                  { objectiveOptionId: 11, content: "사과", imageUrl: null, sequence: 1, isOtherOption: false },
                  { objectiveOptionId: 12, content: "배", imageUrl: null, sequence: 2, isOtherOption: false },
                  { objectiveOptionId: 13, content: "포도", imageUrl: null, sequence: 3, isOtherOption: false },
                ],
              },
            ],
          },
        }),
      });
    });

    await page.goto("/test/participate/99");

    await expect(page.getByText("복수 선택 문항입니다").first()).toBeVisible();
    await expect(page.getByText("복수 선택", { exact: true })).toBeVisible();

    const apple = page.getByRole("checkbox", { name: "사과" });
    const pear = page.getByRole("checkbox", { name: "배" });
    const grape = page.getByRole("checkbox", { name: "포도" });

    await apple.click();
    await pear.click();
    // 단일 선택으로 잘못 매핑되면 사과가 해제된다.
    await expect(apple).toHaveAttribute("aria-checked", "true");
    await expect(pear).toHaveAttribute("aria-checked", "true");

    // maxSelect=2 이므로 세 번째는 선택되지 않는다.
    await grape.click();
    await expect(grape).toHaveAttribute("aria-checked", "false");
  });

  test("객관식 기타 항목을 다시 클릭하면 선택이 해제된다 (단일/복수 선택 공통)", async ({ page }) => {
    const mockOther = (
      questionId: number,
      isDuplicate: boolean,
      maxSelect: number,
    ) => ({
      questionId,
      objectiveId: questionId,
      type: "OBJECTIVE",
      sequence: 1,
      title: isDuplicate ? "복수 선택 기타 문항입니다" : "단일 선택 기타 문항입니다",
      description: "",
      isDuplicate,
      minSelect: 1,
      maxSelect,
      isOther: true,
      options: [
        { objectiveOptionId: 21, content: "사과", imageUrl: null, sequence: 1, isOtherOption: false },
        { objectiveOptionId: 22, content: "배", imageUrl: null, sequence: 2, isOtherOption: false },
        { objectiveOptionId: 23, content: "기타 (직접 입력)", imageUrl: null, sequence: 3, isOtherOption: true },
      ],
    });

    // 1) 단일 선택
    await page.route("**/api/v1/tests/*/questions", async (route) => {
      if (route.request().method() !== "GET") return route.fallback();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          code: "200",
          message: "문항을 조회했습니다.",
          data: { testId: 98, questions: [mockOther(1, false, 1)] },
        }),
      });
    });

    await page.goto("/test/participate/98");
    await expect(page.getByText("단일 선택 기타 문항입니다").first()).toBeVisible();

    const otherRowSingle = page.getByRole("checkbox", { name: "기타" });
    await otherRowSingle.click();
    await expect(otherRowSingle).toHaveAttribute("aria-checked", "true");
    // 다시 클릭하면 해제되어야 한다 (기존 버그: 해제되지 않음)
    await otherRowSingle.click();
    await expect(otherRowSingle).toHaveAttribute("aria-checked", "false");

    // 2) 복수 선택
    await page.route("**/api/v1/tests/*/questions", async (route) => {
      if (route.request().method() !== "GET") return route.fallback();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          code: "200",
          message: "문항을 조회했습니다.",
          data: { testId: 97, questions: [mockOther(2, true, 3)] },
        }),
      });
    });

    await page.goto("/test/participate/97");
    await expect(page.getByText("복수 선택 기타 문항입니다").first()).toBeVisible();

    const apple = page.getByRole("checkbox", { name: "사과" });
    const otherRowMulti = page.getByRole("checkbox", { name: "기타" });

    await apple.click();
    await otherRowMulti.click();
    await expect(apple).toHaveAttribute("aria-checked", "true");
    await expect(otherRowMulti).toHaveAttribute("aria-checked", "true");

    // 기타만 해제되고 사과는 유지되어야 한다
    await otherRowMulti.click();
    await expect(otherRowMulti).toHaveAttribute("aria-checked", "false");
    await expect(apple).toHaveAttribute("aria-checked", "true");
  });

  test("기타 텍스트를 입력한 뒤 다른 선택지를 클릭해도 입력값이 사라지지 않는다 (단일/복수 선택 공통)", async ({ page }) => {
    const mockOther = (
      questionId: number,
      isDuplicate: boolean,
      maxSelect: number,
    ) => ({
      questionId,
      objectiveId: questionId,
      type: "OBJECTIVE",
      sequence: 1,
      title: isDuplicate ? "복수 선택 기타 텍스트 문항입니다" : "단일 선택 기타 텍스트 문항입니다",
      description: "",
      isDuplicate,
      minSelect: 1,
      maxSelect,
      isOther: true,
      options: [
        { objectiveOptionId: 31, content: "사과", imageUrl: null, sequence: 1, isOtherOption: false },
        { objectiveOptionId: 32, content: "배", imageUrl: null, sequence: 2, isOtherOption: false },
        { objectiveOptionId: 33, content: "기타 (직접 입력)", imageUrl: null, sequence: 3, isOtherOption: true },
      ],
    });

    // 1) 단일 선택: 기타에 텍스트 입력 후 다른 선택지 클릭 → 텍스트는 필드에 남아있어야 한다
    await page.route("**/api/v1/tests/*/questions", async (route) => {
      if (route.request().method() !== "GET") return route.fallback();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          code: "200",
          message: "문항을 조회했습니다.",
          data: { testId: 96, questions: [mockOther(1, false, 1)] },
        }),
      });
    });

    await page.goto("/test/participate/96");
    await expect(page.getByText("단일 선택 기타 텍스트 문항입니다").first()).toBeVisible();

    await page.getByPlaceholder("").fill("나만의 답변");
    await page.getByText("사과", { exact: true }).click();
    await expect(page.getByPlaceholder("")).toHaveValue("나만의 답변");

    // 2) 복수 선택: 기타에 텍스트 입력 후 다른 선택지 추가 선택 → 기타는 선택 유지 + 텍스트도 유지
    await page.route("**/api/v1/tests/*/questions", async (route) => {
      if (route.request().method() !== "GET") return route.fallback();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          code: "200",
          message: "문항을 조회했습니다.",
          data: { testId: 95, questions: [mockOther(2, true, 3)] },
        }),
      });
    });

    await page.goto("/test/participate/95");
    await expect(page.getByText("복수 선택 기타 텍스트 문항입니다").first()).toBeVisible();

    await page.getByPlaceholder("").fill("복수 응답 텍스트");
    await page.getByText("배", { exact: true }).click();
    await expect(page.getByPlaceholder("")).toHaveValue("복수 응답 텍스트");
    await expect(page.getByRole("checkbox", { name: "기타" })).toHaveAttribute("aria-checked", "true");
    await expect(page.getByRole("checkbox", { name: "배" })).toHaveAttribute("aria-checked", "true");
  });

  test("5초 테스트 객관식도 기타 재클릭 해제 및 텍스트 유지가 동일하게 동작한다 (단일/복수 선택 공통)", async ({ page }) => {
    test.setTimeout(60000);

    const mockFiveSecOther = (
      questionId: number,
      isDuplicate: boolean,
      maxSelect: number,
    ) => ({
      questionId,
      sequence: 1,
      type: "FIVE_SECOND",
      title: isDuplicate ? "5초 복수 선택 기타 문항입니다" : "5초 단일 선택 기타 문항입니다",
      description: "",
      answerType: "multiple",
      isDuplicate,
      isMultiSelectEnabled: isDuplicate,
      isOther: true,
      minSelect: 1,
      maxSelect,
      options: [
        { fiveSecondOptionId: 41, content: "사과", sequence: 1, isOtherOption: false },
        { fiveSecondOptionId: 42, content: "배", sequence: 2, isOtherOption: false },
        { fiveSecondOptionId: 43, content: "기타 (직접 입력)", sequence: 3, isOtherOption: true },
      ],
    });

    const goToAnswerPhase = async (testId: number) => {
      await page.goto(`/test/participate/${testId}`);
      await page.getByRole("button", { name: "다음으로" }).click();
      await page.getByText("눌러서 확인하기").click();
    };

    // 1) 단일 선택
    await page.route("**/api/v1/tests/*/questions", async (route) => {
      if (route.request().method() !== "GET") return route.fallback();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          code: "200",
          message: "문항을 조회했습니다.",
          data: { testId: 94, questions: [mockFiveSecOther(1, false, 1)] },
        }),
      });
    });

    await goToAnswerPhase(94);
    await expect(page.getByText("5초 단일 선택 기타 문항입니다")).toBeVisible({ timeout: 8000 });

    const otherSingle = page.getByRole("checkbox", { name: "기타" });
    // 재클릭하면 해제되어야 한다
    await otherSingle.click();
    await expect(otherSingle).toHaveAttribute("aria-checked", "true");
    await otherSingle.click();
    await expect(otherSingle).toHaveAttribute("aria-checked", "false");

    // 텍스트 입력 후 다른 선택지 클릭해도 텍스트가 유지되어야 한다
    await page.getByPlaceholder("").fill("5초 단일 답변");
    await page.getByText("사과", { exact: true }).click();
    await expect(page.getByPlaceholder("")).toHaveValue("5초 단일 답변");

    // 2) 복수 선택
    await page.route("**/api/v1/tests/*/questions", async (route) => {
      if (route.request().method() !== "GET") return route.fallback();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          code: "200",
          message: "문항을 조회했습니다.",
          data: { testId: 93, questions: [mockFiveSecOther(2, true, 3)] },
        }),
      });
    });

    await goToAnswerPhase(93);
    await expect(page.getByText("5초 복수 선택 기타 문항입니다")).toBeVisible({ timeout: 8000 });

    const otherMulti = page.getByRole("checkbox", { name: "기타" });
    const pear = page.getByRole("checkbox", { name: "배" });

    await otherMulti.click();
    await expect(otherMulti).toHaveAttribute("aria-checked", "true");
    await otherMulti.click();
    await expect(otherMulti).toHaveAttribute("aria-checked", "false");

    await otherMulti.click();
    await page.getByPlaceholder("").fill("5초 복수 답변");
    await pear.click();
    await expect(page.getByPlaceholder("")).toHaveValue("5초 복수 답변");
    await expect(otherMulti).toHaveAttribute("aria-checked", "true");
    await expect(pear).toHaveAttribute("aria-checked", "true");
  });
});
