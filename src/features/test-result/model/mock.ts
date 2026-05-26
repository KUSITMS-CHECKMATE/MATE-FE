import type { QuestionResult } from "./types";
import type { ParticipateQuestion } from "@/features/test-participate/model/types";

export const MOCK_RESULTS: QuestionResult[] = [
  {
    type: "OBJECTIVE",
    title: "전반적인 사용 경험에 만족하시나요?",
    options: [
      { label: "프로필", count: 32, percentage: 58, isHighlight: true },
      { label: "설정", count: 15, percentage: 27, isHighlight: false },
      { label: "홈", count: 8, percentage: 15, isHighlight: false },
    ],
  },
  {
    type: "SUBJECTIVE",
    title: "전반적인 사용 경험에 만족하시나요?",
    answers: Array(15).fill("만족해요"),
  },
  {
    type: "SCALE",
    title: "전반적인 사용 경험에 만족하시나요?",
    average: 3.5,
    scores: [
      { label: "1점", height: 20, isHighlight: false },
      { label: "2점", height: 45, isHighlight: false },
      { label: "3점", height: 115, isHighlight: true },
      { label: "4점", height: 35, isHighlight: false },
      { label: "5점", height: 15, isHighlight: false },
    ],
  },
  {
    type: "AB_TEST",
    title: "전반적인 사용 경험에 만족하시나요?",
    options: [
      { label: "A안 (27.2%)", height: 45, isHighlight: false },
      { label: "B안 (62.8%)", height: 115, isHighlight: true },
    ],
  },
  {
    type: "CARD_SORTING",
    title: "전반적인 사용 경험에 만족하시나요?",
    categories: [
      {
        name: "상의",
        items: [
          { rank: "icon-step-1-mono", label: "티셔츠", count: 32, percentage: 58, isHighlight: true },
          { rank: "icon-step-2-mono", label: "반팔티", count: 15, percentage: 27, isHighlight: false },
          { rank: "icon-step-3-mono", label: "크롭티", count: 8, percentage: 15, isHighlight: false },
        ],
      },
      {
        name: "하의",
        items: [
          { rank: "icon-step-1-mono", label: "청바지", count: 32, percentage: 58, isHighlight: true },
          { rank: "icon-step-2-mono", label: "반바지", count: 15, percentage: 27, isHighlight: false },
        ],
      },
      {
        name: "신발",
        items: [
          { rank: "icon-step-1-mono", label: "운동화", count: 32, percentage: 58, isHighlight: true },
          { rank: "icon-step-2-mono", label: "슬리퍼", count: 15, percentage: 27, isHighlight: false },
        ],
      },
    ],
  },
  {
    type: "TREE_TEST",
    title: "내 프로필을 수정하려면 어디로 가야 할까요?",
    paths: [
      { label: "프로필", count: 32, percentage: 58, isHighlight: true },
      { label: "설정", count: 15, percentage: 27, isHighlight: false },
      { label: "홈", count: 8, percentage: 15, isHighlight: false },
    ],
  },
  {
    type: "FIVE_SECOND",
    title: "5초동안 보고 기억에 남는것은?",
    imageUrl: undefined,
    answers: [
      { label: "프로필", count: 32, percentage: 58, isHighlight: true },
      { label: "설정", count: 15, percentage: 27, isHighlight: false },
      { label: "홈", count: 8, percentage: 15, isHighlight: false },
    ],
  },
];

// 질문 탭 목록 (7가지 유형 각 1개)
export const MOCK_QUESTIONS = [
  { id: 1, title: "서비스에서 불편한 점은 무엇인가요?", type: "주관식" },
  { id: 2, title: "자주 사용하는 기능은 무엇인가요?", type: "객관식" },
  { id: 3, title: "전반적인 만족도는 어떠신가요?", type: "척도" },
  { id: 4, title: "어떤 디자인이 더 마음에 드시나요?", type: "A/B 테스트" },
  { id: 5, title: "화면에서 가장 먼저 눈에 띈 것은?", type: "5초 테스트" },
  { id: 6, title: "카드를 분류해 주세요", type: "카드 소팅" },
  { id: 7, title: "고객센터를 찾아보세요", type: "트리 테스트" },
];

