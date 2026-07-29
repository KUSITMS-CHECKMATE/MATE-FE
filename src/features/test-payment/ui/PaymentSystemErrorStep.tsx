import { Asset, FixedBottomCTA, Spacing, Text, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface Props {
  subject: string;
  onRetry: () => void;
  isRetrying: boolean;
}

// IAP 결제 자체는 성공(또는 검증 단계에서 실패)했지만 메이트 쪽에 등록을 완료하지 못한 경우 공통으로 쓰는 화면.
// APP_MARKET_VERIFICATION_FAILED(subject="스토어")와 TOSS_SERVER_VERIFICATION_FAILED(subject="메이트")가 이 화면을 함께 쓴다.
// 초안은 그대로 남아있어 별도 환불 절차 없이 재시도만 하면 되므로 재시도 CTA만 보여준다.
export function PaymentSystemErrorStep({ subject, onRetry, isRetrying }: Props) {
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
            {`${subject} 시스템 문제로\n테스트 등록하지 못했어요`}
          </Top.TitleParagraph>
        }
        subtitleBottom={
          <Top.SubtitleParagraph>
            다시 시도하거나 메이트에게 문의해주세요
          </Top.SubtitleParagraph>
        }
      />
      <FixedBottomCTA
        color="dark"
        variant="weak"
        topAccessory={
          <Text display="block" color={adaptive.grey500} typography="t7" textAlign="center">
            {"이 화면을 벗어나도\n만든 테스트는 없어지지 않으니 안심해도 좋아요"}
          </Text>
        }
        onClick={onRetry}
        loading={isRetrying}
      >
        다시 시도
      </FixedBottomCTA>
    </div>
  );
}
