import { useState } from "react";
import { Asset, Button, FixedBottomCTA, Spacing, Text, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { setClipboardText } from "@apps-in-toss/web-framework";

interface Props {
  orderId: string;
}

// SDK에 플랫폼 감지/외부 URL 오픈 브릿지가 따로 없어 웹뷰 표준 방식(userAgent + location)으로 처리한다.
// 각 URL은 Apps-in-toss가 아니라 Apple/Google이 제공하는 표준 환불 요청 페이지다.
function openAppMarketRefundPage() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  window.location.href = isIOS
    ? "https://reportaproblem.apple.com/"
    : "https://play.google.com/store/account/orderhistory";
}

export function AppMarketVerificationFailedStep({ orderId }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await setClipboardText?.(orderId);
      setCopied(true);
    } catch {
      // 클립보드 권한 거부 등 — 주문번호는 화면에 그대로 보이므로 별도 안내 없이 무시
    }
  };

  return (
    <div className="flex flex-col h-dvh">
      <Spacing size={12} />
      <Top
        upper={
          <Top.UpperAssetContent
            content={
              <Asset.Lottie
                frameShape={Asset.frameShape.CleanW60}
                src="https://static.toss.im/lotties-common/error-2-spot.json"
                loop={false}
                aria-hidden={true}
              />
            }
          />
        }
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            {"앱스토어 시스템 문제로\n테스트 등록하지 못했어요"}
          </Top.TitleParagraph>
        }
        subtitleBottom={
          <Top.SubtitleParagraph>
            결제가 돼서 환불이 필요해요. 주문 번호를 복사하고 환불 요청해주세요.
          </Top.SubtitleParagraph>
        }
      />
      <Spacing size={24} />
      <div className="flex items-center justify-between px-6">
        <div className="flex flex-col gap-1">
          <Text color={adaptive.grey500} typography="t7">
            주문 번호
          </Text>
          <Text color={adaptive.grey900} typography="t5" fontWeight="bold">
            {orderId}
          </Text>
        </div>
        <Button size="small" variant="weak" color="dark" onClick={handleCopy}>
          {copied ? "복사됨" : "복사"}
        </Button>
      </div>
      <FixedBottomCTA color="dark" variant="weak" onClick={openAppMarketRefundPage}>
        App Store 환불 요청
      </FixedBottomCTA>
    </div>
  );
}
