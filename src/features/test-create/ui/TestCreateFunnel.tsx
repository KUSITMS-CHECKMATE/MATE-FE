import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { graniteEvent } from "@apps-in-toss/web-framework";
import { ConfirmDialog, Skeleton, useToast } from "@toss/tds-mobile";
import { FunnelLayout, type CTAMode } from "./FunnelLayout";
import { CategorySelectSheet } from "./CategorySelectSheet";
import { ServiceDescriptionStep } from "./ServiceDescriptionStep";
import { ServiceDescriptionNudgeSheet } from "./ServiceDescriptionNudgeSheet";
import { TestImageStep } from "./TestImageStep";
import { TestRegisterStep, type RegisterTab } from "./TestRegisterStep";
import { TestGuidePage } from "@/shared/ui/TestGuidePage";
import { TestBasicInfoStep } from "./TestBasicInfoStep";
import { EditPhaseSheet } from "./EditPhaseSheet";
import { BasicInfoEditPage } from "./BasicInfoEditPage";
import { ServiceDescriptionEditPage } from "./ServiceDescriptionEditPage";
import { TestImageEditPage } from "./TestImageEditPage";
import { useFunnel } from "../model/useFunnel";
import { useTestCreateForm } from "../model/useTestCreateForm";
import { useSaveDraft } from "../model/useSaveDraft";
import { loadDraftIntoForm } from "../model/draftMapper";
import type { BasicSubStep, EditPhase, QuestionTypeId } from "../model/types";
import { getDraft } from "@/shared/api/generated/testDraft";
import { ROUTES } from "@/shared/constants/routes";
import { useScrollLock } from "@/shared/hooks/useScrollLock";
import { useTempSaveAccessoryButton } from "@/shared/hooks/useTempSaveAccessoryButton";
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
  /** 임시저장한 초안을 이어서 작성하기 위해 진입한 경우 */
  resume?: boolean;
}

function TestCreateResumeSkeleton() {
  return (
    <div className="flex flex-col gap-1 px-5 pt-6">
      <Skeleton custom={["title"]} repeatLastItemCount={0} background="greyOpacity100" />
      <div className="pt-4">
        <Skeleton custom={["card"]} repeatLastItemCount={0} background="greyOpacity100" />
      </div>
      <div className="flex flex-col gap-3 pt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} custom={["title", "subtitle"]} repeatLastItemCount={0} background="greyOpacity100" />
        ))}
      </div>
    </div>
  );
}

