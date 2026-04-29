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
import { TestRegisterStep } from "./TestRegisterStep";
import { TestBasicInfoStep } from "./TestBasicInfoStep";
import { useFunnel } from "../model/useFunnel";
import { useTestCreateForm } from "../model/useTestCreateForm";

export function TestCreateFunnel() {
  const navigate = useNavigate();
  const funnel = useFunnel();
  const form = useTestCreateForm();
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [showServiceDescription, setShowServiceDescription] = useState(false);
  const [isServiceIntroSheetOpen, setIsServiceIntroSheetOpen] = useState(false);
  const [hasTestImages, setHasTestImages] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitUnsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
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
  }, []);

  const handleExitConfirm = () => {
    exitUnsubscribeRef.current?.();
    exitUnsubscribeRef.current = null;
    setIsExitDialogOpen(false);
    navigate({ to: "/" });
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
    if (isCategorySheetOpen) return "hidden";
    if (funnel.step === "register") return "submit";
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
        onCancel={funnel.prev}
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
        cancelLabel={funnel.step === "service" || funnel.step === "image" ? "이전" : "취소"}
        isSubmitDisabled
        submitLabel="테스트 만들기"
      >
        {funnel.step === "register" ? (
          <TestRegisterStep />
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
