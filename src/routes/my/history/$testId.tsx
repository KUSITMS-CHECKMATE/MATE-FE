import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { BottomCTA } from '@toss/tds-mobile';
import { getTest, getGetTestUrl } from '@/shared/api/generated/test';
import {
  TestDetailHeader,
  TestDetailImageCarousel,
  TestDetailInfo,
} from '@/features/discovery-detail/ui';

export const Route = createFileRoute('/my/history/$testId')({
  component: HistoryDetailPage,
});

function HistoryDetailPage() {
  const { testId } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: [getGetTestUrl(Number(testId))],
    queryFn: () => getTest(Number(testId)),
  });

  const detail = data?.data?.data as
    | {
        testStatus?: string;
        title?: string;
        categories?: string[];
        imageUrls?: string[];
        reward?: number;
        description?: string;
        serviceName?: string;
        serviceDescription?: string;
      }
    | undefined;

  if (isLoading || !detail) {
    return <div className="flex flex-col min-h-screen bg-white" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pb-17">
      <div className="flex-1 overflow-y-auto pb-22.5">
        <TestDetailHeader
          title={detail.title ?? ''}
          tags={detail.categories ?? []}
        />
        <TestDetailImageCarousel images={detail.imageUrls ?? []} />
        <TestDetailInfo
          reward={detail.reward ?? 0}
          description={detail.description ?? ''}
          serviceName={detail.serviceName ?? ''}
          serviceDescription={detail.serviceDescription ?? ''}
        />
      </div>

      <div className="fixed bottom-0 left-0 w-full">
        <BottomCTA.Single disabled>
          {detail.testStatus === 'ENDED' ? '종료된 설문이에요' : '테스트 참여하기'}
        </BottomCTA.Single>
      </div>
    </div>
  );
}
