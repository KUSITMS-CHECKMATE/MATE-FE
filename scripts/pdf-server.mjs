/**
 * PDF 생성 서버 — Playwright로 stats-report.html 캡처 후 PDF 반환
 *
 * 실행: node scripts/pdf-server.mjs
 * 포트: 3001
 *
 * Vite dev server (port 5173) 가 먼저 실행되어 있어야 합니다.
 * package.json의 "pdf:server" 스크립트로 실행하세요.
 */

import { createServer } from 'node:http';
import { chromium } from '@playwright/test';

const PORT = 3001;
const VITE_URL = 'http://localhost:5173';

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // CORS — Vite dev server 에서의 fetch 허용
  res.setHeader('Access-Control-Allow-Origin', VITE_URL);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (url.pathname !== '/api/pdf') {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    return;
  }

  const testId = url.searchParams.get('testId') ?? 'demo';
  const title = url.searchParams.get('title') ?? '통계 리포트';
  const participants = url.searchParams.get('participants') ?? '100';
  const date = url.searchParams.get('date') ?? '';

  const reportUrl =
    `${VITE_URL}/stats-report.html` +
    `?testId=${encodeURIComponent(testId)}` +
    `&title=${encodeURIComponent(title)}` +
    `&participants=${encodeURIComponent(participants)}` +
    (date ? `&date=${encodeURIComponent(date)}` : '');

  console.log(`[pdf-server] Generating PDF for: ${reportUrl}`);

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.setViewportSize({ width: 794, height: 1122 });
    await page.goto(reportUrl, { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForTimeout(500);

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    const filename = `MATE_Report_${testId}_${new Date().toISOString().slice(0, 10)}.pdf`;

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      'Content-Length': pdf.byteLength,
    });
    res.end(pdf);
    console.log(`[pdf-server] PDF sent (${pdf.byteLength} bytes)`);
  } catch (err) {
    console.error('[pdf-server] Error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: String(err) }));
  } finally {
    await browser?.close();
  }
}).listen(PORT, () => {
  console.log(`[pdf-server] Running at http://localhost:${PORT}`);
  console.log(`[pdf-server] Endpoint: GET /api/pdf?testId=xxx&title=yyy&participants=100`);
});
