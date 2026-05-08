import { Asset, Border, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface ScaleCreateTopSectionProps {
  questionTitle: string;
  questionDescription: string;
  questionImageUrl: string;
  onOpenQuestionEditor: () => void;
  onRemoveImage: () => void;
}

export function ScaleCreateTopSection({
  questionTitle,
  questionDescription,
  questionImageUrl,
  onOpenQuestionEditor,
  onRemoveImage,
}: ScaleCreateTopSectionProps) {
  const hasQuestionTitle = questionTitle.trim().length > 0;

  return (
    <>
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            {hasQuestionTitle ? questionTitle : "제목이 없어요"}
          </Top.TitleParagraph>
        }
        subtitleTop={
          <Top.SubtitleParagraph size={15} color={adaptive.grey500}>
            척도
          </Top.SubtitleParagraph>
        }
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>
            {questionDescription.trim().length > 0
              ? questionDescription
              : "설명이 없어요"}
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

      {questionImageUrl ? (
        <>
          <div className="rounded-2xl bg-white p-4">
            <div
              className="w-full rounded-2xl p-1.5"
              style={{
                height: 194,
                backgroundImage: `url(${questionImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: `inset 0 0 0 1px ${adaptive.greyOpacity100}`,
              }}
            >
              <div className="flex h-full w-full flex-col items-end justify-between">
                <button
                  type="button"
                  onClick={onRemoveImage}
                  aria-label="이미지 삭제"
                >
                  <Asset.Icon
                    frameShape={Asset.frameShape.CircleXSmall}
                    backgroundColor={adaptive.greyOpacity600}
                    name="icon-sweetshop-x-white"
                    scale={0.66}
                    aria-hidden
                  />
                </button>
              </div>
            </div>
          </div>
          <Border className="w-full shrink-0" variant="height16" />
        </>
      ) : (
        <Border className="w-full shrink-0" variant="height16" />
      )}
    </>
  );
}