// 질문 미리보기용 ParticipateQuestion 데이터 (MOCK_QUESTIONS와 인덱스 동일)
export const MOCK_PREVIEW_QUESTIONS: ParticipateQuestion[] = [
  {
    id: "q1",
    type: "SUBJECTIVE",
    data: {
      title: "서비스에서 불편한 점은 무엇인가요?",
      description: "자유롭게 작성해주세요",
      imageUrl: "",
      placeholder: "답변을 입력해주세요",
      maxLength: 200,
    },
  },
  {
    id: "q2",
    type: "OBJECTIVE",
    data: {
      title: "자주 사용하는 기능은 무엇인가요?",
      description: "해당하는 항목을 선택해주세요",
      choices: [
        { id: "c1", name: "홈 화면", imageUrl: "" },
        { id: "c2", name: "검색", imageUrl: "" },
        { id: "c3", name: "마이페이지", imageUrl: "" },
        { id: "c4", name: "기타", imageUrl: "" },
      ],
      isMultiSelectEnabled: false,
      isOtherInputEnabled: false,
      minSelectCount: 1,
      maxSelectCount: 1,
    },
  },
  {
    id: "q3",
    type: "SCALE",
    data: {
      title: "전반적인 만족도는 어떠신가요?",
      description: "",
      scaleCount: 5,
      minLabel: "매우 불만족",
      maxLabel: "매우 만족",
    },
  },
  {
    id: "q4",
    type: "AB_TEST",
    data: {
      title: "어떤 디자인이 더 마음에 드시나요?",
      description: "두 디자인 중 선호하는 것을 선택해주세요",
      imageUrlA: "",
      imageUrlB: "",
      ratio: "1:1",
    },
  },
  {
    id: "q5",
    type: "FIVE_SECOND",
    data: {
      title: "화면에서 가장 먼저 눈에 띈 것은?",
      description: "5초 동안 화면을 보고 기억에 남는 것을 선택해주세요",
      imageUrl: "",
      duration: 5,
      answerExample: "",
      answerType: "multiple",
      isMultipleAnswer: false,
      isOtherInputEnabled: false,
      isMultiSelectEnabled: false,
      choices: [
        { id: "c1", name: "상단 배너", imageUrl: "" },
        { id: "c2", name: "검색창", imageUrl: "" },
        { id: "c3", name: "네비게이션 바", imageUrl: "" },
      ],
      minSelectCount: 1,
      maxSelectCount: 1,
    },
  },
  {
    id: "q6",
    type: "CARD_SORTING",
    data: {
      title: "카드를 분류해 주세요",
      description: "각 카드를 알맞은 카테고리에 배치해주세요",
      cards: [
        { id: "card1", label: "홈" },
        { id: "card2", label: "검색" },
        { id: "card3", label: "마이페이지" },
        { id: "card4", label: "알림" },
        { id: "card5", label: "설정" },
        { id: "card6", label: "고객센터" },
      ],
      categories: [
        { id: "cat1", label: "자주 씀" },
        { id: "cat2", label: "가끔 씀" },
        { id: "cat3", label: "거의 안 씀" },
      ],
      requireAllPlaced: true,
    },
  },
  {
    id: "q7",
    type: "TREE_TEST",
    data: {
      title: "고객센터를 찾아보세요",
      description: "메뉴를 탐색해서 원하는 항목을 찾아주세요",
      nodes: [
        {
          id: "n1",
          name: "홈",
          children: [
            {
              id: "n2",
              name: "지원",
              children: [
                { id: "n3", name: "고객센터", children: [] },
                { id: "n4", name: "FAQ", children: [] },
              ],
            },
            {
              id: "n5",
              name: "설정",
              children: [
                { id: "n6", name: "계정 관리", children: [] },
                { id: "n7", name: "알림 설정", children: [] },
              ],
            },
          ],
        },
      ],
    },
  },
];
