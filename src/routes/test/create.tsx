import { createFileRoute, useSearch } from '@tanstack/react-router'
import { TestCreateFunnel } from '@/features/test-create/ui/TestCreateFunnel'

export const Route = createFileRoute('/test/create')({
  component: function TestCreateRoute() {
    const search = useSearch({ strict: false }) as { payment?: boolean | string }
    const fromPayment = search.payment === true || search.payment === 'true'
    return <TestCreateFunnel fromPayment={fromPayment} />
  },
})
