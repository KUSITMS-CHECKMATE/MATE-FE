import { Asset, List, ListHeader, ListRow, Result, Top } from '@toss/tds-mobile';
import { adaptive } from '@toss/tds-colors';
import type { Notice } from '../model';

interface Props {
  notices: Notice[];
  onNoticeClick?: (id: number) => void;
}

export function MyNotice({ notices, onNoticeClick }: Props) {
  if (notices.length === 0) {
    return (
      <>
        <ListHeader
          descriptionPosition="bottom"
          rightAlignment="center"
          titleWidthRatio={0.6}
          title={
            <ListHeader.TitleParagraph color={adaptive.grey800} fontWeight="bold" typography="t4">
              공지사항
            </ListHeader.TitleParagraph>
          }
        />
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
        />
      </>
    );
  }

  return (
    <>
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            공지사항
          </Top.TitleParagraph>
        }
      />
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
            onClick={() => onNoticeClick?.(notice.id)}
          />
        ))}
      </List>
    </>
  );
}
