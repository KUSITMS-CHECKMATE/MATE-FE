// 커밋 메시지 첫 줄이 컨벤션(`.claude/docs/git.md`)을 따르는지 검사: `feat|fix|refactor|chore: 내용`
import { readFileSync } from 'node:fs';

const subject = readFileSync(process.argv[2], 'utf8').split('\n')[0].trim();

// 머지·리버트·fixup은 git이 만드는 형식이라 통과
if (/^(Merge |Revert |fixup! |squash! )/.test(subject)) process.exit(0);

if (!/^(feat|fix|refactor|chore)(\([^)]+\))?: \S.*/.test(subject)) {
  console.error(
    `커밋 메시지 형식 오류: "${subject}"\n` +
      '형식: feat|fix|refactor|chore: 내용  (소문자 태그, 콜론 뒤 공백)\n' +
      '[FEAT] 같은 대문자 태그는 PR·이슈 제목 전용이에요. 자세한 규칙: .claude/docs/git.md',
  );
  process.exit(1);
}
