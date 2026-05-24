import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { adaptive } from "@toss/tds-colors";
import { Border, CTAButton, FixedBottomCTA, ListRow, Text, Top } from "@toss/tds-mobile";
import { type PaymentStep, type TesterCount, type RewardAmount } from "../model/types";
import { calcPayment, toKRW } from "../model/calcPayment";
import { TesterCountStep } from "./TesterCountStep";
import { RewardAmountStep } from "./RewardAmountStep";

export function PaymentFunnel() {
  const navigate = useNavigate();
  const [step, setStep] = useState<PaymentStep>("main");
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

  const payment =
    testerCount != null && rewardAmount != null ? calcPayment(testerCount, rewardAmount) : null;

  return (
    <div className="flex flex-col h-full bg-white">
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            결제하기
          </Top.TitleParagraph>
        }
        subtitleBottom={
          <Top.SubtitleParagraph>테스터 수와 리워드 금액을 설정해주세요</Top.SubtitleParagraph>
        }
      />
      <ListRow
        left={
          <ListRow.AssetIcon name="icon-rank-1-mono" color="#4365cc" backgroundColor="#eef1fb" />
        }
        contents={
          <ListRow.Texts type="1RowTypeA" top="테스터 수" topProps={{ color: adaptive.grey700 }} />
        }
        right={
          testerCount != null ? (
            <ListRow.Texts
              type="Right1RowTypeA"
              top={`${testerCount}명`}
              topProps={{ color: adaptive.grey700 }}
            />
          ) : undefined
        }
        verticalPadding="large"
        arrowType="right"
        onClick={() => {
          setDraftTesterCount(testerCount);
          setStep("tester-count");
        }}
      />
      {testerCount != null && (
        <ListRow
          left={
            <ListRow.AssetIcon name="icon-rank-2-mono" color="#4365cc" backgroundColor="#eef1fb" />
          }
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top="리워드 금액"
              topProps={{ color: adaptive.grey700 }}
            />
          }
          right={
            rewardAmount != null ? (
              <ListRow.Texts
                type="Right1RowTypeA"
                top={toKRW(rewardAmount)}
                topProps={{ color: adaptive.grey700 }}
              />
            ) : undefined
          }
          verticalPadding="large"
          arrowType="right"
          onClick={() => {
            setDraftRewardAmount(rewardAmount);
            setStep("reward-amount");
          }}
        />
      )}
      {payment != null && (
        <>
          <Border variant="height16" />
          <div className="flex items-center justify-between px-6 py-4">
            <Text typography="t4" fontWeight="bold" color={adaptive.grey800}>
              결제 금액
            </Text>
            <Text color={adaptive.red600} typography="st8" fontWeight="bold">
              {toKRW(payment.total)}
            </Text>
          </div>
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
              <ListRow.Texts type="1RowTypeA" top="수수료" topProps={{ color: adaptive.grey700 }} />
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
              <ListRow.Texts type="1RowTypeA" top="부가세" topProps={{ color: adaptive.grey700 }} />
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
        </>
      )}
      {payment != null && (
        <FixedBottomCTA.Double
          leftButton={
            <CTAButton color="dark" variant="weak" onClick={() => navigate({ to: ".." })}>
              이전
            </CTAButton>
          }
          rightButton={
            <CTAButton onClick={() => {}}>
              {toKRW(payment.total)} 결제하기
            </CTAButton>
          }
        />
      )}
    </div>
  );
}
