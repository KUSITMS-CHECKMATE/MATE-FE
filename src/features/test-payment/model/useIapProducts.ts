import { useQuery } from "@tanstack/react-query";
import { IAP } from "@apps-in-toss/web-framework";

export function useIapProducts() {
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
