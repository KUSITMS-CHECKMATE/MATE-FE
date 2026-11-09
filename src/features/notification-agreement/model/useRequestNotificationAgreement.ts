import { useCallback, useEffect, useRef } from "react";
import { Notification } from "@apps-in-toss/web-framework";

// 콘솔 > 스마트 발송 > "신규 테스트 등록 안내 푸시 알림" 캠페인의 발송 코드
const TEMPLATE_CODE = "mate-mate-test-approved";

/**
 * 토스 알림 동의 시트를 띄운다. 미지원 앱 버전/브릿지 없음(브라우저)이면 조용히 무시한다.
 * 동의 상태는 토스가 관리하므로 재호출해도 이미 동의한 사용자는 alreadyAgreed로 끝난다.
 */
export function useRequestNotificationAgreement() {
  const cleanupRef = useRef<(() => void) | null>(null);

  const release = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
  }, []);

  useEffect(() => release, [release]);

  return useCallback(() => {
    try {
      if (!Notification.requestAgreement.isSupported()) return;
      release(); // 재호출 전 이전 리스너 해제 (중복 방지)
      const cleanup: unknown = Notification.requestAgreement({
        options: { templateCode: TEMPLATE_CODE },
        onEvent: release, // newAgreement | alreadyAgreed | agreementRejected 모두 추가 처리 없음
        onError: (error) => {
          console.warn("requestNotificationAgreement error", error);
          release();
        },
      });
      // 타입 선언과 달리 일부 환경(devtools mock, 2.x iOS 실기기)은 함수가 아닌 객체를 반환한다.
      cleanupRef.current = typeof cleanup === "function" ? (cleanup as () => void) : null;
    } catch (error) {
      console.warn("requestNotificationAgreement not available", error);
    }
  }, [release]);
}
