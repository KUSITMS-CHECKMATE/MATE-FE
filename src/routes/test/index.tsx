import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { listMyTests } from "@/shared/api/generated/test";
import type { UserTest } from "@/features/test/model";
import { TestBanner, TestCreateButton, TestList } from "@/features/test/ui";
import { BottomTabBar } from "@/shared/ui/BottomTabBar";
import { ROUTES } from "@/shared/constants/routes";
import { createDraft } from "@/shared/api/generated/testDraft";

const STATUS_MAP: Record<string, UserTest["status"]> = {
  IN_PROGRESS: "active",
  COMPLETED: "ended",
  WAITING: "waiting",
  REJECTED: "rejected",
};

export const Route = createFileRoute("/test/")({
  component: MakerHomePage,
});

function MakerHomePage() {
  const navigate = useNavigate();
  const { mutate: initDraft, isPending } = useMutation({
    mutationFn: createDraft,
    onSuccess: (res) => {
      const draftId = res.data.data?.draftId;
      if (!draftId) return;
      navigate({ to: ROUTES.TEST_CREATE, search: { draftId, payment: false } });
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["listMyTests"],
    queryFn: () => listMyTests(),
  });

  const tests: UserTest[] = (data?.data?.data?.tests ?? []).map((item) => ({
    id: item.id ?? 0,
    title: item.title ?? "",
    participantCount: item.pplCount ?? 0,
    maxParticipantCount: item.goalPpl ?? 0,
    status: STATUS_MAP[item.testStatus ?? ""] ?? "ended",
  }));

  return (
    <div className="flex flex-col">
      <TestBanner />
      <TestList
        tests={tests}
        isLoading={isLoading}
        onCardClick={(testId) =>
          navigate({ to: ROUTES.TEST_DETAIL, params: { testId: String(testId) } })
        }
      />
      <TestCreateButton onClick={() => initDraft(undefined)} disabled={isPending} />

      <BottomTabBar activeTab="test" />
    </div>
  );
}
