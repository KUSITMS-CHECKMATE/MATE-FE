import { useQuery } from "@tanstack/react-query";
import { generateDownloadUrl } from "@/shared/api/generated/file";

function isDirectlyLoadable(value: string): boolean {
  return (
    value.startsWith("data:") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("blob:")
  );
}

// presigned URL을 받아온 직후 <img>를 그리면 브라우저가 아직 다운로드를 못 끝내
// 스켈레톤 -> 흰 화면 -> 이미지 순으로 깜빡인다. 브라우저 캐시에 미리 채워 넣어
// isLoading이 꺼지는 시점에는 항상 즉시 페인트되도록 한다.
function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });
}

function useImageDownloadUrl(fileKey: string | undefined) {
  return useQuery({
    queryKey: ["fileDownloadUrl", fileKey],
    queryFn: async () => {
      const res = await generateDownloadUrl({ fileKey: fileKey! });
      const presignedUrl = res.data.data?.presignedUrl;
      if (presignedUrl) await preloadImage(presignedUrl);
      return res;
    },
    select: (res) => res.data.data?.presignedUrl,
    enabled: !!fileKey,
    staleTime: 25 * 60 * 1000,
    gcTime: 25 * 60 * 1000,
  });
}

/**
 * 폼에 저장된 이미지 값을 <img src>로 그릴 수 있는 값으로 변환한다.
 * data URI/URL은 그대로 통과시키고, 그 외(업로드 fileKey, 예: 임시저장 초안을
 * 이어쓸 때 서버에서 내려온 값)는 generateDownloadUrl로 30분짜리 presigned URL을
 * 받아와 사용한다. 반환값이 undefined인 동안은 아직 URL을 못 구한 상태다.
 */
export function useResolvedImageSrc(value: string | undefined): string | undefined {
  const fileKey = value && !isDirectlyLoadable(value) ? value : undefined;
  const { data: presignedUrl } = useImageDownloadUrl(fileKey);

  if (!value) return undefined;
  if (isDirectlyLoadable(value)) return value;
  return presignedUrl;
}

/**
 * useResolvedImageSrc와 동일하지만, fileKey를 presigned URL로 바꾸는 동안의
 * 로딩 상태도 함께 반환한다(로딩 스켈레톤 표시용).
 */
export function useResolvedImageSrcState(
  value: string | undefined,
): { src: string | undefined; isLoading: boolean } {
  const fileKey = value && !isDirectlyLoadable(value) ? value : undefined;
  const { data: presignedUrl, isError } = useImageDownloadUrl(fileKey);

  if (!value) return { src: undefined, isLoading: false };
  if (isDirectlyLoadable(value)) return { src: value, isLoading: false };
  return { src: presignedUrl, isLoading: !presignedUrl && !isError };
}
