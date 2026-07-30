import { useEffect } from "react";
import { graniteEvent } from "@apps-in-toss/web-framework";
import { FixedBottomCTA } from "@toss/tds-mobile";

export function GuidePage() {
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    try {
      unsubscribe = graniteEvent.addEventListener("backEvent", {
        onEvent: () => {
          window.history.back();
        },
        onError: (error) => {
          console.error("backEvent error", error);
        },
      });
    } catch {
      console.warn("backEvent listener not supported in browser");
    }
    return () => {
      unsubscribe?.();
    };
  }, []);

  return (
    <div className="flex flex-col">
      <img src="/images/banner_1.png" alt="" aria-hidden className="w-full" />
      <img src="/images/banner_2.png" alt="" aria-hidden className="w-full" />
      <img src="/images/banner_3.png" alt="" aria-hidden className="w-full" />
      <img src="/images/banner_4.png" alt="" aria-hidden className="w-full" />
      <img src="/images/banner_5.png" alt="" aria-hidden className="w-full" />
      <img src="/images/banner_6.png" alt="" aria-hidden className="w-full" />
      <FixedBottomCTA onClick={() => history.back()}>테스트 시작하기</FixedBottomCTA>
    </div>
  );
}
