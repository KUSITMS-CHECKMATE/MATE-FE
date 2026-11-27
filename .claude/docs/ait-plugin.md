# 앱인토스 `ait` 플러그인 (선택)

토스 공식 하네스(`toss/apps-in-toss-harness`). Claude Code·Codex·Cursor용 플러그인으로, 개인 환경(user scope)에 설치한다. **레포에는 포함하지 않는다.**

## 설치 (1회)

```
/plugin marketplace add toss/apps-in-toss-harness
/plugin install ait@apps-in-toss
```

새 세션에서 `/mcp` → `ait-console`을 골라 앱인토스 콘솔 계정으로 로그인한 뒤 `/ait:welcome`으로 점검한다. 설치되는 MCP: `ait-docs`(개발자센터 문서) · `ait-console`(콘솔).

## 이 프로젝트에서 쓰는 것

- `/ait:launch` — 검수 요청 전 출시 체크리스트 점검, 반려 사유 대응. 검수 요청은 내용 확인 후 승인한 경우에만 전송
- `/ait:ux-writing` — 화면 문구 전후 비교 제안, 확정한 것만 반영
- `/ait:feature` — 광고·인앱결제·공유 등 SDK 기능 추가 (기존 스택에 맞춰 작성)

## 쓰지 않는 것 / 주의

- `/ait:new` · `/ait:plan` — 새 프로젝트용
- `/ait:design` · `/ait:inject-*` — 디자인 가이드 문서·토큰·아이콘 파일과 `AGENTS.md`·`CLAUDE.md` 주입 블록을 추가함. TDS 기반인 이 프로젝트와 겹치므로 쓰기 전에 주입 대상을 확인
- `/ait:test-on-device` — 번들을 빌드해 콘솔에 올림. **어떤 빌드를 올리는지 확인 후 사용.** 콘솔 업로드 산출물은 `build:release` 규칙을 따라야 하고 QA용 값이 섞이면 안 됨 → `.claude/docs/deploy.md`
- 첫 검수 요청·출시·롤백·프로모션은 에이전트가 아니라 콘솔에서 직접 진행
- 로컬 `apps-in-toss` MCP(TDS 문서 검색 포함)와 `ait-docs`는 병행 사용
- 플러그인 업데이트는 `/plugin`에서 apps-in-toss 마켓플레이스의 Enable auto-update
