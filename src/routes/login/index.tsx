import { createFileRoute } from "@tanstack/react-router";
import { AppLoginTestPage } from "@/features/login/ui";

export const Route = createFileRoute("/login/")({
  component: AppLoginTestPage,
});
