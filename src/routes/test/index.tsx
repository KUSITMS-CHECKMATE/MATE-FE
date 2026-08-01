import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@toss/tds-mobile";
import { listMyTests } from "@/shared/api/generated/test";
import type { DraftTest, UserTest } from "@/features/test/model";
import { ServiceBanner } from "@/shared/ui/ServiceBanner";
import { TestCreateButton, TestList } from "@/features/test/ui";
import { BottomTabBar } from "@/shared/ui/BottomTabBar";
import { ROUTES } from "@/shared/constants/routes";
import { deleteDraft, listMyDrafts } from "@/shared/api/generated/testDraft";

const STATUS_MAP: Record<string, UserTest["status"]> = {
  IN_PROGRESS: "active",
  COMPLETED: "ended",
  WAITING: "waiting",
  REJECTED: "rejected",
};

// PUBLISHING/PUBLISHED는 발행 처리 중이거나 이미 실제 테스트로 존재하므로 노출하지 않는다
const DRAFT_STATUS_MAP: Record<string, DraftTest["status"] | undefined> = {
  DRAFT: "draft",
  PUBLISH_FAILED: "failed",
};

export const Route = createFileRoute("/test/")({
  component: MakerHomePage,
});

function MakerHomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openToast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["listMyTests"],
    queryFn: () => listMyTests(),
  });

  const { data: draftsData, isLoading: isDraftsLoading } = useQuery({
    queryKey: ["listMyDrafts"],
    queryFn: () => listMyDrafts(),
  });

  const { mutate: removeDraft } = useMutation({
    mutationFn: (draftId: number) => deleteDraft(draftId),
    onMutate: async (draftId: number) => {
      await queryClient.cancelQueries({ queryKey: ["listMyDrafts"] });

      const previousDrafts = queryClient.getQueryData<Awaited<ReturnType<typeof listMyDrafts>>>([
        "listMyDrafts",
      ]);

      queryClient.setQueryData<Awaited<ReturnType<typeof listMyDrafts>>>(["listMyDrafts"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              drafts: (old.data.data?.drafts ?? []).filter((draft) => draft.draftId !== draftId),
            },
          },
        };
      });

      return { previousDrafts };
    },
    onError: (_error, _draftId, context) => {
      if (context?.previousDrafts) {
        queryClient.setQueryData(["listMyDrafts"], context.previousDrafts);
      }
      openToast("초안 삭제에 실패했어요. 다시 시도해주세요.", { type: "bottom" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["listMyDrafts"] });
    },
  });

  const tests: UserTest[] = (data?.data?.data?.tests ?? []).map((item) => ({
    id: item.id ?? 0,
    title: item.title ?? "",
    participantCount: item.pplCount ?? 0,
    maxParticipantCount: item.goalPpl ?? 0,
    status: STATUS_MAP[item.testStatus ?? ""] ?? "ended",
  }));

  const drafts: DraftTest[] = (draftsData?.data?.data?.drafts ?? [])
    .map((item) => {
      const status = DRAFT_STATUS_MAP[item.status ?? ""];
      if (!status || item.draftId == null) return null;
      return {
        draftId: item.draftId,
        title: item.title || "제목 없는 테스트",
        status,
      };
    })
    .filter((item): item is DraftTest => item !== null);

  return (
    <div className="flex flex-col">
      <ServiceBanner />
      <TestList
        tests={tests}
        drafts={drafts}
        isLoading={isLoading || isDraftsLoading}
        onCardClick={(testId) =>
          navigate({ to: ROUTES.TEST_DETAIL, params: { testId: String(testId) } })
        }
        onResumeDraft={(draftId) =>
          navigate({ to: ROUTES.TEST_CREATE, search: { draftId, payment: false, resume: true } })
        }
        onDeleteDraft={(draftId) => removeDraft(draftId)}
        onFailedDraftClick={(draftId) =>
          navigate({ to: ROUTES.TEST_DRAFT_FAILED, params: { draftId: String(draftId) } })
        }
      />
      <TestCreateButton
        onClick={() =>
          navigate({ to: ROUTES.TEST_CREATE, search: { draftId: undefined, payment: false, resume: false } })
        }
      />

      <BottomTabBar activeTab="test" />
    </div>
  );
}
