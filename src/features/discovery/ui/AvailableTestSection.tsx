import { Asset, Result, Skeleton, Spacing } from "@toss/tds-mobile";
import type { DiscoveryTest } from "../model";
import { AvailableTestCard } from "./AvailableTestCard";
import { MoreFooter } from "./MoreFooter";
import { SectionHeader } from "./SectionHeader";

const SKELETON_COUNT = 3;

interface Props {
  tests: DiscoveryTest[];
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  onRetry: () => void;
  onLoadMore: () => void;
  onSelect: (testId: number) => void;
}

export function AvailableTestSection({ tests, isLoading, isError, hasMore, onRetry, onLoadMore, onSelect }: Props) {
  return (
    <section className="flex flex-col">
      <SectionHeader
        title="테스트 참여하고 리워드 받아가기 어때요?"
        description="리워드는 토스뱅크에 바로 지급돼요"
        iconSrc="https://static.toss.im/2d-icons/color/png/4x/icon-alltab-finance-grey.png"
      />

      {isLoading ? (
        <div className="flex flex-col gap-3 px-6 pt-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <Skeleton key={i} custom={["card"]} repeatLastItemCount={0} background="greyOpacity100" />
          ))}
        </div>
      ) : isError ? (
        <Result
          title="테스트 목록을 불러오지 못했어요"
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
      ) : tests.length === 0 ? (
        <Result
          title="참여할 수 있는 테스트가 없어요"
          description="참여 가능한 테스트가 생기면 알려드릴게요"
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
      ) : (
        <>
          <div className="flex flex-col gap-3 px-6 pt-3">
            {tests.map((test) => (
              <AvailableTestCard key={test.id} test={test} onClick={() => onSelect(test.id)} />
            ))}
          </div>
          {hasMore && (
            <>
              <Spacing size={16} />
              <MoreFooter onClick={onLoadMore} />
            </>
          )}
        </>
      )}
    </section>
  );
}
