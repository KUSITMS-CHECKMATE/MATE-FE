import { saveBase64Data } from '@apps-in-toss/web-framework';
import { useState } from 'react';
import { client } from '@/shared/api/client';
import { getDownloadPdfReportUrl } from '@/shared/api/generated/report';

export function usePdfDownload(testId: string, title: string) {
  const [isGenerating, setIsGenerating] = useState(false);

  async function generate() {
    setIsGenerating(true);
    try {
      const url = getDownloadPdfReportUrl(Number(testId)).replace(/^\//, '');
      const blob = await client(url).blob();

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

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
