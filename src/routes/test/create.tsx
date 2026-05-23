import { createFileRoute } from '@tanstack/react-router'
import { TestCreateFunnel } from '@/features/test-create/ui/TestCreateFunnel'

export const Route = createFileRoute('/test/create')({
  component: TestCreateFunnel,
})
