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
      url: annotation.url ?? window.location.href,
      markdown: annotation.comment,
      x: annotation.x,
      y: annotation.y,
      timestamp: annotation.timestamp,
      selected_text: annotation.selectedText,
      bounding_box: annotation.boundingBox,
      nearby_text: annotation.nearbyText,
      css_classes: annotation.cssClasses,
      nearby_elements: annotation.nearbyElements,
      computed_styles: annotation.computedStyles,
      full_path: annotation.fullPath,
      accessibility: annotation.accessibility,
      is_multi_select: annotation.isMultiSelect,
      is_fixed: annotation.isFixed,
      react_components: annotation.reactComponents,
      source_file: annotation.sourceFile,
      drawing_index: annotation.drawingIndex,
      element_bounding_boxes: annotation.elementBoundingBoxes,
      kind: annotation.kind,
      placement: annotation.placement,
      rearrange: annotation.rearrange,
      session_id: annotation.sessionId,
      intent: annotation.intent,
      severity: annotation.severity,
      status: annotation.status,
      thread: annotation.thread,
      annotation_created_at: annotation.createdAt,
      annotation_updated_at: annotation.updatedAt,
      annotation_resolved_at: annotation.resolvedAt,
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