# MATE FE — AI 공통 규칙 (Apps in Toss)

이 문서는 Cursor / Claude / Codex / Gemini 등 모든 AI 도구가 따를 프로젝트 규칙이다.  
도구별 진입 파일(`.cursor/rules/*.mdc`, `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`)은 이 내용과 동기화한다.

---

## 0. 핵심 원칙

이 프로젝트는 **앱인토스 앱**이다.

작업 전 반드시 아래 순서를 따른다:

1. Apps in Toss 공식 문서 확인
2. TDS 확인
3. MCP 확인
4. 그 다음 구현

추측으로 구현하지 말고 **공식 문서 기반으로 작업한다.**

---

## 1. 기본 규칙

- 결과 중심 (설명보다 코드/패치 우선)
- 기존 코드 스타일/구조를 먼저 따름
- 불필요한 라이브러리 추가 금지
- 타입 안정성 유지 (`any` 남용 금지)
- 에러 처리 포함
- 영향 범위 간단히 설명

---

## 2. 기술 스택 규칙

### 공통

- 패키지 매니저는 **pnpm만 사용**
- Vite + React 기준으로 작성 (Next.js 기준 금지)

### API

- `fetch` 대신 **ky 사용**
- API 로직은 분리 (컴포넌트에 직접 작성 최소화)

### 서버 상태

- **TanStack Query 사용**
- `useEffect`로 직접 데이터 관리 지양
- mutation 이후 invalidate 고려

### 전역 상태

- **Zustand는 최소한으로**
- 서버 데이터는 Query로 관리

### 스타일

- Tailwind 사용
- UI는 **TDS 우선 → Tailwind 보완**

### 라우팅

- TanStack Router 기준
- 경로 하드코딩 금지

### 구조

- **FSD 구조 유지**
- `shared` / `features` / `entities` / `pages` 역할 분리

---

## 3. UI 규칙

- 버튼, 인풋, 모달 등 → **TDS 먼저 확인**
- 디자인 임의 구현 금지
- 모바일/웹뷰 환경 고려 (터치, 스크롤 등)

---

## 4. 앱인토스 / MCP 규칙

- 앱인토스 관련 기능은 **항상 MCP 확인 후 구현**
- 플랫폼 제약을 일반 웹 기준으로 단정하지 않음
- 문서 없으면 "확인 필요"로 표시

---

## 5. 테스트

### 도구 및 설정

- E2E: **Playwright** — `e2e/` 폴더, `playwright.config.ts`
- 뷰포트: 390×844 (모바일 기준), 브라우저: Chromium
- 개발 서버: `pnpm exec vite` 자동 실행 (granite dev 아님)
- Fixture: `e2e/fixtures.ts` (공통 확장 포인트)

### 실행 명령

```bash
pnpm test:e2e          # 헤드리스
pnpm test:e2e:ui       # UI 모드 (시각적 디버깅)
pnpm test:e2e:debug    # 스텝별 디버그
```

### AI 워크플로 규칙

1. 페이지·기능 수정 시 → 관련 `e2e/*.spec.ts` 작성 또는 업데이트 **먼저**
2. 수정 완료 후 → "Playwright 테스트를 실행할까요?" 확인 후 실행
3. 테스트 실패 → **커밋 금지**, 원인 분석 후 수정

### 참고 — 앱인토스 환경

- `getSafeAreaInsets is not a constant handler` 콘솔 에러는 네이티브 브릿지 미존재 때문으로 테스트 실패 원인 아님
- 토스 앱 내 WebView 전용 네이티브 기능은 Playwright로 검증 불가 — 별도 표시

---

## 6. Git 규칙

### Commit (Conventional)

- `feat` / `fix` / `refactor` / `chore`

### Branch

- `type/#이슈번호`
- 예: `feat/#12`

### Issue / PR

- `[TYPE] 제목`

### Merge

- **Squash Merge**

### Review

- 최소 1명 승인 후 머지
- Gemini 리뷰 참고

### 알림

- PR은 디코 웹훅 기준으로 읽기 쉽게 작성

---

## 7. 답변 방식

### 구현

- 접근 방식 → 코드 → 후속 작업

### 버그

- 원인 → 수정 → 검증 방법

### 리팩터링

- 문제 → 개선 → 코드

---

## 8. 금지사항

- TDS 확인 없이 UI 구현
- pnpm 아닌 명령어 사용
- 서버 데이터 Zustand 저장
- FSD 구조 깨기
- 대규모 리팩터링 무단 수행
- 앱인토스 문맥 무시

---

## 9. AI 역할

- 코드 생성 + 구조 리뷰
- TDS / MCP 먼저 확인하는 가이드
- Query / Zustand 역할 분리 유지
- PR/커밋까지 같이 정리하는 개발 파트너
