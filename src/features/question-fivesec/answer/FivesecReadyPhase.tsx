import { adaptive } from "@toss/tds-colors";
import {
  Asset,
  CTAButton,
  FixedBottomCTA,
  Tooltip,
  Top,
} from "@toss/tds-mobile";

interface Props {
  isFirst: boolean;
  onPrev: () => void;
  onStart: () => void;
}

export function FivesecReadyPhase({ isFirst, onPrev, onStart }: Props) {
  return (
    <div className="flex flex-col flex-1 bg-white">
      <div className="flex-1">
        <Top
          title={
            <Top.TitleParagraph size={22} color={adaptive.grey900}>
              {`5초간\n아래 사진에 집중해주세요`}
            </Top.TitleParagraph>
          }
          subtitleBottom={
            <Top.SubtitleParagraph size={15}>
              {`제한된 시간 동안 이미지를 보게 될 거예요. \n이미지가 무슨 내용인지 이해하고, 최대한 많은 정보를 기억하려고 해보세요.`}
            </Top.SubtitleParagraph>
          }
          upper={
            <Top.UpperAssetContent
              content={
                <Asset.Lottie
                  frameShape={Asset.frameShape.CleanW60}
                  backgroundColor="transparent"
                  src="https://static.toss.im/lotties-common/siren-2-spot.json"
                  loop={true}
                  speed={1}
                  aria-hidden={true}
                  style={{ aspectRatio: `1/1` }}
                />
              }
            />
          }
        />
      </div>

      <div className="fixed bottom-21 inset-x-0 z-10 flex justify-end px-5 pb-2">
        <div className="flex w-[calc(50%-4px)] justify-center">
          <Tooltip
            open={true}
            onOpenChange={() => {}}
            message="준비됐으면 눌러주세요"
            messageAlign="right"
            placement="top"
            size="medium"
            clipToEnd="none"
            motionVariant="strong"
          >
            <span className="block h-1 opacity-0" aria-hidden={true} />
          </Tooltip>
        </div>
      </div>

      {isFirst ? (
        <FixedBottomCTA onClick={onStart}>다음</FixedBottomCTA>
      ) : (
        <FixedBottomCTA.Double
          leftButton={
            <CTAButton color="dark" variant="weak" onClick={onPrev}>
              이전
            </CTAButton>
          }
          rightButton={<CTAButton onClick={onStart}>다음</CTAButton>}
        />
      )}
    </div>
  );
}
