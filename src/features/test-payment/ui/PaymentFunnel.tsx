import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { graniteEvent } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import {
  Asset,
  BottomInfo,
  Border,
  CTAButton,
  FixedBottomCTA,
  List,
  ListHeader,
  ListRow,
  Post,
  Spacing,
  Text,
  TextField,
  Top,
  useToast,
} from "@toss/tds-mobile";
import { AFFILIATE_REWARD_AMOUNT, type PaymentStep, type TesterCount, type RewardAmount } from "../model/types";
import { calcPayment, toKRW, parseWonAmount } from "../model/calcPayment";
import { usePaymentSubmit } from "../model/usePaymentSubmit";
import { useIapProducts } from "../model/useIapProducts";
import { useIapSkuMap } from "../model/useIapSkuMap";
import { TesterCountStep } from "./TesterCountStep";
import { RewardAmountStep } from "./RewardAmountStep";
import { PaymentCompleteStep } from "./PaymentCompleteStep";
import { PaymentSystemErrorStep } from "./PaymentSystemErrorStep";
import { PaymentGiveUpStep } from "./PaymentGiveUpStep";
import { ResponsePeriodSheet } from "./ResponsePeriodSheet";
import { ROUTES } from "@/shared/constants/routes";
import { Route } from "@/routes/test/payment";
import { trackEvent } from "@/shared/lib/analytics";

const DownArrowIcon = () => (
  <Asset.Icon
    frameShape={Asset.frameShape.CleanW24}
    backgroundColor="transparent"
    name="icon-arrow-down-mono"
    color={adaptive.grey400}
    aria-hidden={true}
    ratio="1/1"
  />
);

