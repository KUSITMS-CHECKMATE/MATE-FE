import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Providers } from '@/providers'
import { AuthGuard } from '@/features/login/ui/AuthGuard'

function RootComponent() {
  return (
    <Providers>
      <AuthGuard>
        <div className="min-h-screen">
          <Outlet />
        </div>
      </AuthGuard>
    </Providers>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
