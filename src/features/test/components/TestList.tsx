import { Asset, Result, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { TestCard } from "./TestCard";

interface Test {
  id: number;
  title: string;
  participantCount: number;
  maxParticipantCount: number;
  status: "active" | "ended";
}

type Props = {
  tests: Test[];
};

export function TestList({ tests }: Props) {
  return (
    <div className="flex flex-col">
      <div className="w-full bg-white px-6 py-6 flex flex-row gap-1">
        <Text color={adaptive.grey800} typography="t4" fontWeight="bold">
          내 테스트
        </Text>
        <Text color="#4365cc" typography="t4" fontWeight="bold">
          {tests.length}
        </Text>
      </div>

      <div>
        {tests.length > 0 ? (
          <div className="flex flex-col gap-3 px-4 pb-24">
            {tests.map((test) => (
              <TestCard
                key={test.id}
                title={test.title}
                participantCount={test.participantCount}
                maxParticipantCount={test.maxParticipantCount}
                status={test.status}
              />
            ))}
          </div>
        ) : (
          <Result
            title="등록한 테스트가 없어요"
            description="테스트를 등록하고 유저 피드백을 받아봐요"
            figure={
              <Asset.Lottie
                frameShape={Asset.frameShape.CleanW60}
                src="https://static.toss.im/lotties-common/empty-spot.json"
                aria-hidden={true}
              />
            }
          />
        )}
      </div>
    </div>
  );
}
