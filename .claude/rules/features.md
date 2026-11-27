---
paths:
  - 'src/features/**'
---

# feature 규칙 (FSD)

- 의존 방향: `routes` → `features` → `shared`. 역방향·feature 간 내부 import 금지
- 현재 `entities/`·`pages/`는 없음 (페이지 역할은 `src/routes/`). 새 레이어는 만들기 전에 상의
- 일반 feature는 `ui/` · `model/` · `api/`로 나눔

## 질문 유형: `question-{type}`

- 네이밍은 **`question-{type}`** (`test-{type}` 금지). 유형: `multiple` · `subjective` · `tree` · `fivesec` · `scale` · `ab` · `cardsort`
- 내부는 `model/`(공유 타입) · `create/`(생성 UI) · `answer/`(응답 UI)로 3분할
- 의존: 퍼널(`test-create`, `test-participate`) → `question-*/create`·`answer` → `question-*/model` (**역방향 금지**)
- 새 유형은 3분할을 지키고 퍼널에서만 조합

## 임시저장(draft) · 결제

- 임시저장은 `test-create/model`의 `useSaveDraft` · `draftMapper` · `draftPayload`가 담당. 이미지는 `imageKey`로 저장되어 미리보기에 한계가 있음
- 결제는 `test-payment`. 결제 테스트 상품은 dev/stg 환경변수에서만 활성

## 이럴 때 더 읽기

- feature 전체 목록·shared 구성을 볼 때 → `.claude/docs/architecture.md`
- 화면 UI를 만들 때 → `.claude/rules/ui.md`
- 서버 데이터·로컬 저장을 다룰 때 → `.claude/rules/state.md`
