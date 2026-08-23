import React, { useState } from 'react';
import LegalPageLayout from '../components/layout/LegalPageLayout';
import { Plus, Minus, MessageSquare, Mail } from 'lucide-react';

export const FAQPage = () => {
  const [openItems, setOpenItems] = useState({ 0: true });

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
    {
      q: "What is Personalized Rakhi Gift?",
      a: (
        <>
          <p className="legal-p">
            Personalized Rakhi Gift is a digital gifting service that lets you create a beautiful memory experience for your brother or sister using your photos, messages, memories, and personalized content.
          </p>
          <p className="legal-p">
            Instead of sending another generic gift, you can create a private digital memory page that can be shared through a link or QR code.
          </p>
        </>
      )
    },
    {
      q: "How does it work?",
      a: (
        <>
          <p className="legal-p">The process is simple:</p>
          <ol className="legal-numbered-list">
            <li className="legal-list-item">Choose your gift plan.</li>
            <li className="legal-list-item">Add your sibling's details.</li>
            <li className="legal-list-item">Upload and personalize your photos.</li>
            <li className="legal-list-item">Add your Rakhi message and optional memories.</li>
            <li className="legal-list-item">Preview your gift.</li>
            <li className="legal-list-item">Complete payment.</li>
            <li className="legal-list-item">Once payment is confirmed, we generate your gift URL and QR code.</li>
            <li className="legal-list-item">Share the gift with your sibling.</li>
          </ol>
        </>
      )
    },
    {
      q: "When will I receive my gift URL?",
      a: (
        <>
          <p className="legal-p">
            The public gift URL is provided only after your payment has been successfully confirmed.
          </p>
          <p className="legal-p">
            Your URL, QR code, and sharing options remain unavailable until the payment status is confirmed.
          </p>
        </>
      )
    },
    {
      q: "Can I upload my own photos?",
      a: (
        <>
          <p className="legal-p">
            Yes. You can upload your personal photos for use in your memory gift.
          </p>
          <p className="legal-p">
            You should only upload photos and content that you have the right or permission to use.
          </p>
        </>
      )
    },
    {
      q: "What is the photo upload limit?",
      a: (
        <>
          <p className="legal-p">
            You can upload up to 8 photos for one gift.
          </p>
          <p className="legal-p">
            Each image must be no larger than 6 MB and must meet the supported file-format requirements shown during upload.
          </p>
        </>
      )
    },
    {
      q: "Can I crop my photos?",
      a: (
        <>
          <p className="legal-p">
            Yes. You can crop each image before final upload.
          </p>
          <p className="legal-p">
            The Memory Wall uses a 4:3 presentation ratio so that photos remain visually consistent.
          </p>
        </>
      )
    },
    {
      q: "Can I add a message to individual photos?",
      a: (
        <>
          <p className="legal-p">
            Yes. You can add an optional short caption or memory to individual photos.
          </p>
          <p className="legal-p">For example:</p>
          <ul className="legal-list">
            <li className="legal-list-item">"Partners in crime ❤️"</li>
            <li className="legal-list-item">"That crazy trip"</li>
            <li className="legal-list-item">"Childhood chaos"</li>
          </ul>
        </>
      )
    },
    {
      q: "Are my photos publicly visible?",
      a: (
        <>
          <p className="legal-p">
            Your gift page is available through its unique URL after payment.
          </p>
          <p className="legal-p">
            We do not intend individual gift pages to be indexed by search engines. However, anyone who obtains the gift URL may be able to access the gift page.
          </p>
          <p className="legal-p">
            Do not upload information that you do not want to share with anyone who receives the link.
          </p>
        </>
      )
    },
    {
      q: "Do you store my photos?",
      a: (
        <>
          <p className="legal-p">
            Yes. Photos used to create your gift are stored with our cloud storage/image-processing provider so that your gift can be delivered through the internet.
          </p>
          <p className="legal-p">
            We store the information necessary to operate and deliver the gift and explain our handling of such data in our Privacy Policy.
          </p>
        </>
      )
    },
    {
      q: "Do you store my card or UPI details?",
      a: (
        <>
          <p className="legal-p">
            We do not directly store your complete payment credentials.
          </p>
          <p className="legal-p">
            Payments are processed through our payment provider, Razorpay. Razorpay independently processes payment and transaction information according to its applicable policies.
          </p>
        </>
      )
    },
    {
      q: "Which payment methods are supported?",
      a: (
        <>
          <p className="legal-p">
            UPI is the required payment method for this service. Payment options presented during checkout are controlled through our Razorpay integration.
          </p>
        </>
      )
    },
    {
      q: "Can I get a refund?",
      a: (
        <>
          <p className="legal-p">
            If you experience a duplicate charge, payment issue, or a technical failure that prevents us from delivering the purchased gift, contact us at <a href="mailto:thedigitalasset88@gmail.com" className="legal-link">thedigitalasset88@gmail.com</a> with your order details.
          </p>
          <p className="legal-p">
            Refund eligibility depends on the circumstances of the transaction and applicable law.
          </p>
        </>
      )
    },
    {
      q: "Can I edit my gift after payment?",
      a: (
        <div className="legal-callout-box">
          <p className="legal-placeholder" style={{ display: 'block', padding: '8px 12px' }}>
            [Choose one before publishing:
            <br />• "Currently, gifts cannot be edited after activation."
            <br />• "You may request limited corrections through support."
            <br />Do not publish this FAQ until this rule matches the actual application.]
          </p>
        </div>
      )
    },
    {
      q: "How long will my gift remain available?",
      a: (
        <>
          <p className="legal-p">
            Your gift is intended to remain available for the period stated on the product page or according to our service policy.
          </p>
          <p className="legal-p">
            We may disable or remove a gift when required by law, for security reasons, because of a policy violation, or after the applicable retention period.
          </p>
        </>
      )
    },
    {
      q: "Can I request deletion of my photos and gift?",
      a: (
        <>
          <p className="legal-p">
            Yes. You can contact us at <a href="mailto:thedigitalasset88@gmail.com" className="legal-link">thedigitalasset88@gmail.com</a> to request deletion of personal data or a gift, subject to legal, fraud-prevention, accounting, or other retention requirements that may apply.
          </p>
        </>
      )
    },
    {
      q: "Can I upload someone else's photo?",
      a: (
        <>
          <p className="legal-p">
            You should only upload content that you are legally permitted to use.
          </p>
          <p className="legal-p">
            By uploading a photo or message, you confirm that you have the necessary rights, permissions, and authority to use that content for creating and sharing the gift.
          </p>
        </>
      )
    },
    {
      q: "What if my gift contains a photo of a child?",
      a: (
        <>
          <p className="legal-p">
            Do not upload photographs of children unless you have the appropriate authority or consent to use and share the image.
          </p>
        </>
      )
    },
    {
      q: "What happens if I lose my gift URL?",
      a: (
        <>
          <p className="legal-p">
            Contact <a href="mailto:thedigitalasset88@gmail.com" className="legal-link">thedigitalasset88@gmail.com</a> with the information needed to identify your order.
          </p>
          <p className="legal-p">
            We may ask you to verify ownership before providing access to gift-related information.
          </p>
        </>
      )
    },
    {
      q: "How can I contact support?",
      a: (
        <>
          <p className="legal-p">
            <strong>Email:</strong> <a href="mailto:thedigitalasset88@gmail.com" className="legal-link">thedigitalasset88@gmail.com</a>
          </p>
          <p className="legal-p">
            <strong>Privacy requests:</strong> <a href="mailto:thedigitalasset88@gmail.com" className="legal-link">thedigitalasset88@gmail.com</a>
          </p>
          <p className="legal-p">
            <strong>Business address:</strong> Lucknow, UP, India
          </p>
        </>
      )
    },
    {
      q: "Does the site use cookies?",
      a: (
        <>
          <p className="legal-p">
            We may use essential cookies and similar technologies required for security, functionality, analytics, and service operation.
          </p>
          <p className="legal-p">
            Where consent is required, we will request it in accordance with applicable law and our Privacy Policy.
          </p>
        </>
      )
    }
  ];

  return (
    <LegalPageLayout
      title="Frequently asked questions"
      tag="Help & Support"
      subtitle="Find quick answers to common questions about creating, preserving, and sharing your Rakhi memory keepsake."
      seoTitle="FAQs | Rakhi Gift"
      seoDescription="Frequently asked questions about creating and sharing your personalized Rakhi memory gift."
    >
      <div className="faq-modern-layout">
        {/* Left Column: 20 Accessible Accordion Cards */}
        <div className="faq-accordion-column">
          <div className="faq-accordion-list" role="region" aria-label="Frequently Asked Questions">
            {faqData.map((item, index) => {
              const isOpen = !!openItems[index];
              const questionId = `faq-q-${index}`;
              const answerId = `faq-a-${index}`;

              return (
                <div
                  key={index}
                  className={`faq-modern-card ${isOpen ? 'faq-card-open' : ''}`}
                >
                  <button
                    type="button"
                    id={questionId}
                    className="faq-modern-btn"
                    onClick={() => toggleItem(index)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <span className="faq-modern-question">
                      {item.q}
                    </span>
                    <div className="faq-toggle-icon" aria-hidden="true">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </div>
                  </button>

                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={questionId}
                    className={`faq-modern-answer ${isOpen ? 'answer-expanded' : ''}`}
                  >
                    <div className="faq-modern-answer-content">
                      {item.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sticky Support Callout Card (As per Image 1) */}
        <aside className="faq-sidebar-column">
          <div className="faq-support-card">
            {/* Dark Chat Icon Emblem matching reference image */}
            <div className="faq-icon-emblem" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7.414l-3.707 3.707A1 1 0 0 1 2 21V6a2 2 0 0 1 2-2z" />
              </svg>
            </div>

            <h3 className="faq-support-title">Do you have more questions?</h3>
            <p className="faq-support-desc">
              Can't find the answer you're looking for? Reach out to our dedicated support team.
            </p>

            <a
              href="mailto:thedigitalasset88@gmail.com"
              className="faq-support-action-btn"
            >
              Shoot a Direct Mail
            </a>
          </div>
        </aside>
      </div>

      <style>{`
        /* 1200px 2-Column FAQ Layout (Matching Reference Image 1) */
        .faq-modern-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          gap: 2.5rem;
          align-items: start;
        }

        .faq-accordion-column {
          min-width: 0;
        }

        .faq-accordion-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* Modern White FAQ Card */
        .faq-modern-card {
          background: var(--bg-surface, #FFFFFF);
          border: 1px solid var(--border-default, #E5D9C8);
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
        }

        .faq-modern-card:hover {
          border-color: #D4C3AC;
          box-shadow: 0 4px 14px rgba(45, 30, 15, 0.04);
        }

        .faq-modern-card.faq-card-open {
          border-color: var(--color-gold, #C69234);
          box-shadow: 0 6px 20px rgba(45, 30, 15, 0.06);
        }

        .faq-modern-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          text-align: left;
          font-family: var(--font-sans, 'Plus Jakarta Sans', sans-serif);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary, #1E1B18);
          background: none;
          border: none;
          cursor: pointer;
          gap: 1rem;
          outline: none;
          line-height: 1.4;
        }

        .faq-modern-btn:focus-visible {
          outline: 2px solid var(--color-gold, #C69234);
          outline-offset: -2px;
        }

        .faq-modern-question {
          flex: 1;
        }

        .faq-toggle-icon {
          color: var(--text-primary, #1E1B18);
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #F5EFEB;
          transition: transform 0.2s ease, background-color 0.2s ease;
        }

        .faq-card-open .faq-toggle-icon {
          background: var(--color-rakhi-light, #FBF0EF);
          color: var(--color-rakhi-red, #9B2226);
        }

        .faq-modern-answer {
          display: none;
          border-top: 1px solid var(--border-light, #EFE4D6);
        }

        .faq-modern-answer.answer-expanded {
          display: block;
          animation: faqFadeIn 0.22s ease-out;
        }

        @keyframes faqFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .faq-modern-answer-content {
          padding: 1.25rem 1.5rem 1.5rem 1.5rem;
          background: var(--bg-surface, #FFFFFF);
        }

        .faq-modern-answer-content p:last-child,
        .faq-modern-answer-content ol:last-child,
        .faq-modern-answer-content ul:last-child {
          margin-bottom: 0;
        }

        /* --- Right Sidebar Support Card (Image 1 Style) --- */
        .faq-sidebar-column {
          position: sticky;
          top: calc(var(--header-height, 72px) + 1.5rem);
        }

        .faq-support-card {
          background: var(--bg-surface, #FFFFFF);
          border: 1px solid var(--border-default, #E5D9C8);
          border-radius: 16px;
          padding: 2.5rem 1.75rem;
          text-align: center;
          box-shadow: 0 8px 24px rgba(45, 30, 15, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .faq-icon-emblem {
          color: #1E1B18;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .faq-support-title {
          font-family: var(--font-sans, 'Plus Jakarta Sans', sans-serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary, #1E1B18);
          margin: 0 0 0.5rem 0;
          line-height: 1.3;
        }

        .faq-support-desc {
          font-size: 0.875rem;
          color: var(--text-secondary, #59524C);
          line-height: 1.6;
          margin: 0 0 1.75rem 0;
        }

        .faq-support-action-btn {
          width: 100%;
          display: block;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, #FF6F43 0%, #FA5226 100%);
          color: #FFFFFF;
          font-weight: 600;
          font-size: 0.95rem;
          border-radius: 8px;
          text-align: center;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(250, 82, 38, 0.28);
          transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
        }

        .faq-support-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(250, 82, 38, 0.38);
          filter: brightness(1.04);
          color: #FFFFFF;
        }

        @media (max-width: 960px) {
          .faq-modern-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .faq-sidebar-column {
            position: static;
          }
        }

        @media (max-width: 640px) {
          .faq-modern-btn {
            padding: 1rem 1.125rem;
            font-size: 0.95rem;
          }
          .faq-modern-answer-content {
            padding: 1rem 1.125rem;
          }
        }
      `}</style>
    </LegalPageLayout>
  );
};

export default FAQPage;
