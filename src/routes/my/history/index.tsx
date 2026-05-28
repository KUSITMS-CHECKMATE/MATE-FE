import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { MyParticipateHistory } from '@/features/my/ui';
import { useMyParticipateHistory } from '@/features/my/model';

export const Route = createFileRoute('/my/history/')({
  component: HistoryPage,
});

function HistoryPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useMyParticipateHistory();

  return (
    <div className="flex flex-col">
      <MyParticipateHistory
        records={data?.records ?? []}
        totalPoints={data?.totalPoints ?? 0}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onRecordClick={(id) => navigate({ to: '/my/history/$testId', params: { testId: String(id) } })}
      />
    </div>
  );
}
