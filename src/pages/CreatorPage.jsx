import React, { useEffect, useRef } from 'react';
import { useNavigate } from '../router/index.jsx';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Heart,
  CheckCircle,
  Copy,
  Share2,
  ExternalLink,
  ShieldCheck,
  Plus,
  AlertCircle,
  User,
  Smile,
  Mail,
  MessageSquare,
  Feather,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';

import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import Button from '../components/common/Button.jsx';
import MemoryWall from '../components/memory-wall/MemoryWall.jsx';
import GiftHero from '../components/gift/GiftHero.jsx';
import RakhiMessage from '../components/gift/RakhiMessage.jsx';
import WhySpecial from '../components/gift/WhySpecial.jsx';
import MemoryTimeline from '../components/gift/MemoryTimeline.jsx';
import SiblingFun from '../components/gift/SiblingFun.jsx';
import SurpriseReveal from '../components/gift/SurpriseReveal.jsx';
import FinalWish from '../components/gift/FinalWish.jsx';
import KeepsakeShare from '../components/gift/KeepsakeShare.jsx';
import ImageUploader from '../components/creator/image-upload/ImageUploader.jsx';

import CreatorStepper from '../components/creator/CreatorStepper.jsx';
import CreatorNavigation from '../components/creator/CreatorNavigation.jsx';
import PackageSelector from '../components/creator/PackageSelector.jsx';
import PreviewToolbar from '../components/creator/PreviewToolbar.jsx';
import PersonalizeTabContainer from '../components/creator/personalize/PersonalizeTabContainer.jsx';

import { useCreatorState } from '../hooks/useCreatorState.js';
import { useCreatorDraft } from '../hooks/useCreatorDraft.js';
import { useCreatorNavigation } from '../hooks/useCreatorNavigation.js';

import { PLAN_CONFIG, getPlanConfig, isThemeAllowedForPlan } from '../config/planConfig.js';
import { STEP_IDS, getStepById } from '../config/stepConfig.js';
import { themes } from '../data/themes.js';
import { getThemeCssVariables, validateTheme } from '../config/themeConfig.js';
import { validateStep } from '../utils/creatorValidation.js';
import {
  uploadGiftPhotos,
  createPaymentOrder,
  verifyPaymentSignature,
  getPaymentOrderStatus,
  trackEvent
} from '../services/api.js';

