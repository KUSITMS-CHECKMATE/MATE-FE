import { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { graniteEvent } from '@apps-in-toss/web-framework';
import { PaymentHistoryDetail } from '@/features/my/ui';
import { usePaymentHistory } from '@/features/my/model';
import { QA_MOCK_PAYMENT_HISTORY } from '@/features/my/model/qaMock';
import { useQaMockMode } from '@/shared/model/qaMockMode';

export const Route = createFileRoute('/my/payment-history')({
  component: PaymentHistoryPage,
});

function PaymentHistoryPage() {
  const qaMock = useQaMockMode((state) => state.enabled);
  const { data, isLoading, isError, refetch } = usePaymentHistory();

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    try {
      unsubscribe = graniteEvent.addEventListener('backEvent', {
        onEvent: () => {
          window.history.back();
        },
        onError: (error) => {
          console.error('backEvent error', error);
        },
      });
    } catch {
      console.warn('backEvent listener not supported in browser');
    }
    return () => {
      unsubscribe?.();
    };
  }, []);

  return (
    <PaymentHistoryDetail
      entries={qaMock ? QA_MOCK_PAYMENT_HISTORY : (data ?? [])}
      isLoading={qaMock ? false : isLoading}
      isError={qaMock ? false : isError}
      onRetry={refetch}
    />
  );
}
