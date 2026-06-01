import { createFileRoute } from "@tanstack/react-router";
import { ParticipatePage } from "@/features/test-participate/ui";

export const Route = createFileRoute("/test/participate/$testId")({
  validateSearch: (search: Record<string, unknown>) => ({
    reward: search.reward != null ? Number(search.reward) : undefined,
  }),
  component: function ParticipateRoute() {
    const { testId } = Route.useParams();
    const { reward } = Route.useSearch();
    return <ParticipatePage testId={Number(testId)} reward={reward} />;
  },
});
