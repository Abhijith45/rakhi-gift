import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import Button from '../common/Button';
import { Link } from '../../router';

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-inner">
        {/* Brand / Logo */}
        <Link to="/" className="brand-logo" aria-label="Rakhi Gift Home">
          <div className="logo-emblem">
            <div className="emblem-inner" />
          </div>
          <span className="logo-text">
            Rakhi<span className="logo-accent">Gift</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop" aria-label="Main Navigation">
          <a href="/#memory-wall" className="nav-link">Memory Wall</a>
          <a href="/#how-it-works" className="nav-link">How It Works</a>
          <a href="/#experience-preview" className="nav-link">Preview</a>
          <a href="/#features" className="nav-link">Features</a>
          <a href="/#pricing" className="nav-link">Pricing</a>
        </nav>

        {/* Header Action CTA */}
        <div className="header-actions">
          <Button
            href="/create"
            variant="primary"
            size="sm"
            icon={<Sparkles size={14} />}
          >
            Create Your Gift
          </Button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="nav-mobile-overlay">
          <nav className="nav-mobile" aria-label="Mobile Navigation">
            <a
              href="#memory-wall"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Memory Wall
            </a>
            <a
              href="#how-it-works"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#experience-preview"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Recipient Experience
            </a>
            <a
              href="#features"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <div className="mobile-menu-cta">
              <Button
                href="#pricing"
                variant="primary"
                size="md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Your Memory Gift
              </Button>
            </div>
          </nav>
        </div>
      )}

      <style>{`
        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--header-height);
          z-index: var(--z-header);
          transition: background-color var(--transition-normal), border-color var(--transition-normal), backdrop-filter var(--transition-normal);
        }

        .header-scrolled {
          background-color: var(--bg-primary, #FAF7F2);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-family: var(--font-serif);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          text-decoration: none;
        }

        .logo-emblem {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-rakhi-red), var(--color-coral));
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
          background: var(--color-gold);
          border-radius: 1px;
          z-index: 0;
        }

        .emblem-inner {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--color-gold);
          border: 2px solid var(--bg-surface);
          position: relative;
          z-index: 1;
        }

        .logo-accent {
          color: var(--color-rakhi-red);
          font-style: italic;
          margin-left: 2px;
        }

        .nav-desktop {
          display: flex;
          align-items: center;
          gap: var(--space-8);
        }

        .nav-link {
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--text-secondary);
          position: relative;
          padding: var(--space-1) 0;
          text-decoration: none;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--color-rakhi-red);
          transition: width var(--transition-fast);
          border-radius: 1px;
        }

        .nav-link:hover {
          color: var(--text-primary);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .mobile-toggle {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          color: var(--text-primary);
          background: none;
          border: none;
          cursor: pointer;
        }

        .nav-mobile-overlay {
          position: fixed;
          top: var(--header-height);
          left: 0;
          right: 0;
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-light);
          padding: var(--space-6) var(--space-4);
          z-index: var(--z-dropdown);
          animation: slideDown 0.25s ease-out;
        }

        .nav-mobile {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .mobile-nav-link {
          font-size: var(--text-base);
          font-weight: 600;
          color: var(--text-secondary);
          padding: var(--space-2) 0;
          text-decoration: none;
        }

        .mobile-nav-link:hover {
          color: var(--color-rakhi-red);
        }

        .mobile-menu-cta {
          padding-top: var(--space-4);
          border-top: 1px solid var(--border-light);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1024px) {
          .nav-desktop {
            display: none;
          }
          .mobile-toggle {
            display: flex;
          }
        }

        @media (max-width: 480px) {
          .header-actions .btn {
            padding: 6px 12px;
            font-size: var(--text-xs, 0.75rem);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
