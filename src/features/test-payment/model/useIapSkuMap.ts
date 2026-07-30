import { useMemo } from "react";
import { useIapProducts } from "./useIapProducts";
import { TESTER_COUNT_OPTIONS, REWARD_AMOUNT_OPTIONS, type TesterCount, type RewardAmount } from "./types";

export type IapSkuMap = Partial<Record<RewardAmount, Partial<Record<TesterCount, string>>>>;

// 콘솔 상품명 규칙: "{테스터 수}명-리워드 {금액}" (예: "100명-리워드 300").
// SKU를 코드에 하드코딩해두면 콘솔에서 상품이 재등록/수정될 때 그대로 어긋나 결제가 막힌다
// (실제로 PAYMENT_006 "허용되지 않은 SKU"로 재현됨). 결제 시점에 콘솔이 내려주는 실제 상품
// 목록에서 매번 새로 매핑해서 쓴다.
const NAME_PATTERN = /^(\d+)명-리워드\s*(\d+)$/;

function buildIapSkuMap(products: { sku: string; displayName: string }[]): IapSkuMap {
  const map: IapSkuMap = {};
  for (const product of products) {
    const match = product.displayName.match(NAME_PATTERN);
    if (!match) continue;

    const testerCount = Number(match[1]) as TesterCount;
    const rewardAmount = Number(match[2]) as RewardAmount;
    if (!TESTER_COUNT_OPTIONS.includes(testerCount) || !REWARD_AMOUNT_OPTIONS.includes(rewardAmount)) continue;

    (map[rewardAmount] ??= {})[testerCount] = product.sku;
  }
  return map;
}

export function useIapSkuMap() {
  const { data: products } = useIapProducts();
  return useMemo(() => (products ? buildIapSkuMap(products) : {}), [products]);
}
