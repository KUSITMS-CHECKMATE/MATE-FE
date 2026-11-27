---
paths:
  - 'src/**/model/**'
  - 'src/shared/hooks/**'
  - 'src/shared/lib/**'
---

# 상태·저장소 규칙

- 서버 데이터는 **전부 TanStack Query**. `useEffect`로 직접 데이터 관리 지양. mutation 후 invalidate 고려
- **Zustand는 최소한**, 서버 데이터를 Zustand에 저장 금지 (캐시가 원본)
- `QueryClient` 인스턴스·기본 옵션은 `src/shared/lib/queryClient.ts` 하나
- 영구 저장이 필요하면 `localStorage`·`AsyncStorage`가 아니라 `@apps-in-toss/web-framework`의 **Storage** 사용. 부팅 시 읽기에는 타임아웃 보호를 둠
- 분석 이벤트는 `src/shared/lib/analytics.ts` (QA 환경에서는 GA 트래킹 차단)

## 이럴 때 더 읽기

- 토큰·세션 처리를 바꿀 때 → `.claude/rules/api-client.md`
