import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { graniteEvent } from "@apps-in-toss/web-framework";
import { ConfirmDialog } from "@toss/tds-mobile";
import { FunnelLayout, type CTAMode } from "./FunnelLayout";
import { CategorySelectSheet } from "./CategorySelectSheet";
import { ServiceDescriptionStep } from "./ServiceDescriptionStep";
import { ServiceDescriptionNudgeSheet } from "./ServiceDescriptionNudgeSheet";
import { TestImageStep } from "./TestImageStep";
import { TestRegisterStep, type RegisterTab } from "./TestRegisterStep";
import { TestGuidePage } from "./TestGuidePage";
import { TestBasicInfoStep } from "./TestBasicInfoStep";
import { EditPhaseSheet } from "./EditPhaseSheet";
import { BasicInfoEditPage } from "./BasicInfoEditPage";
import { ServiceDescriptionEditPage } from "./ServiceDescriptionEditPage";
import { TestImageEditPage } from "./TestImageEditPage";
import { useFunnel } from "../model/useFunnel";
import { useTestCreateForm } from "../model/useTestCreateForm";
import { useSubmitTest } from "../model/useSubmitTest";
import type { BasicSubStep, EditPhase, QuestionTypeId } from "../model/types";
import { ROUTES } from "@/shared/constants/routes";
import { useScrollLock } from "@/shared/hooks/useScrollLock";
import { MultipleCreatePage } from "@/features/question-multiple/create";
import { ScaleCreatePage } from "@/features/question-scale/create";
import { AbCreatePage } from "@/features/question-ab/create";
import { TreeCreatePage } from "@/features/question-tree/create";
import { SubjectiveCreatePage } from "@/features/question-subjective/create";
import { FivesecCreatePage } from "@/features/question-fivesec/create";
import { CardSortCreatePage } from "@/features/question-cardsort/create";

interface Props {
  draftId?: number;
  fromPayment?: boolean;
}

