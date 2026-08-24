/**
 * Creator Wizard Navigation Hook
 * Handles package-aware step ordering, step transitions, package change routing,
 * and immediate non-smooth scroll-to-top on navigation.
 */

import { useCallback } from 'react';
import { STEP_IDS, getCreatorSteps } from '../config/stepConfig.js';
import { validateStep } from '../utils/creatorValidation.js';

export function useCreatorNavigation(builderData, uiState, setUIState) {
  const currentPlan = builderData.plan || 'PREMIUM';
  const steps = getCreatorSteps(currentPlan);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'auto' // Non-smooth, immediate scroll transition per product spec
    });
  };

  const goToStep = useCallback(
    (stepId) => {
      setUIState((prev) => ({
        ...prev,
        currentStepId: stepId,
        errorMsg: ''
      }));
      scrollToTop();
    },
    [setUIState]
  );

  const nextStep = useCallback(() => {
    const currentStepId = uiState.currentStepId;

    // Validate current step before proceeding
    const validation = validateStep(currentStepId, builderData, currentPlan);
    if (!validation.isValid) {
      setUIState((prev) => ({ ...prev, errorMsg: validation.error }));
      return false;
    }

    const currentIndex = steps.findIndex((s) => s.id === currentStepId);
    if (currentIndex >= 0 && currentIndex < steps.length - 1) {
      const nextStepObj = steps[currentIndex + 1];
      goToStep(nextStepObj.id);
      return true;
    }
    return false;
  }, [uiState.currentStepId, builderData, currentPlan, steps, goToStep, setUIState]);

  const previousStep = useCallback(() => {
    const currentStepId = uiState.currentStepId;
    const currentIndex = steps.findIndex((s) => s.id === currentStepId);
    if (currentIndex > 0) {
      const prevStepObj = steps[currentIndex - 1];
      goToStep(prevStepObj.id);
      return true;
    }
    return false;
  }, [uiState.currentStepId, steps, goToStep]);

  /**
   * Package Change Handler: ALWAYS returns user to STEP_IDS.PACKAGE (Step 2)
   */
  const handlePackageChangeRequest = useCallback(() => {
    goToStep(STEP_IDS.PACKAGE);
  }, [goToStep]);

  return {
    steps,
    currentStepId: uiState.currentStepId,
    goToStep,
    nextStep,
    previousStep,
    handlePackageChangeRequest
  };
}
