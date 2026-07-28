import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { FixedBottomCTA, List, ListRow, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { useNavigate } from "@tanstack/react-router";
import { hasSession } from "@/shared/api/client";
import { runTossLogin } from "@/features/login/model/login";
import { ROUTES } from "@/shared/constants/routes";

export function ServiceIntroPage() {
  const navigate = useNavigate();

  // 부팅 시 AuthGuard가 자동 로그인을 마친 뒤 이 화면이 렌더된다.
  // 이미 세션이 있으면(재방문·연결됨) 인트로를 건너뛰고 바로 홈으로 보낸다.
  const authenticated = hasSession();
  useEffect(() => {
    if (authenticated) {
      navigate({ to: ROUTES.DISCOVERY, replace: true });
    }
  }, [authenticated, navigate]);

  const loginMutation = useMutation({
    mutationFn: runTossLogin,
    onSuccess: () => {
      navigate({ to: ROUTES.DISCOVERY });
    },
    onError: (error) => {
      // 원인 진단용: 실제 에러 메시지를 그대로 노출한다. (원인 확인 후 일반 문구로 복구 예정)
      alert(`로그인 실패\n${error instanceof Error ? error.message : String(error)}`);
    },
  });

  if (authenticated) return null;

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
