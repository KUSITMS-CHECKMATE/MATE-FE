import { useNavigate } from '@tanstack/react-router';
import { Text, List, ListRow, Spacing } from '@toss/tds-mobile';
import { adaptive } from '@toss/tds-colors';

export function MyHelpSection() {
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
          onClick={() => navigate({ to: '/my/history/' })}
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
        />
        <ListRow
          left={
            <ListRow.AssetIcon
              name="icon-headphone-slim-mono"
              color={adaptive.teal500}
              backgroundColor={adaptive.greyOpacity100}
            />
          }
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top="문의하기"
              topProps={{ color: adaptive.grey700 }}
            />
          }
        />
      </List>
    </>
  );
}
