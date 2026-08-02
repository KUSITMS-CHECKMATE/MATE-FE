import {
  Asset,
  List,
  ListHeader,
  ListRow,
  Paragraph,
  Result,
  Skeleton,
  Spacing,
} from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import type { PaymentHistoryEntry } from "../model";

const ListHeaderTitleParagraph = ListHeader.TitleParagraph;

interface Props {
  entries: PaymentHistoryEntry[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onEntryClick?: (entry: PaymentHistoryEntry) => void;
}

function toKRW(amount: number): string {
  return `${amount.toLocaleString()}원`;
}

function PaymentHistorySkeleton() {
  return (
    <div className="flex flex-col gap-1 px-4 pt-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} custom={["title", "subtitle"]} repeatLastItemCount={0} />
      ))}
    </div>
  );
}

export function PaymentHistoryDetail({
  entries,
  isLoading = false,
  isError = false,
  onRetry,
  onEntryClick,
}: Props) {
  if (isLoading) {
    return <PaymentHistorySkeleton />;
  }

  if (isError) {
    return (
      <Result
        title="결제 내역을 불러오지 못했어요"
        description="잠시 후 다시 시도해 주세요"
        figure={
          <Asset.Lottie
            frameShape={Asset.frameShape.CleanW60}
            src="https://static.toss.im/lotties-common/error-spot.json"
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

  if (entries.length === 0) {
    return (
      <>
        <Spacing size={48} />
        <Result
          title="결제 내역이 없어요"
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
    <List>
      <ListHeader
        size="large"
        horizontalPadding="medium"
        verticalPadding="medium"
        descriptionPosition="bottom"
        rightAlignment="center"
        a11yRightReflow={false}
        titleWidthRatio={0.6}
        title={
          <ListHeaderTitleParagraph color={adaptive.grey800} fontWeight="bold" typography="t4">
            결제내역
          </ListHeaderTitleParagraph>
        }
      />

      {entries.map((entry) => {
        // 결제완료 상태만 정상 진행중인 결제로 보고, 그 외(취소/실패/환불 등)는 흐리게 + 취소선 처리한다.
        const isCancelled = entry.status !== "결제완료";
        const textColor = isCancelled ? adaptive.grey500 : adaptive.grey800;
        const canOpenTestDetail = entry.testId != null && entry.testStatus != null;

        return (
          <div key={entry.id}>
            <ListHeader
              size="small"
              horizontalPadding="medium"
              verticalPadding="small"
              descriptionPosition="bottom"
              rightAlignment="center"
              a11yRightReflow={false}
              titleWidthRatio={0.6}
              title={
                <ListHeader.TitleParagraph color={adaptive.grey800}>
                  {entry.date}
                </ListHeader.TitleParagraph>
              }
              right={
                <ListHeader.RightText color={adaptive.grey600}>{entry.status}</ListHeader.RightText>
              }
            />
            <div
              className="mx-4 mb-3 rounded-2xl overflow-hidden"
              style={{ backgroundColor: "rgba(0, 23, 51, 0.02)" }}
            >
              <ListHeader
                size="xsmall"
                horizontalPadding="small"
                verticalPadding="small"
                descriptionPosition="bottom"
                rightAlignment="center"
                a11yRightReflow={false}
                titleWidthRatio={0.2}
                title={
                  <ListHeader.TitleParagraph color={adaptive.grey800}>
                    주문번호
                  </ListHeader.TitleParagraph>
                }
                right={
                  <ListHeader.RightText color={adaptive.grey600}>
                    {entry.orderNo}
                  </ListHeader.RightText>
                }
              />
              <ListRow
                left={<ListRow.ImageContainer type="square" border={false} />}
                contents={
                  <ListRow.Texts
                    type="1RowTypeA"
                    top={entry.testTitle}
                    topProps={{ color: textColor }}
                  />
                }
                verticalPadding="small"
                horizontalPadding="small"
                onClick={canOpenTestDetail ? () => onEntryClick?.(entry) : undefined}
              />
              <ListRow
                left={
                  <ListRow.AssetIcon
                    size="xsmall"
                    shape="original"
                    name="icon-money-bag-green-weak"
                  />
                }
                contents={
                  <ListRow.Texts
                    type="1RowTypeA"
                    top={
                      isCancelled ? (
                        <Paragraph.Text>
                          <span style={{ textDecoration: "line-through" }}>결제 금액</span>
                        </Paragraph.Text>
                      ) : (
                        "결제 금액"
                      )
                    }
                    topProps={{ color: textColor }}
                  />
                }
                right={
                  <ListRow.Texts
                    type="Right1RowTypeE"
                    top={
                      isCancelled ? (
                        <Paragraph.Text>
                          <span style={{ textDecoration: "line-through" }}>
                            {toKRW(entry.amount)}
                          </span>
                        </Paragraph.Text>
                      ) : (
                        toKRW(entry.amount)
                      )
                    }
                    topProps={{ color: textColor }}
                  />
                }
                verticalPadding="large"
                horizontalPadding="small"
              />
            </div>
          </div>
        );
      })}
    </List>
  );
}
