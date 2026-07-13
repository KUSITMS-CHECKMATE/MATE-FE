import ky from "ky";

// 토큰은 메모리에만 보관한다. (앱인토스 QA: 토스 연결 해제 시 잔존 데이터가 없어야 하고,
// 연결 상태의 단일 진실 소스는 appLogin이므로 로컬 영구 저장은 하지 않는다.)
// 한 세션 안에서 액세스 토큰이 만료되면 리프레시 토큰으로 재발급해 요청이 실패하지 않게 한다.
let _accessToken: string | null = null;
let _refreshToken: string | null = null;
let _refreshPromise: Promise<string> | null = null;

export const setToken = (token: string) => { _accessToken = token; };
export const clearToken = () => { _accessToken = null; };
export const getToken = () => _accessToken;
export const setRefreshToken = (token: string) => { _refreshToken = token; };
export const clearRefreshToken = () => { _refreshToken = null; };

// 리프레시 토큰 보유 여부 = 현재 세션의 로그인 여부.
export const hasSession = () => _refreshToken != null;

const REISSUE_PATH = "api/v1/auth/reissue";

const API_BASE_URL = import.meta.env.DEV
  ? `${window.location.origin}/`
  : import.meta.env.VITE_API_BASE_URL;

async function refreshAccessToken(): Promise<string> {
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async () => {
    const baseUrl = API_BASE_URL.replace(/\/$/, "");
    const res = await ky
      .post(`${baseUrl}/${REISSUE_PATH}`, {
        json: { refreshToken: _refreshToken },
      })
      .json<{ data?: { accessToken?: string; refreshToken?: string } }>();

    const newAccessToken = res.data?.accessToken;
    const newRefreshToken = res.data?.refreshToken;
    if (!newAccessToken) throw new Error("토큰 재발급 실패");

    setToken(newAccessToken);
    if (newRefreshToken) setRefreshToken(newRefreshToken);
    return newAccessToken;
  })().finally(() => {
    _refreshPromise = null;
  });

  return _refreshPromise;
}

export const client = ky.create({
  prefixUrl: API_BASE_URL,
  credentials: "include",
  hooks: {
    beforeRequest: [
      (request) => {
        if (_accessToken) {
          request.headers.set("Authorization", `Bearer ${_accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        if (response.status !== 401 || !_refreshToken || request.headers.has("X-Retry")) return response;

        try {
          const newToken = await refreshAccessToken();
          request.headers.set("Authorization", `Bearer ${newToken}`);
          request.headers.set("X-Retry", "true");
          return client(request);
        } catch {
          clearToken();
          clearRefreshToken();
          return response;
        }
      },
    ],
  },
});
