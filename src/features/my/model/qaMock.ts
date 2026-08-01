import type { Notice, ParticipateRecord, PaymentHistoryEntry } from './types';

export const QA_MOCK_NOTICES: Notice[] = [
  {
    id: 90201,
    title: '[QA] 서비스 점검 안내',
    publishedAt: '2026. 07. 20',
    content: 'QA 확인용 공지 본문이에요.\n\n실제 공지사항은 아니에요.',
  },
  {
    id: 90202,
    title: '[QA] 업데이트 안내',
    publishedAt: '2026. 07. 15',
    content: 'QA 확인용 공지 본문이에요.\n\n실제 공지사항은 아니에요.',
  },
];

export const QA_MOCK_PARTICIPATE_TOTAL_POINTS = 3000;

export const QA_MOCK_PARTICIPATE_RECORDS: ParticipateRecord[] = [
  { id: 90101, title: '[QA] 참여 가능한 테스트', participatedAt: '2026. 07. 20', earnedAmount: '+500원' },
  { id: 90103, title: '[QA] 종료된 테스트', participatedAt: '2026. 07. 15', earnedAmount: '+1,000원' },
  { id: 90104, title: '[QA] 이미 참여한 테스트', participatedAt: '2026. 07. 10', earnedAmount: '+1,500원' },
];

export const QA_MOCK_PAYMENT_HISTORY: PaymentHistoryEntry[] = [
  {
    id: 'qa-pay-1',
    date: '2026. 07. 30 (목)',
    status: '결제완료',
    orderNo: 'QA-ORDER-240730-01',
    testTitle: '[QA] 종료된 테스트',
    amount: 15000,
  },
  {
    id: 'qa-pay-2',
    date: '2026. 07. 29 (수)',
    status: '결제취소',
    orderNo: 'QA-ORDER-240729-01',
    testTitle: '[QA] 등록 실패한 테스트',
    amount: 12000,
  },
  {
    id: 'qa-pay-3',
    date: '2026. 07. 28 (화)',
    status: '결제실패',
    orderNo: 'QA-ORDER-240728-01',
    testTitle: '[QA] 검토중인 테스트',
    amount: 8000,
  },
  {
    id: 'qa-pay-4',
    date: '2026. 07. 27 (월)',
    status: '환불완료',
    orderNo: 'QA-ORDER-240727-01',
    testTitle: '[QA] 반려된 테스트',
    amount: 10000,
  },
];
