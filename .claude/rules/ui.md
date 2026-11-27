---
paths:
  - 'src/**/ui/**'
  - 'src/**/create/**'
  - 'src/**/answer/**'
  - 'src/shared/ui/**'
---

# UI 규칙 (TDS · Tailwind)

- 버튼·인풋·모달·바텀시트 등은 **TDS(`@toss/tds-mobile`) 먼저 확인**. 없을 때만 Tailwind로 보완. 디자인 임의 구현 금지
- 모바일 WebView 전제: 터치 영역·스크롤 잠금(`useScrollLock`)·하단 고정 CTA·safe area를 고려
- `TextField` 등 입력이 조건부로 나타날 때는 `motion.div`(framer-motion)로 감싸 fade-in(0.2s)
- 이미지 src는 `useResolvedImageSrc`로 해석 (`imageKey` 미리보기 포함)
- 공용 UI는 `src/shared/ui`, 도메인 UI는 각 feature의 `ui/`

## 이럴 때 더 읽기

- 앱인토스 전용 컴포넌트·SDK 사용법이 불확실할 때 → AGENTS.md "작업 순서"의 공식 문서 → TDS → MCP 순서로 확인
- 화면을 바꿨을 때 → `.claude/rules/e2e-test.md`
