import { chromium } from '@playwright/test';
import http from 'http';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const PORT = 3001;
const MATE_API_BASE_URL = (process.env.MATE_API_BASE_URL ?? 'http://localhost:8080').replace(/\/$/, '');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML_PATH = path.resolve(__dirname, './stats-report.html');

const MOCK_DATA = {
  data: {
    participantCount: 76,
    reports: [
      // 1. 가로 막대 — 긴 선택지 텍스트 (truncation 검증)
      {
        type: 'OBJECTIVE',
        title: 'UAM에 탑승한다고 가정했을 때 가장 기대되는 점은 무엇인가요?',
        result: {
          isDuplicate: false,
          options: [
            { content: '교통체증 없는 빠른 이동', count: 29, ratio: 0.38 },
            { content: '특수수단을 이용하는 특별한 경험', count: 18, ratio: 0.24 },
            { content: '먼 지역까지 편리한 이동', count: 17, ratio: 0.22 },
            { content: '하늘에서 경관을 감상하는 경험', count: 12, ratio: 0.16 },
            { content: '프라이빗하게 이동하는 전용 공간', count: 0, ratio: 0.00 },
            { content: '기타 (직접 입력)', count: 0, ratio: 0.00 },
          ],
        },
      },
      // 2. 척도 — 긴 min/max 라벨 (vbar label truncation 검증)
      {
        type: 'SCALE',
        title: 'UAM에 대해 얼마나 알고 있나요?',
        result: {
          distribution: [
            { score: 1, count: 57 },
            { score: 2, count: 8 },
            { score: 3, count: 5 },
            { score: 4, count: 4 },
            { score: 5, count: 2 },
          ],
          mostVoted: 1,
          average: 1.47,
          endValue: {
            minLabel: '전혀 들어본 적 없음',
            maxLabel: '설명할 수 있을 정도로 자세히 알고 있음',
          },
        },
      },
      // 3. 주관식 — AI 요약 있음 + 응답 다수 (subjective overflow 검증)
      {
        type: 'SUBJECTIVE',
        title: '위와 같이 응답한 이유는 무엇인가요?',
        result: {
          aiSummary: '응답자들은 UAM을 경험해본 적 없는 새로운 이동수단에 대한 호기심과 탑승 기대감을 가장 많이 표현하였으며, 동시에 안전성 검증 부족과 높은 요금에 대한 우려를 주요 이용 장벽으로 언급하였다. 교통체증 없는 빠른 이동과 접근성 향상을 긍정적 요인으로 꼽은 응답자도 다수 존재하며, 안전이 보장된다면 이용 의향이 있다는 조건부 긍정 반응이 두드러졌다.',
          clusters: [],
          texts: [
            '한 번도 경험해보지 않은 수단이라서 궁금하다',
            '궁금해서 한 번 정도는 타보고 싶어요!!',
            '새로운 이동수단에 대한 호기심',
            '신기해서',
            '새롭게 접하는 교통수단이어서',
            'Uam에 대해 잘 알지는 못하지만 타보고 싶음',
            '하버드 경험해보지 못한 서비스여서 궁금하다',
            '비현실적이라고 생각했는데 완전 현실에서도 가능할 것 같아요',
            '일상생활에서 쉽게 접할 수 있는 이용수단이 아니기 때문에 실제 탑승했을 때를 상상해보기가 어려웠는데, 체험 후에는 실제 탑승하면 어떨지 구체적으로 그려볼 수 있을 것 같습니다.',
            '새롭게 알게되어 인식이 달라진 않고 빨리 상용화됐으면 좋겠다',
            '실제 탑승시에 어떤 모습일지 조금 더 그려지게 되었다',
            '편리할 것 같다',
            '편리하겠다',
          ],
        },
      },
      // 4. 주관식 — AI 요약 없음 + 짧은 응답 다수 (응답 모음 케이스)
      {
        type: 'SUBJECTIVE',
        title: 'UAM 서비스 이용 시 가장 걱정되는 점은?',
        result: {
          aiSummary: null,
          clusters: [],
          texts: [
            '안전 문제',
            '비용이 너무 비쌀 것 같다',
            '기상 조건에 따른 결항',
            '소음 문제',
            '인프라 부족',
            '해킹 및 보안 취약점',
            '배터리 방전 시 대처 방안',
            '좁은 공간에서의 불편함',
            '탑승 절차가 복잡할 것 같다',
            '일반 대중이 이용하기엔 아직 이른 것 같다',
          ],
        },
      },
    ],
  },
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
    return;
  }

  if (req.method === 'GET' && url.pathname.startsWith('/fonts/')) {
    const fontFile = path.basename(url.pathname);
    const fontPath = path.resolve(__dirname, 'fonts', fontFile);
    try {
      const data = fs.readFileSync(fontPath);
      res.writeHead(200, { 'Content-Type': 'font/woff2' });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('Font not found');
    }
    return;
  }

  if (req.method === 'GET' && url.pathname.startsWith('/img/')) {
    const imgFile = path.basename(url.pathname);
    const imgPath = path.resolve(__dirname, 'img', imgFile);
    try {
      const data = fs.readFileSync(imgPath);
      res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('Image not found');
    }
    return;
  }

  // 객관식/5초테스트 mock 미리보기
  if (req.method === 'GET' && url.pathname === '/mock-preview') {
    const html = fs.readFileSync(HTML_PATH, 'utf-8');
    const injected = html.replace(
      '<script>',
      `<script>window.__REPORT_DATA__ = ${JSON.stringify(MOCK_DATA)};\n` +
      `history.replaceState(null,'','?testId=mock&title=객관식+미리보기');\n</script>\n<script>`
    );
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(injected);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/stats-report.html') {
    try {
      const html = fs.readFileSync(HTML_PATH, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch (error) {
      res.writeHead(500);
      res.end('Failed to read HTML');
    }
    return;
  }

  if (req.method === 'GET' && url.pathname === '/generate-mock') {
    try {
      console.log('[pdf-server] /generate-mock 요청 수신');
      const HTML_URL = `http://localhost:${PORT}/stats-report.html?testId=mock&title=mock`;

      const browser = await chromium.launch({ headless: true });
      try {
        const page = await browser.newPage();
        page.on('console', msg => console.log(`[page:${msg.type()}]`, msg.text()));
        page.on('pageerror', err => console.error('[page:error]', err.message));

        await page.addInitScript(`window.__REPORT_DATA__ = ${JSON.stringify(MOCK_DATA)};`);
        await page.setViewportSize({ width: 595, height: 842 });
        await page.goto(HTML_URL, { waitUntil: 'load' });
        await page.waitForSelector('[data-rendered]', { timeout: 30_000 });
        console.log('[pdf-server] 렌더링 완료, PDF 생성 시작');

        const pdfBuffer = await page.pdf({
          width: '595px',
          height: '842px',
          printBackground: true,
          margin: { top: '0', right: '0', bottom: '0', left: '0' },
        });

        const base64 = pdfBuffer.toString('base64');
        console.log(`PDF generated: ${Math.round(pdfBuffer.length / 1024)}KB`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ data: base64 }));
      } finally {
        await browser.close();
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  if (req.method === 'GET' && url.pathname === '/generate') {
    try {
      const testId = url.searchParams.get('testId') ?? '';
      const title = url.searchParams.get('title') ?? '';
      const authorization = req.headers.authorization ?? '';

      if (!testId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'testId is required' }));
        return;
      }
      if (!authorization) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Authorization header is required' }));
        return;
      }

      console.log('[pdf-server] /generate 요청 수신', { testId, title: title || '(없음)' });

      const reportUrl = `${MATE_API_BASE_URL}/api/v1/tests/${testId}/report`;
      console.log(`[pdf-server] API 호출: ${reportUrl}`);
      const apiRes = await fetch(reportUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
      });
      if (!apiRes.ok) {
        throw new Error(`API 오류 ${apiRes.status}: ${await apiRes.text()}`);
      }
      const reportJson = await apiRes.json();
      console.log('[pdf-server] API 응답 data.reports 개수:', reportJson?.data?.reports?.length ?? 0);

      const resolvedTitle = title || reportJson?.data?.title || '';
      console.log('[pdf-server] 사용할 title:', resolvedTitle || '(없음)');

      const params = new URLSearchParams({ testId, ...(resolvedTitle ? { title: resolvedTitle } : {}) });
      const HTML_URL = `http://localhost:${PORT}/stats-report.html?${params.toString()}`;

      console.log(`Generating PDF for testId=${testId}...`);
      const browser = await chromium.launch({ headless: true });
      try {
        const page = await browser.newPage();

        page.on('console', msg => {
          console.log(`[page:${msg.type()}]`, msg.text());
        });
        page.on('pageerror', err => {
          console.error('[page:error]', err.message);
        });

        await page.addInitScript(`window.__REPORT_DATA__ = ${JSON.stringify(reportJson)};`);

        await page.setViewportSize({ width: 595, height: 842 });
        await page.goto(HTML_URL, { waitUntil: 'load' });

        await page.waitForSelector('[data-rendered]', { timeout: 30_000 });
        console.log('[pdf-server] 렌더링 완료 확인, PDF 생성 시작');

        const pdfBuffer = await page.pdf({
          width: '595px',
          height: '842px',
          printBackground: true,
          margin: { top: '0', right: '0', bottom: '0', left: '0' },
        });

        const base64 = pdfBuffer.toString('base64');
        console.log(`PDF generated: ${Math.round(pdfBuffer.length / 1024)}KB`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ data: base64 }));
      } finally {
        await browser.close();
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`PDF dev server → http://localhost:${PORT}`);
  console.log(`  /mock-preview  — 목업 데이터로 브라우저 미리보기`);
  console.log(`  /generate      — PDF 생성`);
  console.log(`MATE API base URL: ${MATE_API_BASE_URL}`);
});
