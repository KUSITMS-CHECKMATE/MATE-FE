import { createFileRoute } from '@tanstack/react-router';
import { MyNotice } from '@/features/my/ui';
import { mockNotices } from '@/features/my/model';

export const Route = createFileRoute('/my/notice')({
  component: NoticePage,
});

function NoticePage() {
  return <MyNotice notices={mockNotices} />;
}
