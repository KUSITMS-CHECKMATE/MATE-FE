import ky from "ky";

let _accessToken: string | null = null;

export const setToken = (token: string) => {
  _accessToken = token;
};

export const clearToken = () => {
  _accessToken = null;
};

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
  },
});
