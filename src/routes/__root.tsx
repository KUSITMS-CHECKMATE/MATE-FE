import { Outlet, createRootRoute } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib/queryClient'

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <Outlet />
      </div>
    </QueryClientProvider>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
