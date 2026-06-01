import { saveBase64Data } from '@apps-in-toss/web-framework';
import { useState } from 'react';
import { downloadPdfReport } from '@/shared/api/generated/report';

export function usePdfDownload(testId: string, title: string) {
  const [isGenerating, setIsGenerating] = useState(false);

  async function generate() {
    setIsGenerating(true);
    try {
      const res = await downloadPdfReport(Number(testId));
      const downloadUrl = (res as { data: { data: string } }).data.data;

      const buffer = await fetch(downloadUrl).then((r) => r.arrayBuffer());

      const uint8 = new Uint8Array(buffer);
      let binary = '';
      uint8.forEach((b) => { binary += String.fromCharCode(b); });
      const base64 = btoa(binary);

      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const safeName = title.replace(/[\\/:*?"<>|]/g, '_');

      await saveBase64Data({
        data: base64,
        fileName: `${date}_${safeName}.pdf`,
        mimeType: 'application/pdf',
      });
    } catch (e) {
      console.error('[usePdfDownload] 실패:', e);
      throw e;
    } finally {
      setIsGenerating(false);
    }
  }

  return { generate, isGenerating };
}
