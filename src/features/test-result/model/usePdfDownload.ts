import { saveBase64Data } from '@apps-in-toss/web-framework';
import { useState } from 'react';
import ky from 'ky';

const PDF_SERVICE_URL = (import.meta.env.VITE_PDF_SERVICE_URL as string | undefined) ?? 'http://localhost:3001';

export function usePdfDownload(testId: string) {
  const [isGenerating, setIsGenerating] = useState(false);

  async function generate() {
    setIsGenerating(true);
    try {
      const { data } = await ky
        .get(`${PDF_SERVICE_URL}/generate`, {
          searchParams: { testId },
          timeout: 60_000,
        })
        .json<{ data: string }>();

      await saveBase64Data({
        data,
        fileName: `MATE_통계보고서_${testId}.pdf`,
        mimeType: 'application/pdf',
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return { generate, isGenerating };
}
