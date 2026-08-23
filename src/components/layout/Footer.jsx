import React from 'react';
import { Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from '../../router';

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand & Purpose */}
          <div className="footer-brand">
            <Link to="/" className="brand-logo footer-logo" aria-label="Rakhi Gift Home">
              <div className="logo-emblem">
                <div className="emblem-inner" />
              </div>
              <span className="logo-text">
                Rakhi<span className="logo-accent">Gift</span>
              </span>
            </Link>
            <p className="footer-desc">
              Transforming cherished sibling memories into an unforgettable, warm, and tactile digital keepsake.
            </p>
            <div className="footer-trust-badge">
              <ShieldCheck size={16} className="trust-icon" />
              <span>Private & secure permanent links with zero ad tracking.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-group">
            <h4 className="footer-group-title">Experience</h4>
            <ul className="footer-links">
              <li><a href="/#memory-wall">3D Memory Wall</a></li>
              <li><a href="/#how-it-works">How It Works</a></li>
              <li><a href="/#experience-preview">Recipient Preview</a></li>
              <li><a href="/#pricing">Gift Packages</a></li>
            </ul>
          </div>

          {/* Sibling Themes */}
          <div className="footer-links-group">
            <h4 className="footer-group-title">Keepsake Themes</h4>
            <ul className="footer-links">
              <li><span>Warm Memory (Signature)</span></li>
              <li><span>Playful Childhood</span></li>
              <li><span>Elegant Minimal</span></li>
              <li><span>Traditional Rakhi</span></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="footer-links-group">
            <h4 className="footer-group-title">Trust & Legal</h4>
            <ul className="footer-links">
              <li><Link to="/faq">FAQs</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
              <li><a href="mailto:thedigitalasset88@gmail.com">thedigitalasset88@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Rakhi Gift. Crafted with <Heart size={14} className="heart-icon" /> for siblings everywhere.
          </p>
          <div className="footer-tagline">
            <Sparkles size={14} className="gold-icon" />
            <span>Turn your memories into a Rakhi gift</span>
          </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          background-color: var(--bg-dark);
          color: var(--text-on-dark);
          padding-top: var(--space-20);
          padding-bottom: var(--space-10);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: var(--space-12);
          margin-bottom: var(--space-16);
        }

        .footer-brand {
          max-width: 340px;
        }

        .footer-logo {
          color: #FAF7F2;
          margin-bottom: var(--space-4);
        }

        .footer-desc {
          color: #A39B92;
          font-size: var(--text-sm);
          line-height: 1.7;
          margin-bottom: var(--space-6);
        }

        .footer-trust-badge {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-xs);
          color: #D4AF37;
          background: rgba(212, 175, 55, 0.08);
          border: 1px solid rgba(212, 175, 55, 0.2);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
        }

        .trust-icon {
          flex-shrink: 0;
        }

        .footer-group-title {
          font-family: var(--font-sans);
          font-size: var(--text-xs);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #E6DCCD;
          margin-bottom: var(--space-5);
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .footer-links a,
        .footer-links span {
          font-size: var(--text-sm);
          color: #A39B92;
          transition: color var(--transition-fast);
        }

        .footer-links a:hover {
          color: #FFFFFF;
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: var(--space-8);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-size: var(--text-xs);
          color: #857D75;
        }

        .footer-copy {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          color: #857D75;
          margin: 0;
        }

        .heart-icon {
          color: var(--color-rakhi-crimson);
          fill: var(--color-rakhi-crimson);
          display: inline;
        }

        .gold-icon {
          color: var(--color-gold);
          display: inline;
        }

        .footer-tagline {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: #C69234;
          font-weight: 500;
        }

        @media (max-width: 960px) {
          .footer-top {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-8) var(--space-6);
            margin-bottom: var(--space-12);
          }
          .footer-brand {
            grid-column: 1 / -1;
            max-width: 100%;
            margin-bottom: var(--space-2);
          }
        }

        @media (max-width: 600px) {
          .site-footer {
            padding-top: var(--space-12);
            padding-bottom: var(--space-8);
          }
          .footer-top {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-8) var(--space-4);
          }
          .footer-brand {
            grid-column: 1 / -1;
          }
          .footer-bottom {
            flex-direction: column;
            gap: var(--space-3);
            text-align: center;
            padding-top: var(--space-6);
          }
          .footer-copy {
            justify-content: center;
            flex-wrap: wrap;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
