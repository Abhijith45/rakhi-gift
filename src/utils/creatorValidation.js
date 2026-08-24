/**
 * Creator Form Validation Utilities
 * Enforces package-aware validation rules across creator wizard steps.
 */

import { getPlanConfig, isThemeAllowedForPlan } from '../config/planConfig.js';
import { STEP_IDS } from '../config/stepConfig.js';

export function validateStep(stepId, builderData, planKey = 'PREMIUM') {
  const plan = getPlanConfig(planKey);

  switch (stepId) {
    case STEP_IDS.DETAILS: {
      if (!builderData?.senderName || !builderData.senderName.trim()) {
        return { isValid: false, error: 'Please enter your name (Brother).' };
      }
      if (!builderData?.recipientName || !builderData.recipientName.trim()) {
        return { isValid: false, error: 'Please enter your sister’s name (Recipient).' };
      }
      if (builderData?.creatorEmail && builderData.creatorEmail.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(builderData.creatorEmail.trim())) {
          return { isValid: false, error: 'Please enter a valid email address.' };
        }
      }
      return { isValid: true, error: null };
    }

    case STEP_IDS.PACKAGE: {
      if (!builderData?.plan || !['BASIC', 'PREMIUM', 'DELUXE'].includes(builderData.plan)) {
        return { isValid: false, error: 'Please select a gift package.' };
      }
      return { isValid: true, error: null };
    }

    case STEP_IDS.MEMORIES: {
      const count = builderData?.photos?.length || 0;
      if (count < 1) {
        return { isValid: false, error: 'Please add at least 1 photo memory to continue.' };
      }
      if (count > plan.maxPhotos) {
        return {
          isValid: false,
          error: `The ${plan.name} supports a maximum of ${plan.maxPhotos} photos. Please remove ${count - plan.maxPhotos} photo(s) or upgrade package.`
        };
      }
      return { isValid: true, error: null };
    }

    case STEP_IDS.MESSAGE: {
      const msg = builderData?.message?.trim() || '';
      if (msg.length < 20) {
        return { isValid: false, error: 'Please write a message of at least 20 characters.' };
      }
      if (msg.length > 1200) {
        return { isValid: false, error: 'Message cannot exceed 1,200 characters.' };
      }
      return { isValid: true, error: null };
    }

    case STEP_IDS.PERSONALIZE: {
      if (!plan.reasons && !plan.timeline && !plan.siblingFun) {
        return { isValid: true, error: null };
      }

      // 1. Validate Reasons (3–5 items)
      const reasons = builderData?.reasons || [];
      if (reasons.length < 3) {
        return { isValid: false, error: 'Please add at least 3 reasons why your sister is special.' };
      }
      if (reasons.length > 5) {
        return { isValid: false, error: 'You can add up to 5 special reasons.' };
      }
      for (let i = 0; i < reasons.length; i++) {
        if (!reasons[i].title?.trim()) {
          return { isValid: false, error: `Please enter a title for Reason #${i + 1}.` };
        }
        if (!reasons[i].text?.trim()) {
          return { isValid: false, error: `Please enter a description for Reason #${i + 1}.` };
        }
      }

      // 2. Validate Timeline (Premium: 3–5 items, Deluxe: 3–8 items)
      const maxTimeline = plan.id === 'DELUXE' ? 8 : 5;
      const memories = builderData?.memories || [];
      if (memories.length < 3) {
        return { isValid: false, error: 'Please add at least 3 milestones to your memories timeline.' };
      }
      if (memories.length > maxTimeline) {
        return { isValid: false, error: `The ${plan.name} supports up to ${maxTimeline} timeline milestones.` };
      }
      for (let i = 0; i < memories.length; i++) {
        if (!memories[i].date?.trim()) {
          return { isValid: false, error: `Please enter a date/year for Timeline milestone #${i + 1}.` };
        }
        if (!memories[i].title?.trim()) {
          return { isValid: false, error: `Please enter a title for Timeline milestone #${i + 1}.` };
        }
        if (!memories[i].description?.trim()) {
          return { isValid: false, error: `Please enter a story/memory for Timeline milestone #${i + 1}.` };
        }
      }

      // 3. Validate Sibling Fun (3–6 items)
      const funItems = builderData?.funItems || [];
      if (funItems.length < 3) {
        return { isValid: false, error: 'Please add at least 3 inside jokes/Q&As in "Just Between Us".' };
      }
      if (funItems.length > 6) {
        return { isValid: false, error: 'You can add up to 6 inside jokes.' };
      }
      for (let i = 0; i < funItems.length; i++) {
        if (!funItems[i].question?.trim()) {
          return { isValid: false, error: `Please enter a question for Inside Joke #${i + 1}.` };
        }
        if (!funItems[i].answer?.trim()) {
          return { isValid: false, error: `Please enter an answer for Inside Joke #${i + 1}.` };
        }
      }

      return { isValid: true, error: null };
    }

    case STEP_IDS.THEME: {
      if (!builderData?.theme) {
        return { isValid: false, error: 'Please select a visual theme.' };
      }
      if (!isThemeAllowedForPlan(builderData.theme, planKey)) {
        return { isValid: false, error: `The selected theme is not available under the ${plan.name}.` };
      }
      return { isValid: true, error: null };
    }

    default:
      return { isValid: true, error: null };
  }
}
