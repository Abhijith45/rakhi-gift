import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from './router';
import ErrorBoundary from './components/common/ErrorBoundary';
import LandingPage from './pages/LandingPage';
import CreatorPage from './pages/CreatorPage';
import PublicGiftPage from './pages/PublicGiftPage';
import NotFoundPage from './pages/NotFoundPage';
import FAQPage from './pages/FAQPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import { trackEvent } from './services/api';

// Anonymous Session ID Initialization
if (!window.__rakhi_session_id) {
  window.__rakhi_session_id = 'sess_' + Math.random().toString(36).substring(2, 10);
}

export const App = () => {
  useEffect(() => {
    // Record initial landing page view
    trackEvent('landing_view');
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<CreatorPage />} />
          <Route path="/g/:slug" element={<PublicGiftPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/*" element={<AdminDashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
