import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Agentation, type Annotation } from 'agentation'
import { TDSMobileAITProvider } from '@toss/tds-mobile-ait'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import './index.css'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

async function saveAnnotationToSupabase(annotation: Annotation) {
  await fetch(`${SUPABASE_URL}/rest/v1/agentation_feedback`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify([{
      annotation_id: annotation.id,
      comment: annotation.comment,
      element: annotation.element,
      element_path: annotation.elementPath,
      url: annotation.url,
      markdown: annotation.comment,
    }]),
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TDSMobileAITProvider>
      <RouterProvider router={router} />
    </TDSMobileAITProvider>
    <Agentation onAnnotationAdd={saveAnnotationToSupabase} />
  </StrictMode>,
)