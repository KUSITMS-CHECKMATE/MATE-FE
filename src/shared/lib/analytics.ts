declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

// 앱인토스 콘솔 QR 테스트 빌드는 private-apps/private-web 서브도메인으로 접속된다.
// 기획자/QA가 이 경로로 접속하면(빌드는 dev/stg/prd 상관없이 동일) debug_mode로 태깅해
// GA4 "개발자 트래픽" 필터로 정식 리포트에서 제외되게 한다.
function isTestEnvironment(): boolean {
  return import.meta.env.DEV || window.location.hostname.includes('private-')
}

export function initAnalytics() {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return

  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
    debug_mode: isTestEnvironment(),
  })
}

export function trackPageView(path: string) {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return

  window.gtag('event', 'page_view', {
    page_path: path,
    send_to: GA_MEASUREMENT_ID,
  })
}
