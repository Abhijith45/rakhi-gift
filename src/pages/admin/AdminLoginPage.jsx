import React, { useState } from 'react';
import { useNavigate } from '../../router';
import { Lock, Mail, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import { adminLogin } from '../../services/api';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@rakhigift.me');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const data = await adminLogin(email, password);
      localStorage.setItem('rakhi_admin_token', data.token);
      navigate('/admin');
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-root">
      <Header />

      <main className="admin-login-main">
        <div className="container login-container">
          <div className="login-card paper-card animate-fade-in">
            <div className="login-emblem">
              <ShieldCheck size={28} color="var(--color-rakhi-red)" />
            </div>

            <h2 className="login-title">Owner Administration</h2>
            <p className="login-subtitle">Sign in to manage gifts, payments, and view analytics.</p>

            {error && (
              <div className="login-error-banner">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">Admin Email</label>
                <div className="input-icon-wrapper">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    className="form-input with-icon"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-icon-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input
                    type="password"
                    className="form-input with-icon"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                icon={<ArrowRight size={18} />}
                iconPosition="right"
                className="login-submit-btn"
              >
                {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        .admin-login-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-primary);
        }

        .admin-login-main {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: calc(var(--header-height) + 3rem) var(--space-4) var(--space-12) var(--space-4);
        }

        .login-container {
          max-width: 440px;
        }

        .login-card {
          padding: clamp(2rem, 5vw, 3rem);
          text-align: center;
          box-shadow: var(--shadow-lg);
        }

        .login-emblem {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--color-rakhi-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto var(--space-4) auto;
        }

        .login-title {
          font-size: 1.75rem;
          margin-bottom: var(--space-1);
        }

        .login-subtitle {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
        }

        .login-error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FDF2F0;
          color: var(--color-rakhi-red);
          border: 1px solid rgba(155, 34, 38, 0.2);
          padding: 8px 12px;
          border-radius: var(--radius-md);
          font-size: var(--text-xs);
          font-weight: 600;
          margin-bottom: var(--space-4);
          text-align: left;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          text-align: left;
        }

        .input-icon-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .form-input.with-icon {
          padding-left: 36px;
        }

        .login-submit-btn {
          margin-top: var(--space-2);
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default AdminLoginPage;
