import { createFileRoute } from "@tanstack/react-router";
import { PaymentFunnel } from "@/features/test-payment/ui/PaymentFunnel";

export const Route = createFileRoute("/test/payment")({
  validateSearch: (search: Record<string, unknown>) => ({
    draftId: Number(search.draftId),
  }),
  component: PaymentFunnel,
});
