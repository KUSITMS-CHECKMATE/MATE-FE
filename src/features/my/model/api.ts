import { useQuery } from '@tanstack/react-query';
import { client } from '@/shared/api/client';
import type { ParticipateRecord } from './types';

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
