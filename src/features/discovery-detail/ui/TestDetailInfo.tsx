import {
  Border,
  ListHeader,
  ListRow,
  Paragraph,
  Spacing,
  Text,
} from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface Props {
  reward: number;
  description: string;
  serviceName: string;
  serviceDescription: string;
}

export function TestDetailInfo({
  reward,
  description,
  serviceName,
  serviceDescription,
}: Props) {
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
            type="2RowTypeF"
            top="테스트 한줄 소개"
            topProps={{ color: adaptive.grey500 }}
            bottom={description}
            bottomProps={{ color: adaptive.grey700, fontWeight: "medium" }}
          />
        }
        verticalPadding="small"
        horizontalPadding="small"
      />

      <Spacing size={16} />
      <Border variant="height16" />
      <Spacing size={16} />

      <ListRow
        left={
          <ListRow.AssetIcon
            size="medium"
            name="icon-loudspeaker"
            backgroundColor={adaptive.red50}
          />
        }
        contents={
          <ListRow.Texts
            type="2RowTypeC"
            top="서비스 소개"
            topProps={{ color: adaptive.grey800, fontWeight: "bold" }}
            bottom="진행될 테스트의 서비스를 소개할게요"
            bottomProps={{ color: adaptive.grey500 }}
          />
        }
        verticalPadding="small"
      />

      <ListHeader
        title={
          <ListHeader.TitleParagraph
            color={adaptive.grey800}
            fontWeight="bold"
            typography="t5"
          >
            {serviceName}
          </ListHeader.TitleParagraph>
        }
        description={
          <ListHeader.DescriptionParagraph>
            서비스명
          </ListHeader.DescriptionParagraph>
        }
        descriptionPosition="top"
      />

      <div className="px-6 pb-4">
        <Text
          display="block"
          color={adaptive.grey700}
          typography="t5"
          fontWeight="regular"
        >
          {serviceDescription}
        </Text>
      </div>
    </>
  );
}
