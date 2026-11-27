---
paths:
  - 'src/routes/**'
---

# 라우트 규칙 (TanStack Router)

- 파일 기반 라우팅. 파일 하나가 한 경로, `$param`은 동적 파라미터, `.` 은 경로 구분 (`draft.$draftId.tsx` → `/test/draft/$draftId`)
- 라우트 파일은 얇게: 화면 로직은 `src/features/*`에 두고 라우트에서는 조합·파라미터 전달만
- **경로 하드코딩 금지** → `src/shared/constants/routes.ts`의 `ROUTES`. 라우트를 추가하면 `ROUTES`에도 추가
- `src/routeTree.gen.ts`는 자동 생성이므로 수정하지 않음 (라우트 추가·이동 후 dev 서버가 갱신)
- 현재 최상위: `/` · `/discovery` · `/interest` · `/my` · `/test`

## 이럴 때 더 읽기

- 라우트에 들어갈 화면 컴포넌트 위치를 정할 때 → `.claude/docs/architecture.md`
- 라우트에서 API를 호출할 때 → `.claude/rules/api-client.md`
