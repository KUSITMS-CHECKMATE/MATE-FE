import { Asset, Text, Result, Spacing, ListRow, List, Top, Border, Paragraph, Skeleton } from '@toss/tds-mobile';
import { adaptive } from '@toss/tds-colors';
import type { ParticipateRecord } from '../model';

interface Props {
  records: ParticipateRecord[];
  totalPoints: number;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onRecordClick?: (id: number) => void;
}

function HistorySkeleton() {
  return (
    <div className="flex flex-col gap-1 px-4 pt-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} custom={['title', 'subtitle']} repeatLastItemCount={0} />
      ))}
    </div>
  );
}

export function MyParticipateHistory({ records, totalPoints, isLoading = false, isError = false, onRetry, onRecordClick }: Props) {
  if (isLoading) {
    return <HistorySkeleton />;
  }

  if (isError) {
    return (
      <Result
        title="데이터를 불러오지 못했어요"
        description="잠시 후 다시 시도해 주세요"
        figure={
          <Asset.Lottie
            frameShape={Asset.frameShape.CleanW60}
            src="https://static.toss.im/lotties-common/empty-spot.json"
            aria-hidden={true}
          />
        }
        button={
          <Result.Button color="dark" variant="weak" onClick={onRetry}>
            다시 시도하기
          </Result.Button>
        }
      />
    );
  }

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
