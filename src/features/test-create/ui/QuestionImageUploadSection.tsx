import { Asset, ListHeader, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface QuestionImageUploadSectionProps {
  imageUrl: string;
  onCameraClick: () => void;
  onRemove: () => void;
}

export function QuestionImageUploadSection({ imageUrl, onCameraClick, onRemove }: QuestionImageUploadSectionProps) {
  const imageCount = imageUrl ? 1 : 0;

  return (
    <>
      <ListHeader
        descriptionPosition="bottom"
        rightAlignment="center"
        titleWidthRatio={0.6}
        title={
          <ListHeader.TitleParagraph typography="t5" fontWeight="medium" color={adaptive.grey800}>
            이미지
          </ListHeader.TitleParagraph>
        }
        right={
          <ListHeader.RightText typography="t7" fontWeight="medium" color={adaptive.grey700}>
            (선택)
          </ListHeader.RightText>
        }
      />
      <div className="flex flex-nowrap gap-2 px-5 pb-3">
        <div className="h-[88px] w-[88px] shrink-0 overflow-hidden rounded-2xl">
          <button
            type="button"
            className="flex h-full w-full flex-col items-center justify-center gap-1 p-4 bg-[var(--token-tds-color-grey-100,var(--adaptiveGrey100,#f2f4f6))]"
            onClick={onCameraClick}
          >
            <Asset.Icon
              frameShape={Asset.frameShape.CleanW24}
              backgroundColor="transparent"
              name="icon-camera-mono"
              color={adaptive.grey600}
              aria-hidden
              ratio="1/1"
            />
            <div className="flex">
              <Text color={adaptive.grey500} typography="t7" fontWeight="medium">
                {imageCount}
              </Text>
              <Text color={adaptive.grey500} typography="t7" fontWeight="medium">
                /1
              </Text>
            </div>
          </button>
        </div>
        {imageUrl && (
          <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-2xl">
            <img src={imageUrl} alt="질문 이미지" className="h-full w-full object-cover" />
            <div className="absolute inset-[6px] flex items-start justify-end pointer-events-none">
              <button
                type="button"
                onClick={onRemove}
                className="flex p-0 cursor-pointer pointer-events-auto"
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
        )}
      </div>
    </>
  );
}
