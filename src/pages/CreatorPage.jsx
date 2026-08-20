import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from '../router';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  Trash2,
  Heart,
  Image as ImageIcon,
  CheckCircle,
  QrCode,
  Copy,
  Share2,
  ExternalLink,
  ShieldCheck,
  Plus,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import MemoryWall from '../components/memory-wall/MemoryWall';
import ImageUploader from '../components/creator/image-upload/ImageUploader';
import { themes, getThemeById } from '../data/themes';
import { pricingTiers } from '../data/pricing';
import {
  createDraftGift,
  updateGiftDraft,
  uploadGiftPhotos,
  deleteGiftPhoto,
  createPaymentOrder,
  verifyPaymentSignature,
  getPaymentOrderStatus,
  trackEvent
} from '../services/api';

const INITIAL_REASONS = [
  { number: "01", title: "Always Having My Back", text: "Even when I make the worst mistakes, you never judge — you just help me fix them." },
  { number: "02", title: "Our Secret Eyebrow Talks", text: "We can communicate an entire paragraph across a crowded family dinner with one look." },
  { number: "03", title: "Best Playlist Curator", text: "Every great road trip memory we have is tied to the songs you queued up." },
  { number: "04", title: "Forever Loyalty", text: "You'll roast me for an hour straight, but defend me fiercely against the rest of the world." }
];

