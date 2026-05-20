import { Border, ListRow } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface TesterPreviewListRowProps {
  hasBottomContent?: boolean;
  onClick?: () => void;
}

export function TesterPreviewListRow({
  hasBottomContent = true,
  onClick,
}: TesterPreviewListRowProps) {
  return (
    <div>
      <ListRow
        as={onClick ? "button" : undefined}
        className={onClick ? "w-full text-left" : undefined}
        left={
          <ListRow.AssetIcon
            size="medium"
            name="icon-phone-appintoss"
            backgroundColor={adaptive.grey100}
          />
        }
        contents={
          <ListRow.Texts
            type="2RowTypeF"
            top="테스터 화면을 보고 싶다면"
            topProps={{ color: adaptive.grey500 }}
            bottom="테스트 미리보기"
            bottomProps={{ color: adaptive.grey800, fontWeight: "bold" }}
          />
        }
        verticalPadding="large"
        horizontalPadding="medium"
        onClick={onClick}
      />
      {hasBottomContent ? (
        <Border variant="full" color={adaptive.opacity300} />
      ) : null}
    </div>
  );
}
