import { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { graniteEvent } from '@apps-in-toss/web-framework';
import { PaymentHistoryDetail } from '@/features/my/ui';
import { usePaymentHistory } from '@/features/my/model';

export const Route = createFileRoute('/my/payment-history')({
  component: PaymentHistoryPage,
});

function PaymentHistoryPage() {
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
      entries={data ?? []}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
    />
  );
}
