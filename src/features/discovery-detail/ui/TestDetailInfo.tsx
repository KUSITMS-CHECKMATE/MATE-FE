import { ListRow, Paragraph } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface Props {
  reward: number;
  description: string;
}

export function TestDetailInfo({ reward, description }: Props) {
  return (
    <>
      <ListRow
        left={
          <ListRow.AssetIcon
            size="medium"
            name="icon-coin-yellow"
            backgroundColor={adaptive.yellow100}
          />
        }
        contents={
          <ListRow.Texts
            type="2RowTypeF"
            top="보상 머니"
            topProps={{ color: adaptive.grey500 }}
            bottom={
              <Paragraph.Text>{reward.toLocaleString()}원</Paragraph.Text>
            }
            bottomProps={{ color: adaptive.grey800, fontWeight: "bold" }}
          />
        }
        verticalPadding="small"
        horizontalPadding="small"
      />

      <ListRow
        left={
          <ListRow.AssetIcon
            size="medium"
            name="icon-document-teal"
            backgroundColor={adaptive.teal100}
          />
        }
        contents={
          <ListRow.Texts
            type="2RowTypeD"
            top="테스트 한줄 소개"
            topProps={{ color: adaptive.grey500 }}
            bottom={description}
            bottomProps={{ color: adaptive.grey700, fontWeight: "medium" }}
          />
        }
        verticalPadding="small"
        horizontalPadding="small"
      />
    </>
  );
}
