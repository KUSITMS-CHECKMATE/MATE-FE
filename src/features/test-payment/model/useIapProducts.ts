import { useQuery } from "@tanstack/react-query";
import { IAP } from "@apps-in-toss/web-framework";

export function useIapProducts() {
  return useQuery({
    queryKey: ["iapProducts"],
    queryFn: async () => {
      const res = await IAP.getProductItemList();
      return res.products;
    },
    enabled: IAP != null,
    staleTime: 5 * 60 * 1000,
  });
}
