# 빌드 · 배포 (Doppler)

환경변수는 **Doppler**(`dev` / `stg` / `prd`)로 주입. 커밋된 `doppler.yaml`의 기본 config가 `dev`라서 이름 없는 `pnpm build`/`pnpm deploy`는 없음 — 용도별 스크립트를 명시한다.

```bash
pnpm build:dev        # 로컬 개발/QA 빌드 (dev config)
pnpm build:release    # 콘솔 업로드용 .ait — 반드시 이것만 (prd config 고정)
pnpm deploy:dev       # 개발/QA 배포
pnpm deploy:release   # 실서비스 배포 — 반드시 이것만 (prd config 고정)
```

- 콘솔에 올리는 `.ait`는 **반드시 `build:release`**. `build:dev` 산출물을 올리면 QA 전용 값(결제 테스트 상품 등)이 프로덕션에 노출됨
- 새 환경변수(`VITE_` 접두사)는 `.env.example`에 예시를 남기고, QA 전용 값은 `dev`/`stg` config에만 둠
- Doppler CLI 설치·연결 절차는 `docs/DOPPLER.md`, 팀 온보딩은 `docs/TEAM_ONBOARDING.md`
- 앱인토스 SDK 버전 변경(`@apps-in-toss/web-framework`)은 공식 문서의 마이그레이션 안내를 먼저 확인
