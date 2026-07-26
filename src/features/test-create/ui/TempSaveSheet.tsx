import { BottomSheet, Button, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface TempSaveSheetProps {
  open: boolean;
  onClose: () => void;
  /** "저장하기" 선택: 내용을 저장하고 이동 */
  onSave: () => void;
  /** "안할게요" 선택: 저장(성공 토스트) 없이 이동 */
  onSkip: () => void;
  /** 저장 진행 중 버튼 비활성화 */
  isSaving?: boolean;
}

export function TempSaveSheet({ open, onClose, onSave, onSkip, isSaving = false }: TempSaveSheetProps) {
  return (
    <BottomSheet
      header={
        <BottomSheet.Header>
          지금까지 만든 테스트를
          <br />
          저장할까요?
        </BottomSheet.Header>
      }
      open={open}
      onClose={onClose}
      cta={
        <BottomSheet.DoubleCTA
          leftButton={
            <Button color="dark" variant="weak" onClick={onSkip} disabled={isSaving}>
              안할게요
            </Button>
          }
          rightButton={
            <Button onClick={onSave} loading={isSaving}>
              저장하기
            </Button>
          }
        />
      }
    >
      <div className="pb-2" style={{ margin: "0 24px" }}>
        <Text color={adaptive.grey700}>
          '내 테스트'에서
          <br />
          이어서 테스트를 만들거나 등록할 수 있어요.
        </Text>
      </div>
    </BottomSheet>
  );
}
