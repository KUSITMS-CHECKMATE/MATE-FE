import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tanstackRouter from "@tanstack/router-plugin/vite";
import path from "path";
import type { IncomingMessage, ServerResponse } from "node:http";

// /api/pdf?testId=&title=&participants=&date= → A4 PDF (Playwright)
function pdfPlugin(): Plugin {
  return {
    name: "vite-plugin-pdf-generator",
    configureServer(server) {
      server.middlewares.use(
        "/api/pdf",
        async (req: IncomingMessage, res: ServerResponse) => {
          const rawUrl = req.url ?? "";
          const params = new URLSearchParams(rawUrl.startsWith("?") ? rawUrl.slice(1) : rawUrl);

          const testId      = params.get("testId")      ?? "demo";
          const title       = params.get("title")       ?? "통계 리포트";
          const participants = params.get("participants") ?? "100";
          const date        = params.get("date")        ?? "";

          // Vite가 서빙하는 주소를 runtime에 가져옴
          const vitePort = (server.config.server.port ?? 5173);
          const reportUrl =
            `http://localhost:${vitePort}/stats-report.html` +
            `?testId=${encodeURIComponent(testId)}` +
            `&title=${encodeURIComponent(title)}` +
            `&participants=${encodeURIComponent(participants)}` +
            (date ? `&date=${encodeURIComponent(date)}` : "");

          console.log(`[pdf] generating → ${reportUrl}`);

          try {
            const { chromium } = await import("@playwright/test");
            const browser = await chromium.launch({ headless: true });
            const page = await browser.newPage();

            await page.setViewportSize({ width: 794, height: 1122 });
            await page.goto(reportUrl, { waitUntil: "networkidle", timeout: 30_000 });
            await page.waitForTimeout(300);

            const pdf = await page.pdf({
              format: "A4",
              printBackground: true,
              margin: { top: "0", right: "0", bottom: "0", left: "0" },
            });

            await browser.close();

            const filename = `MATE_Report_${testId}_${new Date().toISOString().slice(0, 10)}.pdf`;
            res.writeHead(200, {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
              "Content-Length": pdf.byteLength,
            });
            res.end(pdf);
            console.log(`[pdf] sent ${pdf.byteLength} bytes`);
          } catch (err) {
            console.error("[pdf] error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: String(err) }));
          }
        }
      );
    },
  };
}

export default defineConfig({
  plugins: [
    tanstackRouter({ routesDirectory: "./src/routes", generatedRouteTree: "./src/routeTree.gen.ts" }),
    tailwindcss(),
    react(),
    pdfPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    hmr: true,
  },
});
