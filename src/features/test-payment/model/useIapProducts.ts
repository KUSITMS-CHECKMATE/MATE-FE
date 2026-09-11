import { useQuery } from "@tanstack/react-query";
import { IAP } from "@apps-in-toss/web-framework";

export function useIapProducts() {
  // enabled: IAP != null 이라 IAP 자체가 없으면 queryFn(위 로그 포함)이 아예 실행되지 않는다 —
  // "IAP 상품 목록" 로그가 안 찍히는 게 매칭 문제가 아니라 이것 때문인지 확인하는 용도.
  console.log("IAP 객체 존재 여부", IAP != null);

  return useQuery({
    queryKey: ["iapProducts"],
    queryFn: async () => {
      const res = await IAP.getProductItemList();
      // 콘솔엔 노출 ON인데 결제 화면엔 안 보이는 문제 디버깅용 — 실제로 SDK가 내려주는
      // 원본 목록을 그대로 확인해야 "매칭 실패"인지 "애초에 안 내려옴"인지 구분된다.
      console.log("IAP 상품 목록", res?.products);
      return res?.products;
    },
    enabled: IAP != null,
    staleTime: 5 * 60 * 1000,
  });
}
