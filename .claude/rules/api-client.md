---
paths:
  - 'src/shared/api/**'
  - 'orval.config.ts'
---

# API 규칙 (ky · orval · 인증)

- HTTP는 **ky** (`fetch` 직접 사용 금지). API 로직은 컴포넌트에 직접 쓰지 않고 분리
- 파일: `client.ts`(ky 인스턴스 + `setToken`/`clearToken`) · `mutator.ts`(orval 뮤테이터) · `question.ts`·`report.ts`(수동 작성) · `generated/`(orval 자동 생성)

## orval

- Swagger 변경 시 `pnpm orval` 로 재생성 (`pnpm orval:watch`). `generated/`는 **직접 수정 금지**
- GET → 생성된 `useXxx()` hook 사용
- POST/PUT/DELETE → 생성된 함수(`createXxx` 등)를 `useMutation`으로 직접 래핑 (orval이 POST를 `useQuery`로 잘못 생성하는 경우가 있음)
- mutation 이후 관련 query invalidate 고려
- 도메인 파일: `test` · `question` · `answer` · `auth` · `file` · `users` · `payment` · `report` · `testDraft`

## 인증

- `AuthGuard`(`src/features/login/ui/AuthGuard.tsx`)가 앱 마운트 시 토스 로그인 실행: `appLogin()` → `loginWithToss()` → `setToken(accessToken)`
- 이후 모든 ky 요청에 `Authorization: Bearer {token}` 자동 주입
- 로그아웃: `logout()` → `clearToken()` → `window.location.reload()`
- **토큰은 메모리에만 저장.** 영구 저장 금지 — 앱 재실행 시 AuthGuard가 재인증 (앱인토스 연결 해제는 클라이언트에 통지되지 않음)

## 이럴 때 더 읽기

- 토큰·세션 말고 영구 저장이 필요할 때 → `.claude/rules/state.md`
- 결제·임시저장 API를 만질 때 → `.claude/rules/features.md`
