import { createFileRoute } from "@tanstack/react-router";
import { TestResultPage } from "@/features/test-result/ui";

export const Route = createFileRoute("/test/$testId")({
  component: function TestDetailRoute() {
    const { testId } = Route.useParams();
    return <TestResultPage testId={testId} status="ended" />;
  },
});
