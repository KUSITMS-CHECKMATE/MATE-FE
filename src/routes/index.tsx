import { ServiceIntroPage } from "@/features/intro/ui/ServiceIntroPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: ServiceIntroPage,
});
