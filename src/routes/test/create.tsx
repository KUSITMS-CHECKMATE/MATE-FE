import { createFileRoute } from '@tanstack/react-router'
import { TestCreateFunnel } from '@/features/test-create/ui/TestCreateFunnel'

export const Route = createFileRoute('/test/create')({
  validateSearch: (search: Record<string, unknown>) => ({
    payment: search.payment === true || search.payment === 'true',
  }),
  component: function TestCreateRoute() {
    const { payment } = Route.useSearch()
    return <TestCreateFunnel fromPayment={payment} />
  },
})
