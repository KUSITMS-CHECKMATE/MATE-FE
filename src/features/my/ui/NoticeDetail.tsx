import { ListRow, Spacing, Top } from '@toss/tds-mobile';
import { adaptive } from '@toss/tds-colors';
import type { Notice } from '../model';

interface Props {
  notice: Notice;
}

export function NoticeDetail({ notice }: Props) {
  return (
    <>
      <Spacing size={12} />
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            {notice.title}
          </Top.TitleParagraph>
        }
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>{notice.publishedAt}</Top.SubtitleParagraph>
        }
        lowerGap={0}
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="1RowTypeA"
            top={<div className="whitespace-pre-line">{notice.content}</div>}
            topProps={{ color: adaptive.grey700 }}
          />
        }
        verticalPadding="large"
      />
    </>
  );
}