export function TestCreateFunnel({ draftId, fromPayment = false, resume = false }: Props) {
  const navigate = useNavigate();
  const funnel = useFunnel(fromPayment ? "register" : "basic");
  const form = useTestCreateForm();
  const { openToast } = useToast();

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
  const [isQuestionTypeSheetOpen, setIsQuestionTypeSheetOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<{
    id: string;
    typeId: QuestionTypeId;
  } | null>(null);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  // 첫 임시저장 전까지는 draftId가 없다(서버에 초안 미생성). 첫 저장 성공 시 useSaveDraft가 채워준다.
  const [currentDraftId, setCurrentDraftId] = useState(draftId);
  const saveDraft = useSaveDraft(currentDraftId, setCurrentDraftId);
  const isSaving = saveDraft.isPending;
  const [showGuide, setShowGuide] = useState(false);
  const [isResuming, setIsResuming] = useState(resume && !!draftId);

  const isOverlayOpen =
    isCategorySheetOpen || editPhase !== null || activeQuestion !== null || showGuide || isQuestionTypeSheetOpen;
  useScrollLock(isOverlayOpen);
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitUnsubscribeRef = useRef<(() => void) | null>(null);
  const funnelIsFirstRef = useRef(funnel.isFirst);
  const funnelPrevRef = useRef(funnel.prev);
  const showGuideRef = useRef(showGuide);
  const editPhaseRef = useRef(editPhase);
  const activeQuestionRef = useRef(activeQuestion);
  const isQuestionTypeSheetOpenRef = useRef(isQuestionTypeSheetOpen);
  useEffect(() => {
    funnelIsFirstRef.current = funnel.isFirst;
    funnelPrevRef.current = funnel.prev;
  }, [funnel.isFirst, funnel.prev]);
  useEffect(() => {
    showGuideRef.current = showGuide;
  }, [showGuide]);
  useEffect(() => {
    editPhaseRef.current = editPhase;
  }, [editPhase]);
  useEffect(() => {
    activeQuestionRef.current = activeQuestion;
  }, [activeQuestion]);
  useEffect(() => {
    isQuestionTypeSheetOpenRef.current = isQuestionTypeSheetOpen;
  }, [isQuestionTypeSheetOpen]);

  useEffect(() => {
    try {
      const unsubscribe = graniteEvent.addEventListener("backEvent", {
        onEvent: () => {
          if (activeQuestionRef.current) {
            setActiveQuestion(null);
          } else if (editPhaseRef.current) {
            setEditPhase(null);
          } else if (showGuideRef.current) {
            setShowGuide(false);
          } else if (isQuestionTypeSheetOpenRef.current) {
            setIsQuestionTypeSheetOpen(false);
          } else if (funnelIsFirstRef.current) {
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
    if (fromPayment) {
      // 결제 화면에서 되돌아온 경우: 메모리 폼 상태를 그대로 유지
    } else if (resume && draftId) {
      // 임시저장한 초안 이어서 작성: 서버에서 조회해 폼에 복원
      useTestCreateForm.getState().reset();
      getDraft(draftId)
        .then((res) => {
          const draft = res.data.data;
          // 이미 결제/발행된 초안은 이어쓰기 대상이 아님(목록 조회 이후 상태가 바뀐 경우 대비)
          if (!draft || (draft.status && draft.status !== "DRAFT")) return;
          loadDraftIntoForm(draft);

          // 이미 입력된 항목은 재입력 없이 바로 보이도록 서브스텝을 현재 위치까지 앞당긴다
          const name = draft.title ?? "";
          const summary = draft.description ?? "";
          if (name.trim().length > 0 && summary.trim().length > 0) {
            setBasicSubStep("category");
          } else if (name.trim().length > 0) {
            setBasicSubStep("summary");
          }
          if ((draft.serviceName ?? "").trim().length > 0) {
            setShowServiceDescription(true);
          }
        })
        .catch(() => {
          // 조회 실패 시 빈 폼으로 시작
          useTestCreateForm.getState().reset();
        })
        .finally(() => {
          setIsResuming(false);
        });
    } else {
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

  const showSavedToast = () => {
    openToast("임시 저장을 완료했어요.", {
      type: "bottom",
      lottie: "https://static.toss.im/lotties-common/check-green-spot.json",
      higherThanCTA: true,
    });
  };

  const goToPayment = (id: number) => {
    exitUnsubscribeRef.current?.();
    exitUnsubscribeRef.current = null;
    navigate({ to: ROUTES.TEST_PAYMENT, search: { draftId: id }, replace: true });
  };

  // 액세서리 "임시저장" 버튼: 내용을 저장하고 완료 토스트 표시(화면 이동 없음)
  const handleTempSave = async () => {
    if (isSaving) return;
    try {
      await saveDraft.mutateAsync();
      showSavedToast();
    } catch {
      // 실패 토스트는 useSaveDraft.onError에서 처리
    }
  };
  useTempSaveAccessoryButton(handleTempSave);

  // "테스트 만들기" CTA: 별도 확인 다이얼로그 없이 항상 임시저장 후 결제로 이동
  const handleSubmitCreate = async () => {
    if (isSaving) return;
    let id: number;
    try {
      id = await saveDraft.mutateAsync();
    } catch {
      return; // 실패 토스트는 useSaveDraft.onError에서 처리
    }
    goToPayment(id);
  };

  const isAllComplete = form.name.trim().length > 0 && form.summary.trim().length > 0 && form.categories.length > 0;

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
      if (funnel.step === "service" && !showServiceDescription && form.serviceName.trim().length > 0) {
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

  if (isResuming) {
    return <TestCreateResumeSkeleton />;
  }

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
        onSubmit={handleSubmitCreate}
        currentStep={funnel.step}
        ctaMode={ctaMode}
        confirmLabel={funnel.step === "basic" && !isFocused ? "다음으로" : "확인"}
        confirmFixedAboveKeyboard={funnel.step !== "basic" || isFocused}
        isConfirmDisabled={isConfirmDisabled}
        isNextDisabled={funnel.step === "service" ? false : funnel.step === "image" ? !hasTestImages : !isAllComplete}
        cancelLabel={funnel.step === "register" ? "수정하기" : funnel.step === "service" || funnel.step === "image" ? "이전" : "닫기"}
        isSubmitDisabled={
          !isAllComplete ||
          form.questions.length === 0 ||
          !form.questions.every((q) => !!q.data) ||
          isSaving
        }
        submitLabel="테스트 만들기"
        doubleBottomAccessory={
          funnel.step === "service" ? (
            <button type="button" onClick={() => setIsServiceIntroSheetOpen(true)} className="bg-transparent border-0 cursor-pointer underline text-sm text-[#4e5968]">
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
            isQuestionTypeSheetOpen={isQuestionTypeSheetOpen}
            onOpenQuestionTypeSheet={() => setIsQuestionTypeSheetOpen(true)}
            onCloseQuestionTypeSheet={() => setIsQuestionTypeSheetOpen(false)}
          />
        ) : funnel.step === "image" ? (
          <motion.div key="image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <TestImageStep onHasImagesChange={handleHasImagesChange} />
          </motion.div>
        ) : funnel.step === "service" ? (
          <motion.div key="service" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
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
          <TestBasicInfoStep subStep={basicSubStep} onOpenCategorySheet={() => setIsCategorySheetOpen(true)} onFocus={handleFocus} onBlur={handleBlur} />
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

      <ServiceDescriptionNudgeSheet open={isServiceIntroSheetOpen} onClose={() => setIsServiceIntroSheetOpen(false)} />

      <EditPhaseSheet
        open={isEditSheetOpen}
        onClose={() => setIsEditSheetOpen(false)}
        onConfirm={(phase) => {
          setEditPhase(phase);
        }}
      />

      <AnimatePresence>
        {editPhase === "basic" && <BasicInfoEditPage key="edit-basic" onClose={() => setEditPhase(null)} />}
        {editPhase === "service" && <ServiceDescriptionEditPage key="edit-service" onClose={() => setEditPhase(null)} />}
        {editPhase === "image" && <TestImageEditPage key="edit-image" onClose={() => setEditPhase(null)} />}
        {showGuide && <TestGuidePage key="guide" onClose={() => setShowGuide(false)} />}
        {activeQuestion?.typeId === "OBJECTIVE" && <MultipleCreatePage key="question-multiple" questionId={activeQuestion.id} onClose={() => setActiveQuestion(null)} />}
        {activeQuestion?.typeId === "SUBJECTIVE" && <SubjectiveCreatePage key="question-subjective" questionId={activeQuestion.id} onClose={() => setActiveQuestion(null)} />}
        {activeQuestion?.typeId === "SCALE" && <ScaleCreatePage key="question-scale" questionId={activeQuestion.id} onClose={() => setActiveQuestion(null)} />}
        {activeQuestion?.typeId === "AB_TEST" && <AbCreatePage key="question-ab" questionId={activeQuestion.id} onClose={() => setActiveQuestion(null)} />}
        {activeQuestion?.typeId === "CARD_SORTING" && <CardSortCreatePage key="question-card" questionId={activeQuestion.id} onClose={() => setActiveQuestion(null)} />}
        {activeQuestion?.typeId === "TREE_TEST" && <TreeCreatePage key="question-tree" questionId={activeQuestion.id} onClose={() => setActiveQuestion(null)} />}
        {activeQuestion?.typeId === "FIVE_SECOND" && <FivesecCreatePage key="question-fivesec" questionId={activeQuestion.id} onClose={() => setActiveQuestion(null)} />}
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
