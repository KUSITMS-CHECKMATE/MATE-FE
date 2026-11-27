# MATE-FE

테스트 등록·참여·통계 서비스. **앱인토스(토스 미니앱) WebView** · Vite · React 18 · TanStack Router/Query · TDS · Tailwind · pnpm

모든 AI 도구 공통 지침의 진입점. 규칙 본문은 아래 문서에 한 번씩만 있음

## 작업 순서

1. 앱인토스 기능은 **공식 문서 → TDS → MCP** 순서로 확인한 뒤 구현 (`ait` 플러그인을 설치했다면 `ait-docs` MCP 포함 → `.claude/docs/ait-plugin.md`) (추측 금지, 문서에 없으면 "확인 필요"로 표시. 플랫폼 제약을 일반 웹 기준으로 단정하지 않음)
2. 경로별 규칙(`.claude/rules/*.md`)은 frontmatter `paths`에 맞는 파일을 다룰 때 읽음 (Claude Code는 자동)
3. 아래 "작업별 시작 문서"를 읽고, 각 문서 맨 아래 `이럴 때 더 읽기`에서 **조건에 맞는 것만** 따라 읽음
4. 끝내기 전 `pnpm lint` · `pnpm docs:check` (지침 문서를 고쳤다면), 화면을 고쳤다면 관련 e2e
5. 끝내기 전 이번 변경이 문서와 어긋나는지 확인하고 고침 — 새 feature·라우트·orval 도메인·스크립트·규칙을 추가했다면 `.claude/docs/architecture.md`와 해당 `.claude/rules/*.md`에 반영 (작성법은 `.claude/docs/writing-docs.md`)

## 명령어

- 패키지 매니저는 **pnpm만** (npm·yarn 금지)
- `pnpm dev` (Doppler) · `pnpm dev:plain` (Doppler 없이) · `pnpm lint` · `pnpm orval`
- 빌드·배포는 용도별 스크립트만 있음. 콘솔 업로드는 반드시 `pnpm build:release` → `.claude/docs/deploy.md`
- e2e `pnpm test:e2e` → `.claude/rules/e2e-test.md`

## 절대 규칙 (lint로 못 잡는 것만)

- 콘솔 업로드·실배포에 `build:dev`/`deploy:dev` 산출물 사용 금지 (QA 전용 값이 프로덕션에 노출됨)
- `src/shared/api/generated/`·`src/routeTree.gen.ts`는 직접 수정 금지 (재생성)
- 서버 데이터를 Zustand·`useState`에 복사하지 않음. 서버 상태는 TanStack Query
- 경로 문자열 하드코딩 금지 → `src/shared/constants/routes.ts`의 `ROUTES`
- TDS 확인 없이 UI 구현 금지. 디자인 임의 구현 금지
- 불필요한 라이브러리 추가·대규모 리팩터링 무단 수행 금지
- 코드 스타일은 `eslint.config.js`가 원본. 문서에 다시 적지 않음

## 작업별 시작 문서

- 파일 위치·FSD 구조: `.claude/docs/architecture.md`
- 라우트 추가: `.claude/rules/routing.md`
- API 연동·인증: `.claude/rules/api-client.md`
- feature·질문 유형 추가: `.claude/rules/features.md`
- 상태·저장소: `.claude/rules/state.md`
- UI·TDS·모션: `.claude/rules/ui.md`
- 테스트: `.claude/rules/e2e-test.md`
- 통계 PDF 서버: `.claude/rules/pdf-server.md`
- 빌드·배포·환경변수: `.claude/docs/deploy.md`
- 커밋·브랜치·PR 규칙: `.claude/docs/git.md`
- 커밋 절차: `.claude/skills/commit/SKILL.md` (Claude Code는 `/commit` 또는 "커밋해줘")
- PR 절차: `.claude/skills/pr/SKILL.md` (Claude Code는 `/pr` 또는 "PR 올려줘")
- 검수 전 점검·문구 점검(앱인토스 `ait` 플러그인): `.claude/docs/ait-plugin.md`
- 지침 문서 수정: `.claude/docs/writing-docs.md`
