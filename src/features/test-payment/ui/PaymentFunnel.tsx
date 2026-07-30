import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { graniteEvent } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import { Asset, BottomInfo, Border, CTAButton, FixedBottomCTA, List, ListHeader, ListRow, Post, Spacing, Text, TextField, Top, useToast } from "@toss/tds-mobile";
import { type PaymentStep, type TesterCount, type RewardAmount, IAP_SKU_MAP } from "../model/types";
import { calcPayment, toKRW, parseWonAmount } from "../model/calcPayment";
import { usePaymentSubmit } from "../model/usePaymentSubmit";
import { useIapProducts } from "../model/useIapProducts";
import { TesterCountStep } from "./TesterCountStep";
import { RewardAmountStep } from "./RewardAmountStep";
import { PaymentCompleteStep } from "./PaymentCompleteStep";
import { PaymentSystemErrorStep } from "./PaymentSystemErrorStep";
import { PaymentGiveUpStep } from "./PaymentGiveUpStep";
import { ResponsePeriodSheet } from "./ResponsePeriodSheet";
import { ROUTES } from "@/shared/constants/routes";
import { Route } from "@/routes/test/payment";

const DownArrowIcon = () => <Asset.Icon frameShape={Asset.frameShape.CleanW24} backgroundColor="transparent" name="icon-arrow-down-mono" color={adaptive.grey400} aria-hidden={true} ratio="1/1" />;

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
          setStep("main");
        }}
        onClose={() => setStep("main")}
      />
    );
  }

  if (step === "reward-amount") {
    return (
      <RewardAmountStep
        draft={draftRewardAmount}
        onSelect={setDraftRewardAmount}
        onConfirm={() => {
          setRewardAmount(draftRewardAmount);
          setStep("main");
        }}
        onClose={() => setStep("main")}
      />
    );
  }

  if (step === "complete") {
    return (
      <PaymentCompleteStep onClose={() => navigate({ to: ROUTES.TEST, replace: true })} />
    );
  }

  if (step === "app-market-verification-failed" || step === "toss-server-verification-failed") {
    if (verificationFailureCount >= 4) {
      return (
        <PaymentGiveUpStep onConfirm={() => navigate({ to: ROUTES.TEST, replace: true })} />
      );
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
              onSuccess: () => setStep("complete"),
            },
          )
        }
      />
    );
  }

  const iapSku = testerCount != null && rewardAmount != null ? IAP_SKU_MAP[rewardAmount]?.[testerCount] : undefined;
  const iapProduct = iapSku != null ? iapProducts?.find((product) => product.sku === iapSku) : undefined;
  const actualTotal = iapProduct?.displayAmount != null ? parseWonAmount(iapProduct.displayAmount) : undefined;

  const payment = testerCount != null && rewardAmount != null ? calcPayment(testerCount, rewardAmount, actualTotal) : null;
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
            value={rewardAmount != null ? toKRW(rewardAmount) : ""}
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
                titleWidthRatio={0.6}
                rightAlignment="center"
                title={
                  <ListHeader.TitleParagraph typography="t4" fontWeight="bold" color={adaptive.grey800}>
                    결제 금액
                  </ListHeader.TitleParagraph>
                }
                right={
                  <div className="pr-5">
                    <Text color={adaptive.red600} typography="st8" fontWeight="bold">
                      {displayTotal}
                    </Text>
                  </div>
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
                    topProps={{ color: adaptive.grey900, fontWeight: "bold" }}
                  />
                }
                right={
                  <ListRow.Texts
                    type="Right1RowTypeA"
                    top={toKRW(payment.total)}
                    topProps={{ color: adaptive.grey900, fontWeight: "bold" }}
                  />
                }
              />
            </List>
            <BottomInfo>
              <Post.H4 paddingBottom={16}>환불 정책</Post.H4>
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
                onClick={() =>
                  submitPayment(
                    {
                      draftId,
                      testerCount: testerCount!,
                      rewardAmount: rewardAmount!,
                      responsePeriod,
                    },
                    {
                      onSuccess: () => setStep("complete"),
                    },
                  )
                }
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
