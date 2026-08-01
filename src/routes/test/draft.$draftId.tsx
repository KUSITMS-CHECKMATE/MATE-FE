import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { graniteEvent } from "@apps-in-toss/web-framework";
import { FailedDraftDetail } from "@/features/test/ui";

export const Route = createFileRoute("/test/draft/$draftId")({
  component: FailedDraftPage,
});

function FailedDraftPage() {
  const { draftId } = Route.useParams();

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    try {
      unsubscribe = graniteEvent.addEventListener("backEvent", {
        onEvent: () => {
          window.history.back();
        },
        onError: (error) => {
          console.error("backEvent error", error);
        },
      });
    } catch {
      console.warn("backEvent listener not supported in browser");
    }
    return () => {
      unsubscribe?.();
    };
  }, []);

  return <FailedDraftDetail draftId={Number(draftId)} />;
}
