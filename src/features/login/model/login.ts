import { appLogin } from "@apps-in-toss/web-framework";
import { loginWithToss } from "@/shared/api/generated/auth";
import { setToken, setRefreshToken } from "@/shared/api/client";
import { markOnboarded } from "./session";

// 토스 로그인 오케스트레이터.
// appLogin은 토스 연결 상태의 단일 진실 소스다:
// - 이미 연결된 사용자 → 창 없이 인가 코드를 반환(무음 로그인)
// - 연결 안 됨/해제됨 → 약관 동의 화면을 노출한 뒤 인가 코드 반환
// 부팅 자동 로그인(AuthGuard)과 인트로의 "시작하기"가 모두 이 함수를 사용한다.
export interface TossLoginResult {
  isNewUser: boolean;
}

export async function runTossLogin(): Promise<TossLoginResult> {
  // 개발 모드(브라우저)에서는 네이티브 브릿지가 없으므로 env의 액세스 토큰을 그대로 사용한다.
  // import.meta.env.DEV는 프로덕션 빌드에서 false로 치환돼 이 분기는 번들에서 제거된다.
  if (import.meta.env.DEV) {
    const devToken = import.meta.env.VITE_DEV_ACCESS_TOKEN as string | undefined;
    if (devToken) {
      setToken(devToken);
      const devRefreshToken = import.meta.env.VITE_DEV_REFRESH_TOKEN as string | undefined;
      if (devRefreshToken) setRefreshToken(devRefreshToken);
      await markOnboarded();
      return { isNewUser: false };
    }
  }

  // 1) 토스 인가 코드 받기
  let authorizationCode: string;
  let referrer: string;
  try {
    const res = await appLogin();
    authorizationCode = res.authorizationCode;
    referrer = res.referrer;
  } catch (e) {
    console.error("[login] appLogin 실패:", e);
    throw new Error(`appLogin 실패: ${errorMessage(e)}`);
  }

  // 2) 인가 코드로 Mate JWT 발급
  let body;
  try {
    const result = await loginWithToss({ authorizationCode, referrer });
    body = result.data;
  } catch (e) {
    console.error("[login] loginWithToss 실패:", e);
    throw new Error(`서버 로그인 실패: ${errorMessage(e)}`);
  }

  const token = body.data?.accessToken;
  const refreshToken = body.data?.refreshToken;
  if (!token) {
    console.error("[login] 토큰 없음. 응답:", body);
    throw new Error(`토큰을 받지 못했습니다. (code=${body.code ?? "?"}, message=${body.message ?? "?"})`);
  }

  setToken(token);
  if (refreshToken) setRefreshToken(refreshToken);
  await markOnboarded();

  return { isNewUser: body.data?.isNewUser ?? false };
}

function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}
