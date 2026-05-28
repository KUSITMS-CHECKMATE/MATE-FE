import ky from "ky";

let _accessToken: string | null = null;
let _refreshToken: string | null = null;
let _refreshPromise: Promise<string> | null = null;

export const setToken = (token: string) => { _accessToken = token; };
export const clearToken = () => { _accessToken = null; };
export const getToken = () => _accessToken;
export const setRefreshToken = (token: string) => { _refreshToken = token; };
export const clearRefreshToken = () => { _refreshToken = null; };

const REISSUE_PATH = "api/v1/auth/reissue";

async function refreshAccessToken(): Promise<string> {
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
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
  prefixUrl: import.meta.env.VITE_API_BASE_URL,
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
