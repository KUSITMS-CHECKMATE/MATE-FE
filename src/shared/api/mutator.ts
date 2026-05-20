import { client } from "./client";

export type ErrorType<Error> = Error;

// orval이 생성한 코드는 fetch 스타일로 kyMutator(url, options) 호출
export const kyMutator = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const relativeUrl = url.startsWith("/") ? url.slice(1) : url;
  return client(relativeUrl, options as Parameters<typeof client>[1]).json<T>();
};
