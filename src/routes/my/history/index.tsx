import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { MyParticipateHistory } from '@/features/my/ui';
import { mockParticipateRecords, mockMyUser } from '@/features/my/model';

export const Route = createFileRoute('/my/history/')({
  component: HistoryPage,
});

function HistoryPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <MyParticipateHistory
        records={mockParticipateRecords}
        totalPoints={mockMyUser.points}
        onRecordClick={(id) => navigate({ to: '/my/history/$testId', params: { testId: String(id) } })}
      />
    </div>
  );
}
