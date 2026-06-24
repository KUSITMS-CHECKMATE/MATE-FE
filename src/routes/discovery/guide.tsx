import { createFileRoute } from "@tanstack/react-router";
import { GuidePage } from "@/features/intro/ui/GuidePage";

export const Route = createFileRoute("/discovery/guide")({
  component: GuidePage,
});
