import { saveBase64Data } from '@apps-in-toss/web-framework';
import { useState } from 'react';
import { client } from '@/shared/api/client';
import { getDownloadExcelReportUrl } from '@/shared/api/generated/report';

export function useCsvDownload(testId: string) {
  const [isGenerating, setIsGenerating] = useState(false);

  async function generate() {
    setIsGenerating(true);
    try {
      const url = getDownloadExcelReportUrl(Number(testId)).replace(/^\//, '');
      const blob = await client(url).blob();

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      await saveBase64Data({
        data: base64,
        fileName: `MATE_통계보고서_${testId}.xlsx`,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
    } catch (e) {
      console.error('[useCsvDownload] 실패:', e);
      throw e;
    } finally {
      setIsGenerating(false);
    }
  }

  return { generate, isGenerating };
}
