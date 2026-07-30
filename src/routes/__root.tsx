import { useEffect } from 'react'
import { Outlet, createRootRoute, useNavigate } from '@tanstack/react-router'
import { graniteEvent } from '@apps-in-toss/web-framework'
import { Providers } from '@/providers'
import { ROUTES } from '@/shared/constants/routes'

function RootComponent() {
  const navigate = useNavigate()

  useEffect(() => {
    let unsubscribe: (() => void) | null = null
    try {
      unsubscribe = graniteEvent.addEventListener('homeEvent', {
        onEvent: () => {
          navigate({ to: ROUTES.DISCOVERY })
        },
        onError: (error) => {
          console.error('homeEvent error', error)
        },
      })
    } catch {
      console.warn('homeEvent listener not supported in browser')
    }
    return () => {
      unsubscribe?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
