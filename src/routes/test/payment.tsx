import { createFileRoute } from "@tanstack/react-router";
import { PaymentFunnel } from "@/features/test-payment/ui/PaymentFunnel";

export const Route = createFileRoute("/test/payment")({
  component: PaymentFunnel,
});
