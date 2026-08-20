import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Button from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught React error in ErrorBoundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary, #FDFBF7)' }}>
          <Header />
          <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem' }}>
            <div style={{
              maxWidth: '520px',
              width: '100%',
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '3rem 2rem',
              textAlign: 'center',
              boxShadow: '0 20px 40px -15px rgba(155, 34, 38, 0.08), 0 0 0 1px rgba(155, 34, 38, 0.06)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(155, 34, 38, 0.08)',
                color: 'var(--color-rakhi-red, #9B2226)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto'
              }}>
                <AlertCircle size={32} />
              </div>

              <h1 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#1C1917',
                marginBottom: '0.75rem'
              }}>
                Something went wrong
              </h1>

              <p style={{
                color: '#78716C',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                marginBottom: '2rem'
              }}>
                We encountered an unexpected issue while loading this page. Please try refreshing or return to the homepage.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button variant="secondary" size="md" onClick={this.handleRetry}>
                  <RefreshCw size={16} style={{ marginRight: '0.5rem' }} />
                  Reload Page
                </Button>
                <Button variant="primary" size="md" href="/">
                  <Home size={16} style={{ marginRight: '0.5rem' }} />
                  Return Home
                </Button>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
