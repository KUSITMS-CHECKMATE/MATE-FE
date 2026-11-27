# Git 규칙

- 브랜치 `type/#이슈번호` (예: `feat/#12`)
- 커밋은 Conventional, 태그는 소문자 `feat:` `fix:` `refactor:` `chore:`. UX 흐름·기능 **동작이 바뀌면 `refactor`가 아니라 `fix`**
- 커밋 메시지 형식은 husky `commit-msg` 훅(`scripts/check-commit-msg.mjs`)이 검사. 어긋나면 커밋이 거부됨 (머지·리버트·fixup은 통과)
- 이슈·PR 제목은 `[TYPE] 제목` (대문자 태그는 PR·이슈 전용). PR 제목은 이슈 제목 그대로 사용하고 임의로 다시 쓰지 않음
- PR 본문은 항상 `.github/pull_request_template.md` 형식 그대로. 디코 웹훅에서 읽기 쉽게
- 기본 브랜치는 `dev`. 머지는 **Merge commit 또는 Rebase merge** (Squash 금지 — 기여자별 커밋 이력 유지), 최소 1명 승인 후 머지, Gemini 리뷰는 참고
- Playwright 실패 상태로 커밋 금지
- `git push --force`·`--no-verify`는 요청 없이 사용하지 않음
