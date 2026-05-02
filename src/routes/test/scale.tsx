import { createFileRoute } from '@tanstack/react-router'
import { ScaleCreatePage } from '@/features/test-scale/ui/ScaleCreatePage'

export const Route = createFileRoute('/test/scale')({
  component: ScaleCreatePage,
})
