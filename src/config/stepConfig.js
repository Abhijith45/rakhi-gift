/**
 * Dynamic Package-Aware Step Configuration
 * Calculates step list based on active package tier (BASIC vs PREMIUM/DELUXE).
 */

import { getPlanConfig } from './planConfig.js';

export const STEP_IDS = {
  DETAILS: 'DETAILS',
  PACKAGE: 'PACKAGE',
  MEMORIES: 'MEMORIES',
  MESSAGE: 'MESSAGE',
  PERSONALIZE: 'PERSONALIZE',
  THEME: 'THEME',
  PREVIEW: 'PREVIEW',
  PAYMENT: 'PAYMENT',
  SUCCESS: 'SUCCESS'
};

export const ALL_STEPS = [
  {
    id: STEP_IDS.DETAILS,
    title: 'Sister & Brother Details',
    shortLabel: 'Details',
    heading: 'Create a special Rakhi gift for your sister ❤️',
    subheading: 'Enter your name and your sister’s name to personalize the keepsake.'
  },
  {
    id: STEP_IDS.PACKAGE,
    title: 'Select Keepsake Package',
    shortLabel: 'Package',
    heading: 'Choose your gift package & feature tier',
    subheading: 'Select the keepsake package that best fits your memories.'
  },
  {
    id: STEP_IDS.MEMORIES,
    title: 'Mount Your Cherished Memories',
    shortLabel: 'Memories',
    heading: 'Add & crop your favorite photos',
    subheading: 'Photos are mounted on the 2.5D physical Memory Wall.'
  },
  {
    id: STEP_IDS.MESSAGE,
    title: 'Write Your Rakhi Message',
    shortLabel: 'Message',
    heading: 'Write your heartfelt Rakhi letter',
    subheading: 'An intimate editorial letter that opens with a sacred wax seal.'
  },
  {
    id: STEP_IDS.PERSONALIZE,
    title: 'Personalize Your Keepsake',
    shortLabel: 'Personalize',
    heading: 'Why she is special & sibling memories',
    subheading: 'Add reasons why your bond is unbreakable.'
  },
  {
    id: STEP_IDS.THEME,
    title: 'Choose Theme & Surprise Note',
    shortLabel: 'Theme',
    heading: 'Choose visual theme & sealed surprise',
    subheading: 'Select color palette, aesthetic theme, and secret promise.'
  },
  {
    id: STEP_IDS.PREVIEW,
    title: 'Live Recipient Experience Preview',
    shortLabel: 'Preview',
    heading: 'Preview your sister’s live Rakhi gift',
    subheading: 'This is exactly what she will experience when opening your gift.'
  },
  {
    id: STEP_IDS.PAYMENT,
    title: 'Activate Your Gift',
    shortLabel: 'Payment',
    heading: 'Activate your personalized Rakhi gift',
    subheading: 'One-time secure UPI payment for permanent live hosting.'
  },
  {
    id: STEP_IDS.SUCCESS,
    title: 'Gift Activated!',
    shortLabel: 'Ready',
    heading: 'Your Rakhi gift is live!',
    subheading: 'Share your gift URL or scan the high-res QR code card.'
  }
];

export const getCreatorSteps = (planKey = 'PREMIUM') => {
  const plan = getPlanConfig(planKey);

  // Basic plan excludes PERSONALIZE step
  const filtered = ALL_STEPS.filter((step) => {
    if (step.id === STEP_IDS.PERSONALIZE && !plan.reasons && !plan.timeline && !plan.siblingFun) {
      return false;
    }
    return true;
  });

  // Calculate visible editing steps count (excluding system states PAYMENT & SUCCESS)
  const visibleEditingStepsCount = filtered.filter(
    (s) => s.id !== STEP_IDS.PAYMENT && s.id !== STEP_IDS.SUCCESS
  ).length;

  return filtered.map((step, idx) => ({
    ...step,
    stepIndex: idx + 1,
    visibleStepNumber: idx + 1,
    totalVisibleSteps: visibleEditingStepsCount
  }));
};

export const getStepById = (stepId, planKey = 'PREMIUM') => {
  const steps = getCreatorSteps(planKey);
  return steps.find((s) => s.id === stepId) || steps[0];
};

export default {
  STEP_IDS,
  ALL_STEPS,
  getCreatorSteps,
  getStepById
};
