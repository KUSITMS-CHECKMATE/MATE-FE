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

function useImageDownloadUrl(fileKey: string | undefined) {
  return useQuery({
    queryKey: ["fileDownloadUrl", fileKey],
    queryFn: () => generateDownloadUrl({ fileKey: fileKey! }),
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
