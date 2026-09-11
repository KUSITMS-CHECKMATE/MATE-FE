import { useQuery } from "@tanstack/react-query";
import { IAP } from "@apps-in-toss/web-framework";

export function useIapProducts() {
  return useQuery({
    queryKey: ["iapProducts"],
    queryFn: async () => {
      // getProductItemList() 호출이 콜백 없이 응답을 안 주는 건지, 에러가 조용히 묻히는 건지
      // 구분하기 위한 디버깅용 로그. 정상화되면 지워도 된다.
      console.log("[디버그] IAP.getProductItemList() 호출 시작");
      try {
        const res = await IAP.getProductItemList();
        console.log("[디버그] IAP 상품 목록 응답", res?.products);
        return res?.products;
      } catch (e) {
        console.error("[디버그] IAP.getProductItemList() 에러", e);
        throw e;
      }
    },
    enabled: IAP != null,
    staleTime: 5 * 60 * 1000,
  });
}
