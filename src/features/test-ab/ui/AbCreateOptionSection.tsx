import { Asset, Button, ListHeader, ListRow, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

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
        className="flex items-start gap-4"
        style={{
          width: "100%",
          backgroundColor: adaptive.background,
          padding: 16,
        }}
      >
        <Text color={adaptive.grey700} typography="t5" fontWeight="medium">
          {label}
        </Text>
        <div
          className="relative"
          style={{
            flex: 1,
            height: 302,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 16,
            boxShadow: `inset 0 0 0 1px ${adaptive.greyOpacity100}`,
          }}
        >
          <div style={{ width: 157, height: 289 }} />
          <button
            type="button"
            onClick={onRemove}
            className="absolute right-3 top-3"
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