export const CreatorPage = () => {
  const navigate = useNavigate();

  // 1. Centralized State Architecture
  const {
    builderData,
    setBuilderData,
    updateBuilderData,
    uiState,
    setUIState,
    updateUIState
  } = useCreatorState();

  // 2. Draft Persistence Hook (Hydrates from localStorage / Backend)
  const { saveDraftCheckpoint } = useCreatorDraft(builderData, setBuilderData, setUIState);

  // 3. Package-Aware Step Navigation Hook
  const {
    steps,
    currentStepId,
    goToStep,
    nextStep,
    previousStep,
    handlePackageChangeRequest
  } = useCreatorNavigation(builderData, uiState, setUIState);

  const activePlanConfig = getPlanConfig(builderData.plan);

  // Track creator start
  useEffect(() => {
    trackEvent('create_started');
  }, []);

  // Handle Razorpay redirect callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order_id');
    const status = params.get('status');

    if (orderId && status === 'processing') {
      window.history.replaceState({}, '', '/create');
      updateUIState({ paymentState: 'VERIFYING', loading: true });
      goToStep(STEP_IDS.PAYMENT);
      pollPaymentStatus(orderId);
    } else if (status === 'failed') {
      window.history.replaceState({}, '', '/create');
      updateUIState({
        paymentState: 'FAILED',
        errorMsg: 'Payment was cancelled or failed. Please try again.'
      });
      goToStep(STEP_IDS.PAYMENT);
    }
  }, []);

  // Razorpay script loader
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Poll payment order status
  const pollPaymentStatus = async (orderId) => {
    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await getPaymentOrderStatus(orderId);
        if (res?.isReady || (res?.paymentStatus === 'PAID' && res?.giftStatus === 'ACTIVE')) {
          clearInterval(interval);
          await handlePaymentConfirmed(res);
        } else if (res?.paymentStatus === 'FAILED') {
          clearInterval(interval);
          updateUIState({
            paymentState: 'FAILED',
            errorMsg: "Payment wasn't completed. You can try again.",
            loading: false
          });
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          updateUIState({
            paymentState: 'FAILED',
            errorMsg: 'Payment is taking longer than usual. Your gift will activate automatically within a few minutes.',
            loading: false
          });
        }
      } catch (e) {
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          updateUIState({
            paymentState: 'FAILED',
            errorMsg: 'Connection issue — your gift will activate automatically via our webhook system.',
            loading: false
          });
        }
      }
    }, 3000);
  };

  // Payment Confirmed Handler
  const handlePaymentConfirmed = async (data) => {
    const finalSlug = data.slug;
    updateBuilderData({ giftSlug: finalSlug });
    updateUIState({
      paymentReceipt: {
        plan: data.plan || builderData.plan,
        amount: data.amount || activePlanConfig.price,
        currency: data.currency || 'INR',
        orderId: data.orderId || `order_${Date.now()}`,
        paidAt: data.paidAt || new Date().toISOString()
      }
    });

    const fullGiftUrl = `${window.location.origin}/g/${finalSlug}`;
    const qrData = await QRCode.toDataURL(fullGiftUrl, {
      width: 360,
      margin: 2,
      color: { dark: '#1C1917', light: '#FFFDF9' }
    });

    updateUIState({
      qrCodeDataUrl: qrData,
      paymentState: 'PAID',
      loading: false
    });

    await trackEvent('payment_success', { plan: builderData.plan, slug: finalSlug });
    await trackEvent('gift_created', { slug: finalSlug });

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#9B2226', '#D4AF37', '#D96B43', '#FFF8F0']
    });

    goToStep(STEP_IDS.SUCCESS);
  };

  // Initiate Payment & Razorpay Checkout
  const handleInitiatePayment = async () => {
    try {
      updateUIState({ loading: true, errorMsg: '', paymentState: 'CREATING_ORDER' });
      await trackEvent('payment_started', { plan: builderData.plan, giftId: builderData.draftId });

      let currentGift = builderData;
      if (!currentGift.draftId) {
        const created = await saveDraftCheckpoint();
        currentGift = { ...currentGift, draftId: created.id };
      }

      const orderRes = await createPaymentOrder(currentGift.draftId, currentGift.plan);
      const orderData = orderRes.data || orderRes;
      const isLoaded = await loadRazorpayScript();

      if (isLoaded && window.Razorpay) {
        updateUIState({ paymentState: 'CHECKOUT_OPEN' });
        const lockedAmountInPaise = orderData.amountInPaise || (orderData.amount * 100);

        const rzpOptions = {
          key: orderData.keyId || import.meta.env?.VITE_RAZORPAY_KEY_ID,
          amount: lockedAmountInPaise,
          currency: orderData.currency || 'INR',
          name: 'Rakhi Memory Keepsake',
          description: orderData.planDescription || `${activePlanConfig.name} for ${builderData.recipientName}`,
          image: '/favicon.ico',
          order_id: orderData.orderId,
          prefill: {
            name: builderData.senderName,
            email: builderData.creatorEmail || undefined
          },
          theme: { color: '#9B2226' },
          method: { upi: true, card: true, netbanking: true, wallet: true, emi: false },
          handler: async function (response) {
            updateUIState({ paymentState: 'VERIFYING' });
            try {
              const verifyRes = await verifyPaymentSignature({
                giftId: currentGift.draftId,
                razorpayOrderId: response.razorpay_order_id || orderData.orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              });

              if (verifyRes?.isReady || verifyRes?.paymentStatus === 'PAID') {
                await handlePaymentConfirmed(verifyRes);
              } else {
                await pollPaymentStatus(orderData.orderId);
              }
            } catch (err) {
              await pollPaymentStatus(orderData.orderId);
            }
          },
          modal: {
            ondismiss: function () {
              if (uiState.paymentState !== 'PAID') {
                updateUIState({ paymentState: 'IDLE', loading: false });
              }
            }
          },
          callback_url: `${(import.meta.env?.VITE_API_BASE_URL || '/api').replace('/api', '')}/api/payments/callback`,
          redirect: false
        };

        const rzp = new window.Razorpay(rzpOptions);
        rzp.on('payment.failed', function (response) {
          updateUIState({
            paymentState: 'FAILED',
            errorMsg: response.error.description || 'Payment was declined or failed.',
            loading: false
          });
        });
        rzp.open();
      } else {
        updateUIState({
          paymentState: 'VERIFYING',
          errorMsg: 'Razorpay checkout unavailable. Will poll for webhook confirmation.'
        });
        await pollPaymentStatus(orderData.orderId);
      }
    } catch (err) {
      updateUIState({
        paymentState: 'FAILED',
        errorMsg: err.message || 'Payment initiation failed.',
        loading: false
      });
      await trackEvent('payment_failed', { plan: builderData.plan });
    }
  };

  // Copy Link Handler
  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/g/${builderData.giftSlug}`;
    navigator.clipboard.writeText(fullUrl);
    updateUIState({ copiedLink: true });
    trackEvent('share_clicked', { slug: builderData.giftSlug });
    setTimeout(() => updateUIState({ copiedLink: false }), 2500);
  };

  // Generic Next Step Handler with Checkpoint Save
  const handleNextWithSave = async () => {
    const validation = validateStep(currentStepId, builderData, builderData.plan);
    if (!validation.isValid) {
      updateUIState({ errorMsg: validation.error });
      return;
    }

    try {
      await saveDraftCheckpoint();
      nextStep();
    } catch (err) {
      // Save checkpoint handled error state
    }
  };

  // Step 2 Package Selector Next Handler
  const handlePackageSelectNext = async () => {
    // If photos count exceeds new package max limit, show warning but don't delete extra photos
    if (builderData.photos.length > activePlanConfig.maxPhotos) {
      updateUIState({
        errorMsg: `The ${activePlanConfig.name} supports up to ${activePlanConfig.maxPhotos} photos. Please select ${activePlanConfig.maxPhotos} active photos in the next step.`
      });
    }
    await saveDraftCheckpoint();
    nextStep();
  };

  // Step 3 Photo Upload Sync Handler
  const handlePhotosStepNext = async () => {
    if (builderData.photos.length < 1) {
      updateUIState({ errorMsg: 'Please add at least 1 photo memory to continue.' });
      return;
    }

    try {
      updateUIState({ loading: true, errorMsg: '' });
      let savedGift = await saveDraftCheckpoint();
      const currentGiftId = savedGift?.id || builderData.draftId;

      // Upload local images to Cloudinary
      const unuploaded = builderData.photos.filter((p) => !p.cloudinaryPublicId && (p.imageUrl || p.url));
      if (unuploaded.length > 0 && currentGiftId) {
        const payloadPhotos = unuploaded.map((p) => ({
          data: p.imageUrl || p.url,
          caption: p.caption || null,
          date: p.date || null,
          frameVariant: p.caption ? 'caption' : 'classic',
          displayOrder: p.displayOrder
        }));
        try {
          await uploadGiftPhotos(currentGiftId, { photos: payloadPhotos });
        } catch (e) {
          console.warn('Photo upload background sync:', e);
        }
      }

      await saveDraftCheckpoint();
      nextStep();
    } catch (err) {
      updateUIState({ errorMsg: 'Failed to save photo memories. Please try again.' });
    } finally {
      updateUIState({ loading: false });
    }
  };

  // Active photos slice based on plan
  const activePhotos = builderData.photos.slice(0, activePlanConfig.maxPhotos);

  // Dynamic preview gift object consuming real builder data
  const previewGiftData = {
    id: builderData.draftId || 'preview-draft',
    slug: builderData.giftSlug || 'preview-slug',
    recipientName: builderData.recipientName || 'Sister',
    senderName: builderData.senderName || 'Brother',
    relationship: 'Sister',
    senderNickname: builderData.senderNickname,
    recipientNickname: builderData.recipientNickname,
    plan: builderData.plan,
    theme: builderData.theme,
    message: {
      salutation: `Dearest ${builderData.recipientNickname || builderData.recipientName || 'Sister'},`,
      body: builderData.message || 'Happy Raksha Bandhan! ❤️',
      signoff: 'Forever your brother,',
      sender: builderData.senderNickname || builderData.senderName || 'Brother'
    },
    reasons: activePlanConfig.reasons ? builderData.reasons : [],
    memories: activePlanConfig.timeline ? builderData.memories : [],
    funItems: activePlanConfig.siblingFun ? builderData.funItems : [],
    surprise: builderData.surprise,
    photos: activePhotos.map((p, idx) => ({
      ...p,
      desktop: p.desktop || {
        x: -3.6 + (idx % 4) * 2.4,
        y: idx < 4 ? 1.4 : -1.4,
        z: 0.05 + (idx % 3) * 0.03,
        rotZ: (idx % 2 === 0 ? -1 : 1) * (2.0 + (idx % 3) * 0.8),
        scale: 1.0
      },
      mobile: p.mobile || {
        x: idx % 2 === 0 ? -1.15 : 1.15,
        y: 1.6 - Math.floor(idx / 2) * 1.5,
        z: 0.05,
        rotZ: (idx % 2 === 0 ? -1 : 1) * 2.0,
        scale: 0.85
      },
      pin: { x: 0, y: 0.9, z: 0.12 }
    }))
  };

  return (
    <div className="creator-page-root">
      <Header />

      <main className="creator-main-container">
        {/* Dynamic Stepper Progress Bar */}
        <CreatorStepper
          currentStepId={currentStepId}
          planKey={builderData.plan}
          onStepClick={goToStep}
        />

        <div className="container creator-content-container">
          {uiState.errorMsg && (
            <div className="creator-error-banner animate-fade-in">
              <AlertCircle size={18} />
              <span>{uiState.errorMsg}</span>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 1: DETAILS (Brother -> Sister Focus) */}
          {/* ============================================================ */}
          {currentStepId === STEP_IDS.DETAILS && (
            <div className="creator-step-card paper-card animate-fade-in">
              <div className="step-badge-pill">
                <Sparkles size={13} />
                <span>Step 1 of 7 • Sibling Personalization</span>
              </div>

              <h3 className="card-title">Create a special Rakhi gift for your sister ❤️</h3>
              <p className="card-subtitle">
                Personalize who is giving and receiving this digital keepsake. These names are woven into the 3D memory wall, the sealed letter, and custom keepsake links.
              </p>

              <div className="form-grid">
                {/* Brother's Name */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Brother's Name (Your Name) <span className="required-star">*</span></span>
                  </label>
                  <div className="input-wrapper">
                    <User size={18} className="input-leading-icon" />
                    <input
                      type="text"
                      className="form-input has-leading-icon"
                      placeholder="e.g. Aarav"
                      value={builderData.senderName}
                      onChange={(e) => updateBuilderData({ senderName: e.target.value })}
                      maxLength={32}
                    />
                  </div>
                  <span className="input-helper-text">Appears on the gift letter sign-off & hero greeting</span>
                </div>

                {/* Brother's Nickname */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Brother's Nickname</span>
                    <span className="optional-pill">Optional</span>
                  </label>
                  <div className="input-wrapper">
                    <Smile size={18} className="input-leading-icon" />
                    <input
                      type="text"
                      className="form-input has-leading-icon"
                      placeholder="e.g. Bhai, Bhaiya, Sonu"
                      value={builderData.senderNickname}
                      onChange={(e) => updateBuilderData({ senderNickname: e.target.value })}
                      maxLength={24}
                    />
                  </div>
                  <span className="input-helper-text">Used for playful moments & banter</span>
                </div>

                {/* Sister's Name */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Sister's Name (Recipient) <span className="required-star">*</span></span>
                  </label>
                  <div className="input-wrapper">
                    <Heart size={18} className="input-leading-icon icon-pink" />
                    <input
                      type="text"
                      className="form-input has-leading-icon"
                      placeholder="e.g. Ananya"
                      value={builderData.recipientName}
                      onChange={(e) => updateBuilderData({ recipientName: e.target.value })}
                      maxLength={32}
                    />
                  </div>
                  <span className="input-helper-text">Primary name displayed on the 3D wall & wax seal</span>
                </div>

                {/* Sister's Nickname */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Sister's Nickname</span>
                    <span className="optional-pill">Optional</span>
                  </label>
                  <div className="input-wrapper">
                    <Sparkles size={18} className="input-leading-icon icon-gold" />
                    <input
                      type="text"
                      className="form-input has-leading-icon"
                      placeholder="e.g. Chhoti, Golu, Didi"
                      value={builderData.recipientNickname}
                      onChange={(e) => updateBuilderData({ recipientNickname: e.target.value })}
                      maxLength={24}
                    />
                  </div>
                  <span className="input-helper-text">Affectionate name for the letter salutation</span>
                </div>

                {/* Email for Receipt & Backup */}
                <div className="form-group full-width">
                  <label className="form-label">
                    <span>Your Email for Receipt & Link Backup</span>
                    <span className="optional-pill">Recommended</span>
                  </label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-leading-icon" />
                    <input
                      type="email"
                      className="form-input has-leading-icon"
                      placeholder="e.g. aarav@gmail.com"
                      value={builderData.creatorEmail}
                      onChange={(e) => updateBuilderData({ creatorEmail: e.target.value })}
                    />
                  </div>
                  <span className="input-helper-text">We'll email you a permanent backup of your unique gift link and order receipt.</span>
                </div>
              </div>

              <CreatorNavigation
                isFirstStep={true}
                onNext={handleNextWithSave}
                nextText="Continue to Package"
                loading={uiState.loading}
              />
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 2: PACKAGE SELECTION (Moved Early) */}
          {/* ============================================================ */}
          {currentStepId === STEP_IDS.PACKAGE && (
            <PackageSelector
              selectedPlan={builderData.plan}
              onSelectPlan={(planId) => {
                const planConfig = getPlanConfig(planId);
                updateBuilderData({
                  plan: planId,
                  // If switching to Basic and current theme is not allowed, reset to default theme
                  theme: isThemeAllowedForPlan(builderData.theme, planId)
                    ? builderData.theme
                    : planConfig.defaultTheme
                });
              }}
              onContinue={handlePackageSelectNext}
            />
          )}

          {/* ============================================================ */}
          {/* STEP 3: MOUNTED MEMORIES (PHOTOS) */}
          {/* ============================================================ */}
          {currentStepId === STEP_IDS.MEMORIES && (
            <div className="creator-step-card paper-card animate-fade-in">
              <div className="photos-header">
                <div>
                  <h3 className="card-title">
                    Add & Crop Your Memories ({builderData.photos.length}/{activePlanConfig.maxPhotos})
                  </h3>
                  <p className="card-subtitle">
                    Select up to {activePlanConfig.maxPhotos} photos for your {activePlanConfig.name}. Each image is mounted onto the 3D connected Memory Wall.
                  </p>
                </div>
              </div>

              {/* Notice if photos exceed package limit */}
              {builderData.photos.length > activePlanConfig.maxPhotos && (
                <div className="info-notice-box">
                  <Sparkles size={16} />
                  <span>
                    Your draft contains {builderData.photos.length} photos. The {activePlanConfig.name} will display the top {activePlanConfig.maxPhotos} photos. You can reorder them or upgrade to Premium/Deluxe to show all 8 photos.
                  </span>
                </div>
              )}

              <ImageUploader
                giftId={builderData.draftId}
                initialPhotos={builderData.photos}
                maxPhotos={activePlanConfig.maxPhotos}
                allowCaptions={activePlanConfig.captions}
                allowDates={activePlanConfig.captions}
                onChange={(updatedPhotos) => updateBuilderData({ photos: updatedPhotos })}
              />

              <CreatorNavigation
                onBack={previousStep}
                onNext={handlePhotosStepNext}
                nextText="Continue to Letter"
                loading={uiState.loading}
              />
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 4: RAKHI LETTER (MESSAGE) */}
          {/* ============================================================ */}
          {currentStepId === STEP_IDS.MESSAGE && (
            <div className="creator-step-card paper-card animate-fade-in">
              <div className="step-badge-pill">
                <Feather size={13} />
                <span>Step 4 of 7 • Sacred Rakhi Letter</span>
              </div>

              <h3 className="card-title">Write Your Heartfelt Rakhi Letter</h3>
              <p className="card-subtitle">
                An intimate editorial letter that opens with an interactive wax seal on your sister's gift page.
              </p>

              {/* Inspiration Prompt Chips */}
              <div className="letter-prompts-section">
                <span className="prompts-label">✨ Click an idea to add inspiration:</span>
                <div className="prompt-chips-wrapper">
                  {[
                    "Thank you for always having my back no matter what.",
                    "From fighting over the TV remote to celebrating every big milestone together...",
                    "No matter how far apart we are, our bond remains unbreakable.",
                    "Wishing you all the joy, health, and laughter in the world this Raksha Bandhan."
                  ].map((prompt, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      className="prompt-chip"
                      onClick={() => {
                        const current = builderData.message.trim();
                        const updated = current ? `${current}\n\n${prompt}` : prompt;
                        if (updated.length <= 1200) {
                          updateBuilderData({ message: updated });
                        }
                      }}
                    >
                      "{prompt.slice(0, 42)}..."
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group letter-textarea-group">
                <label className="form-label">
                  <span>Message for {builderData.recipientNickname || builderData.recipientName || 'Sister'}</span>
                  <span className={`char-counter-pill ${builderData.message.length > 1100 ? 'warning' : ''}`}>
                    {builderData.message.length} / 1200 chars
                  </span>
                </label>
                <div className="textarea-wrapper">
                  <textarea
                    className="form-textarea letter-textarea"
                    rows={7}
                    value={builderData.message}
                    onChange={(e) => updateBuilderData({ message: e.target.value })}
                    maxLength={1200}
                    placeholder="Write what you want her to know — your favorite memories together, heartfelt gratitude, or a warm Rakhi blessing..."
                  />
                </div>
              </div>

              <CreatorNavigation
                onBack={previousStep}
                onNext={handleNextWithSave}
                nextText={activePlanConfig.reasons ? "Continue to Personalize" : "Continue to Theme"}
                loading={uiState.loading}
              />
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 5: PERSONALIZE (Reasons, Timeline, Sibling Fun - Gated) */}
          {/* ============================================================ */}
          {currentStepId === STEP_IDS.PERSONALIZE && activePlanConfig.reasons && (
            <div className="creator-step-card paper-card animate-fade-in">
              <div className="step-badge-pill">
                <Sparkles size={13} />
                <span>Step 5 of 7 • Package Enhancements</span>
              </div>

              <PersonalizeTabContainer
                reasons={builderData.reasons}
                memories={builderData.memories}
                funItems={builderData.funItems}
                availablePhotos={builderData.photos}
                recipientName={builderData.recipientNickname || builderData.recipientName || 'Sister'}
                planKey={builderData.plan}
                onUpdateReasons={(newReasons) => updateBuilderData({ reasons: newReasons })}
                onUpdateMemories={(newMemories) => updateBuilderData({ memories: newMemories })}
                onUpdateFunItems={(newFunItems) => updateBuilderData({ funItems: newFunItems })}
              />

              <CreatorNavigation
                onBack={previousStep}
                onNext={handleNextWithSave}
                nextText="Continue to Theme"
                loading={uiState.loading}
              />
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 6: THEME + SURPRISE PROMISE */}
          {/* ============================================================ */}
          {currentStepId === STEP_IDS.THEME && (
            <div className="creator-step-card paper-card animate-fade-in">
              <div className="step-badge-pill">
                <Sparkles size={13} />
                <span>Step 6 of 7 • Visual Aesthetics & Secret Reveal</span>
              </div>

              <h3 className="card-title">Choose Visual Theme & Surprise Promise</h3>
              <p className="card-subtitle">
                Select the mood and color palette that matches your sister's aesthetic.
              </p>

              <div className="themes-grid">
                {themes.map((theme) => {
                  const isAllowed = isThemeAllowedForPlan(theme.id, builderData.plan);
                  const isSelected = builderData.theme === theme.id;

                  return (
                    <div
                      key={theme.id}
                      className={`theme-card ${isSelected ? 'selected' : ''} ${!isAllowed ? 'disabled' : ''}`}
                      onClick={() => {
                        if (isAllowed) {
                          updateBuilderData({ theme: theme.id });
                        }
                      }}
                    >
                      <div className="theme-header">
                        <h4
                          className="theme-name"
                          style={{ fontFamily: theme.fontFamilyHeading || 'inherit' }}
                        >
                          {theme.name}
                        </h4>
                        {isSelected && <CheckCircle size={18} className="theme-check-icon" />}
                      </div>
                      <span className="theme-badge">{theme.badge}</span>
                      <p className="theme-desc">{theme.description}</p>

                      {/* Mini Visual Preview Pill */}
                      <div
                        className="theme-mini-visual"
                        style={{
                          background: theme.palette.bgSurface,
                          borderColor: theme.palette.gold || theme.palette.accent
                        }}
                      >
                        <div
                          className="mini-thread-line"
                          style={{ background: theme.wall?.threadColor || theme.palette.accent }}
                        />
                        <span
                          className="mini-sample-text"
                          style={{
                            fontFamily: theme.fontFamilyHeading,
                            color: theme.palette.accent
                          }}
                        >
                          Aa Bb Cc • Sample
                        </span>
                      </div>

                      <div className="theme-swatches">
                        <span className="swatch" title="Background" style={{ background: theme.palette.bgPrimary }} />
                        <span className="swatch" title="Surface" style={{ background: theme.palette.bgSurface }} />
                        <span className="swatch" title="Accent" style={{ background: theme.palette.accent }} />
                        <span className="swatch" title="Gold" style={{ background: theme.palette.gold }} />
                        <span className="swatch" title="Text" style={{ background: theme.palette.textPrimary }} />
                      </div>

                      {!isAllowed && (
                        <div className="theme-tier-lock">Requires Premium Package</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sealed Surprise Promise Input */}
              <div className="surprise-edit-box">
                <div className="surprise-header-row">
                  <Gift size={20} className="surprise-header-icon" />
                  <div>
                    <h4 className="surprise-box-title">Sealed Surprise Promise / Gift Voucher</h4>
                    <p className="surprise-box-sub">
                      Hidden inside a scratchable wax envelope at the end of the gift page.
                    </p>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '0.75rem' }}>
                  <label className="form-label">
                    <span>Secret Promise or Gift Voucher Code</span>
                    <span className="optional-pill">Optional</span>
                  </label>
                  <div className="input-wrapper">
                    <Gift size={18} className="input-leading-icon icon-gold" />
                    <input
                      type="text"
                      className="form-input has-leading-icon"
                      value={builderData.surprise.voucher}
                      onChange={(e) =>
                        updateBuilderData({
                          surprise: { ...builderData.surprise, voucher: e.target.value }
                        })
                      }
                      placeholder="e.g. 1000 Amazon Voucher / Weekend Trip to Hills / Dinner at your favorite cafe"
                    />
                  </div>
                  <span className="input-helper-text">
                    This will remain completely confidential until she clicks to reveal the wax seal!
                  </span>
                </div>
              </div>

              <CreatorNavigation
                onBack={previousStep}
                onNext={async () => {
                  await saveDraftCheckpoint();
                  trackEvent('preview_viewed', { theme: builderData.theme });
                  nextStep();
                }}
                nextText="See Live Preview"
                loading={uiState.loading}
              />
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 7: LIVE RECIPIENT PREVIEW */}
          {/* ============================================================ */}
          {currentStepId === STEP_IDS.PREVIEW && (
            <div className="preview-mode-wrapper animate-fade-in">
              {/* Compact Preview Action Toolbar */}
              <PreviewToolbar
                builderData={builderData}
                onUpdateTheme={(newTheme) => updateBuilderData({ theme: newTheme })}
                onJumpToStep={goToStep}
                onChangePackage={handlePackageChangeRequest}
              />

              {/* Exact Live Recipient Storytelling View with Live Theme Skinning */}
              <div
                className="preview-wall-box"
                data-theme={validateTheme(builderData.theme)}
                style={getThemeCssVariables(builderData.theme)}
              >
                <GiftHero gift={previewGiftData} plan={builderData.plan} />
                <MemoryWall gift={previewGiftData} plan={builderData.plan} theme={validateTheme(builderData.theme)} />
                <RakhiMessage gift={previewGiftData} plan={builderData.plan} />
                {activePlanConfig.reasons && previewGiftData.reasons.length > 0 && (
                  <WhySpecial gift={previewGiftData} plan={builderData.plan} />
                )}
                {activePlanConfig.timeline && previewGiftData.memories.length > 0 && (
                  <MemoryTimeline gift={previewGiftData} plan={builderData.plan} />
                )}
                {activePlanConfig.siblingFun && previewGiftData.funItems.length > 0 && (
                  <SiblingFun gift={previewGiftData} plan={builderData.plan} />
                )}
                <SurpriseReveal gift={previewGiftData} plan={builderData.plan} />
                <FinalWish gift={previewGiftData} plan={builderData.plan} />
                <KeepsakeShare gift={previewGiftData} plan={builderData.plan} />
              </div>

              <div className="step-actions preview-actions">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={previousStep}
                  icon={<ArrowLeft size={16} />}
                >
                  Back to Theme
                </Button>
                <Button
                  variant="gold"
                  size="lg"
                  onClick={() => goToStep(STEP_IDS.PAYMENT)}
                  icon={<ArrowRight size={18} />}
                  iconPosition="right"
                >
                  Proceed to Activate Gift ({activePlanConfig.formattedPrice})
                </Button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 8: PAYMENT & ACTIVATION (System State) */}
          {/* ============================================================ */}
          {currentStepId === STEP_IDS.PAYMENT && (
            <div className="creator-step-card paper-card animate-fade-in">
              <h3 className="card-title">Activate Keepsake — {activePlanConfig.name}</h3>
              <p className="card-subtitle">
                One-time secure payment of {activePlanConfig.formattedPrice} with permanent private link hosting for {builderData.recipientName}.
              </p>

              <div className="payment-summary-box">
                <div className="summary-row">
                  <span>Selected Package:</span>
                  <strong>{activePlanConfig.name}</strong>
                </div>
                <div className="summary-row">
                  <span>Mounted Memory Photos:</span>
                  <span>{activePhotos.length} Photos</span>
                </div>
                <div className="summary-row total-row">
                  <span>Total Amount:</span>
                  <span className="total-price">{activePlanConfig.formattedPrice}</span>
                </div>
              </div>

              <div className="payment-security-notice">
                <ShieldCheck size={20} color="var(--color-gold)" />
                <span>
                  Secure 256-bit encrypted checkout. Instant unique link generation & QR card download.
                </span>
              </div>

              {uiState.loading && (
                <div className="payment-loading-box">
                  <Sparkles size={18} />
                  <span>Processing payment & confirming with bank...</span>
                </div>
              )}

              <div className="step-actions">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => goToStep(STEP_IDS.PREVIEW)}
                  icon={<ArrowLeft size={16} />}
                >
                  Back to Preview
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleInitiatePayment}
                  disabled={uiState.loading}
                  icon={<Sparkles size={18} />}
                >
                  {uiState.loading ? 'Confirming Payment...' : `Pay ${activePlanConfig.formattedPrice} & Activate`}
                </Button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 9: SUCCESS / GIFT ACTIVATED (System State) */}
          {/* ============================================================ */}
          {currentStepId === STEP_IDS.SUCCESS && (
            <div className="completion-card paper-card animate-fade-in-up">
              <div className="completion-emblem">
                <Heart size={28} className="completion-heart" />
              </div>

              <h2 className="completion-title">Your Rakhi Gift is Ready! ❤️</h2>
              <p className="completion-subtitle">
                The memory keepsake for <strong>{builderData.recipientName}</strong> is live and permanently hosted.
              </p>

              {uiState.paymentReceipt && (
                <div className="receipt-box">
                  <div className="receipt-row">
                    <span><strong>Package:</strong> {uiState.paymentReceipt.plan} Keepsake</span>
                    <span className="receipt-status">✓ Verified Paid (₹{uiState.paymentReceipt.amount})</span>
                  </div>
                  <div className="receipt-row-sub">
                    <span>Order Ref: {uiState.paymentReceipt.orderId}</span>
                    <span>{new Date(uiState.paymentReceipt.paidAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              {builderData.giftSlug && (
                <div className="gift-link-box">
                  <span className="link-text">
                    {window.location.origin}/g/{builderData.giftSlug}
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm copy-btn"
                    onClick={handleCopyLink}
                  >
                    <Copy size={14} />
                    <span>{uiState.copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              )}

              {uiState.qrCodeDataUrl && builderData.giftSlug && (
                <div className="qr-container">
                  <h4 className="qr-title">Printable QR Code Card</h4>
                  <div className="qr-image-wrapper">
                    <img src={uiState.qrCodeDataUrl} alt="Gift QR Code" className="qr-image" />
                  </div>
                  <p className="qr-hint">
                    Scan with any camera or attach to your physical Rakhi gift hamper!
                  </p>
                </div>
              )}

              <div className="completion-actions">
                <Button
                  href={`/g/${builderData.giftSlug}`}
                  target="_blank"
                  variant="gold"
                  size="md"
                  icon={<ExternalLink size={16} />}
                >
                  View Active Gift Site
                </Button>

                <Button
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Dearest ${builderData.recipientName}, I created a special digital Rakhi gift for you! Open it here: ${window.location.origin}/g/${builderData.giftSlug}`
                  )}`}
                  target="_blank"
                  variant="secondary"
                  size="md"
                  icon={<Share2 size={16} />}
                >
                  Share on WhatsApp
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style>{`
        .creator-page-root {
          min-height: 100vh;
          background-color: var(--bg-primary, #FAF7F2);
          color: var(--text-primary, #1E1B18);
        }

        .creator-main-container {
          padding-top: var(--header-height, 60px);
          padding-bottom: 4rem;
        }

        .creator-content-container {
          max-width: 840px;
          margin: 1.5rem auto 0 auto;
        }

        .creator-step-card {
          padding: clamp(1.5rem, 4vw, 2.75rem);
          border-radius: 20px;
          background: #FFFDF9;
          border: 1.5px solid #EFE6D8;
          box-shadow: 
            0 20px 48px -12px rgba(45, 30, 15, 0.08),
            0 4px 12px -2px rgba(45, 30, 15, 0.03);
          position: relative;
        }

        .step-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #9B2226;
          background: #FBF0EF;
          border: 1px solid rgba(155, 34, 38, 0.15);
          padding: 4px 12px;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.85rem;
        }

        .card-title {
          font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
          color: #1E1B18;
          line-height: 1.25;
          letter-spacing: -0.015em;
          margin: 0 0 0.4rem 0;
        }

        .card-subtitle {
          font-family: var(--font-sans, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.9375rem;
          color: #59524C;
          line-height: 1.6;
          margin: 0 0 1.5rem 0;
        }

        .creator-error-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #FEE2E2;
          border: 1px solid #FCA5A5;
          color: #991B1B;
          padding: 10px 14px;
          border-radius: var(--radius-md, 8px);
          font-size: 0.85rem;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .info-notice-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(198, 146, 52, 0.1);
          border: 1px solid rgba(198, 146, 52, 0.3);
          color: #7A5813;
          padding: 10px 14px;
          border-radius: var(--radius-md, 8px);
          font-size: 0.825rem;
          margin-bottom: 1rem;
        }

        /* --- UI/UX Pro Max Form Layout --- */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.35rem 1.25rem;
          margin-top: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: relative;
        }

        .form-group.full-width {
          grid-column: span 2;
        }

        .form-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-sans, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.8125rem;
          font-weight: 700;
          color: #2D2721;
          letter-spacing: 0.01em;
          margin-bottom: 2px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .input-leading-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #8C827A;
          pointer-events: none;
          transition: color 0.2s ease, transform 0.2s ease;
          z-index: 2;
        }

        .form-input {
          width: 100%;
          font-family: var(--font-sans, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.9375rem;
          font-weight: 500;
          color: #1E1B18;
          background-color: #FAF7F2;
          border: 1.5px solid #E5D9C8;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
          box-sizing: border-box;
        }

        .form-input.has-leading-icon {
          padding-left: 42px;
        }

        .form-input:hover {
          border-color: #C69234;
          background-color: #FFFDF9;
        }

        .form-input:focus {
          background-color: #FFFFFF;
          border-color: #9B2226;
          box-shadow: 0 0 0 3.5px rgba(155, 34, 38, 0.12), 0 2px 8px rgba(155, 34, 38, 0.06);
        }

        .form-input::placeholder {
          color: #A89F91;
          font-weight: 400;
        }

        .input-wrapper:focus-within .input-leading-icon {
          color: #9B2226;
          transform: translateY(-50%) scale(1.08);
        }

        .input-wrapper:focus-within .input-leading-icon.icon-pink {
          color: #BE185D;
        }

        .input-wrapper:focus-within .input-leading-icon.icon-gold {
          color: #C69234;
        }

        .input-helper-text {
          font-size: 0.75rem;
          color: #7A7268;
          margin-top: 3px;
          line-height: 1.4;
        }

        .optional-pill {
          font-size: 0.7rem;
          font-weight: 600;
          color: #8C827A;
          background: #EFE6D8;
          padding: 2px 8px;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .required-star {
          color: #9B2226;
          font-weight: 700;
          margin-left: 2px;
        }

        /* --- Letter Prompts & Textarea --- */
        .letter-prompts-section {
          background: #FDF9F3;
          border: 1px dashed #E5D9C8;
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 1.25rem;
        }

        .prompts-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #7A5813;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .prompt-chips-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .prompt-chip {
          background: #FFFFFF;
          border: 1px solid #E5D9C8;
          color: #59524C;
          font-size: 0.75rem;
          padding: 5px 11px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .prompt-chip:hover {
          background: #FBF0EF;
          border-color: #9B2226;
          color: #9B2226;
          transform: translateY(-1px);
        }

        .char-counter-pill {
          font-size: 0.7rem;
          color: #8C827A;
          font-weight: 600;
        }

        .char-counter-pill.warning {
          color: #DC2626;
          font-weight: 700;
        }

        .letter-textarea {
          font-family: var(--font-sans, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.9375rem;
          line-height: 1.7;
          background: #FAF7F2;
          border: 1.5px solid #E5D9C8;
          border-radius: 14px;
          padding: 14px 16px;
          min-height: 150px;
          resize: vertical;
          width: 100%;
          outline: none;
          transition: all 0.22s ease;
          box-sizing: border-box;
        }

        .letter-textarea:focus {
          background: #FFFFFF;
          border-color: #9B2226;
          box-shadow: 0 0 0 3.5px rgba(155, 34, 38, 0.12), 0 2px 8px rgba(155, 34, 38, 0.06);
        }

        /* --- Surprise Section --- */
        .surprise-edit-box {
          margin-top: 1.75rem;
          padding: 1.25rem;
          background: #FDF9F2;
          border: 1.5px dashed #DFC9A8;
          border-radius: 14px;
        }

        .surprise-header-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .surprise-header-icon {
          color: #C69234;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .surprise-box-title {
          font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0 0 2px 0;
          color: #2D1D13;
        }

        .surprise-box-sub {
          font-size: 0.775rem;
          color: #7A624E;
          margin: 0;
        }

        .themes-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin: 1.25rem 0;
        }

        .theme-card {
          background: #FFFDF9;
          border: 2px solid #EFE6D8;
          border-radius: var(--radius-lg, 12px);
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .theme-card.selected {
          border-color: var(--color-rakhi-red, #9B2226);
          background: #FFFDFB;
          box-shadow: 0 0 0 1px var(--color-rakhi-red, #9B2226);
        }

        .theme-card.disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .theme-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2px;
        }

        .theme-name {
          font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0;
        }

        .theme-check-icon {
          color: var(--color-rakhi-red, #9B2226);
        }

        .theme-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          color: #7A5813;
          background: rgba(198, 146, 52, 0.12);
          padding: 1px 7px;
          border-radius: 9999px;
          margin-bottom: 6px;
        }

        .theme-desc {
          font-size: 0.775rem;
          color: var(--text-secondary, #59524C);
          margin: 0 0 10px 0;
          line-height: 1.35;
        }

        .theme-mini-visual {
          position: relative;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #DFCDB4;
          margin-bottom: 10px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        }

        .mini-thread-line {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
        }

        .mini-sample-text {
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .theme-swatches {
          display: flex;
          gap: 6px;
        }

        .swatch {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.1);
        }

        .theme-tier-lock {
          font-size: 10px;
          font-weight: 700;
          color: #B58428;
          margin-top: 6px;
        }

        .preview-mode-wrapper {
          width: 100%;
        }

        .preview-wall-box {
          background: var(--bg-primary, #FAF7F2);
          border-radius: var(--radius-xl, 16px);
          box-shadow: 0 20px 40px rgba(45, 30, 15, 0.08);
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .preview-actions {
          display: flex;
          justify-content: space-between;
          padding: 1rem 0;
        }

        .payment-summary-box {
          background: #F8F6F0;
          border: 1px solid #EFE6D8;
          border-radius: var(--radius-lg, 12px);
          padding: 1.25rem;
          margin: 1.25rem 0;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          margin-bottom: 8px;
        }

        .summary-row.total-row {
          border-top: 1px solid #EFE6D8;
          padding-top: 10px;
          margin-top: 10px;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .total-price {
          color: var(--color-rakhi-red, #9B2226);
        }

        .payment-security-notice {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.8rem;
          color: var(--text-secondary, #59524C);
          margin-bottom: 1.5rem;
        }

        .completion-card {
          text-align: center;
          padding: 2.5rem 1.5rem;
        }

        .completion-emblem {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(155, 34, 38, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem auto;
        }

        .completion-heart {
          color: var(--color-rakhi-red, #9B2226);
          fill: var(--color-rakhi-red, #9B2226);
        }

        .completion-title {
          font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
          font-size: 1.8rem;
          margin: 0 0 6px 0;
        }

        .completion-subtitle {
          font-size: 0.9rem;
          color: var(--text-secondary, #59524C);
          margin: 0 0 1.5rem 0;
        }

        .receipt-box {
          background: #F8F6F0;
          border: 1px solid #EFE6D8;
          border-radius: 8px;
          padding: 10px 14px;
          margin-bottom: 1.25rem;
          font-size: 0.85rem;
          text-align: left;
        }

        .receipt-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .receipt-status {
          color: #15803D;
          font-weight: 600;
        }

        .receipt-row-sub {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          opacity: 0.75;
        }

        .gift-link-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #FFFDF9;
          border: 1px solid #EFE6D8;
          padding: 8px 12px;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          gap: 10px;
        }

        .link-text {
          font-family: monospace;
          font-size: 0.85rem;
          color: var(--text-primary, #1E1B18);
          word-break: break-all;
        }

        .qr-container {
          margin: 1.5rem 0;
        }

        .qr-title {
          font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
          font-size: 1.1rem;
          margin: 0 0 10px 0;
        }

        .qr-image-wrapper {
          display: inline-block;
          background: #FFF;
          padding: 10px;
          border: 1px solid #EFE6D8;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        .qr-image {
          width: 180px;
          height: 180px;
          display: block;
        }

        .qr-hint {
          font-size: 0.775rem;
          color: var(--text-secondary, #59524C);
          margin-top: 6px;
        }

        .completion-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        @media (max-width: 640px) {
          .creator-step-card {
            padding: clamp(1.25rem, 4vw, 1.75rem) clamp(0.875rem, 3.5vw, 1.25rem);
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
          .form-group.full-width {
            grid-column: span 1;
          }
          .themes-grid {
            grid-template-columns: 1fr;
          }
          .step-actions,
          .preview-actions {
            flex-direction: column-reverse;
            width: 100%;
            gap: 10px;
          }
          .step-actions .btn,
          .preview-actions .btn {
            width: 100%;
            justify-content: center;
          }
          .completion-actions {
            flex-direction: column;
            width: 100%;
          }
          .completion-actions .btn {
            width: 100%;
            justify-content: center;
          }
          .gift-link-box {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }
          .link-text {
            text-align: center;
          }
          .gift-link-box .copy-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default CreatorPage;
