import React from 'react';
import { Home, Sparkles, PlusCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="not-found-page-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary, #FDFBF7)' }}>
      <Header />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem' }}>
        <div style={{
          maxWidth: '560px',
          width: '100%',
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '3.5rem 2.5rem',
          textAlign: 'center',
          boxShadow: '0 20px 40px -15px rgba(155, 34, 38, 0.08), 0 0 0 1px rgba(155, 34, 38, 0.06)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            background: 'rgba(212, 175, 55, 0.12)',
            color: '#B8860B',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.25rem'
          }}>
            <Sparkles size={14} />
            <span>404 — Page Not Found</span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'var(--color-rakhi-red, #9B2226)',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em'
          }}>
            Lost in the Memories?
          </h1>

          <p style={{
            color: '#78716C',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            marginBottom: '2.25rem'
          }}>
            The page you are looking for doesn't exist, has been moved, or the link may have been entered incorrectly.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="secondary" size="lg" href="/">
              <Home size={18} style={{ marginRight: '0.5rem' }} />
              Go to Homepage
            </Button>
            <Button variant="primary" size="lg" href="/create">
              <PlusCircle size={18} style={{ marginRight: '0.5rem' }} />
              Create a Rakhi Gift
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
