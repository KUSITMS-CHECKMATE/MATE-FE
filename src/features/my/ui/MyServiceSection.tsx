import { Text, List, ListRow, Spacing } from '@toss/tds-mobile';
import { adaptive } from '@toss/tds-colors';

export function MyServiceSection() {
  return (
    <>
      <Spacing size={23} />
      <div className="px-6">
        <Text color={adaptive.grey800} typography="t6" fontWeight="bold">
          서비스 정보
        </Text>
      </div>
      <Spacing size={11} />
      <List>
        <ListRow
          left={
            <ListRow.AssetIcon
              name="icon-government-search-dark"
              backgroundColor={adaptive.greyOpacity100}
            />
          }
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top="정책"
              topProps={{ color: adaptive.grey700 }}
            />
          }
        />
        <ListRow
          left={
            <ListRow.AssetIcon
              name="icon-lock"
              backgroundColor={adaptive.greyOpacity100}
            />
          }
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top="개인정보처리방침"
              topProps={{ color: adaptive.grey700 }}
            />
          }
        />
        <ListRow
          left={
            <ListRow.AssetIcon
              name="icon-store-roof-blue-no-door"
              backgroundColor={adaptive.greyOpacity100}
            />
          }
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top="메이트 사업자정보"
              topProps={{ color: adaptive.grey700 }}
            />
          }
        />
      </List>
      <Spacing size={19} />
    </>
  );
}
