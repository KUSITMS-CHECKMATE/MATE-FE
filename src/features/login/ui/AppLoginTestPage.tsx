import { useState } from "react";
import { appLogin } from "@apps-in-toss/web-framework";
import { Top, Button, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { useNavigate } from "@tanstack/react-router";
import { ROUTES } from "@/shared/constants/routes";

interface AppLoginResult {
  authorizationCode: string;
  referrer: "DEFAULT" | "SANDBOX";
}

export function AppLoginTestPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<AppLoginResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

  async function copyToClipboard(key: string, value: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((curr) => (curr === key ? null : curr)), 1500);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
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

        <Button
          size="medium"
          display="block"
          color="dark"
          variant="weak"
          onClick={() => navigate({ to: ROUTES.DISCOVERY })}
        >
          본 앱으로 이동
        </Button>

        {result && (
          <div
            className="flex flex-col gap-4 rounded-2xl p-4 break-all"
            style={{ backgroundColor: adaptive.grey100 }}
          >
            <div className="flex flex-col gap-2">
              <Text display="block" color={adaptive.grey900} typography="t6" fontWeight="bold">
                authorizationCode
              </Text>
              <Text display="block" color={adaptive.grey800} typography="t7" fontWeight="regular">
                {result.authorizationCode}
              </Text>
              <Button
                size="small"
                display="inline"
                color="dark"
                variant="weak"
                onClick={() => copyToClipboard("authorizationCode", result.authorizationCode)}
              >
                {copiedKey === "authorizationCode" ? "복사됨" : "복사"}
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <Text display="block" color={adaptive.grey900} typography="t6" fontWeight="bold">
                referrer
              </Text>
              <Text display="block" color={adaptive.grey800} typography="t7" fontWeight="regular">
                {result.referrer}
              </Text>
              <Button
                size="small"
                display="inline"
                color="dark"
                variant="weak"
                onClick={() => copyToClipboard("referrer", result.referrer)}
              >
                {copiedKey === "referrer" ? "복사됨" : "복사"}
              </Button>
            </div>

            <Button
              size="small"
              display="block"
              color="dark"
              variant="weak"
              onClick={() => copyToClipboard("all", JSON.stringify(result, null, 2))}
            >
              {copiedKey === "all" ? "전체 복사됨" : "전체 JSON 복사"}
            </Button>
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
