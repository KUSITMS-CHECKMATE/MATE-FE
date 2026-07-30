import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { graniteEvent } from '@apps-in-toss/web-framework';
import { MyParticipateHistory } from '@/features/my/ui';
import { useMyParticipateHistory } from '@/features/my/model';

export const Route = createFileRoute('/my/history/')({
  component: HistoryPage,
});

function HistoryPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useMyParticipateHistory();

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
    <div className="flex flex-col">
      <MyParticipateHistory
        records={data?.records ?? []}
        totalPoints={data?.totalPoints ?? 0}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onRecordClick={(id) => navigate({ to: '/discovery/$testId', params: { testId: String(id) } })}
      />
    </div>
  );
}
