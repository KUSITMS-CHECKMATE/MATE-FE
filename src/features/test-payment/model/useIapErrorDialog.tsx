import { useState } from "react";
import { useDialog, ConfirmDialog } from "@toss/tds-mobile";

interface ConfirmDialogState {
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  onConfirm: () => void;
}

// IAP onError의 error.code별 안내 다이얼로그. 처리한 코드면 true, 아직 대응 안 한 코드면 false —
// 호출부는 false일 때 기존 토스트로 폴백한다. 코드 하나씩 추가해 나간다.
//
// 버튼 2개짜리(ConfirmDialog)는 useDialog().openConfirm에 커스텀 버튼을 넘기면 렌더링이 깨져서,
// 직접 상태를 들고 <ConfirmDialog> 컴포넌트를 그려주는 방식으로 처리한다. 반환된 dialog를
// 트리 안 어딘가에 렌더링해야 실제로 화면에 뜬다.
export function useIapErrorDialog() {
  const { openAlert } = useDialog();
  const [confirmState, setConfirmState] = useState<ConfirmDialogState | null>(null);

  const showIapErrorDialog = async (code: string | undefined): Promise<boolean> => {
    // 코드 표기가 SCREAMING_SNAKE_CASE로 통일돼 있지 않은 경우가 있어 대문자로 정규화해서 매칭한다.
    switch (code?.toUpperCase()) {
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
        setConfirmState({
          title: "이 기기에서는 결제할 수 없어요",
          description: "지금 기기나 계정 환경에서는 지원되지 않는 상품이에요. 다른 기기에서 시도하거나 고객센터로 문의해주세요.",
          cancelLabel: "닫기",
          confirmLabel: "문의하기",
          onConfirm: () => {
            // TODO: 문의하기 연결 — 프로젝트에 CS 채널/문의 라우트가 아직 없음 (MyHelpSection의 "문의하기"도 onClick 미구현)
          },
        });
        return true;
      default:
        if (code) console.warn("대응 안 한 IAP 에러 코드", code);
        return false;
    }
  };

  const dialog = confirmState ? (
    <ConfirmDialog
      open
      title={confirmState.title}
      description={confirmState.description}
      cancelButton={
        <ConfirmDialog.CancelButton size="large" onClick={() => setConfirmState(null)}>
          {confirmState.cancelLabel}
        </ConfirmDialog.CancelButton>
      }
      confirmButton={
        <ConfirmDialog.ConfirmButton
          size="large"
          onClick={() => {
            confirmState.onConfirm();
            setConfirmState(null);
          }}
        >
          {confirmState.confirmLabel}
        </ConfirmDialog.ConfirmButton>
      }
      onClose={() => setConfirmState(null)}
    />
  ) : null;

  return { showIapErrorDialog, dialog };
}
