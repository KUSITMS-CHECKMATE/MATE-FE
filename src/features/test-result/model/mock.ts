import type { QuestionResult } from "./types";

export const MOCK_RESULTS: QuestionResult[] = [
  {
    type: "multiple",
    title: "전반적인 사용 경험에 만족하시나요?",
    options: [
      { label: "프로필", count: 32, percentage: 58, isHighlight: true },
      { label: "설정", count: 15, percentage: 27, isHighlight: false },
      { label: "홈", count: 8, percentage: 15, isHighlight: false },
    ],
  },
  {
    type: "subjective",
    title: "전반적인 사용 경험에 만족하시나요?",
    answers: Array(15).fill("만족해요"),
  },
  {
    type: "scale",
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
    type: "ab",
    title: "전반적인 사용 경험에 만족하시나요?",
    options: [
      { label: "A안 (27.2%)", height: 45, isHighlight: false },
      { label: "B안 (62.8%)", height: 115, isHighlight: true },
    ],
  },
  {
    type: "cardSort",
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
    type: "tree",
    title: "내 프로필을 수정하려면 어디로 가야 할까요?",
    paths: [
      { label: "프로필", count: 32, percentage: 58, isHighlight: true },
      { label: "설정", count: 15, percentage: 27, isHighlight: false },
      { label: "홈", count: 8, percentage: 15, isHighlight: false },
    ],
  },
  {
    type: "fiveSec",
    title: "5초동안 보고 기억에 남는것은?",
    imageUrl: undefined,
    answers: [
      { label: "프로필", count: 32, percentage: 58, isHighlight: true },
      { label: "설정", count: 15, percentage: 27, isHighlight: false },
      { label: "홈", count: 8, percentage: 15, isHighlight: false },
    ],
  },
];

export const MOCK_QUESTIONS = [
  { id: 1, title: "입력한 제목이 이렇게 떠요", type: "객관식" },
  { id: 2, title: "입력한 제목이 이렇게 떠요", type: "주관식" },
];
