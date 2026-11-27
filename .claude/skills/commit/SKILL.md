---
name: commit
description: 커밋할 때 사용. "커밋해줘", "커밋하자", "지금 작업 나눠서 커밋", "변경사항 커밋"처럼 커밋을 요청하면 바로 실행. 변경사항을 논리 단위로 나눠 MATE-FE 커밋 컨벤션(`type: 내용`)에 맞춰 커밋. push·PR 생성은 하지 않음 (PR은 `/pr`)
---

# /commit

규칙 원본은 `.claude/docs/git.md`. 이 스킬은 절차만 적는다.

1. `git status`, `git diff --staged`(없으면 `git diff`)로 변경 확인. 현재 브랜치가 `dev`면 멈추고 알림 (`dev`는 PR로만 반영)
2. 서로 무관한 변경은 **논리 단위로 나눠** 커밋. 스테이징은 `git add <파일>`로 파일을 지정 (`git add -A` 금지 — `.env` 등 비밀 파일 혼입 방지)
3. 태그 선택
   - `feat` 새 기능 · `fix` 사용자에게 보이는 동작 변경·버그 수정 · `refactor` 동작 변화 없는 구조 개선
   - `chore` 설정·빌드·CI·의존성·문서처럼 앱 동작이 바뀌지 않는 수정 (CI를 고치는 것이어도 `chore`)
4. 메시지는 `type: 내용` — 소문자 태그, 콜론 뒤 공백, 한국어, 명사형 (`~ 추가`, `~ 수정`). 필요하면 빈 줄 뒤 본문에 이유를 적음. `[FEAT]` 같은 대문자 태그는 PR·이슈 제목 전용이라 쓰지 않음
5. 화면·기능을 고쳤다면 관련 e2e를 먼저 확인 → `.claude/rules/e2e-test.md`. Playwright가 실패하면 커밋하지 않음
6. husky가 `commit-msg`(형식 검사)와 `pre-commit`(지침 문서가 바뀐 경우 `docs:check`)를 실행. 실패하면 원인을 고치고 **새 커밋**으로 만듦 (`--no-verify`·`--amend`로 우회하지 않음)
7. 커밋 메시지에 `Co-Authored-By`, `Generated with Claude` 등 **AI 작성 표시를 넣지 않음**
8. 끝나면 `git log --oneline`으로 만든 커밋을 보여줌. push는 요청이 있을 때만
