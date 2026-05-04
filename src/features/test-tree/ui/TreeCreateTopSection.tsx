import { Border, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface TreeCreateTopSectionProps {
  questionTitle: string;
  questionDescription: string;
  onOpenQuestionEditor: () => void;
}

export function TreeCreateTopSection({
  questionTitle,
  questionDescription,
  onOpenQuestionEditor,
}: TreeCreateTopSectionProps) {
  const hasQuestionTitle = questionTitle.trim().length > 0;
  const displayTitle = hasQuestionTitle ? questionTitle : "제목이 없어요";
  const displayDescription =
    questionDescription.trim().length > 0 ? questionDescription : "설명이 없어요";

  return (
    <>
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            {displayTitle}
          </Top.TitleParagraph>
        }
        subtitleTop={
          <Top.SubtitleParagraph size={15} color={adaptive.grey500}>
            트리 테스트
          </Top.SubtitleParagraph>
        }
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>
            {displayDescription}
          </Top.SubtitleParagraph>
        }
        lower={
          <Top.LowerButton
            color={hasQuestionTitle ? "dark" : "primary"}
            size="small"
            variant="weak"
            display="inline"
            onClick={onOpenQuestionEditor}
          >
            {hasQuestionTitle ? "수정하기" : "입력하기"}
          </Top.LowerButton>
        }
      />

      <Border variant="height16" />
    </>
  );
}
