import { createFileRoute } from '@tanstack/react-router'
import { TestCreateFunnel } from '@/features/test-create/ui/TestCreateFunnel'

export const Route = createFileRoute('/test/create')({
  validateSearch: (search: Record<string, unknown>) => ({
    draftId: search.draftId != null ? Number(search.draftId) : undefined as number | undefined,
    payment: search.payment === true || search.payment === 'true',
  }),
  component: function TestCreateRoute() {
    const { draftId, payment: fromPayment } = Route.useSearch()
    return <TestCreateFunnel draftId={draftId} fromPayment={fromPayment} />
  },
})
