# 파일 위치 (FSD)

```txt
src/
├─ main.tsx · App.tsx · providers.tsx   # 진입·Provider 조립
├─ routes/                              # 페이지 진입점 (TanStack Router 파일 기반, 얇게)
├─ features/                            # 화면·도메인 로직
└─ shared/
   ├─ api/        client · mutator · 수동 API · generated/(orval)
   ├─ constants/  ROUTES · categories · imageRatio
   ├─ hooks/      useScrollLock · useResolvedImageSrc · useTestLike · …
   ├─ lib/        queryClient · analytics
   ├─ types/      공용 타입
   └─ ui/         BottomTabBar · TestCard · Spinner · …
```

## features

```txt
features/
├─ test-create/          생성 퍼널 (오케스트레이터)
├─ test-participate/     진행 퍼널 (오케스트레이터)
├─ test-payment/         인앱결제
├─ test-result/          결과·통계 화면
├─ test/                 내 테스트 목록·카드·임시저장 실패 상세
├─ discovery/            발견 탭
├─ discovery-detail/     발견 테스트 상세
├─ interest/             관심 탭
├─ intro/                서비스 소개·가이드
├─ my/                   마이페이지 (공지·약관·결제내역 등)
├─ login/                AuthGuard · 토스 로그인 · 세션
└─ question-{type}/      multiple · subjective · tree · fivesec · scale · ab · cardsort
   ├─ model/             공유 타입
   ├─ create/            생성 UI
   └─ answer/            응답 UI
```

그 밖 최상위: `e2e/`(Playwright) · `pdf-server/`(통계 PDF) · `docs/`(Doppler 설정·온보딩) · `public/`

## 이럴 때 더 읽기

- feature 간 의존·질문 유형 규칙이 궁금할 때 → `.claude/rules/features.md`
- 라우트를 추가할 때 → `.claude/rules/routing.md`