export const CreatorPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Flow State: 1: Details, 2: Photos, 3: Message, 4: Reasons, 5: Theme, 6: Preview, 7: Payment, 8: Complete
  const [currentStep, setCurrentStep] = useState(1);
  const [draftId, setDraftId] = useState(null);
  const [giftSlug, setGiftSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentState, setPaymentState] = useState('IDLE'); // 'IDLE' | 'CREATING_ORDER' | 'CHECKOUT_OPEN' | 'VERIFYING' | 'PAID' | 'FAILED'
  const [paymentReceipt, setPaymentReceipt] = useState(null);

  // Form State
  const [senderName, setSenderName] = useState('Ananya');
  const [recipientName, setRecipientName] = useState('Aarav');
  const [relationship, setRelationship] = useState('Brother');
  const [senderNickname, setSenderNickname] = useState('');
  const [recipientNickname, setRecipientNickname] = useState('');

  const [photos, setPhotos] = useState([
    {
      id: "photo-1",
      title: "Childhood Chaos",
      caption: "When we thought mud puddles were swimming pools.",
      date: "Summer 2014",
      imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      aspectRatio: 1.25
    },
    {
      id: "photo-2",
      title: "First Cooking Disaster",
      caption: "Burnt maggi, smoked kitchen, but we laughed for hours.",
      date: "Diwali 2017",
      imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
      aspectRatio: 0.85
    },
    {
      id: "photo-3",
      title: "Graduation Day Cheer",
      caption: "You yelled louder than anyone else in the auditorium.",
      date: "Spring 2021",
      imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
      aspectRatio: 1.3
    },
    {
      id: "photo-4",
      title: "Terrace Talks",
      caption: "Solving all the world's problems over chai.",
      date: "Monsoon 2022",
      imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
      aspectRatio: 0.9
    },
    {
      id: "photo-5",
      title: "Goa Road Trip",
      caption: "Flat tire, zero network, but the best playlist ever.",
      date: "Winter 2023",
      imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
      aspectRatio: 1.35
    },
    {
      id: "photo-6",
      title: "Partners in Crime",
      caption: "Forever teammate, through thick and thin.",
      date: "Always",
      imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
      aspectRatio: 0.88
    }
  ]);

  const [message, setMessage] = useState(
    "No matter how many miles separate us or how busy life gets, you will always be the first person I turn to when I need a laugh, an honest opinion, or someone to split the last slice of pizza. Thank you for always protecting me, cheering for my craziest dreams, and never letting me forget where we came from. Happy Raksha Bandhan! ❤️"
  );

  const [reasons, setReasons] = useState(INITIAL_REASONS);
  const [surprise, setSurprise] = useState({
    badge: "A Little Surprise For You",
    title: "One Last Promise...",
    message: "I booked our tickets for that concert we've been wanting to attend since 2019! Check your email this weekend. Here's to making 100 more memories together.",
    voucher: "FLIGHT & CONCERT PASS — NOVEMBER 2026",
    note: "Claimable anytime. Non-negotiable sibling date!"
  });

  const [selectedTheme, setSelectedTheme] = useState('warm-memory');
  const [selectedPlan, setSelectedPlan] = useState('PREMIUM');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showWallModal, setShowWallModal] = useState(false);

  // Track creator start
  useEffect(() => {
    trackEvent('create_started');
  }, []);

  // Handle Razorpay redirect callback — when Razorpay redirects user back to /create?order_id=...&status=processing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order_id');
    const paymentId = params.get('payment_id');
    const status = params.get('status');

    if (orderId && status === 'processing') {
      // Clean URL so refresh doesn't re-trigger
      window.history.replaceState({}, '', '/create');
      setPaymentState('VERIFYING');
      setLoading(true);
      setCurrentStep(7);
      // Start polling — webhook or callback handler will activate the gift
      pollPaymentStatus(orderId);
    } else if (status === 'failed') {
      window.history.replaceState({}, '', '/create');
      setPaymentState('FAILED');
      setErrorMsg('Payment was cancelled or failed. Please try again.');
      setCurrentStep(7);
    }
  }, []);

  // Save / Sync Draft to Backend
  const saveDraft = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      const payload = {
        senderName,
        recipientName,
        relationship,
        senderNickname,
        recipientNickname,
        theme: selectedTheme,
        message,
        plan: selectedPlan,
        reasons,
        surprise
      };

      if (!draftId) {
        const created = await createDraftGift(payload);
        setDraftId(created.id);
        setGiftSlug(created.slug);
        return created;
      } else {
        const updated = await updateGiftDraft(draftId, payload);
        setGiftSlug(updated.slug);
        return updated;
      }
    } catch (err) {
      console.error('Draft save failed:', err);
      setErrorMsg(err.message || 'Failed to save draft progress.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Step 1 -> Step 2
  const handleStep1Next = async () => {
    if (!senderName.trim() || !recipientName.trim()) {
      setErrorMsg('Please enter both your name and your sibling’s name.');
      return;
    }
    await saveDraft();
    setCurrentStep(2);
  };

  // Step 2 -> Step 3
  const handleStep2Next = async () => {
    if (photos.length < 1) {
      setErrorMsg('Please add at least 1 photo memory to continue.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      let currentGiftId = draftId;
      if (!currentGiftId) {
        const created = await saveDraft();
        currentGiftId = created.id;
      }

      // Upload any local base64/cropped photos to Cloudinary/backend
      const unuploaded = photos.filter((p) => !p.cloudinaryPublicId && (p.imageUrl || p.url));
      if (unuploaded.length > 0 && currentGiftId) {
        const payloadPhotos = unuploaded.map((p) => ({
          data: p.imageUrl || p.url,
          caption: p.caption || null,
          frameVariant: p.caption ? 'caption' : 'classic',
          displayOrder: p.displayOrder
        }));
        try {
          await uploadGiftPhotos(currentGiftId, { photos: payloadPhotos });
        } catch (e) {
          console.warn('Background upload sync notice:', e);
        }
      }

      await saveDraft();
      setCurrentStep(3);
    } catch (err) {
      console.error('Step 2 continue error:', err);
      setErrorMsg('Failed to save memories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add a Reason
  const handleAddReason = () => {
    if (reasons.length >= 6) return;
    const nextNum = reasons.length + 1;
    setReasons((prev) => [
      ...prev,
      {
        number: `0${nextNum}`,
        title: `Special Reason #${nextNum}`,
        text: "Another reason why you're simply the best sibling in the world."
      }
    ]);
  };

  // Helper to dynamically load Razorpay Checkout SDK
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

  // Poll server payment status for asynchronous webhook/callback reconciliation
  const pollPaymentStatus = async (orderId) => {
    let attempts = 0;
    const maxAttempts = 20; // 20 × 3s = 60 seconds total wait time
    const interval = setInterval(async () => {
      attempts++;
      try {
        // api.js already unwraps response.data.data, so res IS the data object
        const res = await getPaymentOrderStatus(orderId);
        if (res?.isReady || (res?.paymentStatus === 'PAID' && res?.giftStatus === 'ACTIVE')) {
          clearInterval(interval);
          await handlePaymentConfirmed(res);
        } else if (res?.paymentStatus === 'FAILED') {
          clearInterval(interval);
          setPaymentState('FAILED');
          setErrorMsg("Payment wasn't completed. You can try again.");
          setLoading(false);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          setPaymentState('FAILED');
          setErrorMsg('Payment is taking longer than usual. If your money was debited, your gift will activate automatically within a few minutes.');
          setLoading(false);
        }
      } catch (e) {
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setPaymentState('FAILED');
          setErrorMsg('Connection issue — if payment was made, your gift will activate automatically via our webhook system.');
          setLoading(false);
        }
        // else: keep polling on transient network errors
      }
    }, 3000);
  };

  // Process verified payment confirmation and unlock URL + QR
  const handlePaymentConfirmed = async (data) => {
    const finalSlug = data.slug;
    setGiftSlug(finalSlug);
    setPaymentReceipt({
      plan: data.plan || selectedPlan,
      amount: data.amount || (selectedPlan === 'BASIC' ? 99 : selectedPlan === 'DELUXE' ? 449 : 249),
      currency: data.currency || 'INR',
      orderId: data.orderId || `order_${Date.now()}`,
      paidAt: data.paidAt || new Date().toISOString()
    });

    // Generate High-Res QR Code Data URL only after verified activation
    const fullGiftUrl = `${window.location.origin}/g/${finalSlug}`;
    const qrData = await QRCode.toDataURL(fullGiftUrl, {
      width: 360,
      margin: 2,
      color: {
        dark: '#1C1917',
        light: '#FFFDF9'
      }
    });
    setQrCodeDataUrl(qrData);

    setPaymentState('PAID');
    setLoading(false);

    await trackEvent('payment_success', { plan: selectedPlan, slug: finalSlug });
    await trackEvent('gift_created', { slug: finalSlug });

    // Trigger Celebration Confetti
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#9B2226', '#D4AF37', '#D96B43', '#FFF8F0']
    });

    setCurrentStep(8); // Unlock and navigate to Success Screen
  };

  // Initiate Payment & Razorpay Checkout
  const handleInitiatePayment = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      setPaymentState('CREATING_ORDER');
      await trackEvent('payment_started', { plan: selectedPlan, giftId: draftId });

      let currentGiftId = draftId;
      if (!currentGiftId) {
        const created = await saveDraft();
        currentGiftId = created.id;
      }

      // 1. Create order on backend
      const orderRes = await createPaymentOrder(currentGiftId, selectedPlan);
      const orderData = orderRes.data || orderRes;

      // 2. Load Razorpay Checkout SDK
      const isLoaded = await loadRazorpayScript();

      if (isLoaded && window.Razorpay && !orderData.isSandbox) {
        setPaymentState('CHECKOUT_OPEN');
        const rzpOptions = {
          key: orderData.keyId,
          amount: orderData.amount * 100,
          currency: orderData.currency || 'INR',
          name: 'Rakhi Memory Keepsake',
          description: `${selectedPlan} Tier for ${recipientName}`,
          image: '/favicon.ico',
          order_id: orderData.orderId,
          prefill: {
            name: senderName
          },
          theme: {
            color: '#9B2226'
          },
          // Enable all payment methods including UPI
          method: {
            upi: true,
            card: true,
            netbanking: true,
            wallet: true,
            emi: false
          },
          config: {
            display: {
              blocks: {
                utib: {
                  name: 'Pay via UPI',
                  instruments: [
                    { method: 'upi', flows: ['qr', 'intent', 'collect', 'vpa'] }
                  ]
                }
              },
              sequence: ['block.utib'],
              preferences: { show_default_blocks: true }
            }
          },
          handler: async function (response) {
            setPaymentState('VERIFYING');
            try {
              // api.js unwraps response.data.data, so verifyRes IS the inner data object
              const verifyRes = await verifyPaymentSignature({
                giftId: currentGiftId,
                razorpayOrderId: response.razorpay_order_id || orderData.orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              });

              if (verifyRes?.isReady || verifyRes?.paymentStatus === 'PAID') {
                await handlePaymentConfirmed(verifyRes);
              } else {
                // Verification returned but not yet active — poll for webhook
                await pollPaymentStatus(orderData.orderId);
              }
            } catch (err) {
              console.warn('Immediate verification pending webhook, starting polling:', err);
              await pollPaymentStatus(orderData.orderId);
            }
          },
          modal: {
            ondismiss: function () {
              if (paymentState !== 'PAID') {
                setPaymentState('IDLE');
                setLoading(false);
              }
            }
          },
          // Razorpay redirect callback (fallback for mobile/UPI redirect flows)
          callback_url: `${window.location.origin.replace('3000', '5000')}/api/payments/callback`,
          redirect: false
        };

        const rzp = new window.Razorpay(rzpOptions);
        rzp.on('payment.failed', function (response) {
          console.error('Razorpay payment failed:', response.error);
          setPaymentState('FAILED');
          setErrorMsg(response.error.description || 'Payment was declined or failed.');
          setLoading(false);
        });
        rzp.open();
      } else {
        // Razorpay SDK unavailable (e.g. ad blocker): skip checkout, poll for webhook activation
        setPaymentState('VERIFYING');
        setErrorMsg('Razorpay checkout is unavailable. If you complete payment via UPI or bank transfer, your gift will activate automatically.');
        await pollPaymentStatus(orderData.orderId);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentState('FAILED');
      setErrorMsg(err.message || 'Payment initiation failed. Please try again.');
      await trackEvent('payment_failed', { plan: selectedPlan });
      setLoading(false);
    }
  };

  // Copy Gift Link to Clipboard
  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/g/${giftSlug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    trackEvent('share_clicked', { slug: giftSlug });
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Dynamic preview gift object
  const previewGiftData = {
    id: draftId || 'preview-draft',
    slug: giftSlug || 'preview-slug',
    recipientName,
    senderName,
    relationship,
    theme: selectedTheme,
    message: {
      salutation: `Dearest ${recipientNickname || recipientName},`,
      body: message,
      signoff: "Forever your loving sibling,",
      sender: senderNickname || senderName
    },
    reasons,
    surprise,
    photos: photos.map((p, idx) => ({
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
    })),
    threadConnections: [
      { from: photos[0]?.id, to: photos[1]?.id },
      { from: photos[1]?.id, to: photos[2]?.id },
      { from: photos[2]?.id, to: photos[3]?.id },
      ...(photos.length > 4 ? [{ from: photos[3]?.id, to: photos[4]?.id }] : []),
      ...(photos.length > 5 ? [{ from: photos[4]?.id, to: photos[5]?.id }] : [])
    ]
  };

  return (
    <div className="creator-page-root">
      <Header />

      <main className="creator-main-container">
        {/* Progress Stepper Bar */}
        {currentStep < 8 && (
          <div className="creator-stepper-header">
            <div className="container stepper-inner">
              <div className="stepper-meta">
                <span className="step-pill">Step {currentStep} of 7</span>
                <h2 className="step-heading">
                  {currentStep === 1 && "Who is this Rakhi memory for?"}
                  {currentStep === 2 && "Mount your cherished photos"}
                  {currentStep === 3 && "Write your heartfelt message"}
                  {currentStep === 4 && "Special reasons & surprise note"}
                  {currentStep === 5 && "Choose an aesthetic theme"}
                  {currentStep === 6 && "Live gift experience preview"}
                  {currentStep === 7 && "Select keepsake tier & activate"}
                </h2>
              </div>

              {/* Progress Indicator */}
              <div className="stepper-track">
                <div
                  className="stepper-progress-bar"
                  style={{ width: `${(currentStep / 7) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="container creator-content-container">
          {errorMsg && (
            <div className="creator-error-banner animate-fade-in">
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 1: DETAILS */}
          {/* ============================================================ */}
          {currentStep === 1 && (
            <div className="creator-step-card paper-card animate-fade-in">
              <h3 className="card-title">Recipient & Sender Details</h3>
              <p className="card-subtitle">
                Personalize who is giving and receiving this digital keepsake.
              </p>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Sibling's Name (Recipient) *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Aarav"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    maxLength={32}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Name (Sender) *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ananya"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    maxLength={32}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Relationship *</label>
                  <div className="radio-pill-group">
                    <button
                      type="button"
                      className={`radio-pill ${relationship === 'Brother' ? 'active' : ''}`}
                      onClick={() => setRelationship('Brother')}
                    >
                      👦 Brother
                    </button>
                    <button
                      type="button"
                      className={`radio-pill ${relationship === 'Sister' ? 'active' : ''}`}
                      onClick={() => setRelationship('Sister')}
                    >
                      👧 Sister
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Sibling Nickname (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Motu, Golu, Bhai"
                    value={recipientNickname}
                    onChange={(e) => setRecipientNickname(e.target.value)}
                    maxLength={24}
                  />
                </div>
              </div>

              <div className="step-actions">
                <div />
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleStep1Next}
                  disabled={loading}
                  icon={<ArrowRight size={16} />}
                  iconPosition="right"
                >
                  {loading ? 'Saving...' : 'Continue to Photos'}
                </Button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 2: PHOTOS */}
          {/* ============================================================ */}
          {currentStep === 2 && (
            <div className="creator-step-card paper-card animate-fade-in">
              <div className="photos-header">
                <div>
                  <h3 className="card-title">Add & Crop Your Memories ({photos.length}/8)</h3>
                  <p className="card-subtitle">
                    Select up to 8 photos. Each image is cropped to 4:3 for the physical wire-grid Memory Wall.
                  </p>
                </div>
              </div>

              <ImageUploader
                giftId={draftId}
                initialPhotos={photos}
                onChange={setPhotos}
                onOpenPreview={() => setShowWallModal(true)}
              />

              <div className="step-actions">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setCurrentStep(1)}
                  icon={<ArrowLeft size={16} />}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleStep2Next}
                  disabled={loading}
                  icon={<ArrowRight size={16} />}
                  iconPosition="right"
                >
                  {loading ? 'Saving Memories...' : 'Continue to Letter'}
                </Button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: MESSAGE */}
          {/* ============================================================ */}
          {currentStep === 3 && (
            <div className="creator-step-card paper-card animate-fade-in">
              <h3 className="card-title">Write Your Heartfelt Rakhi Letter</h3>
              <p className="card-subtitle">
                An intimate editorial letter that opens with a sacred wax seal in the gift.
              </p>

              <div className="form-group">
                <label className="form-label">
                  Message for {recipientNickname || recipientName} ({message.length}/1200 characters)
                </label>
                <textarea
                  className="form-textarea"
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={1200}
                  placeholder="Write your genuine emotions, gratitude, and inside memories here..."
                />
              </div>

              <div className="step-actions">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setCurrentStep(2)}
                  icon={<ArrowLeft size={16} />}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={async () => {
                    await saveDraft();
                    setCurrentStep(4);
                  }}
                  disabled={loading}
                  icon={<ArrowRight size={16} />}
                  iconPosition="right"
                >
                  Continue to Reasons
                </Button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 4: REASONS & SURPRISE */}
          {/* ============================================================ */}
          {currentStep === 4 && (
            <div className="creator-step-card paper-card animate-fade-in">
              <div className="reasons-step-header">
                <div>
                  <h3 className="card-title">Why You're Special (3–5 Items)</h3>
                  <p className="card-subtitle">
                    Little reminders of why your sibling bond is unbreakable.
                  </p>
                </div>
                {reasons.length < 5 && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleAddReason}
                  >
                    <Plus size={14} />
                    <span>Add Item</span>
                  </button>
                )}
              </div>

              <div className="reasons-edit-list">
                {reasons.map((r, idx) => (
                  <div key={idx} className="reason-edit-card">
                    <span className="reason-num-badge">{r.number || `0${idx + 1}`}</span>
                    <div className="reason-fields">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Title (e.g. Always Having My Back)"
                        value={r.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setReasons((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, title: val } : item))
                          );
                        }}
                      />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Description..."
                        value={r.text}
                        onChange={(e) => {
                          const val = e.target.value;
                          setReasons((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, text: val } : item))
                          );
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Surprise Reveal Section */}
              <div className="surprise-edit-box">
                <h4 className="surprise-box-title">🎁 Sealed Surprise Promise</h4>
                <div className="form-group">
                  <label className="form-label">Surprise Voucher / Secret Promise</label>
                  <input
                    type="text"
                    className="form-input"
                    value={surprise.voucher}
                    onChange={(e) => setSurprise({ ...surprise, voucher: e.target.value })}
                    placeholder="e.g. CONCERT PASS & DINNER — NOV 2026"
                  />
                </div>
              </div>

              <div className="step-actions">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setCurrentStep(3)}
                  icon={<ArrowLeft size={16} />}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={async () => {
                    await saveDraft();
                    setCurrentStep(5);
                  }}
                  disabled={loading}
                  icon={<ArrowRight size={16} />}
                  iconPosition="right"
                >
                  Continue to Theme
                </Button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 5: THEME SELECTION */}
          {/* ============================================================ */}
          {currentStep === 5 && (
            <div className="creator-step-card paper-card animate-fade-in">
              <h3 className="card-title">Choose Visual Keepsake Theme</h3>
              <p className="card-subtitle">
                Select the mood and color palette that matches your sibling's aesthetic.
              </p>

              <div className="themes-grid">
                {themes.map((theme) => {
                  const isSelected = selectedTheme === theme.id;
                  return (
                    <div
                      key={theme.id}
                      className={`theme-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedTheme(theme.id)}
                    >
                      <div className="theme-header">
                        <h4 className="theme-name">{theme.name}</h4>
                        {isSelected && <CheckCircle size={18} className="theme-check-icon" />}
                      </div>
                      <span className="theme-badge">{theme.badge}</span>
                      <p className="theme-desc">{theme.description}</p>

                      {/* Palette Color Swatches */}
                      <div className="theme-swatches">
                        <span className="swatch" style={{ background: theme.palette.bgPrimary }} />
                        <span className="swatch" style={{ background: theme.palette.accent }} />
                        <span className="swatch" style={{ background: theme.palette.gold }} />
                        <span className="swatch" style={{ background: theme.palette.textPrimary }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="step-actions">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setCurrentStep(4)}
                  icon={<ArrowLeft size={16} />}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={async () => {
                    await saveDraft();
                    trackEvent('preview_viewed', { theme: selectedTheme });
                    setCurrentStep(6);
                  }}
                  disabled={loading}
                  icon={<ArrowRight size={16} />}
                  iconPosition="right"
                >
                  See Live 3D Preview
                </Button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 6: LIVE PREVIEW */}
          {/* ============================================================ */}
          {currentStep === 6 && (
            <div className="preview-mode-wrapper animate-fade-in">
              <div className="preview-banner">
                <Sparkles size={16} color="var(--color-gold)" />
                <span>
                  Live Preview: This is exactly what {recipientName} will experience when opening your gift!
                </span>
              </div>

              {/* True 3D Memory Wall with Real Entered Data */}
              <div className="preview-wall-box">
                <MemoryWall gift={previewGiftData} />
              </div>

              <div className="step-actions preview-actions">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setCurrentStep(5)}
                  icon={<ArrowLeft size={16} />}
                >
                  Back to Themes
                </Button>
                <Button
                  variant="gold"
                  size="lg"
                  onClick={() => setCurrentStep(7)}
                  icon={<ArrowRight size={18} />}
                  iconPosition="right"
                >
                  Proceed to Activate Gift
                </Button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 7: PAYMENT & ACTIVATION */}
          {/* ============================================================ */}
          {currentStep === 7 && (
            <div className="creator-step-card paper-card animate-fade-in">
              <h3 className="card-title">Select Keepsake Package & Activate</h3>
              <p className="card-subtitle">
                One-time payment with lifetime permanent link hosting for {recipientName}.
              </p>

              <div className="plan-selection-grid">
                {pricingTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`plan-card ${selectedPlan === tier.id.toUpperCase() ? 'active-plan' : ''}`}
                    onClick={() => setSelectedPlan(tier.id.toUpperCase())}
                  >
                    {tier.popular && <span className="plan-tag">Recommended</span>}
                    <h4 className="plan-title">{tier.name}</h4>
                    <div className="plan-price">{tier.price}</div>
                    <p className="plan-desc">{tier.tagline}</p>
                  </div>
                ))}
              </div>

              <div className="payment-security-notice">
                <ShieldCheck size={20} color="var(--color-gold)" />
                <span>
                  Secure 256-bit encrypted checkout. Instant unique link generation & QR card download.
                </span>
              </div>

              {loading && (
                <div style={{ margin: 'var(--space-4) 0', padding: 'var(--space-3)', background: 'rgba(212, 175, 55, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gold)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--color-gold-dark)', fontSize: '0.9rem' }}>
                  <Sparkles size={18} />
                  <span>Payment received. We're confirming your payment and preparing your gift...</span>
                </div>
              )}

              <div className="step-actions">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setCurrentStep(6)}
                  icon={<ArrowLeft size={16} />}
                >
                  Back to Preview
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleInitiatePayment}
                  disabled={loading}
                  icon={<Sparkles size={18} />}
                >
                  {loading ? 'Confirming Payment...' : `Pay & Activate (${selectedPlan === 'BASIC' ? '₹99' : selectedPlan === 'DELUXE' ? '₹449' : '₹249'})`}
                </Button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 8: COMPLETION / ACTIVATION SUCCESS */}
          {/* ============================================================ */}
          {currentStep === 8 && (
            <div className="completion-card paper-card animate-fade-in-up">
              <div className="completion-emblem">
                <Heart size={28} className="completion-heart" />
              </div>

              <h2 className="completion-title">Your Rakhi Gift is Ready! ❤️</h2>
              <p className="completion-subtitle">
                The memory keepsake for <strong>{recipientName}</strong> is live and permanently hosted.
              </p>

              {/* Payment Verification Receipt */}
              {paymentReceipt && (
                <div style={{ margin: 'var(--space-4) 0', padding: 'var(--space-3) var(--space-4)', background: 'rgba(28, 25, 23, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.85rem', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span><strong>Package:</strong> {paymentReceipt.plan} Keepsake</span>
                    <span style={{ color: '#15803d', fontWeight: 600 }}>✓ Verified Paid (₹{paymentReceipt.amount})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.8 }}>
                    <span><strong>Order Ref:</strong> {paymentReceipt.orderId}</span>
                    <span>{new Date(paymentReceipt.paidAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              {/* Public Gift Link Box */}
              {giftSlug && (
                <div className="gift-link-box">
                  <span className="link-text">
                    {window.location.origin}/g/{giftSlug}
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm copy-btn"
                    onClick={handleCopyLink}
                  >
                    <Copy size={14} />
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              )}

              {/* Scannable QR Code Card */}
              {qrCodeDataUrl && giftSlug && (
                <div className="qr-container">
                  <h4 className="qr-title">Printable QR Code Card</h4>
                  <div className="qr-image-wrapper">
                    <img src={qrCodeDataUrl} alt="Gift QR Code" className="qr-image" />
                  </div>
                  <p className="qr-hint">
                    Scan with any camera or attach to your physical Rakhi gift hamper!
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {giftSlug && (
                <div className="completion-actions btn-group-mobile-stack">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `I made something special for you this Raksha Bandhan ❤️ Open your gift: ${window.location.origin}/g/${giftSlug}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-gold btn-lg"
                    onClick={() => trackEvent('whatsapp_share_clicked', { slug: giftSlug })}
                  >
                    <Share2 size={18} />
                    <span>Share on WhatsApp</span>
                  </a>

                  <Button
                    href={`/g/${giftSlug}`}
                    variant="secondary"
                    size="lg"
                    target="_blank"
                    icon={<ExternalLink size={18} />}
                    iconPosition="right"
                  >
                    Open Gift Experience
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Quick Memory Wall Preview Modal */}
      {showWallModal && (
        <div
          className="wall-preview-modal-backdrop"
          onClick={() => setShowWallModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="wall-preview-modal-card paper-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="preview-modal-header">
              <div className="preview-title-wrap">
                <Sparkles size={18} color="var(--color-gold)" />
                <h3>Live Memory Wall Preview</h3>
              </div>
              <button
                type="button"
                className="preview-close-btn"
                onClick={() => setShowWallModal(false)}
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>
            <div className="preview-modal-body">
              <MemoryWall gift={previewGiftData} mode="preview" />
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        .creator-page-root {
          min-height: 100vh;
          background-color: var(--bg-primary);
          display: flex;
          flex-direction: column;
        }

        .creator-main-container {
          flex-grow: 1;
          padding-top: calc(var(--header-height) + 1.5rem);
          padding-bottom: var(--space-16);
        }

        .creator-stepper-header {
          background: #FAF5ED;
          border-bottom: 1px solid var(--border-light);
          padding: var(--space-4) 0;
          margin-bottom: var(--space-8);
        }

        .stepper-inner {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .stepper-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .step-pill {
          font-size: var(--text-xs);
          font-weight: 700;
          color: var(--color-rakhi-red);
          background: var(--color-rakhi-light);
          padding: 3px 12px;
          border-radius: var(--radius-full);
        }

        .step-heading {
          font-size: 1.35rem;
          color: var(--text-primary);
          margin: 0;
        }

        .stepper-track {
          width: 100%;
          height: 5px;
          background: #EADBCE;
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .stepper-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--color-rakhi-red), var(--color-gold));
          transition: width 0.3s ease;
        }

        .creator-content-container {
          max-width: 840px;
        }

        .creator-step-card {
          padding: clamp(1.75rem, 4vw, 3rem);
          box-shadow: var(--shadow-md);
        }

        .card-title {
          font-size: 1.6rem;
          color: var(--text-primary);
          margin-bottom: var(--space-1);
        }

        .card-subtitle {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-5);
          margin-bottom: var(--space-8);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .form-label {
          font-size: var(--text-xs);
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.02em;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: var(--text-sm);
          font-family: inherit;
          color: var(--text-primary);
          background: #FFFFFF;
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input:focus,
        .form-textarea:focus {
          border-color: var(--color-gold);
          box-shadow: 0 0 0 3px var(--color-gold-glow);
        }

        .radio-pill-group {
          display: flex;
          gap: var(--space-3);
        }

        .radio-pill {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          background: #FFFFFF;
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-secondary);
          transition: all 0.2s;
        }

        .radio-pill.active {
          border-color: var(--color-rakhi-red);
          background: var(--color-rakhi-light);
          color: var(--color-rakhi-red);
        }

        .step-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: var(--space-6);
          border-top: 1px solid var(--border-light);
        }

        /* Photos Grid */
        .photos-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
          gap: var(--space-3);
        }

        .photos-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
          margin-bottom: var(--space-8);
        }

        .photo-thumb-card {
          position: relative;
          background: #FFFFFF;
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: var(--space-2);
          box-shadow: var(--shadow-xs);
        }

        .thumb-img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          margin-bottom: var(--space-2);
        }

        .thumb-delete-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(28, 25, 23, 0.75);
          color: #FFFFFF;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .thumb-delete-btn:hover {
          background: var(--color-rakhi-red);
        }

        .thumb-caption-input {
          width: 100%;
          font-size: var(--text-xs);
          padding: 4px 6px;
          border: 1px solid transparent;
          border-radius: var(--radius-sm);
        }

        .thumb-caption-input:focus {
          border-color: var(--border-default);
          background: #FAF7F2;
        }

        /* Reasons List */
        .reasons-step-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-5);
        }

        .reasons-edit-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          margin-bottom: var(--space-6);
        }

        .reason-edit-card {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          background: #FFFFFF;
          padding: var(--space-3);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
        }

        .reason-num-badge {
          font-family: var(--font-serif);
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--color-rakhi-red);
          background: var(--color-rakhi-light);
          padding: 6px 10px;
          border-radius: var(--radius-sm);
        }

        .reason-fields {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-grow: 1;
        }

        .surprise-edit-box {
          background: #FAF4E8;
          border: 1px dashed var(--color-gold);
          border-radius: var(--radius-md);
          padding: var(--space-5);
          margin-bottom: var(--space-6);
        }

        .surprise-box-title {
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--space-3);
        }

        /* Themes */
        .themes-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
          margin-bottom: var(--space-8);
        }

        .theme-card {
          background: #FFFFFF;
          border: 2px solid var(--border-default);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          cursor: pointer;
          transition: all 0.2s;
        }

        .theme-card:hover {
          border-color: var(--border-strong);
        }

        .theme-card.selected {
          border-color: var(--color-rakhi-red);
          background: var(--color-rakhi-light);
          box-shadow: var(--shadow-sm);
        }

        .theme-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2px;
        }

        .theme-name {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: var(--text-primary);
        }

        .theme-check-icon {
          color: var(--color-rakhi-red);
        }

        .theme-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          color: var(--color-gold);
          margin-bottom: var(--space-2);
        }

        .theme-desc {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          margin-bottom: var(--space-4);
        }

        .theme-swatches {
          display: flex;
          gap: 6px;
        }

        .swatch {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        /* Preview Box */
        .preview-banner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          background: #FAF5ED;
          border: 1px solid var(--border-gold);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--space-6);
        }

        .preview-wall-box {
          margin-bottom: var(--space-8);
        }

        /* Plan Selection */
        .plan-selection-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }

        .plan-card {
          background: #FFFFFF;
          border: 2px solid var(--border-default);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }

        .plan-card.active-plan {
          border-color: var(--color-gold);
          background: #FFFDF8;
          box-shadow: 0 4px 16px rgba(198, 146, 52, 0.25);
        }

        .plan-tag {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--color-gold);
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: var(--radius-full);
        }

        .plan-title {
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .plan-price {
          font-family: var(--font-serif);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-rakhi-red);
          margin-bottom: 4px;
        }

        .plan-desc {
          font-size: var(--text-xs);
          color: var(--text-secondary);
        }

        .payment-security-notice {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          background: #FAF5EC;
          border: 1px solid var(--border-light);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          font-size: var(--text-xs);
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
        }

        /* Completion Step */
        .completion-card {
          text-align: center;
          padding: clamp(2rem, 6vw, 4rem);
          max-width: 680px;
          margin: 0 auto;
        }

        .completion-emblem {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--color-rakhi-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto var(--space-4) auto;
          box-shadow: 0 4px 14px var(--color-rakhi-glow);
        }

        .completion-heart {
          color: var(--color-rakhi-red);
          fill: var(--color-rakhi-red);
        }

        .completion-title {
          font-size: 2.2rem;
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }

        .completion-subtitle {
          font-size: var(--text-base);
          color: var(--text-secondary);
          margin-bottom: var(--space-8);
        }

        .gift-link-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #FFFFFF;
          border: 2px solid var(--border-gold);
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-4);
          margin-bottom: var(--space-8);
          gap: var(--space-3);
        }

        .link-text {
          font-family: monospace;
          font-size: var(--text-sm);
          color: var(--color-rakhi-red);
          font-weight: 700;
          word-break: break-all;
          text-align: left;
        }

        .qr-container {
          background: #FAF7F2;
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          margin-bottom: var(--space-8);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .qr-title {
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--space-4);
        }

        .qr-image-wrapper {
          background: #FFFFFF;
          padding: var(--space-3);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          margin-bottom: var(--space-3);
        }

        .qr-image {
          width: 180px;
          height: 180px;
        }

        .qr-hint {
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin: 0;
        }

        .completion-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-4);
        }

        .creator-error-banner {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: #FDF2F0;
          color: var(--color-rakhi-red);
          border: 1px solid rgba(155, 34, 38, 0.2);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          font-weight: 600;
          margin-bottom: var(--space-6);
        }

        .wall-preview-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(28, 25, 23, 0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: var(--z-modal-backdrop);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-4);
          animation: fadeIn 0.2s ease-out;
        }

        .wall-preview-modal-card {
          max-width: 1080px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: var(--space-6);
          box-shadow: var(--shadow-2xl);
        }

        .preview-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-4);
          padding-bottom: var(--space-3);
          border-bottom: 1px solid var(--border-light);
        }

        .preview-title-wrap {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .preview-title-wrap h3 {
          margin: 0;
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .preview-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 18px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .preview-close-btn:hover {
          background: var(--bg-subtle);
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .form-grid,
          .themes-grid,
          .plan-selection-grid {
            grid-template-columns: 1fr;
          }
          .photos-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default CreatorPage;
