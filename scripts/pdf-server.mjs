import { chromium } from '@playwright/test';
import http from 'http';
import { fileURLToPath } from 'url';
import path from 'path';

const PORT = 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML_URL = `file://${path.resolve(__dirname, '../public/stats-report.html')}`;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && url.pathname === '/generate') {
    try {
      console.log('Generating PDF...');
      const browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();
      await page.setViewportSize({ width: 595, height: 842 });
      await page.goto(HTML_URL, { waitUntil: 'networkidle' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });

      await browser.close();

      const base64 = pdfBuffer.toString('base64');
      console.log(`PDF generated: ${Math.round(pdfBuffer.length / 1024)}KB`);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ data: base64 }));
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
  console.log(`PDF server ready → http://localhost:${PORT}/generate`);
});
