import type { ReportData, ReportItem, TestStatus } from '@/shared/api/report';
import type { QuestionSummaryListItem } from '@/shared/api/question';
import type { ParticipateQuestion } from '@/features/test-participate/model/types';

const QA_REPORT_ITEMS: ReportItem[] = [
  {
    questionId: 1,
    sequence: 1,
    title: '서비스에서 불편한 점은 무엇인가요?',
    type: 'SUBJECTIVE',
    result: {
      aiSummary: 'QA용 mock 요약이에요.',
      clusters: [{ representative: '로딩이 느려요', count: 5, responses: ['로딩이 느려요', '가끔 멈춰요'] }],
      texts: ['로딩이 느려요', '메뉴가 헷갈려요', '전반적으로 만족해요'],
    },
  },
  {
    questionId: 2,
    sequence: 2,
    title: '자주 사용하는 기능은 무엇인가요?',
    type: 'OBJECTIVE',
    result: {
      options: [
        { optionId: 1, content: '홈 화면', count: 21, ratio: 0.42 },
        { optionId: 2, content: '검색', count: 21, ratio: 0.42 },
        { optionId: 3, content: '마이페이지', count: 8, ratio: 0.16 },
      ],
      aiSummary: 'QA용 mock 요약이에요.',
      clusters: [],
    },
  },
  {
    questionId: 3,
    sequence: 3,
    title: '전반적인 만족도는 어떠신가요?',
    type: 'SCALE',
    result: {
      average: 3.8,
      mostVoted: 4,
      endValue: { minLabel: '매우 불만족', maxLabel: '매우 만족' },
      distribution: [
        { score: 1, count: 2 },
        { score: 2, count: 5 },
        { score: 3, count: 12 },
        { score: 4, count: 20 },
        { score: 5, count: 9 },
      ],
    },
  },
  {
    questionId: 4,
    sequence: 4,
    title: '어떤 디자인이 더 마음에 드시나요?',
    type: 'AB_TEST',
    result: {
      A: { count: 27, ratio: 0.45 },
      B: { count: 33, ratio: 0.55 },
    },
  },
  {
    questionId: 5,
    sequence: 5,
    title: '화면에서 가장 먼저 눈에 띈 것은?',
    type: 'FIVE_SECOND',
    result: {
      options: [
        { optionId: 1, content: '상단 배너', count: 20, ratio: 0.5 },
        { optionId: 2, content: '검색창', count: 12, ratio: 0.3 },
        { optionId: 3, content: '네비게이션 바', count: 8, ratio: 0.2 },
      ],
      aiSummary: 'QA용 mock 요약이에요.',
      clusters: [],
    },
  },
  {
    questionId: 6,
    sequence: 6,
    title: '카드를 분류해 주세요',
    type: 'CARD_SORTING',
    result: {
      byCard: [],
      byCategory: [
        {
          category: '자주 씀',
          cards: [
            { rank: 1, cardName: '홈', count: 18, ratio: 0.36 },
            { rank: 1, cardName: '검색', count: 18, ratio: 0.36 },
            { rank: 3, cardName: '마이페이지', count: 8, ratio: 0.16 },
          ],
        },
        {
          category: '가끔 씀',
          cards: [
            { rank: 1, cardName: '알림', count: 12, ratio: 0.24 },
            { rank: 1, cardName: '설정', count: 12, ratio: 0.24 },
          ],
        },
      ],
    },
  },
  {
    questionId: 7,
    sequence: 7,
    title: '고객센터를 찾아보세요',
    type: 'TREE_TEST',
    result: {
      nodeFrequency: [
        { nodeId: 3, label: '고객센터', count: 28, ratio: 0.7 },
        { nodeId: 4, label: 'FAQ', count: 12, ratio: 0.3 },
      ],
      pathFrequency: [{ path: [1, 2, 3], pathLabels: ['홈', '지원', '고객센터'], count: 28 }],
    },
  },
];

export const QA_MOCK_QUESTION_SUMMARY: QuestionSummaryListItem[] = QA_REPORT_ITEMS.map((item) => ({
  questionId: item.questionId,
  sequence: item.sequence,
  title: item.title,
  type: item.type,
}));

