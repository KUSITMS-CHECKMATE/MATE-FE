import { Asset, Button, ListHeader, ListRow, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

const IMAGE_SLOT_HORIZONTAL_PADDING = 22;
const IMAGE_SLOT_LABEL_WIDTH = `calc(50vw - ${IMAGE_SLOT_HORIZONTAL_PADDING}px)`;
const AB_IMAGE_WIDTH = `calc(50vw - ${IMAGE_SLOT_HORIZONTAL_PADDING}px)`;
const AB_IMAGE_HEIGHT = 302;

interface AbCreateOptionSectionProps {
  imageUrlA: string;
  imageUrlB: string;
  onUploadA: () => void;
  onUploadB: () => void;
  onRemoveA: () => void;
  onRemoveB: () => void;
}

interface AbImageSlotProps {
  label: string;
  imageUrl: string;
  onUpload: () => void;
  onRemove: () => void;
}

function AbImageSlot({ label, imageUrl, onUpload, onRemove }: AbImageSlotProps) {
  const hasImage = imageUrl.trim().length > 0;

  if (hasImage) {
    return (
      <div
        className="grid items-start"
        style={{
          width: "100%",
          backgroundColor: adaptive.background,
          gridTemplateColumns: `${IMAGE_SLOT_LABEL_WIDTH} ${AB_IMAGE_WIDTH}`,
          padding: `15px ${IMAGE_SLOT_HORIZONTAL_PADDING}px`,
        }}
      >
        <Text color={adaptive.grey700} typography="t5" fontWeight="medium" className="pt-1.5">
          {label}
        </Text>
        <div
          className="relative overflow-hidden"
          style={{
            width: AB_IMAGE_WIDTH,
            height: AB_IMAGE_HEIGHT,
            borderRadius: 14,
            boxShadow: `inset 0 0 0 1px ${adaptive.greyOpacity100}`,
          }}
        >
          <img
            src={imageUrl}
            alt={`${label} 이미지`}
            className="h-full w-full object-cover"
            draggable={false}
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute right-1.5 top-1.5"
            aria-label={`${label} 이미지 삭제`}
          >
            <Asset.Icon
              frameShape={Asset.frameShape.CircleXSmall}
              backgroundColor={adaptive.greyOpacity600}
              name="icon-sweetshop-x-white"
              scale={0.66}
              aria-hidden={true}
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="1RowTypeA"
          top={label}
          topProps={{ color: adaptive.grey700 }}
        />
      }
      right={
        <Button color="dark" variant="weak" size="small" onClick={onUpload}>
          이미지 추가
        </Button>
      }
      verticalPadding="large"
    />
  );
}

export function AbCreateOptionSection({ imageUrlA, imageUrlB, onUploadA, onUploadB, onRemoveA, onRemoveB }: AbCreateOptionSectionProps) {
  return (
    <>
      <ListHeader
        descriptionPosition="bottom"
        rightAlignment="center"
        titleWidthRatio={0.6}
        title={
          <ListHeader.TitleParagraph typography="t5" fontWeight="medium" color={adaptive.grey600}>
            A/B안 설정
          </ListHeader.TitleParagraph>
        }
        className="w-full"
      />
      <AbImageSlot
        label="A안"
        imageUrl={imageUrlA}
        onUpload={onUploadA}
        onRemove={onRemoveA}
      />
      <AbImageSlot
        label="B안"
        imageUrl={imageUrlB}
        onUpload={onUploadB}
        onRemove={onRemoveB}
      />
    </>
  );
}