export function TestCreateFunnel({ draftId, fromPayment = false }: Props) {
  const navigate = useNavigate();
  const funnel = useFunnel(fromPayment ? "register" : "basic");
  const form = useTestCreateForm();

  const [basicSubStep, setBasicSubStep] = useState<BasicSubStep>("name");
  const [registerTab, setRegisterTab] = useState<RegisterTab>("questions");
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [showServiceDescription, setShowServiceDescription] = useState(false);
  const [isServiceIntroSheetOpen, setIsServiceIntroSheetOpen] = useState(false);
  const [hasTestImages, setHasTestImages] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editPhase, setEditPhase] = useState<EditPhase | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<{
    id: string;
    typeId: QuestionTypeId;
  } | null>(null);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const { mutate: submitTest, isPending: isSubmitting } = useSubmitTest(draftId);
  const [showGuide, setShowGuide] = useState(false);

  const isOverlayOpen =
    isCategorySheetOpen || editPhase !== null || activeQuestion !== null || showGuide;
  useScrollLock(isOverlayOpen);
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitUnsubscribeRef = useRef<(() => void) | null>(null);
  const funnelIsFirstRef = useRef(funnel.isFirst);
  const funnelPrevRef = useRef(funnel.prev);
  useEffect(() => {
    funnelIsFirstRef.current = funnel.isFirst;
    funnelPrevRef.current = funnel.prev;
  }, [funnel.isFirst, funnel.prev]);

  useEffect(() => {
    try {
      const unsubscribe = graniteEvent.addEventListener("backEvent", {
        onEvent: () => {
          if (funnelIsFirstRef.current) {
            setIsExitDialogOpen(true);
          } else {
            funnelPrevRef.current();
          }
        },
        onError: (error) => {
          console.error("backEvent error", error);
        },
      });
      exitUnsubscribeRef.current = unsubscribe;
      return () => {
        unsubscribe();
        exitUnsubscribeRef.current = null;
      };
    } catch {
      console.warn("backEvent listener not supported in browser");
      return () => {};
    }
  }, []);

  useEffect(() => {
    if (!fromPayment) {
      useTestCreateForm.getState().reset();
    }

    return () => {
      if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExitConfirm = () => {
    exitUnsubscribeRef.current?.();
    exitUnsubscribeRef.current = null;
    setIsExitDialogOpen(false);
    navigate({ to: ROUTES.TEST });
  };

  const isAllComplete =
    form.name.trim().length > 0 && form.summary.trim().length > 0 && form.categories.length > 0;

  const isConfirmDisabled = (() => {
    switch (funnel.step) {
      case "basic":
        if (isFocused) return false;
        return !isAllComplete;
      case "service":
        return !showServiceDescription && form.serviceName.trim().length === 0;
      default:
        return false;
    }
  })();

  const ctaMode: CTAMode = (() => {
    if (editPhase || activeQuestion || isCategorySheetOpen) return "hidden";
    if (funnel.step === "register") return registerTab === "info" ? "submit-double" : "submit";
    if (funnel.step === "image") return "double";
    if (funnel.step === "basic") return "confirm";
    if (isFocused) return "confirm";
    if (funnel.step === "service") return "double";
    if (!hasInteracted) return "double";
    return "hidden";
  })();

  const handleFocus = () => {
    if (blurTimerRef.current) {
      clearTimeout(blurTimerRef.current);
      blurTimerRef.current = null;
    }
    setIsFocused(true);
    setHasInteracted(true);
  };

  const handleBlur = () => {
    blurTimerRef.current = setTimeout(() => {
      setIsFocused(false);
      if (
        funnel.step === "service" &&
        !showServiceDescription &&
        form.serviceName.trim().length > 0
      ) {
        setShowServiceDescription(true);
      }
      if (funnel.step === "basic") {
        if (basicSubStep === "name" && form.name.trim().length > 0) {
          setBasicSubStep("summary");
        } else if (basicSubStep === "summary" && form.summary.trim().length > 0) {
          setBasicSubStep("category");
        }
      }
      blurTimerRef.current = null;
    }, 100);
  };

  const dismissKeyboard = () => {
    const active = document.activeElement;
    if (active instanceof HTMLElement) {
      active.blur();
    }
    setIsFocused(false);
  };

  const handleHasImagesChange = useCallback((hasImages: boolean) => {
    setHasTestImages(hasImages);
  }, []);

  const handleBasicConfirm = () => {
    if (isFocused) {
      dismissKeyboard();
    } else {
      funnel.next();
    }
  };

  return (
    <>
      <FunnelLayout
        onConfirm={() => {
          if (funnel.step === "service") {
            dismissKeyboard();
            if (!showServiceDescription && form.serviceName.trim().length > 0) {
              setShowServiceDescription(true);
            }
          } else if (funnel.step === "basic") {
            handleBasicConfirm();
          } else {
            funnel.next();
          }
        }}
        onNext={() => {
          funnel.next();
        }}
        onCancel={() => {
          if (funnel.step === "register") {
            setIsEditSheetOpen(true);
          } else if (funnel.step === "basic") {
            setIsExitDialogOpen(true);
          } else {
            funnel.prev();
          }
        }}
        onSubmit={() => submitTest()}
        currentStep={funnel.step}
        ctaMode={ctaMode}
        confirmLabel={funnel.step === "basic" && !isFocused ? "다음으로" : "확인"}
        confirmFixedAboveKeyboard={funnel.step !== "basic" || isFocused}
        isConfirmDisabled={isConfirmDisabled}
        isNextDisabled={
          funnel.step === "service"
            ? false
            : funnel.step === "image"
              ? !hasTestImages
              : !isAllComplete
        }
        cancelLabel={
          funnel.step === "register"
            ? "수정하기"
            : funnel.step === "service" || funnel.step === "image"
              ? "이전"
              : "취소"
        }
        isSubmitDisabled={!isAllComplete || !form.questions.some((q) => !!q.data) || isSubmitting}
        submitLabel="테스트 만들기"
        doubleBottomAccessory={
          funnel.step === "service" ? (
            <button
              type="button"
              onClick={() => setIsServiceIntroSheetOpen(true)}
              className="bg-transparent border-0 cursor-pointer underline text-sm text-[#4e5968]"
            >
              서비스 소개란?
            </button>
          ) : undefined
        }
      >
        {funnel.step === "register" ? (
          <TestRegisterStep
            activeTab={registerTab}
            onTabChange={setRegisterTab}
            onEnterQuestion={setActiveQuestion}
            onGuideView={() => setShowGuide(true)}
          />
        ) : funnel.step === "image" ? (
          <motion.div
            key="image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <TestImageStep onHasImagesChange={handleHasImagesChange} />
          </motion.div>
        ) : funnel.step === "service" ? (
          <motion.div
            key="service"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <ServiceDescriptionStep
              showDescriptionField={showServiceDescription}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onServiceNameConfirm={() => {
                if (!showServiceDescription && form.serviceName.trim().length > 0) {
                  setShowServiceDescription(true);
                }
              }}
            />
          </motion.div>
        ) : (
          <TestBasicInfoStep
            subStep={basicSubStep}
            onOpenCategorySheet={() => setIsCategorySheetOpen(true)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        )}
      </FunnelLayout>

      <AnimatePresence>
        {isCategorySheetOpen && (
          <CategorySelectSheet
            selectedCategories={form.categories}
            onToggle={form.toggleCategory}
            onConfirm={() => setIsCategorySheetOpen(false)}
            onCancel={() => {
              form.setCategories([]);
              setIsCategorySheetOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      <ServiceDescriptionNudgeSheet
        open={isServiceIntroSheetOpen}
        onClose={() => setIsServiceIntroSheetOpen(false)}
      />

      <EditPhaseSheet
        open={isEditSheetOpen}
        onClose={() => setIsEditSheetOpen(false)}
        onConfirm={(phase) => {
          setEditPhase(phase);
        }}
      />

      <AnimatePresence>
        {editPhase === "basic" && (
          <BasicInfoEditPage key="edit-basic" onClose={() => setEditPhase(null)} />
        )}
        {editPhase === "service" && (
          <ServiceDescriptionEditPage key="edit-service" onClose={() => setEditPhase(null)} />
        )}
        {editPhase === "image" && (
          <TestImageEditPage key="edit-image" onClose={() => setEditPhase(null)} />
        )}
        {showGuide && <TestGuidePage key="guide" onClose={() => setShowGuide(false)} />}
        {activeQuestion?.typeId === "OBJECTIVE" && (
          <MultipleCreatePage
            key="question-multiple"
            questionId={activeQuestion.id}
            onClose={() => setActiveQuestion(null)}
          />
        )}
        {activeQuestion?.typeId === "SUBJECTIVE" && (
          <SubjectiveCreatePage
            key="question-subjective"
            questionId={activeQuestion.id}
            onClose={() => setActiveQuestion(null)}
          />
        )}
        {activeQuestion?.typeId === "SCALE" && (
          <ScaleCreatePage
            key="question-scale"
            questionId={activeQuestion.id}
            onClose={() => setActiveQuestion(null)}
          />
        )}
        {activeQuestion?.typeId === "AB_TEST" && (
          <AbCreatePage
            key="question-ab"
            questionId={activeQuestion.id}
            onClose={() => setActiveQuestion(null)}
          />
        )}
        {activeQuestion?.typeId === "CARD_SORTING" && (
          <CardSortCreatePage
            key="question-card"
            questionId={activeQuestion.id}
            onClose={() => setActiveQuestion(null)}
          />
        )}
        {activeQuestion?.typeId === "TREE_TEST" && (
          <TreeCreatePage
            key="question-tree"
            questionId={activeQuestion.id}
            onClose={() => setActiveQuestion(null)}
          />
        )}
        {activeQuestion?.typeId === "FIVE_SECOND" && (
          <FivesecCreatePage
            key="question-fivesec"
            questionId={activeQuestion.id}
            onClose={() => setActiveQuestion(null)}
          />
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={isExitDialogOpen}
        title="테스트 등록을 그만할까요?"
        description="삭제하면 복구할 수 없어요"
        onClose={() => setIsExitDialogOpen(false)}
        cancelButton={
          <ConfirmDialog.CancelButton size="xlarge" onClick={() => setIsExitDialogOpen(false)}>
            닫기
          </ConfirmDialog.CancelButton>
        }
        confirmButton={
          <ConfirmDialog.ConfirmButton color="danger" size="xlarge" onClick={handleExitConfirm}>
            나가기
          </ConfirmDialog.ConfirmButton>
        }
      />
    </>
  );
}
