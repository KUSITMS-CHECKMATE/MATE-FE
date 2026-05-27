import { useState } from 'react';
import ky from 'ky';
import { saveBase64Data } from '@apps-in-toss/web-framework';
import { getToken } from '@/shared/api/client';

const PDF_SERVICE_URL = (import.meta.env.VITE_PDF_SERVICE_URL as string | undefined) ?? 'http://localhost:3001';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

export function usePdfDownload(testId: string, testTitle?: string) {
  const [isGenerating, setIsGenerating] = useState(false);

  async function generate() {
    setIsGenerating(true);
    try {
      const token = getToken() ?? '';
      const { data: base64Pdf } = await ky
        .get(`${PDF_SERVICE_URL}/generate`, {
          searchParams: {
            testId,
            token,
            apiBase: API_BASE_URL,
            ...(testTitle ? { title: testTitle } : {}),
          },
          timeout: 60_000,
        })
        .json<{ data: string }>();

      await saveBase64Data({
        data: base64Pdf,
        fileName: `MATE_통계보고서_${testId}.pdf`,
        mimeType: 'application/pdf',
      });
    } catch (e) {
      console.error('[usePdfDownload] 실패:', e);
      alert(`PDF 다운로드 실패: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsGenerating(false);
    }
  }

  return { generate, isGenerating };
}
