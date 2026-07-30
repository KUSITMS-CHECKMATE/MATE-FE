import { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { graniteEvent } from '@apps-in-toss/web-framework';
import { NoticeDetail } from '@/features/my/ui';
import { mockNotices } from '@/features/my/model';

export const Route = createFileRoute('/my/notice/$noticeId')({
  component: NoticeDetailPage,
});

function NoticeDetailPage() {
  const { noticeId } = Route.useParams();

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

  const notice = mockNotices.find((n) => n.id === Number(noticeId));

  if (!notice) {
    return <div className="flex flex-col min-h-screen bg-white" />;
  }

  return <NoticeDetail notice={notice} />;
}
