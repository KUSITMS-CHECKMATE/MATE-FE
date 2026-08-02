export interface MyUser {
  name: string;
  points: number;
}

export interface ParticipateRecord {
  id: number;
  title: string;
  participatedAt: string;
  earnedAmount: string;
}

export interface Notice {
  id: number;
  title: string;
  publishedAt: string;
  content: string;
}

export type PaymentHistoryStatus = '결제완료' | '결제취소' | '결제실패' | '환불대기중' | '환불거절' | '환불완료';
export type PaymentHistoryTestStatus = 'active' | 'ended' | 'waiting' | 'rejected';

export interface PaymentHistoryEntry {
  id: string;
  date: string;
  status: PaymentHistoryStatus;
  orderNo: string;
  testTitle: string;
  amount: number;
  testId?: number;
  testStatus?: PaymentHistoryTestStatus;
}

export interface TestDetail {
  id: number;
  name: string;
  categories: string[];
  images: string[];
  reward: string;
  summary: string;
  serviceName: string;
  serviceDescription: string;
  isEnded: boolean;
}
