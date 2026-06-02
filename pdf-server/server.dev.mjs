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
    participantCount: 50,
    reports: [
      {
        type: 'OBJECTIVE',
        title: '가장 자주 사용하는 기능은?',
        result: {
          isDuplicate: false,
          options: [
            { content: '프로필', count: 29, ratio: 0.58 },
            { content: '설정', count: 14, ratio: 0.27 },
            { content: '홈', count: 8, ratio: 0.15 },
          ],
        },
      },
      {
        type: 'OBJECTIVE',
        title: '불편한 기능을 모두 선택해주세요',
        result: {
          isDuplicate: true,
          options: [
            { content: '검색', count: 36, ratio: 0.72 },
            { content: '알림', count: 25, ratio: 0.50 },
            { content: '마이페이지', count: 16, ratio: 0.32 },
          ],
        },
      },
      {
        type: 'OBJECTIVE',
        title: '개선이 필요한 부분은?',
        result: {
          isDuplicate: false,
          options: [
            { content: '속도', count: 22, ratio: 0.44 },
            { content: 'UI', count: 18, ratio: 0.36 },
            { content: '기타', count: 10, ratio: 0.20 },
          ],
          aiSummary: '응답자들은 주로 앱 속도 개선을 원하며, UI 개선 및 다크모드 지원에 대한 요구도 높게 나타났습니다.',
          clusters: [],
          otherTexts: ['알림이 너무 많아요', '검색 결과가 느려요', '다크모드 지원해주세요', '폰트가 작아요'],
        },
      },
      {
        type: 'FIVE_SECOND',
        title: '5초 후 기억에 남는 요소를 선택해주세요',
        result: {
          isDuplicate: false,
          options: [
            { content: '상단 배너', count: 24, ratio: 0.48 },
            { content: '검색창', count: 18, ratio: 0.36 },
            { content: '네비게이션 바', count: 8, ratio: 0.16 },
          ],
        },
      },
      {
        type: 'FIVE_SECOND',
        title: '5초 후 기억에 남는 요소를 모두 선택해주세요',
        result: {
          isDuplicate: true,
          options: [
            { content: '상단 배너', count: 38, ratio: 0.76 },
            { content: '검색창', count: 27, ratio: 0.54 },
            { content: '네비게이션 바', count: 15, ratio: 0.30 },
          ],
        },
      },
      {
        type: 'FIVE_SECOND',
        title: '5초 후 기억에 남는 것을 선택하거나 직접 입력해주세요',
        result: {
          isDuplicate: false,
          options: [
            { content: '상단 배너', count: 20, ratio: 0.40 },
            { content: '검색창', count: 16, ratio: 0.32 },
            { content: '기타', count: 14, ratio: 0.28 },
          ],
          aiSummary: '대부분의 응답자가 상단 배너와 검색창을 기억했으며, 일부는 로고와 색상을 언급했습니다.',
          clusters: [],
          otherTexts: ['로고가 눈에 띄었어요', '파란색 배경이 인상적이었어요', '전체적으로 깔끔했어요'],
        },
      },
      {
        type: 'FIVE_SECOND',
        title: '5초 동안 본 화면에서 가장 먼저 떠오르는 것은?',
        result: {
          aiSummary: '응답자들은 주로 중앙의 큰 이미지와 파란색 버튼을 가장 먼저 인식했다고 답했습니다.',
          clusters: [
            { representative: '큰 이미지', count: 18, responses: ['중앙 이미지가 눈에 들어왔어요', '큰 사진이 인상적이었어요'] },
            { representative: '파란색 버튼', count: 12, responses: ['파란 버튼이 눈에 띄었어요', 'CTA 버튼이 먼저 보였어요'] },
          ],
          texts: ['큰 이미지', '파란색 버튼', '헤더 텍스트', '상단 메뉴'],
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
          format: 'A4',
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

      const params = new URLSearchParams({ testId, ...(title ? { title } : {}) });
      const HTML_URL = `http://localhost:${PORT}/stats-report.html?${params.toString()}`;

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
          format: 'A4',
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
