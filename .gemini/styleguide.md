# 🚀 MATE FE Style Guide & Conventions

이 가이드는 프로젝트의 일관성과 코드 품질 유지를 위해 반드시 준수해야 하는 규칙이다.
Gemini AI는 모든 PR(Pull Request) 리뷰 시 본 문서를 기준으로 엄격히 검토하고, 위반 사항이 있을 경우 **명확한 수정 방향**과 함께 지적해야 한다.

---

## 1. 프로젝트 개요

이 프로젝트는 **앱인토스(Apps in Toss) 미니앱**이다.
일반 SPA 기준이 아닌 플랫폼 제약을 고려해야 하며, 추측으로 구현하지 말고 **공식 문서 기반으로 작업한다.**

---

## 2. 커밋 컨벤션 (Commit Convention)

### 2.1 타입 목록

| 타입       | 설명                           |
| ---------- | ------------------------------ |
| `feat`     | 새로운 기능 구현               |
| `fix`      | 버그 및 오류 해결              |
| `refactor` | 리팩토링                       |
| `chore`    | 설정, 패키지, 기타 사소한 변경 |

### 2.2 브랜치 규칙

- 형식: `type/#이슈번호`
- 예: `feat/#12`

### 2.3 Issue / PR 제목

- 형식: `[TYPE] 제목`
- 예: `[FEAT] 로그인 페이지 구현`

---

## 3. 기술 스택 규칙 (Development Rules)

### 3.1 공통

- 패키지 매니저는 **pnpm만 사용** (npm, yarn 사용 금지)
- **Vite + React** 기준으로 작성 (Next.js 패턴 금지)

### 3.2 API

- `fetch` 직접 사용 금지 → **ky 사용**
- API 로직은 컴포넌트에서 분리 (컴포넌트 내부에 직접 작성 최소화)

### 3.3 서버 상태

- **TanStack Query 사용**
- `useEffect`로 직접 데이터 관리 지양
- mutation 이후 `invalidateQueries` 고려

### 3.4 전역 상태

- **Zustand는 최소한으로** 사용
- 서버 데이터는 Zustand에 저장하지 않고 **Query로만 관리**

### 3.5 스타일

- **Tailwind CSS** 사용
- UI 컴포넌트(버튼, 인풋, 모달 등)는 **TDS(Toss Design System) 우선** → Tailwind 보완
- 임의 디자인 구현 금지

### 3.6 라우팅

- **TanStack Router** 기준
- 경로(path) 하드코딩 금지

### 3.7 아키텍처

- **FSD(Feature-Sliced Design) 구조 유지**
- `shared` / `features` / `entities` / `pages` 역할 분리 준수

---

## 4. 코드 품질 규칙

- TypeScript `any` 남용 금지 — 타입 안정성 유지
- 에러 처리 포함 필수
- 불필요한 라이브러리 추가 금지
- 코드 내 `console.log` PR 제출 전 반드시 제거

---

## 5. Gemini 리뷰 가이드라인

### 5.1 리뷰 작성 원칙

- 모든 리뷰 답변은 **한국어**로 작성한다.
- 위반 사항은 **명확한 수정 방향**과 함께 제시한다.

### 5.2 리뷰 체크리스트

Gemini AI는 아래 항목을 반드시 점검한다.

- [ ] `fetch`를 직접 사용하지 않고 `ky`를 사용하는가?
- [ ] API 로직이 컴포넌트 내부에 직접 작성되지 않고 분리되어 있는가?
- [ ] 서버 데이터를 Zustand에 저장하지 않는가?
- [ ] `useEffect`로 데이터를 직접 관리하지 않는가?
- [ ] mutation 이후 `invalidateQueries`가 고려되었는가?
- [ ] TDS 컴포넌트를 우선 사용하고 있는가? (버튼, 인풋, 모달 등)
- [ ] FSD 레이어 규칙(shared/features/entities/pages)을 위반하지 않는가?
- [ ] TanStack Router를 사용하고 경로를 하드코딩하지 않는가?
- [ ] TypeScript `any`를 남용하지 않는가?
- [ ] 에러 처리가 포함되어 있는가?
- [ ] 모바일/웹뷰 환경이 고려되었는가? (터치, 스크롤 등)

---

본 문서는 프로젝트 전반에 적용되는 공식 스타일 가이드이며, 변경은 팀 합의 하에만 가능하다.
