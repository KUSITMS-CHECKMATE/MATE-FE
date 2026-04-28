import { BottomSheet, Button, ListRow } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface ServiceDescriptionNudgeSheetProps {
  open: boolean;
  onClose: () => void;
  onSkip: () => void;
}

export function ServiceDescriptionNudgeSheet({ open, onClose, onSkip }: ServiceDescriptionNudgeSheetProps) {
  return (
    <BottomSheet
      header={<BottomSheet.Header>서비스 소개를 하면 이런 혜택이 있어요</BottomSheet.Header>}
      headerDescription={<BottomSheet.HeaderDescription>서비스 소개는 선택사항이에요</BottomSheet.HeaderDescription>}
      open={open}
      onClose={onClose}
      cta={
        <BottomSheet.DoubleCTA
          leftButton={
            <Button color="dark" variant="weak" onClick={onSkip}>
              다음에
            </Button>
          }
          rightButton={<Button onClick={onClose}>소개하기</Button>}
        />
      }
    >
      <ListRow
        left={<ListRow.AssetIcon size="xsmall" shape="original" name="icon-loudspeaker" />}
        contents={
          <ListRow.Texts
            type="2RowTypeF"
            top="테스트를 진행하며"
            topProps={{ color: adaptive.grey500 }}
            bottom="서비스 홍보도 같이할 수 있어요"
            bottomProps={{ color: adaptive.grey800, fontWeight: "bold" }}
          />
        }
        verticalPadding="large"
      />
      <ListRow
        left={<ListRow.AssetIcon size="xsmall" shape="original" url="https://static.toss.im/2d-emojis/png/4x/u1F913.png" />}
        contents={
          <ListRow.Texts
            type="2RowTypeF"
            top="어떤 서비스의 테스트인지 설명하여"
            topProps={{ color: adaptive.grey500 }}
            bottom="사용자의 이해도를 높여요"
            bottomProps={{ color: adaptive.grey800, fontWeight: "bold" }}
          />
        }
        verticalPadding="large"
      />
    </BottomSheet>
  );
}
