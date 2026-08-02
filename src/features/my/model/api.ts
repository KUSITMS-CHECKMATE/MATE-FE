import { useQuery } from '@tanstack/react-query';
import { client } from '@/shared/api/client';
import { getHistory, getGetHistoryUrl } from '@/shared/api/generated/payment';
import type { ParticipateRecord, PaymentHistoryEntry } from './types';

const PAY_STATUS_LABEL: Record<string, PaymentHistoryEntry['status']> = {
  PAY_SUCCEEDED: '결제완료',
  PAY_CANCELLED: '결제취소',
  PAY_FAILED: '결제실패',
  REFUND_PENDING: '환불대기중',
  REFUND_REJECTED: '환불거절',
  REFUNDED: '환불완료',
};

const TEST_STATUS_LABEL: Record<string, NonNullable<PaymentHistoryEntry['testStatus']>> = {
  IN_PROGRESS: 'active',
  COMPLETED: 'ended',
  WAITING: 'waiting',
  REJECTED: 'rejected',
};

const WEEKDAY_KR = ['일', '월', '화', '수', '목', '금', '토'];

function formatPaymentDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}. ${m}. ${day} (${WEEKDAY_KR[d.getDay()]})`;
}

interface AnswerItem {
  testId: number;
  testName: string;
  createdAt: string;
  reward: number;
}

interface AnswersMeResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    totalPromotionReward: number;
    answers: AnswerItem[];
  };
}

export const useMyParticipateHistory = () =>
  useQuery({
    queryKey: ['answers', 'me'],
    queryFn: () => client('api/v1/answers/me').json<AnswersMeResponse>(),
    select: (res) => ({
      totalPoints: res.data.totalPromotionReward,
      records: res.data.answers.map((item): ParticipateRecord => ({
        id: item.testId,
        title: item.testName,
        participatedAt: item.createdAt,
        earnedAmount: `+${item.reward.toLocaleString()}원`,
      })),
    }),
  });

export const usePaymentHistory = () =>
  useQuery({
    queryKey: [getGetHistoryUrl()],
    queryFn: () => getHistory(),
    select: (res) =>
      (res.data.data ?? []).map((item, index): PaymentHistoryEntry => ({
        id: item.orderNo ?? String(index),
        date: item.approvedAt ? formatPaymentDate(item.approvedAt) : '',
        status: PAY_STATUS_LABEL[item.payStatus ?? ''] ?? '결제완료',
        orderNo: item.orderNo ?? '',
        testTitle: item.testTitle ?? '',
        thumbnailUrl: item.thumbnailUrl ?? undefined,
        amount: item.amount ?? 0,
        testId: item.testId,
        testStatus: item.testStatus ? TEST_STATUS_LABEL[item.testStatus] : undefined,
      })),
  });
