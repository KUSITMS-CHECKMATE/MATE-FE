import { Asset, Result, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { useNavigate } from "@tanstack/react-router";
import { TestCard } from "./TestCard";

interface Test {
  id: number;
  title: string;
  description: string;
  reward: number;
  thumbnailUrl: string;
}

interface Props {
  tests: Test[];
}

export function TestList({ tests }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <div className="flex px-4 pt-6 pb-3 gap-1">
        <Text color={adaptive.grey800} typography="t4" fontWeight="bold">
          참여 가능 테스트
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
              title={test.title}
              description={test.description}
              reward={test.reward}
              thumbnailUrl={test.thumbnailUrl}
              onClick={() =>
                navigate({
                  to: "/discovery/$testId",
                  params: { testId: String(test.id) },
                })
              }
            />
          ))}
        </div>
      ) : (
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
            <Result.Button color="dark" variant="weak">
              다시 시도하기
            </Result.Button>
          }
        />
      )}
    </div>
  );
}
