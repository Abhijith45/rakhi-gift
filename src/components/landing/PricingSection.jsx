import React, { useState } from 'react';
import { Sparkles, Check, X, ShieldCheck, ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import { pricingTiers } from '../../data/pricing';

export const PricingSection = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "Does my sister need to download an app to view her gift?",
      a: "No! The gift is delivered as a private web link. It opens instantly in any mobile or desktop browser with no login, sign-up, or app installation needed."
    },
    {
      q: "How long does the unique gift link remain active?",
      a: "Every paid gift includes permanent private hosting. Your sister can revisit her Memory Wall and letter anytime from any device."
    },
    {
      q: "Can I print the QR code to slip inside a physical gift hamper?",
      a: "Yes! All packages generate a high-resolution printable QR code card that you can download and slip inside your Rakhi envelope, sweets box, or courier hamper."
    },
    {
      q: "Can I preview the gift before paying?",
      a: "Yes! You can see the full live recipient experience in Step 7, change visual themes, and fine-tune your memories before completing activation."
    }
  ];

  return (
    <section id="pricing" className="section pricing-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={13} />
            <span>Simple, Transparent Gifting</span>
          </div>
          <h2 className="section-title">
            One-time gift, <span className="title-serif-accent">permanent keepsake.</span>
          </h2>
          <p className="section-subtitle">
            No recurring subscriptions, no ads, and no hidden fees. Choose the tier that best fits your memories.
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="pricing-grid">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`pricing-card ${tier.popular ? 'pricing-card-popular' : ''}`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="popular-badge">
                  <Sparkles size={13} />
                  <span>{tier.badge || 'Recommended'}</span>
                </div>
              )}

              <div className="pricing-card-header">
                <h3 className="tier-name">{tier.name}</h3>
                <div className="tier-price-row">
                  <span className="tier-price">{tier.price}</span>
                  <span className="tier-period">/ one-time</span>
                </div>
                <p className="tier-tagline">{tier.tagline}</p>
              </div>

              {/* Action CTA */}
              <div className="pricing-cta-wrap">
                <Button
                  href="/create"
                  variant={tier.popular ? 'primary' : 'secondary'}
                  size="md"
                  icon={<ArrowRight size={16} />}
                  iconPosition="right"
                >
                  {tier.ctaText}
                </Button>
              </div>

              {/* Feature Checklist */}
              <div className="tier-features-list">
                <div className="features-list-title">Included in this gift:</div>
                {tier.features.map((item, idx) => (
                  <div key={idx} className={`feature-item ${!item.included ? 'feature-excluded' : ''}`}>
                    {item.included ? (
                      <Check size={16} className="feature-check" />
                    ) : (
                      <X size={15} className="feature-cross" />
                    )}
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Guarantee Note */}
        <div className="pricing-guarantee-card">
          <ShieldCheck size={24} className="guarantee-icon" />
          <div>
            <h4 className="guarantee-title">Private & Distraction-Free Guarantee</h4>
            <p className="guarantee-desc">
              Your photos and personal messages remain strictly private. No public indexing, no ad networks, and no clutter.
            </p>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="pricing-faq-section">
          <div className="faq-header">
            <HelpCircle size={20} className="faq-icon" />
            <h3 className="faq-title">Frequently Asked Questions</h3>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-item">
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  aria-expanded={openFaq === idx}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`faq-chevron ${openFaq === idx ? 'open' : ''}`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="faq-answer-pane animate-fade-in">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .pricing-section {
          background-color: var(--bg-primary);
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-8);
          align-items: stretch;
          margin-bottom: var(--space-12);
        }

        .pricing-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: var(--shadow-sm);
          transition: transform var(--transition-normal), box-shadow var(--transition-normal);
        }

        .pricing-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .pricing-card-popular {
          border: 2px solid var(--color-gold);
          box-shadow: 0 12px 35px -6px rgba(198, 146, 52, 0.2), var(--shadow-md);
          background: #FFFDF8;
          transform: scale(1.02);
        }

        .pricing-card-popular:hover {
          transform: scale(1.02) translateY(-4px);
        }

        .popular-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #C69234, #D4AF37);
          color: #FFFFFF;
          padding: 4px 16px;
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 700;
          letter-spacing: 0.04em;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 3px 10px rgba(198, 146, 52, 0.4);
        }

        .pricing-card-header {
          margin-bottom: var(--space-6);
        }

        .tier-name {
          font-family: var(--font-serif);
          font-size: 1.45rem;
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }

        .tier-price-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: var(--space-3);
        }

        .tier-price {
          font-family: var(--font-serif);
          font-size: 2.75rem;
          font-weight: 700;
          color: var(--color-rakhi-red);
          line-height: 1;
        }

        .tier-period {
          font-size: var(--text-xs);
          color: var(--text-muted);
          font-weight: 500;
        }

        .tier-tagline {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          line-height: 1.5;
          min-height: 36px;
        }

        .pricing-cta-wrap {
          margin-bottom: var(--space-6);
        }

        .tier-features-list {
          border-top: 1px solid var(--border-light);
          padding-top: var(--space-6);
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .features-list-title {
          font-size: var(--text-xs);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-secondary);
          margin-bottom: var(--space-2);
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          font-size: var(--text-xs);
          color: var(--text-primary);
          line-height: 1.5;
        }

        .feature-excluded {
          color: var(--text-muted);
          opacity: 0.6;
        }

        .feature-check {
          color: var(--color-gold);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .feature-cross {
          color: var(--text-muted);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .pricing-guarantee-card {
          max-width: 760px;
          margin: 0 auto var(--space-12) auto;
          display: flex;
          align-items: center;
          gap: var(--space-4);
          background: #FAF5EC;
          border: 1px solid var(--border-gold);
          padding: var(--space-5) var(--space-6);
          border-radius: var(--radius-lg);
        }

        .guarantee-icon {
          color: var(--color-gold);
          flex-shrink: 0;
        }

        .guarantee-title {
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .guarantee-desc {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          margin: 0;
        }

        .pricing-faq-section {
          max-width: 760px;
          margin: 0 auto;
        }

        .faq-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-6);
          justify-content: center;
        }

        .faq-icon {
          color: var(--color-rakhi-red);
        }

        .faq-title {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: var(--text-primary);
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .faq-item {
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .faq-question-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-5);
          font-weight: 600;
          font-size: var(--text-sm);
          color: var(--text-primary);
          text-align: left;
        }

        .faq-chevron {
          color: var(--text-secondary);
          transition: transform var(--transition-fast);
          flex-shrink: 0;
        }

        .faq-chevron.open {
          transform: rotate(180deg);
        }

        .faq-answer-pane {
          padding: 0 var(--space-5) var(--space-4) var(--space-5);
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.65;
          border-top: 1px dashed var(--border-light);
          padding-top: var(--space-3);
        }

        @media (max-width: 960px) {
          .pricing-grid {
            grid-template-columns: 1fr;
            max-width: 460px;
            margin-left: auto;
            margin-right: auto;
          }
          .pricing-card-popular {
            transform: none;
          }
          .pricing-card-popular:hover {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </section>
  );
};

export default PricingSection;
