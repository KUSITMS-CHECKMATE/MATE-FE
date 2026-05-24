import { Asset, Result, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { useNavigate } from "@tanstack/react-router";
import { TestCard } from "@/features/discovery/ui/TestCard";

const MOCK_TESTS = [
  {
    id: 1,
    title: "테스트명 한줄만 보이게아아아아아아",
    description: "테스트 한줄 소개 한줄만 보이게탈탈탈라탈리라라라라라라",
    reward: 300,
    thumbnailUrl:
      "https://static.toss.im/assets/homepage/tossapp/toss-app-main.png",
    liked: true,
  },
  {
    id: 2,
    title: "테스트명 한줄만 보이게",
    description: "테스트 한줄 소개 한줄만 보이게",
    reward: 300,
    thumbnailUrl: "",
    liked: true,
  },
  {
    id: 3,
    title: "테스트명 세 번째",
    description: "테스트 한줄 소개",
    reward: 150,
    thumbnailUrl:
      "https://static.toss.im/assets/homepage/tossapp/toss-app-main.png",
    liked: true,
  },
];

interface Props {
  onRetry?: () => void;
}

export function InterestList({ onRetry }: Props) {
  const navigate = useNavigate();
  const tests = MOCK_TESTS;

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
              title={test.title}
              description={test.description}
              reward={test.reward}
              thumbnailUrl={test.thumbnailUrl}
              liked={test.liked}
              onClick={() =>
                navigate({
                  to: "/interest/$testId",
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
          button={
            <Result.Button color="dark" variant="weak" onClick={onRetry}>
              다시 시도하기
            </Result.Button>
          }
        />
      )}
    </div>
  );
}
