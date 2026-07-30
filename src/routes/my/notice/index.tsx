import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { graniteEvent } from '@apps-in-toss/web-framework';
import { MyNotice } from '@/features/my/ui';
import { mockNotices } from '@/features/my/model';
import { useQaMockMode } from '@/shared/model/qaMockMode';
import { QA_MOCK_NOTICES } from '@/features/my/model/qaMock';

export const Route = createFileRoute('/my/notice/')({
  component: NoticePage,
});

function NoticePage() {
  const navigate = useNavigate();
  const qaMock = useQaMockMode((state) => state.enabled);

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
    <MyNotice
      notices={qaMock ? QA_MOCK_NOTICES : mockNotices}
      onNoticeClick={(id) => navigate({ to: '/my/notice/$noticeId', params: { noticeId: String(id) } })}
    />
  );
}
