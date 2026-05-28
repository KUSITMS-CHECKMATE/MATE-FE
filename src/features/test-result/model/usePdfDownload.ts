import { saveBase64Data } from '@apps-in-toss/web-framework';
import { useState } from 'react';
import { client } from '@/shared/api/client';
import { getDownloadPdfReportUrl } from '@/shared/api/generated/report';

export function usePdfDownload(testId: string) {
  const [isGenerating, setIsGenerating] = useState(false);

  async function generate() {
    setIsGenerating(true);
    try {
      const url = getDownloadPdfReportUrl(Number(testId)).replace(/^\//, '');
      const buffer = await client.get(url).arrayBuffer();

      const uint8 = new Uint8Array(buffer);
      let binary = '';
      uint8.forEach((b) => { binary += String.fromCharCode(b); });
      const base64 = btoa(binary);

      await saveBase64Data({
        data: base64,
        fileName: `MATE_통계보고서_${testId}.pdf`,
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
