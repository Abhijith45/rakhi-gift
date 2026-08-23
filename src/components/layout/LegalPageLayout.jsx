import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link } from '../../router';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const LegalPageLayout = ({
  title,
  tag = 'Legal & Information',
  subtitle,
  lastUpdated,
  seoTitle,
  seoDescription,
  tableOfContents = [],
  activeSection = '',
  children
}) => {
  useEffect(() => {
    // SEO / Page Metadata
    if (seoTitle || title) {
      document.title = seoTitle || `${title} | Rakhi Gift`;
    }

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    if (seoDescription || subtitle) {
      metaDesc.setAttribute('content', seoDescription || subtitle);
    }

    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [title, seoTitle, seoDescription, subtitle]);

  const hasToc = tableOfContents && tableOfContents.length > 0;

  return (
    <div className="legal-page-root">
      <Header />

      <main id="main-content" className="legal-main">
        <div className="legal-container">
          {/* Breadcrumb Navigation */}
          <div className="legal-nav-bar">
            <Link to="/" className="legal-back-link">
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Hero Header */}
          <header className="legal-hero">
            <div className="legal-tag">
              <Sparkles size={13} className="gold-sparkle" />
              <span>{tag}</span>
            </div>

            <h1 className="legal-title">{title}</h1>

            {subtitle && (
              <p className="legal-subtitle">{subtitle}</p>
            )}

            {lastUpdated && (
              <div className="legal-meta-pill">
                <span>Last Updated: <strong>{lastUpdated}</strong></span>
              </div>
            )}
          </header>

          {/* 1200px Content Layout */}
          {hasToc ? (
            <div className="legal-doc-layout">
              {/* Left Sticky Table of Contents Sidebar */}
              <aside className="legal-toc-sidebar" aria-label="Table of contents">
                <div className="legal-toc-sticky-box">
                  <h3 className="legal-toc-heading">Table of Contents</h3>
                  <nav className="legal-toc-nav">
                    <ul className="legal-toc-list">
                      {tableOfContents.map((item, idx) => {
                        const isActive = activeSection === item.id;
                        return (
                          <li key={item.id || idx} className="legal-toc-item">
                            <a
                              href={`#${item.id}`}
                              className={`legal-toc-link ${isActive ? 'toc-link-active' : ''}`}
                            >
                              <span className="toc-number">{idx + 1}.</span>
                              <span className="toc-title-text">{item.title}</span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>
              </aside>

              {/* Right Document Content Column */}
              <div className="legal-doc-content paper-card">
                {children}
              </div>
            </div>
          ) : (
            <div className="legal-full-content-wrapper">
              {children}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style>{`
        .legal-page-root {
          min-height: 100vh;
          background-color: var(--bg-primary, #FAF7F2);
          color: var(--text-primary, #1E1B18);
          display: flex;
          flex-direction: column;
        }

        .legal-main {
          flex: 1;
          padding-top: calc(var(--header-height, 72px) + 2rem);
          padding-bottom: var(--space-20, 5rem);
        }

        /* 1200px Main Container */
        .legal-container {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 0 1.5rem;
          box-sizing: border-box;
        }

        .legal-nav-bar {
          margin-bottom: 1.5rem;
        }

        .legal-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: var(--text-sm, 0.875rem);
          font-weight: 600;
          color: var(--text-secondary, #59524C);
          transition: color var(--transition-fast, 150ms ease);
          text-decoration: none;
        }

        .legal-back-link:hover {
          color: var(--color-rakhi-red, #9B2226);
        }

        .legal-hero {
          margin: 0 auto 3rem auto;
          text-align: center;
          max-width: 860px;
        }

        .legal-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: var(--text-xs, 0.75rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-gold, #C69234);
          background: rgba(198, 146, 52, 0.1);
          padding: 4px 12px;
          border-radius: var(--radius-full, 9999px);
          border: 1px solid rgba(198, 146, 52, 0.25);
          margin-bottom: var(--space-4, 1rem);
        }

        .gold-sparkle {
          color: var(--color-gold, #C69234);
        }

        .legal-title {
          font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
          font-size: clamp(2.2rem, 4.5vw, 3.4rem);
          font-weight: 700;
          color: var(--text-primary, #1E1B18);
          line-height: 1.15;
          margin-bottom: 0.75rem;
          letter-spacing: -0.015em;
        }

        .legal-subtitle {
          font-size: clamp(1rem, 1.8vw, 1.15rem);
          color: var(--text-secondary, #59524C);
          line-height: 1.6;
          max-width: 680px;
          margin: 0 auto 1.25rem auto;
        }

        .legal-meta-pill {
          display: inline-block;
          font-size: var(--text-xs, 0.75rem);
          color: var(--text-muted, #857D75);
          background: var(--bg-surface, #FFFDF9);
          padding: 4px 14px;
          border-radius: var(--radius-full, 9999px);
          border: 1px solid var(--border-default, #E5D9C8);
        }

        .legal-meta-pill strong {
          color: var(--text-primary, #1E1B18);
        }

        /* --- 2-Column Documentation Layout (Image 2 style) --- */
        .legal-doc-layout {
          display: grid;
          grid-template-columns: 280px minmax(0, 1fr);
          gap: 2.5rem;
          align-items: start;
          position: relative;
        }

        /* TOC Sidebar: Sticky to navbar with height fit-content */
        .legal-toc-sidebar {
          width: 100%;
          position: sticky;
          top: calc(var(--header-height, 72px) + 1rem);
          height: fit-content;
          align-self: start;
        }

        .legal-toc-sticky-box {
          background: var(--bg-surface, #FFFDF9);
          border: 1px solid var(--border-default, #E5D9C8);
          border-radius: var(--radius-lg, 16px);
          padding: 1.5rem 1.25rem;
          box-shadow: 0 4px 16px rgba(45, 30, 15, 0.04);
          height: fit-content;
          max-height: calc(100vh - 110px);
          overflow-y: auto;
        }

        .legal-toc-heading {
          font-family: var(--font-sans, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.95rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-primary, #1E1B18);
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-light, #EFE4D6);
        }

        .legal-toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .legal-toc-link {
          display: flex;
          align-items: baseline;
          gap: 8px;
          font-size: 0.8125rem;
          color: var(--text-secondary, #59524C);
          padding: 6px 10px;
          border-radius: 6px;
          text-decoration: none;
          line-height: 1.4;
          transition: all 0.15s ease;
        }

        .legal-toc-link:hover {
          color: var(--color-rakhi-red, #9B2226);
          background: rgba(155, 34, 38, 0.05);
        }

        .legal-toc-link.toc-link-active {
          color: var(--color-rakhi-red, #9B2226);
          background: var(--color-rakhi-light, #FBF0EF);
          font-weight: 700;
        }

        .toc-number {
          font-weight: 700;
          color: var(--color-rakhi-red, #9B2226);
          font-size: 0.75rem;
          min-width: 16px;
        }

        /* Document Reading Area */
        .legal-doc-content {
          background: var(--bg-surface, #FFFDF9);
          border: 1px solid var(--border-default, #E5D9C8);
          border-radius: var(--radius-xl, 24px);
          padding: clamp(2rem, 4vw, 3.5rem);
          box-shadow: 
            0 12px 36px -4px rgba(45, 30, 15, 0.06),
            0 4px 12px -2px rgba(45, 30, 15, 0.03);
          min-width: 0;
        }

        .legal-full-content-wrapper {
          width: 100%;
        }

        /* Section dividers */
        .legal-section-block {
          padding-bottom: 2.25rem;
          margin-bottom: 2.25rem;
          border-bottom: 1px solid var(--border-light, #EFE4D6);
          scroll-margin-top: 100px;
        }

        .legal-section-block:last-child {
          border-bottom: none;
          padding-bottom: 0;
          margin-bottom: 0;
        }

        .legal-h2 {
          font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
          font-size: clamp(1.3rem, 2.2vw, 1.55rem);
          font-weight: 700;
          color: var(--text-primary, #1E1B18);
          margin-bottom: 0.85rem;
          line-height: 1.3;
        }

        .legal-h3 {
          font-family: var(--font-sans, 'Plus Jakarta Sans', sans-serif);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary, #1E1B18);
          margin-top: 1.5rem;
          margin-bottom: 0.6rem;
        }

        .legal-p {
          font-size: 0.95rem;
          line-height: 1.8;
          color: var(--text-secondary, #59524C);
          margin-bottom: 0.95rem;
        }

        .legal-list {
          list-style: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .legal-list-item {
          font-size: 0.95rem;
          line-height: 1.75;
          color: var(--text-secondary, #59524C);
          margin-bottom: 0.4rem;
        }

        .legal-numbered-list {
          list-style: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .legal-link {
          color: var(--color-rakhi-red, #9B2226);
          text-decoration: underline;
          text-underline-offset: 3px;
          font-weight: 500;
          transition: color 0.15s ease;
        }

        .legal-link:hover {
          color: var(--color-rakhi-dark, #74171A);
        }

        .legal-placeholder {
          display: inline-block;
          padding: 1px 6px;
          background: rgba(198, 146, 52, 0.12);
          border: 1px dashed rgba(198, 146, 52, 0.5);
          border-radius: 4px;
          color: #8C6214;
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.9em;
        }

        @media (max-width: 960px) {
          .legal-doc-layout {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .legal-toc-sidebar {
            display: none; /* Keep mobile reading experience clean */
          }
          .legal-doc-content {
            padding: 1.5rem 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LegalPageLayout;
