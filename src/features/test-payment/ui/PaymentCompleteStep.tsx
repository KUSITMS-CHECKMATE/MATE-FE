import { Asset, CTAButton, FixedBottomCTA, Spacing, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface Props {
  onViewTest: () => void;
  onClose: () => void;
}

export function PaymentCompleteStep({ onViewTest, onClose }: Props) {
  return (
    <div className="flex flex-col h-dvh items-center overflow-hidden">
      <Spacing size={169} />
      <Asset.Image
        frameShape={Asset.frameShape.CleanW100}
        backgroundColor="transparent"
        src="https://static.toss.im/lotties/check-spot-apng.png"
        aria-hidden={true}
        style={{ aspectRatio: "1/1" }}
      />
      <Spacing size={24} />
      <Text display="block" color={adaptive.grey800} typography="t2" fontWeight="bold" textAlign="center">
        테스트 결제 완료
      </Text>
      <Spacing size={8} />
      <Text display="block" color={adaptive.grey700} typography="t5" fontWeight="regular" textAlign="center">
        내부 검토를 통과한 뒤 테스트 등록이 돼요{"\n"}검토는 최대 일주일까지 걸려요
      </Text>
      <FixedBottomCTA.Double
        leftButton={
          <CTAButton color="dark" variant="weak" display="block" onClick={onClose}>
            닫기
          </CTAButton>
        }
        rightButton={
          <CTAButton display="block" onClick={onViewTest}>
            테스트 보기
          </CTAButton>
        }
      />
    </div>
  );
}
