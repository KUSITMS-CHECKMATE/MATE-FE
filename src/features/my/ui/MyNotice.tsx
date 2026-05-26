import { Asset, List, ListRow, Result, Top } from '@toss/tds-mobile';
import { adaptive } from '@toss/tds-colors';
import type { Notice } from '../model';

interface Props {
  notices: Notice[];
}

export function MyNotice({ notices }: Props) {
  return (
    <>
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            공지사항
          </Top.TitleParagraph>
        }
      />
      {notices.length === 0 ? (
        <Result
          title="공지사항이 없어요"
          description=""
          figure={
            <Asset.Lottie
              frameShape={Asset.frameShape.CleanW60}
              src="https://static.toss.im/lotties-common/empty-spot.json"
              aria-hidden={true}
            />
          }
          button={
            <Result.Button color="dark" variant="weak">
              다시 시도하기
            </Result.Button>
          }
        />
      ) : (
        <List>
          {notices.map((notice) => (
            <ListRow
              key={notice.id}
              contents={
                <ListRow.Texts
                  type="2RowTypeA"
                  top={notice.title}
                  topProps={{ color: adaptive.grey800, fontWeight: 'semibold' }}
                  bottom={notice.publishedAt}
                  bottomProps={{ color: adaptive.grey600 }}
                />
              }
              horizontalPadding="small"
              arrowType="right"
            />
          ))}
        </List>
      )}
    </>
  );
}
