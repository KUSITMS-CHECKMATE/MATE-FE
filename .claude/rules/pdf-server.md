---
paths:
  - 'pdf-server/**'
---

# 통계 PDF 서버 규칙

- `stats-report.html`을 Playwright(Chromium)로 렌더링해 PDF로 변환. 포트 3001, `/health` 제공
- `server.mjs` 운영 (`MATE_API_BASE_URL`에서 데이터 조회) · `server.dev.mjs` 목 데이터 개발용. 실행 `pnpm pdf:server`
- 폰트는 `fonts/`에서 `/fonts/*`로 서빙. 텍스트가 깨지면 폰트 로딩부터 확인
- 보고서 변경은 `stats-report.html`과 데이터 연동 양쪽을 확인

## 이럴 때 더 읽기

- 배포(Dockerfile)·환경변수를 바꿀 때 → `.claude/docs/deploy.md`
