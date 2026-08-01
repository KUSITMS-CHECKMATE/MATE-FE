import { useNavigate } from '@tanstack/react-router';
import { Text, List, ListRow, Spacing } from '@toss/tds-mobile';
import { adaptive } from '@toss/tds-colors';
import { ROUTES } from '@/shared/constants/routes';

interface Props {
  onGuideClick?: () => void;
}

export function MyHelpSection({ onGuideClick }: Props) {
  const navigate = useNavigate();

  return (
    <>
      <Spacing size={20} />
      <div className="px-6">
        <Text color={adaptive.grey800} typography="t6" fontWeight="bold">
          도움말
        </Text>
      </div>
      <Spacing size={11} />
      <List>
        <ListRow
          left={
            <ListRow.AssetIcon
              name="icon-calendar-check-white"
              backgroundColor={adaptive.greyOpacity100}
            />
          }
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top="참여 기록"
              topProps={{ color: adaptive.grey700 }}
            />
          }
          verticalPadding="large"
          onClick={() => navigate({ to: '/my/history' })}
        />
        <ListRow
          left={
            <ListRow.AssetIcon
              name="icon-loudspeaker"
              backgroundColor={adaptive.greyOpacity100}
            />
          }
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top="공지사항"
              topProps={{ color: adaptive.grey700 }}
            />
          }
          onClick={() => navigate({ to: '/my/notice' })}
        />
        <ListRow
          left={
            <ListRow.AssetIcon
              name="icon-chat-bubble-question"
              backgroundColor={adaptive.greyOpacity100}
            />
          }
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top="가이드"
              topProps={{ color: adaptive.grey700 }}
            />
          }
          onClick={onGuideClick}
        />
        <ListRow
          left={
            <ListRow.AssetImage
              src="https://static.toss.im/2d-icons/emoji/png/4x/u1F4B0.png"
              shape="squircle"
              scale={0.66}
              backgroundColor={adaptive.greyOpacity100}
              size="small"
            />
          }
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top="결제 내역"
              topProps={{ color: adaptive.grey700 }}
            />
          }
          onClick={() => navigate({ to: ROUTES.MY_PAYMENT_HISTORY })}
        />
      </List>
    </>
  );
}
