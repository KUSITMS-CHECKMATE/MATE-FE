import { Asset, Button, List, ListHeader, ListRow } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface AbCreateOptionSectionProps {
  imageUrlA: string;
  imageUrlB: string;
  onUploadA: () => void;
  onUploadB: () => void;
  onRemoveA: () => void;
  onRemoveB: () => void;
}

export function AbCreateOptionSection({ imageUrlA, imageUrlB, onUploadA, onUploadB, onRemoveA, onRemoveB }: AbCreateOptionSectionProps) {
  return (
    <>
      <ListHeader
        size="small"
        horizontalPadding="medium"
        verticalPadding="medium"
        descriptionPosition="bottom"
        rightAlignment="center"
        a11yRightReflow={false}
        titleWidthRatio={0.6}
        title={
          <ListHeader.TitleParagraph color={adaptive.grey600}>
            A/B안 설정
          </ListHeader.TitleParagraph>
        }
      />
      <List>
        <ListRow
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top="A안"
              topProps={{ color: adaptive.grey700 }}
            />
          }
          right={
            imageUrlA.trim().length > 0 ? (
              <div
                className="relative h-16 w-28 overflow-hidden rounded-xl"
                style={{ boxShadow: `inset 0 0 0 1px ${adaptive.greyOpacity100}` }}
              >
                <img src={imageUrlA} alt="A안 이미지" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={onRemoveA}
                  className="absolute right-1 top-1"
                  aria-label="A안 이미지 삭제"
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
            ) : (
              <Button color="dark" variant="weak" onClick={onUploadA}>
                이미지 추가
              </Button>
            )
          }
          verticalPadding="large"
        />
        <ListRow
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top="B안"
              topProps={{ color: adaptive.grey700 }}
            />
          }
          right={
            imageUrlB.trim().length > 0 ? (
              <div
                className="relative h-16 w-28 overflow-hidden rounded-xl"
                style={{ boxShadow: `inset 0 0 0 1px ${adaptive.greyOpacity100}` }}
              >
                <img src={imageUrlB} alt="B안 이미지" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={onRemoveB}
                  className="absolute right-1 top-1"
                  aria-label="B안 이미지 삭제"
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
            ) : (
              <Button color="dark" variant="weak" onClick={onUploadB}>
                이미지 추가
              </Button>
            )
          }
          verticalPadding="large"
        />
      </List>
    </>
  );
}
