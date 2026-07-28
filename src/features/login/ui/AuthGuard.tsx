import { useEffect, useState } from "react";
import { clearOnboarded, isOnboarded } from "@/features/login/model/session";
import { runTossLogin } from "@/features/login/model/login";

interface AuthGuardProps {
  children: React.ReactNode;
}

// 앱 부팅 시 세션을 복원한 뒤 자식을 렌더한다.
// 이전에 로그인한 적이 있으면(onboarded) appLogin으로 조용히 재로그인을 시도한다.
// - 토스에 연결돼 있으면 무음으로 성공 → 로그인 유지(인트로 건너뜀)
// - 연결을 끊었으면 appLogin이 약관 화면을 다시 띄운다(토스 QA 요구사항)
// - 실패/취소/네트워크 오류면 로그아웃 상태로 두고 온보딩 플래그를 정리해 인트로로 폴백한다.
export function AuthGuard({ children }: AuthGuardProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (await isOnboarded()) {
        try {
          await runTossLogin();
        } catch {
          await clearOnboarded();
        }
      }
    })().finally(() => {
      if (mounted) setReady(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
