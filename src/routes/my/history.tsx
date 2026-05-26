import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/my/history')({
  component: () => <Outlet />,
});
