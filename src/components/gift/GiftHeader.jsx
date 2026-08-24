import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

export const GiftHeader = ({
  gift,
  plan = 'PREMIUM'
}) => {
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const normalizedPlan = (plan || gift?.plan || 'PREMIUM').toUpperCase();

  // Available section links based on gift data & plan entitlements
  const hasWhySpecial = normalizedPlan !== 'BASIC' && gift?.reasons && gift.reasons.length > 0;
  const hasTimeline = normalizedPlan !== 'BASIC' && (gift?.timeline?.length > 0 || gift?.photos?.length > 0);
  const hasFun = normalizedPlan !== 'BASIC';
  const hasSurprise = gift?.surprise && (gift.surprise.giftVoucher || gift.surprise.message);

  const navItems = [
    { id: 'memory-wall', label: 'Memories' },
    { id: 'rakhi-message', label: 'Letter' },
    ...(hasWhySpecial ? [{ id: 'why-special', label: 'Reasons' }] : []),
    ...(hasTimeline ? [{ id: 'timeline', label: 'Timeline' }] : []),
    ...(hasFun ? [{ id: 'sibling-fun', label: 'Banter' }] : []),
    ...(hasSurprise ? [{ id: 'surprise', label: 'Surprise' }] : [])
  ];

  // 1. IntersectionObserver to detect when Memory Wall enters viewport
  useEffect(() => {
    const memoryWallEl = document.getElementById('memory-wall') || document.getElementById('memory-wall-section');
    if (!memoryWallEl) {
      const handleScrollFallback = () => {
        setIsScrolledPastHero(window.scrollY > window.innerHeight * 0.35);
      };
      window.addEventListener('scroll', handleScrollFallback, { passive: true });
      return () => window.removeEventListener('scroll', handleScrollFallback);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const rect = memoryWallEl.getBoundingClientRect();
          setIsScrolledPastHero(rect.top <= 80);
        });
      },
      {
        root: null,
        threshold: [0, 0.1, 0.2, 0.5, 0.8, 1.0],
        rootMargin: '-60px 0px 0px 0px'
      }
    );

    observer.observe(memoryWallEl);

    const handleScroll = () => {
      const rect = memoryWallEl.getBoundingClientRect();
      setIsScrolledPastHero(rect.top <= 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 2. IntersectionObserver to track Active Section
  useEffect(() => {
    const sectionIds = ['hero', 'memory-wall', 'rakhi-message', 'why-special', 'timeline', 'sibling-fun', 'surprise', 'final-wish', 'share'];
    const sectionElements = sectionIds
      .map(id => document.getElementById(id) || document.getElementById(`${id}-section`))
      .filter(Boolean);

    if (sectionElements.length === 0) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rawId = entry.target.id.replace('-section', '');
            setActiveSection(rawId);
          }
        });
      },
      {
        root: null,
        threshold: 0.35
      }
    );

    sectionElements.forEach(el => sectionObserver.observe(el));

    return () => sectionObserver.disconnect();
  }, [hasWhySpecial, hasTimeline, hasFun, hasSurprise]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetEl = document.getElementById(targetId) || document.getElementById(`${targetId}-section`);
    if (targetEl) {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      targetEl.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <header className={`gift-header ${isScrolledPastHero ? 'header-scrolled' : 'header-transparent'} plan-${normalizedPlan.toLowerCase()}`}>
      <div className="container gift-header-inner">
        {/* Left: Brand Logo matching normal navbar */}
        <a
          href="#hero"
          className="brand-logo gift-brand-logo"
          onClick={(e) => handleNavClick(e, 'hero')}
          aria-label="Rakhi Gift Home"
        >
          <div className="logo-emblem">
            <div className="emblem-inner" />
          </div>
          <span className="logo-text">
            Rakhi<span className="logo-accent">Gift</span>
          </span>
        </a>

        {/* Desktop Chapter Navigation Links */}
        <nav className="gift-nav-desktop" aria-label="Gift Chapter Navigation">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`gift-nav-link ${isActive ? 'active-link' : ''}`}
                onClick={(e) => handleNavClick(e, item.id)}
              >
                <span>{item.label}</span>
                {isActive && <span className="active-pill-dot" aria-hidden="true" />}
              </a>
            );
          })}
        </nav>

        {/* Mobile Chapter Navigation Toggle */}
        <div className="gift-mobile-actions">
          <button
            type="button"
            className="mobile-chapter-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation' : 'Open Navigation'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Chapter Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-gift-drawer paper-card animate-fade-in">
          <div className="drawer-header">
            <span className="drawer-title">Chapters</span>
          </div>
          <div className="drawer-nav-list">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`drawer-nav-item ${activeSection === item.id ? 'drawer-active' : ''}`}
                onClick={(e) => handleNavClick(e, item.id)}
              >
                <span>{item.label}</span>
                {activeSection === item.id && <Sparkles size={13} className="sparkle-gold" />}
              </a>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .gift-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 60;
          height: var(--header-height, 64px);
          transition: background-color 0.25s ease, border-color 0.25s ease, backdrop-filter 0.25s ease;
        }

        /* Initial Hero State */
        .header-transparent {
          background-color: transparent;
        }

        /* Scrolled state: Matching page background seamlessly with zero inner shadow */
        .header-scrolled {
          background-color: var(--gift-bg, #FAF4E8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .gift-header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }

        /* --- Brand Logo (Matches Normal Navbar exactly) --- */
        .gift-brand-logo {
          display: inline-flex;
          align-items: center;
          gap: var(--space-3, 0.75rem);
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--gift-text, #1E1B18);
          letter-spacing: -0.02em;
          text-decoration: none;
          user-select: none;
        }

        .logo-emblem {
          width: 28px;
          height: 28px;
          min-width: 28px;
          min-height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gift-accent, #9B2226), var(--gift-accent-secondary, #D96B43));
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-sizing: border-box;
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
          min-width: 14px;
          min-height: 14px;
          border-radius: 50%;
          background: var(--gift-gold, #C69234);
          border: 2px solid var(--gift-surface, #FFFDF9);
          position: relative;
          z-index: 1;
          box-sizing: border-box;
        }

        .logo-text {
          line-height: 1;
          display: inline-block;
        }

        .logo-accent {
          color: var(--gift-accent, #9B2226);
          font-style: italic;
          margin-left: 2px;
        }

        .plan-deluxe .logo-accent {
          color: var(--gift-accent, #8E1616);
        }

        /* --- Desktop Chapter Navigation --- */
        .gift-nav-desktop {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(245, 239, 230, 0.45);
          padding: 4px 6px;
          border-radius: var(--radius-full, 9999px);
          border: 1px solid var(--gift-border, rgba(222, 212, 198, 0.6));
        }

        .header-scrolled .gift-nav-desktop {
          background: rgba(245, 239, 230, 0.6);
        }

        .gift-nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 14px;
          border-radius: var(--radius-full, 9999px);
          font-size: var(--text-xs, 0.75rem);
          font-weight: 500;
          color: var(--gift-text-secondary, #59524C);
          text-decoration: none;
          transition: color 0.18s ease, background-color 0.18s ease;
          line-height: 1;
          box-sizing: border-box;
        }

        .gift-nav-link:hover {
          color: var(--gift-text, #1E1B18);
          background: rgba(255, 253, 249, 0.85);
        }

        /* Active link only changes color & background tint */
        .gift-nav-link.active-link {
          color: var(--gift-accent, #9B2226);
          background: var(--gift-surface, #FFFDF9);
          font-weight: 500;
        }

        .active-pill-dot {
          width: 4px;
          height: 4px;
          min-width: 4px;
          min-height: 4px;
          border-radius: 50%;
          background: var(--gift-accent, #9B2226);
          display: inline-block;
        }

        /* --- Mobile Actions --- */
        .gift-mobile-actions {
          display: none;
        }

        .mobile-chapter-toggle {
          width: 44px;
          height: 44px;
          min-width: 44px;
          min-height: 44px;
          border-radius: var(--radius-md, 8px);
          background: var(--bg-surface, #FFFDF9);
          border: 1px solid var(--border-default, #E5D9C8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary, #1E1B18);
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .mobile-chapter-toggle:hover,
        .mobile-chapter-toggle:focus-visible {
          background-color: var(--bg-subtle, rgba(0, 0, 0, 0.04));
        }

        /* --- Mobile Drawer --- */
        .mobile-gift-drawer {
          position: absolute;
          top: var(--header-height, 64px);
          left: 1rem;
          right: 1rem;
          background: var(--bg-surface, #FFFDF9);
          border: 1px solid var(--border-default, #E5D9C8);
          border-radius: var(--radius-lg, 12px);
          padding: var(--space-4, 1rem);
          box-shadow: 0 12px 30px rgba(45, 30, 15, 0.12);
        }

        .drawer-header {
          border-bottom: 1px solid var(--border-light, #EFE4D6);
          padding-bottom: 8px;
          margin-bottom: 8px;
        }

        .drawer-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted, #857D75);
        }

        .drawer-nav-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .drawer-nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          min-height: 44px;
          border-radius: var(--radius-md, 8px);
          text-decoration: none;
          color: var(--text-secondary, #59524C);
          font-size: var(--text-sm, 0.875rem);
          font-weight: 500;
          box-sizing: border-box;
        }

        .drawer-nav-item:hover,
        .drawer-active {
          background: var(--color-rakhi-light, #FBF0EF);
          color: var(--color-rakhi-red, #9B2226);
        }

        .sparkle-gold {
          color: var(--color-gold, #C69234);
        }

        @media (max-width: 768px) {
          .gift-nav-desktop {
            display: none;
          }
          .gift-mobile-actions {
            display: flex;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gift-header {
            transition: none !important;
          }
          .gift-nav-link {
            transition: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default GiftHeader;
