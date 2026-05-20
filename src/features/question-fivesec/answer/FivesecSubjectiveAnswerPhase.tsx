import { adaptive } from "@toss/tds-colors";
import { CTAButton, FixedBottomCTA, TextArea, Top } from "@toss/tds-mobile";

interface Props {
  title: string;
  description: string;
  placeholder: string;
  text: string;
  canGoNext: boolean;
  isFirst: boolean;
  isLast: boolean;
  onChange: (text: string) => void;
  onPrev: () => void;
  onGoNext: () => void;
}

export function FivesecSubjectiveAnswerPhase({
  title,
  description,
  placeholder,
  text,
  canGoNext,
  isFirst,
  isLast,
  onChange,
  onPrev,
  onGoNext,
}: Props) {
  return (
    <>
      <div className="flex flex-col flex-1">
        <Top
          title={
            <Top.TitleParagraph size={22} color={adaptive.grey900}>
              {title}
            </Top.TitleParagraph>
          }
          subtitleTop={
            <Top.SubtitleBadges
              badges={[{ text: "5초 테스트", color: "elephant", variant: "weak" }]}
            />
          }
          subtitleBottom={
            <Top.SubtitleParagraph size={15}>{description}</Top.SubtitleParagraph>
          }
        />
        <TextArea
          variant="box"
          hasError={false}
          label="답변"
          labelOption="sustain"
          value={text}
          placeholder={placeholder}
          height={200}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {isFirst ? (
        <FixedBottomCTA disabled={!canGoNext} onClick={onGoNext}>
          {isLast ? "완료하기" : "다음"}
        </FixedBottomCTA>
      ) : (
        <FixedBottomCTA.Double
          leftButton={
            <CTAButton color="dark" variant="weak" onClick={onPrev}>
              이전
            </CTAButton>
          }
          rightButton={
            <CTAButton disabled={!canGoNext} onClick={onGoNext}>
              {isLast ? "완료하기" : "다음"}
            </CTAButton>
          }
        />
      )}
    </>
  );
}
