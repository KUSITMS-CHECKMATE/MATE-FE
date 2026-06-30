export type PaymentStep = "main" | "tester-count" | "reward-amount";

export const TESTER_COUNT_OPTIONS = [30, 50, 100, 200, 300] as const;
export type TesterCount = (typeof TESTER_COUNT_OPTIONS)[number];

export const REWARD_AMOUNT_OPTIONS = [200, 300, 500, 700, 1000] as const;
export type RewardAmount = (typeof REWARD_AMOUNT_OPTIONS)[number];

// 앱인토스 콘솔에 등록된 IAP 상품 SKU (테스터 수별, 리워드 200원 고정)
// 추후 리워드 금액별 상품 추가 예정
export const IAP_SKU_MAP: Record<TesterCount, string> = {
  30:  "ait.0000027116.bbb4fcbc.1baf1c35f7.9985925853",
  50:  "ait.0000027116.34ff04c1.18f5a5012b.2136162454",
  100: "ait.0000027116.6e61d447.34f8c4c29f.2391064657",
  200: "ait.0000027116.6b37ba55.c99c31a873.2391195239",
  300: "ait.0000027116.c268bcaa.3fb1a9c260.2391253802",
} as const;
