import { useMemo } from "react";
import { useIapProducts } from "./useIapProducts";
import {
  TESTER_COUNT_OPTIONS,
  REWARD_AMOUNT_OPTIONS,
  AFFILIATE_REWARD_AMOUNT,
  type TesterCount,
  type RewardAmount,
} from "./types";

export type IapSkuMap = Partial<Record<RewardAmount, Partial<Record<TesterCount, string>>>>;

// 콘솔 상품명 규칙: "{테스터 수}명-리워드 {금액}" (예: "100명-리워드 300").
// SKU를 코드에 하드코딩해두면 콘솔에서 상품이 재등록/수정될 때 그대로 어긋나 결제가 막힌다
// (실제로 PAYMENT_006 "허용되지 않은 SKU"로 재현됨). 결제 시점에 콘솔이 내려주는 실제 상품
// 목록에서 매번 새로 매핑해서 쓴다.
const NAME_PATTERN = /^(\d+)명-리워드\s*(\d+)$/;

// 이름을 패턴에 맞게 바꿀 수 없는 예외 상품. QA용 "테스트"(440원) 상품처럼 콘솔 상품명이
// "{n}명-리워드 {m}" 규칙을 따르지 않는 경우에만 여기 추가한다.
const NAME_OVERRIDES: Record<string, { testerCount: TesterCount; rewardAmount: RewardAmount }> = {
  "테스트": { testerCount: 2, rewardAmount: 10 },
};

// 제휴 단체 전용가 상품명 규칙: "제휴 단체 전용가 - 옵션N", 설명 "제휴 단체 전용가 - {테스터 수}인 기준".
// 테스터 수는 상품명이 아니라 설명(description)에서 파싱한다.
const AFFILIATE_NAME_PATTERN = /^제휴\s*단체\s*전용가/;
const AFFILIATE_DESCRIPTION_PATTERN = /(\d+)인\s*기준/;

function buildIapSkuMap(products: { sku: string; displayName: string; description?: string }[]): IapSkuMap {
  const map: IapSkuMap = {};
  for (const product of products) {
    const override = NAME_OVERRIDES[product.displayName.trim()];
    if (override) {
      (map[override.rewardAmount] ??= {})[override.testerCount] = product.sku;
      continue;
    }

    const match = product.displayName.match(NAME_PATTERN);
    if (match) {
      const testerCount = Number(match[1]) as TesterCount;
      const rewardAmount = Number(match[2]) as (typeof REWARD_AMOUNT_OPTIONS)[number];
      if (TESTER_COUNT_OPTIONS.includes(testerCount) && REWARD_AMOUNT_OPTIONS.includes(rewardAmount)) {
        (map[rewardAmount] ??= {})[testerCount] = product.sku;
      }
      continue;
    }

    if (AFFILIATE_NAME_PATTERN.test(product.displayName)) {
      const descMatch = product.description?.match(AFFILIATE_DESCRIPTION_PATTERN);
      if (!descMatch) continue;

      const testerCount = Number(descMatch[1]) as TesterCount;
      if (!TESTER_COUNT_OPTIONS.includes(testerCount)) continue;

      (map[AFFILIATE_REWARD_AMOUNT] ??= {})[testerCount] = product.sku;
    }
  }
  return map;
}

export function useIapSkuMap() {
  const { data: products } = useIapProducts();
  return useMemo(() => (products ? buildIapSkuMap(products) : {}), [products]);
}