export const QA_MOCK_PREVIEW_QUESTIONS: Record<number, ParticipateQuestion> = {
  1: {
    id: '1',
    type: 'SUBJECTIVE',
    data: { title: '서비스에서 불편한 점은 무엇인가요?', description: '자유롭게 작성해주세요', imageUrl: '', placeholder: '답변을 입력해주세요', maxLength: 200 },
  },
  2: {
    id: '2',
    type: 'OBJECTIVE',
    data: {
      title: '자주 사용하는 기능은 무엇인가요?',
      description: '해당하는 항목을 선택해주세요',
      choices: [
        { id: 'c1', name: '홈 화면', imageUrl: '' },
        { id: 'c2', name: '검색', imageUrl: '' },
        { id: 'c3', name: '마이페이지', imageUrl: '' },
      ],
      isMultiSelectEnabled: false,
      isOtherInputEnabled: false,
      minSelectCount: 1,
      maxSelectCount: 1,
    },
  },
  3: {
    id: '3',
    type: 'SCALE',
    data: { title: '전반적인 만족도는 어떠신가요?', description: '', scaleCount: 5, minLabel: '매우 불만족', maxLabel: '매우 만족' },
  },
  4: {
    id: '4',
    type: 'AB_TEST',
    data: {
      title: '어떤 디자인이 더 마음에 드시나요?',
      description: '두 디자인 중 선호하는 것을 선택해주세요',
      imageUrlA: 'https://static.toss.im/appsintoss/33213/ac1b1d5e-c6d7-4943-9236-fcbd2bc825c0.png',
      imageUrlB: 'https://static.toss.im/appsintoss/33213/ac1b1d5e-c6d7-4943-9236-fcbd2bc825c0.png',
    },
  },
  5: {
    id: '5',
    type: 'FIVE_SECOND',
    data: {
      title: '화면에서 가장 먼저 눈에 띈 것은?',
      description: '5초 동안 화면을 보고 기억에 남는 것을 선택해주세요',
      imageUrl: 'https://static.toss.im/appsintoss/33213/ac1b1d5e-c6d7-4943-9236-fcbd2bc825c0.png',
      answerExample: '',
      answerType: 'multiple',
      isMultipleAnswer: false,
      isOtherInputEnabled: false,
      isMultiSelectEnabled: false,
      choices: [
        { id: 'c1', name: '상단 배너', imageUrl: '' },
        { id: 'c2', name: '검색창', imageUrl: '' },
        { id: 'c3', name: '네비게이션 바', imageUrl: '' },
      ],
      minSelectCount: 1,
      maxSelectCount: 1,
    },
  },
  6: {
    id: '6',
    type: 'CARD_SORTING',
    data: {
      title: '카드를 분류해 주세요',
      description: '각 카드를 알맞은 카테고리에 배치해주세요',
      cards: [
        { id: 'card1', label: '홈' },
        { id: 'card2', label: '검색' },
        { id: 'card3', label: '마이페이지' },
        { id: 'card4', label: '알림' },
        { id: 'card5', label: '설정' },
        { id: 'card6', label: '고객센터' },
      ],
      categories: [
        { id: 'cat1', label: '자주 씀' },
        { id: 'cat2', label: '가끔 씀' },
        { id: 'cat3', label: '거의 안 씀' },
      ],
      requireAllPlaced: true,
    },
  },
  7: {
    id: '7',
    type: 'TREE_TEST',
    data: {
      title: '고객센터를 찾아보세요',
      description: '메뉴를 탐색해서 원하는 항목을 찾아주세요',
      nodes: [
        {
          id: 'n1',
          name: '홈',
          children: [
            {
              id: 'n2',
              name: '지원',
              children: [
                { id: 'n3', name: '고객센터', children: [] },
                { id: 'n4', name: 'FAQ', children: [] },
              ],
            },
            {
              id: 'n5',
              name: '설정',
              children: [
                { id: 'n6', name: '계정 관리', children: [] },
                { id: 'n7', name: '알림 설정', children: [] },
              ],
            },
          ],
        },
      ],
    },
  },
};

function buildReport(testStatus: TestStatus, participantCount: number, includeReports: boolean): ReportData {
  return {
    testStatus,
    reportStatus: testStatus === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS',
    questionCount: QA_REPORT_ITEMS.length,
    participantCount,
    reports: includeReports ? QA_REPORT_ITEMS : [],
  };
}

// QA_MOCK_MY_TESTS(features/test/model/qaMock.ts)와 동일한 id로 매핑
export const QA_MOCK_TEST_RESULTS: Record<number, ReportData> = {
  90001: buildReport('IN_PROGRESS', 12, false),
  90002: buildReport('COMPLETED', 30, true),
  90003: buildReport('WAITING', 0, false),
  90004: buildReport('REJECTED', 0, false),
};

export const QA_MOCK_TEST_TITLES: Record<number, string> = {
  90001: '[QA] 진행중인 테스트',
  90002: '[QA] 종료된 테스트',
  90003: '[QA] 검토중인 테스트',
  90004: '[QA] 반려된 테스트',
};
