import { BottomSheet, ListRow } from '@toss/tds-mobile';
import { adaptive } from '@toss/tds-colors';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TestCreateGuideBottomSheet({ open, onClose }: Props) {
  return (
    <BottomSheet
      header={<BottomSheet.Header>테스트를 만들기 전 알려드려요</BottomSheet.Header>}
      open={open}
      onClose={onClose}
      cta={
        <BottomSheet.CTA color="primary" variant="fill" disabled={false} onClick={onClose}>
          확인
        </BottomSheet.CTA>
      }
    >
      <ListRow
        left={
          <ListRow.AssetImage
            src="https://static.toss.im/2d-icons/emoji/png/4x/uE113.png"
            shape="squircle"
            backgroundColor="rgba(255, 255, 255, 0)"
            size="small"
          />
        }
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="테스트 등록 중 임시 저장할 수 있어요"
            topProps={{ color: adaptive.grey800, fontWeight: 'bold' }}
            bottom="상단 버튼으로 테스트를 임시 저장해요"
            bottomProps={{ color: adaptive.grey600 }}
          />
        }
        verticalPadding="large"
      />
      <ListRow
        left={
          <ListRow.AssetImage
            src="https://static.toss.im/2d-icons/color/png/4x/icon-document-retry.png"
            shape="squircle"
            backgroundColor="rgba(255, 255, 255, 0)"
            size="small"
          />
        }
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top={<div className="whitespace-pre-line">{'임시 저장한 테스트는\n테스트 탭에서 확인할 수 있어요'}</div>}
            topProps={{ color: adaptive.grey800, fontWeight: 'bold' }}
            bottom="언제든 이어서 등록해요"
            bottomProps={{ color: adaptive.grey600 }}
          />
        }
        verticalPadding="large"
      />
    </BottomSheet>
  );
}
