import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { adaptive } from "@toss/tds-colors";
import {
  Asset,
  CTAButton,
  Checkbox,
  FixedBottomCTA,
  List,
  ListRow,
  Text,
  Tooltip,
  Top,
} from "@toss/tds-mobile";
import { QuestionHeader } from "@/features/test-participate/ui/QuestionHeader";
import type { QuestionAnswerProps } from "@/features/test-participate/model/types";

type Phase = "ready" | "preview" | "countdown" | "answer";

interface Props extends QuestionAnswerProps<"fivesec"> {
  onPrev: () => void;
  onGoNext: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function FivesecAnswerView({
  question,
  answer,
  onChange,
  onPrev,
  onGoNext,
  isFirst,
  isLast,
}: Props) {
  const {
    title,
    description,
    duration,
    isMultiSelectEnabled,
    minSelectCount,
    maxSelectCount,
    choices,
  } = question.data;

  const [phase, setPhase] = useState<Phase>("ready");
  const [remaining, setRemaining] = useState(duration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedIds = answer?.selectedIds ?? [];
  const canGoNext = selectedIds.length >= minSelectCount;

  function startCountdown() {
    setPhase("countdown");
    setRemaining(duration);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setPhase("answer");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function handleSelect(id: string) {
    if (isMultiSelectEnabled) {
      const next = selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : selectedIds.length < maxSelectCount
          ? [...selectedIds, id]
          : selectedIds;
      onChange({ type: "fivesec", selectedIds: next });
    } else {
      const next = selectedIds.includes(id) ? [] : [id];
      onChange({ type: "fivesec", selectedIds: next });
    }
  }

  if (phase === "ready") {
    return (
      <div className="flex flex-col flex-1 bg-white">
        <div className="flex-1">
          <Top
            title={
              <Top.TitleParagraph size={22} color={adaptive.grey900}>
                {`5초간\n아래 사진에 집중해주세요`}
              </Top.TitleParagraph>
            }
            subtitleBottom={
              <Top.SubtitleParagraph size={15}>
                {`제한된 시간 동안 이미지를 보게 될 거예요. \n이미지가 무슨 내용인지 이해하고, 최대한 많은 정보를 기억하려고 해보세요.`}
              </Top.SubtitleParagraph>
            }
            upper={
              <Top.UpperAssetContent
                content={
                  <Asset.Lottie
                    frameShape={Asset.frameShape.CleanW60}
                    backgroundColor="transparent"
                    src="https://static.toss.im/lotties-common/siren-2-spot.json"
                    loop={true}
                    speed={1}
                    aria-hidden={true}
                    style={{ aspectRatio: `1/1` }}
                  />
                }
              />
            }
          />
        </div>

        <div className="bg-white">
          <div className="px-5 pb-2">
            <div className="flex justify-end">
              <div className="flex w-[calc(50%-4px)] justify-center">
                <Tooltip
                  open={true}
                  onOpenChange={() => {}}
                  message="준비됐으면 눌러주세요"
                  messageAlign="right"
                  placement="top"
                  size="medium"
                  clipToEnd="none"
                  motionVariant="strong"
                >
                  <span className="block h-1 opacity-0" aria-hidden={true} />
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="flex gap-2 px-5 pb-[calc(env(safe-area-inset-bottom,0px)+20px)]">
            {!isFirst && (
              <div className="flex-1">
                <CTAButton color="dark" variant="weak" onClick={onPrev}>
                  이전
                </CTAButton>
              </div>
            )}
            <div className={isFirst ? "w-full" : "flex-1"}>
              <CTAButton onClick={() => setPhase("preview")}>다음</CTAButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "preview") {
    return (
      <div className="flex flex-col flex-1 bg-white">
        <QuestionHeader
          categoryLabel="5초 테스트"
          title="5초간 아래 사진에 집중해주세요"
        />
        <div className="flex-1 px-5 pt-4">
          <motion.div
            role="button"
            onClick={startCountdown}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              width: "100%",
              height: 212,
              backgroundColor: adaptive.grey100,
              borderRadius: 16,
              boxShadow: `inset 0 0 0 1px ${adaptive.greyOpacity100}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text color={adaptive.blue500} typography="st8" fontWeight="semibold">
              눌러서 확인하기
            </Text>
          </motion.div>
        </div>
        <div className="h-18 shrink-0" aria-hidden={true} />
      </div>
    );
  }

  if (phase === "countdown") {
    return (
      <motion.div
        className="flex flex-col flex-1 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <QuestionHeader
          categoryLabel="5초 테스트"
          title="5초간 아래 사진에 집중해주세요"
        />
        <div className="flex-1 px-5 pt-4">
          <div className="relative w-full h-53 rounded-2xl bg-pink-200 shadow-[inset_0_0_0_1px_rgba(2,32,71,0.05)] flex items-center justify-center">
            <span className="text-5xl font-bold text-white">{remaining}</span>
          </div>
        </div>
        <div className="h-18 shrink-0" aria-hidden={true} />
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <QuestionHeader
        categoryLabel="5초 테스트"
        title={title}
        description={description}
      />
      <List>
        {choices.map((choice) => {
          const checked = selectedIds.includes(choice.id);
          return (
            <div
              key={choice.id}
              className="bg-white"
              onClick={() => handleSelect(choice.id)}
            >
              <ListRow
                role="checkbox"
                aria-checked={checked}
                contents={<ListRow.Texts type="1RowTypeA" top={choice.name} />}
                right={
                  isMultiSelectEnabled ? (
                    <Checkbox.Line size={24} checked={checked} />
                  ) : (
                    <Checkbox.Circle size={24} checked={checked} />
                  )
                }
                verticalPadding="large"
              />
            </div>
          );
        })}
      </List>
      {isFirst ? (
        <FixedBottomCTA disabled={!canGoNext} onClick={onGoNext}>
          {isLast ? "완료하기" : "다음"}
        </FixedBottomCTA>
      ) : (
        <FixedBottomCTA.Double
          leftButton={
            <CTAButton color="dark" variant="weak" onClick={onPrev}>
              이전
            </CTAButton>
          }
          rightButton={
            <CTAButton disabled={!canGoNext} onClick={onGoNext}>
              {isLast ? "완료하기" : "다음"}
            </CTAButton>
          }
        />
      )}
    </div>
  );
}
