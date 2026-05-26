import { Asset, Text, Result, Spacing, ListRow, List, Top, Border, Paragraph } from '@toss/tds-mobile';
import { adaptive } from '@toss/tds-colors';
import type { ParticipateRecord } from '../model';

interface Props {
  records: ParticipateRecord[];
  totalPoints: number;
  onRecordClick?: (id: number) => void;
}

export function MyParticipateHistory({ records, totalPoints, onRecordClick }: Props) {
  return (
    <>
      <Top
        title={
          <Top.TitleParagraph size={28} color={adaptive.grey900}>
            {totalPoints.toLocaleString()}원
          </Top.TitleParagraph>
        }
        subtitleTop={
          <Top.SubtitleParagraph size={15}>지금까지 모은 머니</Top.SubtitleParagraph>
        }
      />
      <Border variant="height16" />
    <div className="flex flex-col">
      <div className="px-4 pt-6 pb-3">
        <Text color={adaptive.grey800} typography="t4" fontWeight="bold">
          참여 기록
        </Text>
      </div>

      {records.length === 0 ? (
        <>
          <Spacing size={24} />
          <Result
            title="참여 기록이 없어요"
            description="발견 탭에서 테스트를 둘러볼까요?"
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
        </>
      ) : (
        <List>
          {records.map((record) => (
            <ListRow
              key={record.id}
              contents={
                <ListRow.Texts
                  type="2RowTypeA"
                  top={record.title}
                  topProps={{ color: adaptive.grey800, fontWeight: 'semibold' }}
                  bottom={record.participatedAt}
                  bottomProps={{ color: adaptive.grey600 }}
                />
              }
              right={
                <ListRow.Texts
                  type="Right1RowTypeA"
                  top={<Paragraph.Text>{record.earnedAmount}</Paragraph.Text>}
                  topProps={{ color: adaptive.grey700 }}
                />
              }
              verticalPadding="large"
              onClick={() => onRecordClick?.(record.id)}
            />
          ))}
        </List>
      )}
    </div>
    </>
  );
}
