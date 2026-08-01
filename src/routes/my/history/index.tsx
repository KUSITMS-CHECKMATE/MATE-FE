import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { graniteEvent } from '@apps-in-toss/web-framework';
import { MyParticipateHistory } from '@/features/my/ui';
import { useMyParticipateHistory } from '@/features/my/model';
import { useQaMockMode } from '@/shared/model/qaMockMode';
import { QA_MOCK_PARTICIPATE_RECORDS, QA_MOCK_PARTICIPATE_TOTAL_POINTS } from '@/features/my/model/qaMock';

export const Route = createFileRoute('/my/history/')({
  component: HistoryPage,
});

function HistoryPage() {
  const navigate = useNavigate();
  const qaMock = useQaMockMode((state) => state.enabled);
  const { data, isLoading, isError, refetch } = useMyParticipateHistory({ enabled: !qaMock });

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
        records={qaMock ? QA_MOCK_PARTICIPATE_RECORDS : data?.records ?? []}
        totalPoints={qaMock ? QA_MOCK_PARTICIPATE_TOTAL_POINTS : data?.totalPoints ?? 0}
        isLoading={qaMock ? false : isLoading}
        isError={qaMock ? false : isError}
        onRetry={refetch}
        onRecordClick={(id) => navigate({ to: '/discovery/$testId', params: { testId: String(id) } })}
      />
    </div>
  );
}
