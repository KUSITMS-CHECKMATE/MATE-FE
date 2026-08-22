export type PaymentStep = "main" | "tester-count" | "reward-amount" | "complete" | "app-market-verification-failed" | "toss-server-verification-failed";

export const TESTER_COUNT_OPTIONS = [30, 50, 100, 200, 300] as const;
export type TesterCount = (typeof TESTER_COUNT_OPTIONS)[number];

export const REWARD_AMOUNT_OPTIONS = [200, 300, 500] as const;

// 제휴 단체 전용가(콘솔 상품 "제휴 단체 전용가 - 옵션N") 전용 리워드 금액.
// 일반 REWARD_AMOUNT_OPTIONS 목록에는 노출하지 않고, 테스터 수 100명 이상일 때만
// RewardAmountStep 상단에 별도 섹션으로 보여준다.
export const AFFILIATE_REWARD_AMOUNT = 100 as const;

export type RewardAmount = (typeof REWARD_AMOUNT_OPTIONS)[number] | typeof AFFILIATE_REWARD_AMOUNT;
