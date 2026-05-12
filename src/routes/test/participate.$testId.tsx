import { createFileRoute } from "@tanstack/react-router";
import { ParticipatePage } from "@/features/test-participate/ui";

export const Route = createFileRoute("/test/participate/$testId")({
  component: function ParticipateRoute() {
    const { testId } = Route.useParams();
    return <ParticipatePage testId={Number(testId)} />;
  },
});
