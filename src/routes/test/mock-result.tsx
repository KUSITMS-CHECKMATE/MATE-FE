import { createFileRoute } from "@tanstack/react-router";
import { ResultTabContent } from "@/features/test-result/ui/ResultTabContent";
import { MOCK_RESULTS } from "@/features/test-result/model/mock";

export const Route = createFileRoute("/test/mock-result")({
  component: function MockResultPreview() {
    return <ResultTabContent results={MOCK_RESULTS} />;
  },
});
