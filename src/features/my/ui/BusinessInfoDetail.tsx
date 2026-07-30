import { ListRow, Spacing, Top } from '@toss/tds-mobile';
import { adaptive } from '@toss/tds-colors';

const BUSINESS_INFO_CONTENT = `상호명 : 메이트

사업자등록번호: 564-18-02754

사업장 소재지: 경기도 수원시 영통구 중부대로 335

고객센터 연락처: 010-2674-1915

이메일: mateappintoss@gmail.com`;

export function BusinessInfoDetail() {
  return (
    <>
      <Spacing size={12} />
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            메이트 사업자정보
          </Top.TitleParagraph>
        }
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>2026. 07. 21</Top.SubtitleParagraph>
        }
        lowerGap={0}
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="1RowTypeA"
            top={<div className="whitespace-pre-line">{BUSINESS_INFO_CONTENT}</div>}
            topProps={{ color: adaptive.grey700 }}
          />
        }
        verticalPadding="large"
      />
    </>
  );
}
