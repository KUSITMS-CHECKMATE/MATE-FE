import { FixedBottomCTA } from "@toss/tds-mobile";

export function GuidePage() {
  return (
    <div className="flex flex-col">
      <img src="/images/banner_1.png" alt="" aria-hidden className="w-full" />
      <img src="/images/banner_2.png" alt="" aria-hidden className="w-full" />
      <img src="/images/banner_3.png" alt="" aria-hidden className="w-full" />
      <img src="/images/banner_4.png" alt="" aria-hidden className="w-full" />
      <img src="/images/banner_5.png" alt="" aria-hidden className="w-full" />
      <FixedBottomCTA onClick={() => history.back()}>테스트 시작하기</FixedBottomCTA>
    </div>
  );
}
