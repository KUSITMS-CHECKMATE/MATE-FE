import { useState } from "react";
import { Asset, FixedBottomCTA, Spacing, Stepper, StepperRow, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { useNavigate } from "@tanstack/react-router";
import { appLogin } from "@apps-in-toss/web-framework";
import { loginWithToss } from "@/shared/api/generated/auth";
import { setToken, setRefreshToken } from "@/shared/api/client";
import { ROUTES } from "@/shared/constants/routes";

const STEPS = [
  { icon: "icon-phone-vibration", title: "새로운 서비스를 구경해요" },
  { icon: "icon-pencil-blue", title: "간단한 테스트를 진행해요" },
  { icon: "icon-coin-stack-blue", title: "테스트 참여하고 리워드 받아요" },
];

export function ServiceIntroPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function handleStart() {
    setIsLoading(true);
    try {
      const { authorizationCode, referrer } = await appLogin();
      const { data: body } = await loginWithToss({ authorizationCode, referrer });
      const token = body.data?.accessToken;
      const refreshToken = body.data?.refreshToken;
      if (!token) throw new Error("토큰을 받지 못했습니다.");
      setToken(token);
      if (refreshToken) setRefreshToken(refreshToken);
      navigate({ to: ROUTES.DISCOVERY });
    } catch {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <Top
        lowerGap={0}
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            메이커와 테스터를 이어주는 테스트 리워드 서비스
          </Top.TitleParagraph>
        }
        subtitleBottom={<Top.SubtitleParagraph>리워드를 받아요</Top.SubtitleParagraph>}
      />
      <img src="/images/intro.png" alt="" aria-hidden={true} className="w-full" />
      <Spacing size={40} />
      <Stepper>
        {STEPS.map((step, i) => (
          <StepperRow
            key={step.title}
            left={
              <StepperRow.AssetFrame
                shape={Asset.frameShape.CleanW32}
                content={<Asset.ContentIcon name={step.icon} aria-hidden={true} />}
              />
            }
            center={<StepperRow.Texts type="A" title={step.title} />}
            hideLine={i === STEPS.length - 1}
          />
        ))}
      </Stepper>
      <FixedBottomCTA onClick={handleStart} disabled={isLoading}>
        {isLoading ? "로그인 중" : "시작하기"}
      </FixedBottomCTA>
    </div>
  );
}
