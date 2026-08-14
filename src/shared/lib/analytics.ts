declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

export function trackPageView(path: string) {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return

  window.gtag('event', 'page_view', {
    page_path: path,
    send_to: GA_MEASUREMENT_ID,
  })
}

export type UserRole = 'tester' | 'maker' | 'general'

export interface AnalyticsEventParams {
  sign_up: { method: string }
  login: { method: string }
  view_item_list: { list_name: string }
  view_item: { test_id: string; test_category?: string }
  search: { search_term: string }
  add_to_wishlist: { test_id: string }
  remove_from_wishlist: { test_id: string }
  join_test: { test_id: string; reward_amount?: number }
  test_start: { test_id: string }
  test_exit: { test_id: string; exit_step?: string; progress_rate?: number; duration?: number }
  test_complete: { test_id: string; duration?: number }
  reward_granted: { test_id: string; reward_amount?: number }
  create_test_start: Record<string, never>
  create_test_exit: { test_type?: string; exit_step?: string; progress_rate?: number }
  create_test: { test_id: string; test_type?: string; target_count?: number }
  test_intro_prompt_view: { test_id: string }
  test_intro_accept: { test_id: string }
  test_intro_complete: { test_id: string }
  test_intro_skip: { test_id: string }
  begin_checkout: { test_id: string; value?: number; currency?: string }
  purchase: { transaction_id: string; test_id: string; value: number; currency: string }
  recruit_complete: { test_id: string; target_count?: number }
  feedback_view: { test_id: string }
  report_download: { test_id: string; report_format: string }
  contact_click: { contact_type: string }
  test_page_view: { test_id: string }
  test_share: { test_id: string; share_method: string }
  user_role: { user_role: UserRole }
}

export function trackEvent<EventName extends keyof AnalyticsEventParams>(
  eventName: EventName,
  params: AnalyticsEventParams[EventName],
) {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return

  window.gtag('event', eventName, {
    ...params,
    send_to: GA_MEASUREMENT_ID,
  })
}

export function setUserRole(userRole: UserRole) {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return

  window.gtag('set', 'user_properties', { user_role: userRole })
}
