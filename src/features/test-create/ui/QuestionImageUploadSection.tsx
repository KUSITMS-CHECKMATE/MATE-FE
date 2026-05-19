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
        <button
          type="button"
          style={{
            width: 88,
            height: 88,
            backgroundColor: "var(--token-tds-color-grey-100, var(--adaptiveGrey100, #f2f4f6))",
            borderRadius: 16,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            flexShrink: 0,
          }}
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
          <div style={{ display: "flex" }}>
            <Text color={adaptive.grey500} typography="t7" fontWeight="medium">
              {imageCount}
            </Text>
            <Text color={adaptive.grey500} typography="t7" fontWeight="medium">
              /1
            </Text>
          </div>
        </button>
        {imageUrl && (
          <div
            style={{
              position: "relative",
              width: 88,
              height: 88,
              flexShrink: 0,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <img src={imageUrl} alt="질문 이미지" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div
              style={{
                position: "absolute",
                top: 6,
                left: 6,
                right: 6,
                bottom: 6,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-start",
                pointerEvents: "none",
              }}
            >
              <button
                type="button"
                onClick={onRemove}
                style={{
                  display: "flex",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  pointerEvents: "auto",
                }}
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
