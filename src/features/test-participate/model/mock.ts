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
        title: "관심 분야를 선택해주세요",
        description: "트리에서 한 노드 선택",
        nodes: [
          {
            id: "n1",
            name: "디자인",
            children: [
              { id: "n1-1", name: "UI", children: [] },
              { id: "n1-2", name: "UX", children: [] },
            ],
          },
          {
            id: "n2",
            name: "개발",
            children: [
              { id: "n2-1", name: "프론트", children: [] },
              { id: "n2-2", name: "백엔드", children: [] },
            ],
          },
        ],
      },
    },
    {
      id: "q4",
      type: "multiple",
      data: {
        title: "오늘의 기분이 어떤지 체크해주세요",
        description: "솔직하게 답변해 주세요",
        choices: [
          { id: "c1", name: "행복함", imageUrl: "placeholder" },
          { id: "c2", name: "슬픔", imageUrl: "" },
          { id: "c3", name: "피곤함", imageUrl: "placeholder" },
        ],
        isMultiSelectEnabled: false,
        isOtherInputEnabled: false,
        minSelectCount: 1,
        maxSelectCount: 1,
      },
    },
    {
      id: "q5",
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
      id: "q7",
      type: "subjective",
      data: {
        title: "오늘의 기분이 어떤지 작성해주세요",
        description: "좋은 하루 보내셨길 바랍니다",
        imageUrl: "",
        placeholder: "답변을 작성해주세요",
        maxLength: null,
      },
    },
    {
      id: "q8",
      type: "subjective",
      data: {
        title: "이 이미지를 보고 느낀 점을 작성해주세요",
        description: "자유롭게 작성해주세요",
        imageUrl: "placeholder",
        placeholder: "답변을 작성해주세요",
        maxLength: null,
      },
    },
    {
      id: "q6",
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