export function PaymentFunnel() {
  const navigate = useNavigate();
  const { draftId } = Route.useSearch();
  const { openToast } = useToast();
  const {
    mutate: submitPayment,
    isPending,
    appMarketVerificationFailed,
    serverVerificationFailed,
    verificationFailureCount,
  } = usePaymentSubmit();
  const { data: iapProducts } = useIapProducts();
  const skuMap = useIapSkuMap();

  const handleGoBack = () => {
    navigate({ to: ROUTES.TEST_CREATE, search: { draftId, payment: true, resume: false } });
  };

  const [step, setStep] = useState<PaymentStep>("main");
  const stepRef = useRef(step);

  useEffect(() => {
    if (appMarketVerificationFailed) setStep("app-market-verification-failed");
  }, [appMarketVerificationFailed]);
  useEffect(() => {
    if (serverVerificationFailed) setStep("toss-server-verification-failed");
  }, [serverVerificationFailed]);
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // 결제 화면 진입 시점 = 여기까지 작성한 내용이 이미 임시저장된 시점이므로, 진입 즉시 안내 토스트를 보여준다.
  useEffect(() => {
    openToast("지금까지 만든 테스트를\n임시 저장했어요", {
      type: "bottom",
      lottie: "https://static.toss.im/lotties-common/check-green-spot.json",
      higherThanCTA: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    try {
      unsubscribe = graniteEvent.addEventListener("backEvent", {
        onEvent: () => {
          if (stepRef.current === "complete") {
            navigate({ to: ROUTES.TEST, replace: true });
          } else if (stepRef.current === "main") {
            handleGoBack();
          } else {
            setStep("main");
          }
        },
        onError: (error) => {
          console.error("backEvent error", error);
        },
      });
    } catch {
      console.warn("backEvent listener not supported in browser");
    }
    return () => {
      unsubscribe?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [responsePeriod, setResponsePeriod] = useState(30);
  const [draftResponsePeriod, setDraftResponsePeriod] = useState(30);
  const [isResponsePeriodOpen, setIsResponsePeriodOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);

  const [testerCount, setTesterCount] = useState<TesterCount | null>(null);
  const [draftTesterCount, setDraftTesterCount] = useState<TesterCount | null>(null);
  const [rewardAmount, setRewardAmount] = useState<RewardAmount | null>(null);
  const [draftRewardAmount, setDraftRewardAmount] = useState<RewardAmount | null>(null);
  if (step === "tester-count") {
    return (
      <TesterCountStep
        draft={draftTesterCount}
        onSelect={setDraftTesterCount}
        onConfirm={() => {
          setTesterCount(draftTesterCount);
          // 제휴 단체 전용가는 테스터 수별 전용 SKU라서, 테스터 수를 바꿔서 그 SKU가
          // 더 이상 없어지면(예: 100명 → 50명) 선택했던 리워드 금액을 초기화해야 한다.
          // 안 그러면 등록되지 않은 조합(50명 + 제휴가)으로 결제를 시도하게 된다.
          const stillAffiliateAvailable =
            draftTesterCount != null && skuMap[AFFILIATE_REWARD_AMOUNT]?.[draftTesterCount] != null;
          if (rewardAmount === AFFILIATE_REWARD_AMOUNT && !stillAffiliateAvailable) {
            setRewardAmount(null);
            setDraftRewardAmount(null);
          }
          setStep("main");
        }}
        onClose={() => setStep("main")}
      />
    );
  }

  if (step === "reward-amount") {
    const affiliateSku = testerCount != null ? skuMap[AFFILIATE_REWARD_AMOUNT]?.[testerCount] : undefined;
    return (
      <RewardAmountStep
        draft={draftRewardAmount}
        onSelect={setDraftRewardAmount}
        onConfirm={() => {
          setRewardAmount(draftRewardAmount);
          setStep("main");
        }}
        onClose={() => setStep("main")}
        affiliateAvailable={affiliateSku != null}
      />
    );
  }

  if (step === "complete") {
    return <PaymentCompleteStep onClose={() => navigate({ to: ROUTES.TEST, replace: true })} />;
  }

  if (step === "app-market-verification-failed" || step === "toss-server-verification-failed") {
    if (verificationFailureCount >= 4) {
      return <PaymentGiveUpStep onConfirm={() => navigate({ to: ROUTES.TEST, replace: true })} />;
    }
    return (
      <PaymentSystemErrorStep
        subject={step === "app-market-verification-failed" ? "스토어" : "메이트"}
        isRetrying={isPending}
        onRetry={() =>
          submitPayment(
            {
              draftId,
              testerCount: testerCount!,
              rewardAmount: rewardAmount!,
              responsePeriod,
            },
            {
              onSuccess: ({ orderId }) => {
                const retryTotal = calcPayment(testerCount!, rewardAmount!).total;
                trackEvent("purchase", {
                  transaction_id: orderId ?? "unknown",
                  test_id: String(draftId),
                  value: retryTotal,
                  currency: "KRW",
                });
                trackEvent("create_test", { test_id: String(draftId), target_count: testerCount! });
                setStep("complete");
              },
            },
          )
        }
      />
    );
  }

  const iapSku =
    testerCount != null && rewardAmount != null ? skuMap[rewardAmount]?.[testerCount] : undefined;
  const iapProduct =
    iapSku != null ? iapProducts?.find((product) => product.sku === iapSku) : undefined;
  const actualTotal =
    iapProduct?.displayAmount != null ? parseWonAmount(iapProduct.displayAmount) : undefined;

  const payment =
    testerCount != null && rewardAmount != null
      ? calcPayment(testerCount, rewardAmount, actualTotal)
      : null;
  const displayTotal = iapProduct?.displayAmount ?? (payment != null ? toKRW(payment.total) : null);

  return (
    <>
      <div className="flex flex-col h-full bg-white">
        <Spacing size={12} />
        <Top
          title={
            <Top.TitleParagraph size={22} color={adaptive.grey900}>
              결제
            </Top.TitleParagraph>
          }
        />
        <div className="flex flex-col gap-2">
          <TextField.Button
            variant="line"
            hasError={false}
            label="테스트 응답 기간"
            labelOption="sustain"
            value={`${responsePeriod}일간`}
            placeholder="테스트 응답 기간"
            right={<DownArrowIcon />}
            onClick={() => {
              setDraftResponsePeriod(responsePeriod);
              setSheetKey((k) => k + 1);
              setIsResponsePeriodOpen(true);
            }}
          />
          <TextField.Button
            variant="line"
            hasError={false}
            label="테스터 수"
            labelOption="sustain"
            value={testerCount != null ? `${testerCount}명` : ""}
            placeholder="선택해주세요"
            right={<DownArrowIcon />}
            onClick={() => {
              setDraftTesterCount(testerCount);
              setStep("tester-count");
            }}
          />
          <TextField.Button
            variant="line"
            hasError={false}
            label="리워드 금액"
            labelOption="sustain"
            value={
              rewardAmount === AFFILIATE_REWARD_AMOUNT
                ? "제휴 단체 전용가"
                : rewardAmount != null
                  ? toKRW(rewardAmount)
                  : ""
            }
            placeholder="선택해주세요"
            right={<DownArrowIcon />}
            onClick={() => {
              setDraftRewardAmount(rewardAmount);
              setStep("reward-amount");
            }}
          />
        </div>
        {payment != null && (
          <>
            <Border variant="height16" />
            <List>
              <ListHeader
                descriptionPosition="bottom"
                rightAlignment="center"
                titleWidthRatio={0.6}
                title={
                  <ListHeader.TitleParagraph
                    color={adaptive.grey800}
                    fontWeight="bold"
                    typography="t4"
                  >
                    결제 금액
                  </ListHeader.TitleParagraph>
                }
                right={
                  <Text color={adaptive.red600} typography="st8" fontWeight="bold">
                    {displayTotal}
                  </Text>
                }
              />
              <ListRow
                contents={
                  <ListRow.Texts
                    type="1RowTypeA"
                    top="테스터 리워드"
                    topProps={{ color: adaptive.grey700 }}
                  />
                }
                right={
                  <ListRow.Texts
                    type="Right1RowTypeA"
                    top={toKRW(payment.testerReward)}
                    topProps={{ color: adaptive.grey700 }}
                  />
                }
              />
              <ListRow
                contents={
                  <ListRow.Texts
                    type="1RowTypeA"
                    top="수수료"
                    topProps={{ color: adaptive.grey700 }}
                  />
                }
                right={
                  <ListRow.Texts
                    type="Right1RowTypeA"
                    top={toKRW(payment.fee)}
                    topProps={{ color: adaptive.grey700 }}
                  />
                }
              />
              <ListRow
                contents={
                  <ListRow.Texts
                    type="1RowTypeA"
                    top="부가세"
                    topProps={{ color: adaptive.grey700 }}
                  />
                }
                right={
                  <ListRow.Texts
                    type="Right1RowTypeA"
                    top={toKRW(payment.vat)}
                    topProps={{ color: adaptive.grey700 }}
                  />
                }
              />
              <ListRow
                contents={
                  <ListRow.Texts
                    type="1RowTypeA"
                    top="결제 합계"
                    topProps={{ color: adaptive.grey700 }}
                  />
                }
                right={
                  <ListRow.Texts
                    type="Right1RowTypeA"
                    top={toKRW(payment.total)}
                    topProps={{ color: adaptive.grey700 }}
                  />
                }
              />
              <Spacing size={16} />
            </List>
            <BottomInfo>
              <Post.H4 paddingBottom={16}>환불 정책</Post.H4>
              <Post.Paragraph typography="t7" color={adaptive.grey500}>
                {`1. 회사는 메이커를 대상으로 유료 서비스를 제공합니다.
2. 목표 참여 인원 대비 실제 모집 인원의 달성률을 기준으로 환불을 처리합니다.
   가. 목표 달성률이 20% 미만으로 종료된 경우 결제일로부터 1개월 이내 100% 환불합니다.
   나. 목표 달성률이 20% 이상인 경우 테스트 종료 이후 환불이 불가능합니다.
   다. 자동 종료, 수동 종료, 잔여 모집 기간과 관계없이 동일하게 적용됩니다.
3. 다음의 경우에는 환불이 불가능합니다.
   가. 목표 미달 상태에서 현재 인원으로 진행을 선택한 경우
   나. 달성률 20% 이상 상태에서 수동 종료한 경우
   다. 결과 데이터 또는 리포트를 열람하거나 다운로드한 경우
   라. 허위 테스트 생성, 중복 생성, 시스템 악용 등 정책 위반이 확인된 경우
4. 회사 귀책사유의 결제 오류는 전액 환불합니다.
5. 환불은 최초 결제수단으로 처리됩니다.
6. 부정 참여, 오지급, 조건 미충족 시 리워드를 회수할 수 있습니다.
7. 회사는 관계 법령의 청약철회 및 환불 규정을 준수합니다.`}
              </Post.Paragraph>
            </BottomInfo>
          </>
        )}
        {payment != null ? (
          <FixedBottomCTA.Double
            leftButton={
              <CTAButton color="dark" variant="weak" onClick={handleGoBack}>
                이전
              </CTAButton>
            }
            rightButton={
              <CTAButton
                onClick={() => {
                  trackEvent("begin_checkout", {
                    test_id: String(draftId),
                    value: payment?.total,
                    currency: "KRW",
                  });
                  submitPayment(
                    {
                      draftId,
                      testerCount: testerCount!,
                      rewardAmount: rewardAmount!,
                      responsePeriod,
                    },
                    {
                      onSuccess: ({ orderId }) => {
                        trackEvent("purchase", {
                          transaction_id: orderId ?? "unknown",
                          test_id: String(draftId),
                          value: payment?.total ?? 0,
                          currency: "KRW",
                        });
                        trackEvent("create_test", { test_id: String(draftId), target_count: testerCount! });
                        setStep("complete");
                      },
                    },
                  );
                }}
                disabled={isPending}
              >
                {displayTotal} 결제하기
              </CTAButton>
            }
          />
        ) : (
          <FixedBottomCTA color="dark" variant="weak" onClick={handleGoBack}>
            이전
          </FixedBottomCTA>
        )}
      </div>
      <ResponsePeriodSheet
        open={isResponsePeriodOpen}
        sheetKey={sheetKey}
        draft={draftResponsePeriod}
        onSelect={setDraftResponsePeriod}
        onConfirm={() => {
          setResponsePeriod(draftResponsePeriod);
          setIsResponsePeriodOpen(false);
        }}
        onClose={() => {
          setDraftResponsePeriod(responsePeriod);
          setIsResponsePeriodOpen(false);
        }}
      />
    </>
  );
}
