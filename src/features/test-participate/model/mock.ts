import type { ParticipateTest } from "./types";

export const MOCK_PARTICIPATE_TEST: ParticipateTest = {
  id: 1,
  title: "메이트 샘플 테스트",
  questions: [
    {
      id: "q1",
      type: "subjective",
      data: {
        title: "오늘의 기분이 어떤지 작성해주세요",
        description: "좋은 하루 보내셨길 바랍니다",
        imageUrl: "",
        placeholder: "답변 쓰는중임",
        maxLength: null,
      },
    },
    {
      id: "q2",
      type: "multiple",
      data: {
        title: "선호하는 색상을 모두 골라주세요",
        description: "1개 이상 3개 이하로 선택",
        choices: [
          { id: "c1", name: "빨강", imageUrl: "" },
          { id: "c2", name: "파랑", imageUrl: "" },
          { id: "c3", name: "초록", imageUrl: "" },
          { id: "c4", name: "노랑", imageUrl: "" },
        ],
        isMultiSelectEnabled: true,
        isOtherInputEnabled: false,
        minSelectCount: 1,
        maxSelectCount: 3,
      },
    },
    {
      id: "q3",
      type: "tree",
      data: {
        title: "내 프로필 사진을 수정하려면 어디로 가야할까요?",
        description: "",
        nodes: [
          { id: "n1", name: "홈", children: [] },
          {
            id: "n2",
            name: "송금",
            children: [
              { id: "n2-1", name: "은행 송금", children: [] },
              {
                id: "n2-2",
                name: "연락처 송금",
                children: [
                  {
                    id: "n2-2-1",
                    name: "자동 이체 설정",
                    children: [
                      { id: "n2-2-1-1", name: "마지막 뎁스", children: [] },
                      { id: "n2-2-1-2", name: "마지막 뎁스", children: [] },
                    ],
                  },
                ],
              },
            ],
          },
          { id: "n3", name: "투자", children: [] },
          { id: "n4", name: "설정", children: [] },
        ],
      },
    },
    {
      id: "q4",
      type: "fivesec",
      data: {
        title: "5초 안에 떠오르는 것을 골라주세요",
        description: "1개 이상 2개 이하",
        imageUrl: "",
        duration: 5,
        answerExample: "",
        isMultipleAnswer: true,
        isMultiSelectEnabled: true,
        choices: [
          { id: "f1", name: "사과", imageUrl: "" },
          { id: "f2", name: "바나나", imageUrl: "" },
          { id: "f3", name: "포도", imageUrl: "" },
        ],
        minSelectCount: 1,
        maxSelectCount: 2,
      },
    },
  ],
};
