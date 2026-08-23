/**
 * Creator Central State Management Hook
 * Maintains clean separation between Builder Data (business domain) and UI State (presentation domain).
 */

import { useState } from 'react';
import { STEP_IDS } from '../config/stepConfig.js';

export const INITIAL_BUILDER_DATA = {
  draftId: null,
  giftSlug: '',
  senderName: '',
  senderNickname: '',
  recipientName: '',
  recipientNickname: '',
  relationship: 'Sister', // Default product focus: Brother -> Sister
  creatorEmail: '',
  plan: 'PREMIUM',
  theme: 'warm-memory',
  photos: [],
  message: '',
  reasons: [],
  memories: [],
  funItems: [],
  surprise: {
    title: 'One Last Promise...',
    voucher: '',
    note: ''
  }
};

export const INITIAL_UI_STATE = {
  currentStepId: STEP_IDS.DETAILS,
  loading: false,
  saving: false,
  restoringDraft: false,
  errorMsg: '',
  previewThemeModalOpen: false,
  paymentState: 'IDLE', // 'IDLE' | 'CREATING_ORDER' | 'CHECKOUT_OPEN' | 'VERIFYING' | 'PAID' | 'FAILED'
  paymentReceipt: null,
  qrCodeDataUrl: '',
  copiedLink: false
};

export function useCreatorState() {
  const [builderData, setBuilderData] = useState(INITIAL_BUILDER_DATA);
  const [uiState, setUIState] = useState(INITIAL_UI_STATE);

  const updateBuilderData = (updates) => {
    setBuilderData((prev) => ({
      ...prev,
      ...(typeof updates === 'function' ? updates(prev) : updates)
    }));
  };

  const updateUIState = (updates) => {
    setUIState((prev) => ({
      ...prev,
      ...(typeof updates === 'function' ? updates(prev) : updates)
    }));
  };

  return {
    builderData,
    setBuilderData,
    updateBuilderData,
    uiState,
    setUIState,
    updateUIState
  };
}
