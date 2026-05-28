import { useQuery } from "@tanstack/react-query";
import { Asset, Result, Skeleton, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { useNavigate } from "@tanstack/react-router";
import { listLikedTests, getListLikedTestsUrl } from "@/shared/api/generated/test";
import { TestCard } from "@/shared/ui/TestCard";
import { ROUTES } from "@/shared/constants/routes";

export function InterestList() {
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [getListLikedTestsUrl()],
    queryFn: () => listLikedTests(),
  });

  const tests = (data?.data?.data?.tests ?? []).filter(
    (test): test is typeof test & { id: number } => test.id !== undefined
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 px-4 pt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} custom={["card", "title", "subtitle"]} repeatLastItemCount={0} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-6">
        <Result
          title="목록을 불러오지 못했어요"
          description="잠시 후 다시 시도해 주세요"
          figure={
            <Asset.Lottie
              frameShape={Asset.frameShape.CleanW60}
              src="https://static.toss.im/lotties-common/error-spot.json"
              aria-hidden={true}
            />
          }
          button={
            <Result.Button color="dark" variant="weak" onClick={() => refetch()}>
              다시 시도하기
            </Result.Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex px-4 pt-6 pb-3 gap-1">
        <Text color={adaptive.grey800} typography="t4" fontWeight="bold">
          관심
        </Text>
        <Text color="#4365cc" typography="t4" fontWeight="bold">
          {tests.length}
        </Text>
      </div>

      {tests.length > 0 ? (
        <div className="flex flex-col gap-3 px-4">
          {tests.map((test) => (
            <TestCard
              key={test.id}
              id={test.id}
              title={test.title ?? ""}
              description={test.description ?? ""}
              reward={test.reward ?? 0}
              thumbnailUrl={test.thumbnailUrl ?? ""}
              liked={true}
              onClick={() =>
                navigate({
                  to: ROUTES.INTEREST_DETAIL,
                  params: { testId: String(test.id) },
                })
              }
            />
          ))}
        </div>
      ) : (
        <Result
          title="관심 있는 테스트가 없어요"
          description="발견 탭에서 테스트를 둘러볼까요?"
          figure={
            <Asset.Lottie
              frameShape={Asset.frameShape.CleanW60}
              src="https://static.toss.im/lotties-common/empty-spot.json"
              aria-hidden={true}
            />
          }
          button={undefined}
        />
      )}
    </div>
  );
}
