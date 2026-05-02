import { useState } from "react";
import { appLogin } from "@apps-in-toss/web-framework";
import { Top, Button, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface AppLoginResult {
  authorizationCode: string;
  referrer: "DEFAULT" | "SANDBOX";
}

export function AppLoginTestPage() {
  const [result, setResult] = useState<AppLoginResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleLogin() {
    setPending(true);
    setError(null);
    setResult(null);

    try {
      const res = await appLogin();
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            토스 로그인 테스트
          </Top.TitleParagraph>
        }
      />

      <div className="flex flex-col gap-5 px-5 pb-10">
        <Text display="block" color={adaptive.grey700} typography="t7" fontWeight="regular">
          appLogin() 브릿지를 호출해 클라이언트에서 authorizationCode를 받아옵니다.
          토스 앱(또는 샌드박스) 환경에서만 동작해요.
        </Text>

        <Button
          size="medium"
          display="block"
          color="primary"
          onClick={handleLogin}
          disabled={pending}
        >
          {pending ? "로그인 중..." : "토스 로그인"}
        </Button>

        {result && (
          <div className="rounded-2xl p-4 break-all" style={{ backgroundColor: adaptive.grey100 }}>
            <Text display="block" color={adaptive.grey900} typography="t6" fontWeight="bold">
              authorizationCode
            </Text>
            <Text display="block" color={adaptive.grey800} typography="t7" fontWeight="regular">
              {result.authorizationCode}
            </Text>
            <div className="mt-3" />
            <Text display="block" color={adaptive.grey900} typography="t6" fontWeight="bold">
              referrer
            </Text>
            <Text display="block" color={adaptive.grey800} typography="t7" fontWeight="regular">
              {result.referrer}
            </Text>
          </div>
        )}

        {error && (
          <div className="rounded-2xl p-4 break-all" style={{ backgroundColor: "#FEECEC" }}>
            <Text display="block" color="#D6293E" typography="t6" fontWeight="bold">
              에러
            </Text>
            <Text display="block" color={adaptive.grey800} typography="t7" fontWeight="regular">
              {error}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}
