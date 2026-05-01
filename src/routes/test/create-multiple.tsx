import { createFileRoute } from "@tanstack/react-router";
import { MultipleCreatePage } from "@/features/test-multiple/ui";

export const Route = createFileRoute("/test/create-multiple")({
  component: MultipleCreatePage,
});
