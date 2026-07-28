export type PaymentStep = "main" | "tester-count" | "reward-amount";

export const TESTER_COUNT_OPTIONS = [30, 50, 100, 200, 300] as const;
export type TesterCount = (typeof TESTER_COUNT_OPTIONS)[number];

export const REWARD_AMOUNT_OPTIONS = [200, 300, 500, 700, 1000] as const;
export type RewardAmount = (typeof REWARD_AMOUNT_OPTIONS)[number];
