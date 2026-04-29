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
import { TestBasicInfoStep } from "./TestBasicInfoStep";
import { EditPhaseSheet } from "./EditPhaseSheet";
import { BasicInfoEditPage } from "./BasicInfoEditPage";
import { ServiceDescriptionEditPage } from "./ServiceDescriptionEditPage";
import { TestImageEditPage } from "./TestImageEditPage";
import { useFunnel } from "../model/useFunnel";
import { useTestCreateForm } from "../model/useTestCreateForm";
import type { EditPhase } from "../model/types";
import { ROUTES } from "@/shared/constants/routes";

export function TestCreateFunnel() {
  const navigate = useNavigate();
  const funnel = useFunnel();
  const form = useTestCreateForm();
  const [registerTab, setRegisterTab] = useState<RegisterTab>("info");
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [showServiceDescription, setShowServiceDescription] = useState(false);
  const [isServiceIntroSheetOpen, setIsServiceIntroSheetOpen] = useState(false);
  const [hasTestImages, setHasTestImages] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editPhase, setEditPhase] = useState<EditPhase | null>(null);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitUnsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = graniteEvent.addEventListener("backEvent", {
        onEvent: () => {
          setIsExitDialogOpen(true);
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
    useTestCreateForm.getState().reset();

    return () => {
      if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    };
  }, []);

  const handleExitConfirm = () => {
    exitUnsubscribeRef.current?.();
    exitUnsubscribeRef.current = null;
    setIsExitDialogOpen(false);
    navigate({ to: ROUTES.TEST });
  };

  const isConfirmDisabled = (() => {
    switch (funnel.step) {
      case "name":
        return form.name.trim().length === 0;
      case "summary":
        return form.summary.trim().length === 0;
      case "service":
        return !showServiceDescription && form.serviceName.trim().length === 0;
      default:
        return false;
    }
  })();

  const isAllComplete = form.name.trim().length > 0 && form.summary.trim().length > 0 && form.categories.length > 0;

  const ctaMode: CTAMode = (() => {
    if (editPhase) return "hidden";
    if (isCategorySheetOpen) return "hidden";
    if (funnel.step === "register") return registerTab === "info" ? "submit-double" : "submit";
    if (funnel.step === "image") return "double";
    if (isFocused) return "confirm";
    if (funnel.step === "service" && showServiceDescription) return "double";
    if (funnel.step === "service") return "double";
    if (!hasInteracted) return "double";
    if (funnel.step === "category" && isAllComplete) return "double";
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

  return (
    <>
      <FunnelLayout
        onConfirm={() => {
          if (funnel.step === "service") {
            dismissKeyboard();
            if (!showServiceDescription && form.serviceName.trim().length > 0) {
              setShowServiceDescription(true);
            }
          } else {
            funnel.next();
          }
        }}
        onNext={() => {
          if (funnel.step === "service" && form.serviceName.trim().length === 0) {
            setIsServiceIntroSheetOpen(true);
          } else {
            funnel.next();
          }
        }}
        onCancel={() => {
          if (funnel.step === "register") {
            setIsEditSheetOpen(true);
          } else {
            funnel.prev();
          }
        }}
        onSubmit={() => {
          // TODO: 테스트 만들기 제출
        }}
        currentStep={funnel.step}
        ctaMode={ctaMode}
        isConfirmDisabled={isConfirmDisabled}
        isNextDisabled={
          funnel.step === "service"
            ? false
            : funnel.step === "image"
              ? !hasTestImages
              : !isAllComplete
        }
        cancelLabel={funnel.step === "register" ? "수정하기" : funnel.step === "service" || funnel.step === "image" ? "이전" : "취소"}
        isSubmitDisabled
        submitLabel="테스트 만들기"
      >
        {funnel.step === "register" ? (
          <TestRegisterStep activeTab={registerTab} onTabChange={setRegisterTab} />
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
          <TestBasicInfoStep
            step={funnel.step}
            currentIndex={funnel.currentIndex}
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
        onSkip={() => { setIsServiceIntroSheetOpen(false); funnel.next(); }}
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
