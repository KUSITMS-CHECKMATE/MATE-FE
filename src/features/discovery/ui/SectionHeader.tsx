import { ListHeader, ListRow } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface Props {
  title: string;
  /** 없으면 아이콘+설명 줄을 그리지 않는다 */
  description?: string;
  iconSrc?: string;
}

export function SectionHeader({ title, description, iconSrc }: Props) {
  return (
    <>
      <ListHeader
        size="large"
        horizontalPadding="medium"
        verticalPadding="small"
        descriptionPosition="bottom"
        rightAlignment="center"
        a11yRightReflow={false}
        titleWidthRatio={0.6}
        title={
          <ListHeader.TitleParagraph color={adaptive.grey800}>
            <span className="whitespace-pre">{title}</span>
          </ListHeader.TitleParagraph>
        }
      />
      {description && (
        <ListRow
          left={
            iconSrc ? (
              <ListRow.AssetImage
                src={iconSrc}
                shape="squircle"
                backgroundColor="rgba(2, 32, 71, 0)"
                size="xsmall"
              />
            ) : undefined
          }
          contents={<ListRow.Texts type="1RowTypeA" top={description} topProps={{ color: adaptive.grey600 }} />}
          verticalPadding="small"
        />
      )}
    </>
  );
}
