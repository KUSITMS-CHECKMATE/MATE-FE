import { Asset, Result, Skeleton, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import type { DraftTest, UserTest } from "../model";
import { TestCard } from "./TestCard";

interface Props {
  tests: UserTest[];
  drafts?: DraftTest[];
  isLoading?: boolean;
  onCardClick?: (testId: number) => void;
  onResumeDraft?: (draftId: number) => void;
  onDeleteDraft?: (draftId: number) => void;
}

function TestListSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="w-full bg-white px-6 py-6">
        <Skeleton custom={["title"]} repeatLastItemCount={0} background="greyOpacity100" />
      </div>
      <div className="flex flex-col gap-3 px-4 pb-24">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            custom={["title", "subtitle"]}
            repeatLastItemCount={0}
            background="greyOpacity100"
          />
        ))}
      </div>
    </div>
  );
}

export function TestList({
  tests,
  drafts = [],
  isLoading = false,
  onCardClick,
  onResumeDraft,
  onDeleteDraft,
}: Props) {
  if (isLoading) {
    return <TestListSkeleton />;
  }

  const totalCount = tests.length + drafts.length;

  return (
    <div className="flex flex-col">
      <div className="w-full bg-white px-6 py-6 flex flex-row gap-1">
        <Text color={adaptive.grey800} typography="t4" fontWeight="bold">
          내 테스트
        </Text>
        <Text color="#4365cc" typography="t4" fontWeight="bold">
          {totalCount}
        </Text>
      </div>

      <div>
        {totalCount > 0 ? (
          <div className="flex flex-col gap-3 px-4 pb-24">
            {drafts.map((draft) => (
              <TestCard
                key={`draft-${draft.draftId}`}
                title={draft.title}
                status={draft.status}
                onResume={() => onResumeDraft?.(draft.draftId)}
                onDelete={() => onDeleteDraft?.(draft.draftId)}
              />
            ))}
            {tests.map((test) => (
              <TestCard
                key={test.id}
                title={test.title}
                participantCount={test.participantCount}
                maxParticipantCount={test.maxParticipantCount}
                status={test.status}
                onClick={() => onCardClick?.(test.id)}
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
