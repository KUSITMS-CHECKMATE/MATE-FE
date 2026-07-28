import { useEffect, useRef } from "react";
import { partner, tdsEvent } from "@apps-in-toss/web-framework";

/**
 * 네비 액세서리 "임시저장" 버튼을 마운트 동안 계속 노출하고, 탭 시 최신 onTempSave를 호출한다.
 * (리스너 재구독 없이 항상 최신 콜백을 참조하도록 ref에 보관)
 */
export function useTempSaveAccessoryButton(onTempSave: () => void) {
  const onTempSaveRef = useRef(onTempSave);
  useEffect(() => {
    onTempSaveRef.current = onTempSave;
  }, [onTempSave]);

  useEffect(() => {
    try {
      partner.addAccessoryButton({
        id: "temp-save",
        title: "임시저장",
        icon: { name: "icon-cloud-download" },
      });
    } catch {
      // 브라우저 환경에서는 무시
    }

    const cleanup = tdsEvent.addEventListener("navigationAccessoryEvent", {
      onEvent: ({ id }: { id: string }) => {
        if (id === "temp-save") {
          onTempSaveRef.current();
        }
      },
      onError: (error: unknown) => {
        console.error("navigationAccessoryEvent error", error);
      },
    });

    return () => {
      cleanup();
      partner.removeAccessoryButton().catch(() => {});
    };
  }, []);
}
