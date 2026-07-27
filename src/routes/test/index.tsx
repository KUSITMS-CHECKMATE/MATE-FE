import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { listMyTests } from "@/shared/api/generated/test";
import type { UserTest } from "@/features/test/model";
import { ServiceBanner } from "@/shared/ui/ServiceBanner";
import { TestCreateButton, TestList } from "@/features/test/ui";
import { BottomTabBar } from "@/shared/ui/BottomTabBar";
import { ROUTES } from "@/shared/constants/routes";
import { createDraft, listMyDrafts } from "@/shared/api/generated/testDraft";

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
    // 서버에 임시저장된(DRAFT 상태) 초안 중 가장 최근 것이 있으면 이어서 작성, 없으면 새 초안 생성
    mutationFn: async () => {
      const listRes = await listMyDrafts();
      const drafts = listRes.data.data?.drafts ?? [];
      const latestDraft = drafts.find((draft) => draft.status === "DRAFT");
      if (latestDraft?.draftId != null) {
        return { draftId: latestDraft.draftId, resume: true };
      }
      const res = await createDraft();
      return { draftId: res.data.data?.draftId, resume: false };
    },
    onSuccess: ({ draftId, resume }) => {
      if (!draftId) return;
      navigate({ to: ROUTES.TEST_CREATE, search: { draftId, payment: false, resume } });
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
      <ServiceBanner />
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
