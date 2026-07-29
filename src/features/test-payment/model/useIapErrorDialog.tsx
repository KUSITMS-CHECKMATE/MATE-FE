import { useDialog, useToast } from "@toss/tds-mobile";

// IAP onError의 error.code별 안내 다이얼로그. 처리한 코드면 true, 아직 대응 안 한 코드면 false —
// 호출부는 false일 때 기존 토스트로 폴백한다. 코드 하나씩 추가해 나간다.
export function useIapErrorDialog() {
  const { openAlert } = useDialog();
  const { openToast } = useToast();

  const showIapErrorDialog = async (code: string | undefined): Promise<boolean> => {
    // 코드 표기가 SCREAMING_SNAKE_CASE로 통일돼 있지 않은 경우가 있어 대문자로 정규화해서 매칭한다.
    switch (code?.toUpperCase()) {
      case "NETWORK_ERROR":
        openToast("결제하지 못했어요.\n잠시 후 다시 시도해주세요.", {
          type: "top",
          lottie: "https://static.toss.im/lotties-common/error-yellow-spot.json",
        });
        return true;
      case "KOREAN_ACCOUNT_ONLY":
        await openAlert({
          title: "한국 App Store 계정이 필요해요",
          description: "지금 로그인한 계정으로는 결제할 수 없어요. 설정에서 한국 계정으로 전환하고 다시 시도해주세요.",
          alertButton: "확인",
        });
        return true;
      case "INVALID_PRODUCT_ID":
        await openAlert({
          title: "지금은 결제가 어려워요",
          description: "상품 정보를 불러오지 못했어요. 잠시 후 다시 확인해주세요.",
          alertButton: "확인",
        });
        return true;
      case "PAYMENT_PENDING":
        await openAlert({
          title: "결제가 대기 중이에요",
          description: "승인이 끝나면 테스트가 자동으로 등록돼요. 자동으로 저장돼서 앱을 닫아도 괜찮아요.",
          alertButton: "확인",
        });
        return true;
      case "INVALID_USER_ENVIRONMENT":
        await openAlert({
          title: "이 기기에서는 결제할 수 없어요",
          description: "지금 기기나 계정 환경에서는 지원되지 않는 상품이에요. 다른 기기에서 시도하거나 고객센터로 문의해주세요.",
          alertButton: "확인",
        });
        return true;
      default:
        if (code) console.warn("대응 안 한 IAP 에러 코드", code);
        return false;
    }
  };

  return { showIapErrorDialog };
}
