import { ListHeader, ListRow, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface Props {
  reward: number;
  description: string;
  serviceName: string;
  serviceDescription: string;
}

export function TestDetailInfo({ reward, description, serviceName, serviceDescription }: Props) {
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
            bottom={`${reward.toLocaleString()}원`}
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
            bottomProps={{ color: adaptive.grey700, fontWeight: "semibold" }}
          />
        }
        verticalPadding="small"
        horizontalPadding="small"
      />

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
            type="2RowTypeF"
            top="서비스 소개"
            topProps={{ color: adaptive.grey500 }}
            bottom="진행될 테스트의 서비스를 소개할게요"
            bottomProps={{ color: adaptive.grey800, fontWeight: "semibold" }}
          />
        }
        horizontalPadding="small"
      />

      <ListHeader
        title={
          <ListHeader.TitleParagraph color={adaptive.grey800} fontWeight="bold" typography="t5">
            {serviceName}
          </ListHeader.TitleParagraph>
        }
        descriptionPosition="bottom"
      />
      <div className="w-full flex flex-row justify-start items-center px-6 pb-4">
        <Text display="block" color={adaptive.grey700} typography="t5" fontWeight="regular">
          {serviceDescription}
        </Text>
      </div>
    </>
  );
}
