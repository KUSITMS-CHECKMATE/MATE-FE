import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Asset } from '@toss/tds-mobile';
import { MyTestDetail } from '@/features/my/ui';
import { mockTestDetails } from '@/features/my/model';

export const Route = createFileRoute('/my/history/$testId')({
  component: HistoryDetailPage,
});

function HistoryDetailPage() {
  const navigate = useNavigate();
  const { testId } = Route.useParams();
  const test = mockTestDetails[Number(testId)];

  if (!test) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <MyTestDetail test={test} />
    </div>
  );
}
