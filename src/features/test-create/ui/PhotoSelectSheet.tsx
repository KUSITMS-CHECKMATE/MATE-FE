import { BottomSheet, ListRow, Asset, Spacing } from "@toss/tds-mobile";

interface PhotoSelectSheetProps {
  open: boolean;
  onClose: () => void;
  onCamera: () => void;
  onAlbum: () => void;
}

export function PhotoSelectSheet({ open, onClose, onCamera, onAlbum }: PhotoSelectSheetProps) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      onExited={() => {
        // 시트가 완전히 닫힌 후 액션 실행은 TestImageStep에서 처리
      }}
    >
      <ListRow
        as="button"
        className="w-full"
        left={
          <Asset.Image
            frameShape={Asset.frameShape.CleanW24}
            backgroundColor="transparent"
            src="https://static.toss.im/2d-emojis/png/4x/u1F4F7.png"
            aria-hidden={true}
            style={{ aspectRatio: "1/1" }}
          />
        }
        contents={<ListRow.Texts type="1RowTypeA" top="사진 촬영하기" />}
        verticalPadding="large"
        onClick={() => {
          onClose();
          setTimeout(onCamera, 300);
        }}
      />
      <ListRow
        as="button"
        className="w-full"
        left={
          <Asset.Icon
            frameShape={Asset.frameShape.CleanW24}
            backgroundColor="transparent"
            name="icon-picture"
            aria-hidden={true}
            ratio="1/1"
          />
        }
        contents={<ListRow.Texts type="1RowTypeA" top="앨범에서 선택하기" />}
        verticalPadding="large"
        onClick={() => {
          onClose();
          setTimeout(onAlbum, 300);
        }}
      />
      <Spacing size={24} />
    </BottomSheet>
  );
}
