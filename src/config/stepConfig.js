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
    heading: "Let's start with the two people this gift is about.",
    subheading: 'Enter your names so we can personalize the hero, letter, and final wish.'
  },
  {
    id: STEP_IDS.PACKAGE,
    title: 'Select Keepsake Package',
    shortLabel: 'Package',
    heading: 'Choose how special you’d like to make it.',
    subheading: 'Select the package tier that best fits your memories.'
  },
  {
    id: STEP_IDS.MEMORIES,
    title: 'Mount Your Cherished Memories',
    shortLabel: 'Memories',
    heading: 'Add the moments you’d never want to forget.',
    subheading: 'Upload and crop your favorite photos for the 3D connected Memory Wall.'
  },
  {
    id: STEP_IDS.MESSAGE,
    title: 'Write Your Rakhi Message',
    shortLabel: 'Letter',
    heading: 'Write what you want her to know.',
    subheading: 'An intimate letter that opens with an interactive wax seal on her gift page.'
  },
  {
    id: STEP_IDS.PERSONALIZE,
    title: 'Personalize Your Keepsake',
    shortLabel: 'Personalize',
    heading: 'Add the little things only the two of you understand.',
    subheading: 'Add reasons why your sister is special, milestone chapters, and inside jokes.'
  },
  {
    id: STEP_IDS.THEME,
    title: 'Choose Theme & Surprise Note',
    shortLabel: 'Theme',
    heading: 'Choose the look and add one last surprise.',
    subheading: 'Select a visual mood and add a sealed promise or gift voucher.'
  },
  {
    id: STEP_IDS.PREVIEW,
    title: 'Live Recipient Experience Preview',
    shortLabel: 'Preview',
    heading: 'See exactly what she’ll receive.',
    subheading: 'Preview the live interactive gift before activating.'
  },
  {
    id: STEP_IDS.PAYMENT,
    title: 'Activate Your Gift',
    shortLabel: 'Payment',
    heading: 'Activate your gift & generate your link.',
    subheading: 'Complete one-time payment to generate your private URL and printable QR card.'
  },
  {
    id: STEP_IDS.SUCCESS,
    title: 'Gift Ready!',
    shortLabel: 'Ready',
    heading: 'Your Rakhi gift is ready ❤️',
    subheading: 'Share your private link on WhatsApp or print the high-res QR card.'
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
    totalVisibleSteps: visibleEditingStepsCount
  }));
};

export const getStepById = (stepId, planKey = 'PREMIUM') => {
  const steps = getCreatorSteps(planKey);
  return steps.find((s) => s.id === stepId) || steps[0];
};

export default getCreatorSteps;
