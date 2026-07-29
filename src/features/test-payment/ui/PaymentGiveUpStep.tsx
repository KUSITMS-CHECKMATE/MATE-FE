import { Asset, FixedBottomCTA, Spacing, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface Props {
  onConfirm: () => void;
}

// PaymentSystemErrorStep에서 "다시 시도"가 4번 이상 계속 실패하면 더 이상 재시도를 주지 않는 최종 화면.
// (재시도 횟수 집계는 usePaymentSubmit의 failureCount 참고)
export function PaymentGiveUpStep({ onConfirm }: Props) {
  return (
    <div className="flex flex-col h-dvh">
      <Spacing size={12} />
      <Top
        upper={
          <Top.UpperAssetContent
            content={
              <Asset.Image
                frameShape={Asset.frameShape.CleanW60}
                backgroundColor="transparent"
                src="https://static.toss.im/2d-icons/emoji/png/4x/u1F6A7.png"
                aria-hidden={true}
                style={{ aspectRatio: "1/1" }}
              />
            }
          />
        }
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            지금은 테스트 등록이 어려워요
          </Top.TitleParagraph>
        }
        subtitleBottom={
          <Top.SubtitleParagraph>
            메이트에게 문의하면 만드신 테스트 등록을 도와드릴게요
          </Top.SubtitleParagraph>
        }
      />
      <FixedBottomCTA color="dark" variant="weak" onClick={onConfirm}>
        확인했어요
      </FixedBottomCTA>
    </div>
  );
}
