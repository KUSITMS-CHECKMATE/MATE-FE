import { useMutation } from "@tanstack/react-query";
import { FixedBottomCTA, List, ListRow, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { useNavigate } from "@tanstack/react-router";
import { appLogin } from "@apps-in-toss/web-framework";
import { loginWithToss } from "@/shared/api/generated/auth";
import { setToken, setRefreshToken } from "@/shared/api/client";
import { ROUTES } from "@/shared/constants/routes";

export function ServiceIntroPage() {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async () => {
      const { authorizationCode, referrer } = await appLogin();
      const { data: body } = await loginWithToss({ authorizationCode, referrer });
      const token = body.data?.accessToken;
      const refreshToken = body.data?.refreshToken;
      if (!token) throw new Error("토큰을 받지 못했습니다.");
      setToken(token);
      if (refreshToken) setRefreshToken(refreshToken);
    },
    onSuccess: () => {
      navigate({ to: ROUTES.DISCOVERY });
    },
    onError: () => {
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    },
  });

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            테스트 리워드 플랫폼
          </Top.TitleParagraph>
        }
        subtitleTop={
          <Top.SubtitleParagraph>서비스 메이커와 테스터를 이어주는</Top.SubtitleParagraph>
        }
      />
      <img src="/images/intro.png" alt="" aria-hidden={true} className="w-full" />
      <List>
        <ListRow
          left={
            <ListRow.Icon
              shape="no-background"
              url="https://static.toss.im/2d-emojis/png/4x/u1F50E.png"
            />
          }
          contents={
            <ListRow.Texts
              type="1RowTypeC"
              top="새로운 서비스 구경하기"
              topProps={{ color: adaptive.grey800 }}
            />
          }
        />
        <ListRow
          left={<ListRow.Icon shape="no-background" name="icon-pencil-blue" />}
          contents={
            <ListRow.Texts
              type="1RowTypeC"
              top="간단한 테스트 진행하기"
              topProps={{ color: adaptive.grey800 }}
            />
          }
        />
        <ListRow
          left={
            <ListRow.Icon
              shape="no-background"
              url="https://static.toss.im/2d-emojis/png/4x/u1F4B0.png"
            />
          }
          contents={
            <ListRow.Texts
              type="1RowTypeC"
              top="참여 완료하고 리워드 받기"
              topProps={{ color: adaptive.grey800 }}
            />
          }
          verticalPadding="large"
        />
      </List>
      <FixedBottomCTA onClick={() => loginMutation.mutate()} disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "로그인 중" : "시작하기"}
      </FixedBottomCTA>
    </div>
  );
}
