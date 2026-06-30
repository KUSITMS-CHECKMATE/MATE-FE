import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Providers } from '@/providers'

function RootComponent() {
  return (
    <Providers>
      <div className="min-h-screen">
        <Outlet />
      </div>
    </Providers>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
