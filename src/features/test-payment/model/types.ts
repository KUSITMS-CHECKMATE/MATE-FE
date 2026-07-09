export type PaymentStep = "main" | "tester-count" | "reward-amount";

export const TESTER_COUNT_OPTIONS = [30, 50, 100, 200, 300] as const;
export type TesterCount = (typeof TESTER_COUNT_OPTIONS)[number];

export const REWARD_AMOUNT_OPTIONS = [200, 300, 500] as const;
export type RewardAmount = (typeof REWARD_AMOUNT_OPTIONS)[number];

// 앱인토스 콘솔에 등록된 IAP 상품 SKU (리워드 금액 → 테스터 수)
export const IAP_SKU_MAP: Record<RewardAmount, Record<TesterCount, string>> = {
  200: {
    30:  "ait.0000027116.bbb4fcbc.1baf1c35f7.9985925853",
    50:  "ait.0000027116.34ff04c1.18f5a5012b.2136162454",
    100: "ait.0000027116.6e61d447.34f8c4c29f.2391064657",
    200: "ait.0000027116.6b37ba55.c99c31a873.2391195239",
    300: "ait.0000027116.c268bcaa.3fb1a9c260.2391253802",
  },
  300: {
    30:  "ait.0000027116.19561da3.a239aed405.2957102080",
    50:  "ait.0000027116.ad0103dd.8bc99b5b24.2957147665",
    100: "ait.0000027116.81bbd29d.236c493d95.2957569045",
    200: "ait.0000027116.b65037e9.0739657b5a.2957645768",
    300: "ait.0000027116.9ead32a9.e9dd4c6db5.2957929226",
  },
  500: {
    30:  "ait.0000027116.472803cf.74937485fc.2959424878",
    50:  "ait.0000027116.53657ba3.75ca0daf7b.2959490616",
    100: "ait.0000027116.726b70fa.89138803f6.2960661787",
    200: "ait.0000027116.c21ca6be.f47ecbf79d.2961120003",
    300: "ait.0000027116.98321dcc.5d64f194fa.2961167282",
  },
};
