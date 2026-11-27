---
name: pr
description: PR을 올릴 때 사용. "PR 올려줘", "PR 만들어줘", "풀리퀘 올려줘", "푸시하고 PR"처럼 PR 생성을 요청하면 실행. 현재 브랜치로 dev 대상 PR을 .github/pull_request_template.md 양식에 맞춰 생성하며, 제목·본문을 보여주고 확인받은 뒤에만 push·생성
---

# /pr

규칙 원본은 `.claude/docs/git.md`. 이 스킬은 절차만 적는다.

1. 브랜치 확인: `type/#이슈번호` 형식이어야 함. `dev`에서는 만들지 않고 알림. 커밋되지 않은 변경이 있으면 `/commit`을 먼저 안내
2. 검사: `pnpm lint` 통과 확인 (CI와 같은 검사. 실패하면 PR을 만들지 말고 보고). 지침 문서를 고쳤다면 `pnpm docs:check`, 화면을 고쳤다면 관련 e2e → `.claude/rules/e2e-test.md`
3. `git log dev..HEAD`, `git diff dev...HEAD`로 변경 파악
4. 제목: 이슈 제목을 **그대로** 사용 — `gh issue view {이슈번호} --json title -q .title` (`[FEAT] 제목` 형식). 임의로 다시 쓰지 않음. 이슈가 없으면 `[TYPE] 한 줄 요약`을 제안하고 확인
5. 본문은 `.github/pull_request_template.md`를 **그대로** 채움
   - PR 유형 체크박스 해당 항목만 `[x]`
   - `resolves #{이슈번호}`
   - 작업 사항: 변경을 bullet로 요약 (디스코드 웹훅에서 읽기 쉽게 짧게)
   - 기타(공유 사항): 배포 시 유의사항, 환경변수 추가 여부 등
6. `Generated with Claude Code` 등 **AI 작성 표시를 본문에 넣지 않음**
7. **제목·본문을 먼저 보여주고 확인받은 뒤** push와 PR 생성: `git push -u origin HEAD` → `gh pr create --base dev --title ... --body ...`
8. PR 링크를 알려줌. 머지는 하지 않음 (최소 1명 승인 후 사람이 머지)
