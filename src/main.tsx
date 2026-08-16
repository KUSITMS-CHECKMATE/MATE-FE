import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TDSMobileAITProvider } from '@toss/tds-mobile-ait'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { initAnalytics, trackPageView } from './shared/lib/analytics'
import './index.css'

initAnalytics()

const router = createRouter({ routeTree })

router.subscribe('onResolved', ({ toLocation }) => {
  trackPageView(toLocation.href)
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TDSMobileAITProvider>
      <RouterProvider router={router} />
    </TDSMobileAITProvider>
  </StrictMode>,
)
