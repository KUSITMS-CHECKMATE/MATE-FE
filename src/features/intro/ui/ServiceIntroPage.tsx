import { Asset, FixedBottomCTA, Stepper, StepperRow, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { useNavigate } from "@tanstack/react-router";
import { ROUTES } from "@/shared/constants/routes";

const STEPS = [
  {
    icon: "icon-phone-vibration",
    title: "새로운 서비스를 구경해요",
    description: "다양한 미니앱 서비스를 만나볼 수 있어요",
  },
  {
    icon: "icon-pencil-blue",
    title: "간단한 테스트를 진행해요",
    description: "질문에 답하고 솔직한 의견을 남겨요",
  },
  {
    icon: "icon-coin-stack-blue",
    title: "테스트 참여하고 리워드 받아요",
    description: "참여 완료 후 리워드를 받아요",
  },
];

export function ServiceIntroPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            메이커와 테스터를 이어주는 테스트 리워드 서비스
          </Top.TitleParagraph>
        }
        subtitleBottom={<Top.SubtitleParagraph>리워드를 받아요</Top.SubtitleParagraph>}
      />
      <img src="/images/intro.png" alt="" aria-hidden={true} className="w-full" />
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
            center={<StepperRow.Texts type="A" title={step.title} description={step.description} />}
            hideLine={i === STEPS.length - 1}
          />
        ))}
      </Stepper>
      <FixedBottomCTA onClick={() => navigate({ to: ROUTES.DISCOVERY })}>시작하기</FixedBottomCTA>
    </div>
  );
}
