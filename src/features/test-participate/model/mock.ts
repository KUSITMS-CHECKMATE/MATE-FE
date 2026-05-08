import type { ParticipateTest } from "./types";

const MOCK_TEST_1: ParticipateTest = {
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
      type: "subjective",
      data: {
        title: "저녁 뭐 드셨나요?",
        description: "좋은 하루 보내셨길 바랍니다",
        imageUrl: "",
        placeholder: "답변 쓰는중임",
        maxLength: null,
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
      id: "q5",
      type: "scale",
      data: {
        title: "이 서비스가 2030 여성으로서 도움이 되고 편리하다고 느껴지셨나요?",
        description: "1~5점 중에서 생각한 점수를 알려주세요.",
        scaleCount: 5,
        minLabel: "전혀 그렇지 않다",
        maxLabel: "매우 그렇다",
      },
    },
    {
      id: "q6",
      type: "scale",
      data: {
        title: "전반적인 만족도를 7점 척도로 평가해주세요.",
        description: "1~7점 중에서 생각한 점수를 알려주세요.",
        scaleCount: 7,
        minLabel: "전혀 만족하지 않는다",
        maxLabel: "매우 만족한다",
      },
    },
    {
      id: "q7",
      type: "scale",
      data: {
        title: "이 디자인이 브랜드 이미지와 잘 어울린다고 생각하시나요?",
        description: "1~5점 중에서 생각한 점수를 알려주세요.",
        scaleCount: 5,
        minLabel: "전혀 그렇지 않다",
        maxLabel: "매우 그렇다",
        imageUrl: "https://static.toss.im/appsintoss/33213/ac1b1d5e-c6d7-4943-9236-fcbd2bc825c0.png",
      },
    },
    {
      id: "q8",
      type: "ab",
      data: {
        title: "누가 더 귀엽나요?",
        description: "솔직하게 답변해 주세요",
        imageUrlA: "https://static.toss.im/appsintoss/33213/ac1b1d5e-c6d7-4943-9236-fcbd2bc825c0.png",
        imageUrlB: "https://static.toss.im/appsintoss/33213/ac1b1d5e-c6d7-4943-9236-fcbd2bc825c0.png",
      },
    },
    {
      id: "cs1",
      type: "cardsort",
      data: {
        title: "카드를 적절한 카테고리로 분류해주세요",
        description: "각 카드를 하나의 카테고리에 배치해주세요",
        cards: [
          { id: "card1", label: "셔츠" },
          { id: "card2", label: "가디건" },
          { id: "card3", label: "슬랙스" },
          { id: "card4", label: "청바지" },
          { id: "card5", label: "운동화" },
          { id: "card6", label: "구두" },
        ],
        categories: [
          { id: "cat1", label: "상의" },
          { id: "cat2", label: "하의" },
          { id: "cat3", label: "신발" },
        ],
        requireAllPlaced: true,
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
        description: "1개 이상 2개 이하로 선택",
        imageUrl: "placeholder",
        duration: 5,
        answerExample: "",
        answerType: "multiple",
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
    {
      id: "q9",
      type: "fivesec",
      data: {
        title: "이 이미지를 보고 가장 먼저 떠오르는 단어를 선택해주세요",
        description: "1개만 선택",
        imageUrl: "placeholder",
        duration: 5,
        answerExample: "",
        answerType: "multiple",
        isMultipleAnswer: false,
        isMultiSelectEnabled: false,
        choices: [
          { id: "g1", name: "따뜻함", imageUrl: "" },
          { id: "g2", name: "차가움", imageUrl: "" },
          { id: "g3", name: "편안함", imageUrl: "" },
          { id: "g4", name: "활기참", imageUrl: "" },
        ],
        minSelectCount: 1,
        maxSelectCount: 1,
      },
    },
    {
      id: "q10",
      type: "fivesec",
      data: {
        title: "사진을 보고 느낀 점을 알려주세요",
        description: "아무거나 다 괜찮아요.",
        imageUrl: "placeholder",
        duration: 5,
        answerExample: "",
        answerType: "subjective",
        isMultipleAnswer: false,
        isMultiSelectEnabled: false,
        choices: [],
        minSelectCount: 0,
        maxSelectCount: 0,
        placeholder: "답변을 작성해주세요",
      },
    },
  ],
};

const MOCK_TEST_2: ParticipateTest = {
  id: 2,
  title: "척도 테스트",
  questions: [
    {
      id: "ab1",
      type: "ab",
      data: {
        title: "누가 더 귀엽나요?",
        description: "솔직하게 답변해 주세요",
        imageUrlA: "https://static.toss.im/appsintoss/33213/ac1b1d5e-c6d7-4943-9236-fcbd2bc825c0.png",
        imageUrlB: "https://static.toss.im/appsintoss/33213/ac1b1d5e-c6d7-4943-9236-fcbd2bc825c0.png",
      },
    },
    {
      id: "s1",
      type: "scale",
      data: {
        title: "이 서비스가 전반적으로 사용하기 편리했나요?",
        description: "1~5점 중에서 생각한 점수를 알려주세요.",
        scaleCount: 5,
        minLabel: "개좋다",
        maxLabel: "별로",
      },
    },
    {
      id: "s2",
      type: "scale",
      data: {
        title: "이 서비스를 다른 사람에게 추천할 의향이 있나요?",
        description: "1~7점 중에서 생각한 점수를 알려주세요.",
        scaleCount: 7,
        minLabel: "전혀 그렇지 않다",
        maxLabel: "매우 그렇다",
      },
    },
    {
      id: "s3",
      type: "scale",
      data: {
        title: "이 디자인이 브랜드 이미지와 잘 어울린다고 생각하시나요?",
        description: "1~5점 중에서 생각한 점수를 알려주세요.",
        scaleCount: 5,
        minLabel: "전혀 그렇지 않다",
        maxLabel: "매우 그렇다",
        imageUrl: "https://static.toss.im/appsintoss/33213/ac1b1d5e-c6d7-4943-9236-fcbd2bc825c0.png",
      },
    },
    {
      id: "s4",
      type: "scale",
      data: {
        title: "이 화면 구성이 목적에 맞게 명확하게 전달되나요?",
        description: "1~7점 중에서 생각한 점수를 알려주세요.",
        scaleCount: 7,
        minLabel: "전혀 명확하지 않다",
        maxLabel: "매우 명확하다",
        imageUrl: "https://static.toss.im/appsintoss/33213/ac1b1d5e-c6d7-4943-9236-fcbd2bc825c0.png",
      },
    },
  ],
};

const MOCK_TEST_3: ParticipateTest = {
  id: 3,
  title: "카드 소팅 테스트",
  questions: [
    {
      id: "cs1",
      type: "cardsort",
      data: {
        title: "카드를 적절한 카테고리로 분류해주세요",
        description: "각 카드를 하나의 카테고리에 배치해주세요",
        cards: [
          { id: "card1", label: "셔츠" },
          { id: "card2", label: "가디건" },
          { id: "card3", label: "슬랙스" },
          { id: "card4", label: "청바지" },
          { id: "card5", label: "운동화" },
          { id: "card6", label: "구두" },
          { id: "card7", label: "청바지" },
          { id: "card8", label: "운동화" },
          { id: "card9", label: "구두" },
          { id: "card10", label: "청바지" },
          { id: "card11", label: "운동화" },
          { id: "card12", label: "구두" },
        ],
        categories: [
          { id: "cat1", label: "상의" },
          { id: "cat2", label: "하의" },
          { id: "cat3", label: "신발" },
        ],
        requireAllPlaced: true,
      },
    },
    {
      id: "s1",
      type: "scale",
      data: {
        title: "분류 작업이 얼마나 직관적이었나요?",
        description: "1~5점 중에서 생각한 점수를 알려주세요.",
        scaleCount: 5,
        minLabel: "전혀 직관적이지 않다",
        maxLabel: "매우 직관적이다",
      },
    },
  ],
};

const MOCK_TEST_4: ParticipateTest = {
  id: 4,
  title: "5초 테스트 - 객관식",
  questions: [
    {
      id: "fivesec-multiple",
      type: "fivesec",
      data: {
        title: "5초 안에 떠오르는 것을 골라주세요",
        description: "1개 이상 2개 이하로 선택",
        imageUrl: "placeholder",
        duration: 5,
        answerExample: "",
        answerType: "multiple",
        isMultipleAnswer: true,
        isMultiSelectEnabled: true,
        choices: [
          { id: "f1", name: "사과", imageUrl: "" },
          { id: "f2", name: "바나나", imageUrl: "" },
          { id: "f3", name: "포도", imageUrl: "" },
          { id: "f4", name: "수박", imageUrl: "" },
        ],
        minSelectCount: 1,
        maxSelectCount: 2,
      },
    },
  ],
};

const MOCK_TEST_5: ParticipateTest = {
  id: 5,
  title: "5초 테스트 - 주관식",
  questions: [
    {
      id: "fivesec-subjective",
      type: "fivesec",
      data: {
        title: "사진을 보고 느낀 점을 알려주세요",
        description: "아무거나 다 괜찮아요.",
        imageUrl: "placeholder",
        duration: 5,
        answerExample: "",
        answerType: "subjective",
        isMultipleAnswer: false,
        isMultiSelectEnabled: false,
        choices: [],
        minSelectCount: 0,
        maxSelectCount: 0,
        placeholder: "답변을 작성해주세요",
      },
    },
  ],
};

export const MOCK_PARTICIPATE_TESTS: Record<number, ParticipateTest> = {
  1: MOCK_TEST_1,
  2: MOCK_TEST_2,
  3: MOCK_TEST_3,
  4: MOCK_TEST_4,
  5: MOCK_TEST_5,
};

export const MOCK_PARTICIPATE_TEST = MOCK_TEST_1;
