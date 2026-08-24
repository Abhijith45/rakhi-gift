import React from 'react';
import { Link } from '../../router';

export const GiftFooter = ({
  plan = 'PREMIUM'
}) => {
  const normalizedPlan = (plan || 'PREMIUM').toUpperCase();

  return (
    <footer id="footer" className={`gift-site-footer plan-${normalizedPlan.toLowerCase()}`}>
      <div className="container gift-footer-container">
        {/* Centered Brand Logo */}
        <Link to="/" className="brand-logo footer-logo" aria-label="Rakhi Gift Home">
          <div className="logo-emblem">
            <div className="emblem-inner" />
          </div>
          <span className="logo-text">
            Rakhi<span className="logo-accent">Gift</span>
          </span>
        </Link>

        {/* Copyright Text */}
        <p className="footer-copyright">
          © {new Date().getFullYear()} RakhiGift. All rights reserved.
        </p>
      </div>

      <style>{`
        .gift-site-footer {
          background: var(--gift-bg, #FAF4E8);
          border-top: 1px solid var(--gift-border, #E5D9C8);
          padding: var(--space-8, 2rem) 0;
          text-align: center;
        }

        .gift-footer-container {
          max-width: 680px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-3, 0.75rem);
        }

        .footer-logo {
          display: inline-flex;
          align-items: center;
          gap: var(--space-3, 0.75rem);
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--gift-text, #1E1B18);
          text-decoration: none;
          user-select: none;
        }

        .logo-emblem {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gift-accent, #9B2226), var(--gift-accent-secondary, #D96B43));
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .logo-emblem::before {
          content: '';
          position: absolute;
          width: 36px;
          height: 2px;
          background: var(--gift-gold, #C69234);
          border-radius: 1px;
          z-index: 0;
        }

        .emblem-inner {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--gift-gold, #C69234);
          border: 2px solid var(--gift-surface, #FFFDF9);
          position: relative;
          z-index: 1;
        }

        .logo-accent {
          color: var(--gift-accent, #9B2226);
          font-style: italic;
          margin-left: 2px;
        }

        .plan-deluxe .logo-accent {
          color: var(--gift-accent, #8E1616);
        }

        .footer-copyright {
          font-size: var(--text-xs, 0.75rem);
          color: var(--gift-text-muted, #857D75);
          margin: 0;
          letter-spacing: 0.02em;
        }
      `}</style>
    </footer>
  );
};

export default GiftFooter;
