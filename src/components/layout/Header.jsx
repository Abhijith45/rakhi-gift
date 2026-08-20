import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Heart } from 'lucide-react';
import Button from '../common/Button';

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
        <a href="#" className="brand-logo" aria-label="Rakhi Gift Home">
          <div className="logo-emblem">
            <div className="emblem-inner" />
          </div>
          <span className="logo-text">
            Rakhi<span className="logo-accent">Gift</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="nav-desktop" aria-label="Main Navigation">
          <a href="#memory-wall" className="nav-link">Memory Wall</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#experience-preview" className="nav-link">Preview</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#pricing" className="nav-link">Pricing</a>
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
          transition: background-color var(--transition-normal), box-shadow var(--transition-normal), backdrop-filter var(--transition-normal);
        }

        .header-scrolled {
          background-color: rgba(250, 247, 242, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 1px 0 var(--border-light), 0 4px 16px rgba(30, 27, 24, 0.04);
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
        }

        .logo-emblem {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-rakhi-red), var(--color-coral));
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px var(--color-rakhi-glow);
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
          gap: var(--space-3);
        }

        .mobile-toggle {
          display: none;
          color: var(--text-primary);
          padding: var(--space-2);
          border-radius: var(--radius-sm);
        }

        .mobile-toggle:hover {
          background-color: var(--bg-subtle);
        }

        .nav-mobile-overlay {
          position: fixed;
          top: var(--header-height);
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(250, 247, 242, 0.97);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: var(--space-8) var(--space-6);
          border-top: 1px solid var(--border-light);
          animation: fadeIn 0.25s var(--ease-soft);
        }

        .nav-mobile {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .mobile-nav-link {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--text-primary);
          padding: var(--space-2) 0;
          border-bottom: 1px solid var(--border-light);
        }

        .mobile-menu-cta {
          margin-top: var(--space-6);
        }

        @media (max-width: 860px) {
          .nav-desktop {
            display: none;
          }
          .mobile-toggle {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
