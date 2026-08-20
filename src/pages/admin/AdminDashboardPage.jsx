import React, { useState, useEffect } from 'react';
import { useNavigate } from '../../router';
import {
  LayoutDashboard,
  Gift,
  CreditCard,
  BarChart3,
  LogOut,
  Sparkles,
  Eye,
  CheckCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import {
  getAdminDashboard,
  getAdminGifts,
  getAdminPayments,
  getAdminAnalytics,
  toggleAdminGiftStatus
} from '../../services/api';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('rakhi_admin_token'));
  const [activeTab, setActiveTab] = useState('overview'); // overview, gifts, payments, analytics
  const [loading, setLoading] = useState(true);

  // Data states
  const [stats, setStats] = useState(null);
  const [gifts, setGifts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('rakhi_admin_token');
    navigate('/admin/login');
  };

  const loadAllAdminData = async () => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      setLoading(true);
      const [dashData, giftsData, paymentsData, analyticsData] = await Promise.all([
        getAdminDashboard(token).catch(() => null),
        getAdminGifts(token).catch(() => []),
        getAdminPayments(token).catch(() => []),
        getAdminAnalytics(token).catch(() => null)
      ]);

      setStats(dashData);
      setGifts(giftsData || []);
      setPayments(paymentsData || []);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Admin data fetch error:', err);
      if (err.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, [token]);

  const filteredGifts = gifts.filter(
    (g) =>
      g.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.senderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-page-root">
      <Header />

      <main className="admin-main">
        <div className="container admin-container">
          {/* Admin Navigation Bar */}
          <div className="admin-top-bar">
            <div className="admin-title-wrap">
              <span className="admin-badge">Admin Dashboard</span>
              <h1 className="admin-heading">Gift Management & Analytics</h1>
            </div>

            <div className="admin-top-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={loadAllAdminData}
                title="Refresh data"
              >
                <RefreshCw size={14} />
                <span>Refresh</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm logout-btn"
                onClick={handleLogout}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="admin-tabs">
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard size={16} />
              <span>Overview KPIs</span>
            </button>
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'gifts' ? 'active' : ''}`}
              onClick={() => setActiveTab('gifts')}
            >
              <Gift size={16} />
              <span>All Gifts ({gifts.length})</span>
            </button>
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              <CreditCard size={16} />
              <span>Payments ({payments.length})</span>
            </button>
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 size={16} />
              <span>Funnel Analytics</span>
            </button>
          </div>

          {/* KPI Summary Cards */}
          <div className="admin-kpi-grid">
            <div className="kpi-card paper-card">
              <span className="kpi-label">Total Gifts Created</span>
              <div className="kpi-value">{stats?.totalGifts || gifts.length}</div>
              <span className="kpi-sub">
                {stats?.activeGifts || gifts.filter((g) => g.status === 'ACTIVE').length} Active Keepsakes
              </span>
            </div>

            <div className="kpi-card paper-card">
              <span className="kpi-label">Total Revenue</span>
              <div className="kpi-value">₹{stats?.totalRevenue || 0}</div>
              <span className="kpi-sub">{stats?.totalPaidOrders || 0} Paid Orders</span>
            </div>

            <div className="kpi-card paper-card">
              <span className="kpi-label">Total Keepsake Views</span>
              <div className="kpi-value">{stats?.totalViews || 0}</div>
              <span className="kpi-sub">Across all gift links</span>
            </div>

            <div className="kpi-card paper-card">
              <span className="kpi-label">Conversion Rate</span>
              <div className="kpi-value">{analytics?.conversionRate || 0}%</div>
              <span className="kpi-sub">Landing to Paid Gift</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* TAB 1: OVERVIEW */}
          {/* ============================================================ */}
          {activeTab === 'overview' && (
            <div className="admin-tab-content animate-fade-in">
              <div className="admin-section-box paper-card">
                <h3 className="section-box-title">Recent Keepsakes</h3>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Recipient</th>
                        <th>Sender</th>
                        <th>Plan</th>
                        <th>Status</th>
                        <th>Views</th>
                        <th>Created</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gifts.slice(0, 6).map((gift) => (
                        <tr key={gift.id}>
                          <td>
                            <strong>{gift.recipientName}</strong>
                          </td>
                          <td>{gift.senderName}</td>
                          <td>
                            <span className="plan-badge">{gift.plan}</span>
                          </td>
                          <td>
                            <span className={`status-pill ${gift.status.toLowerCase()}`}>
                              {gift.status}
                            </span>
                          </td>
                          <td>{gift.viewCount || 0}</td>
                          <td>{new Date(gift.createdAt).toLocaleDateString()}</td>
                          <td>
                            <a
                              href={`/g/${gift.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="table-link"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: ALL GIFTS */}
          {/* ============================================================ */}
          {activeTab === 'gifts' && (
            <div className="admin-tab-content animate-fade-in">
              <div className="admin-section-box paper-card">
                <div className="table-filter-bar">
                  <div className="search-input-wrap">
                    <Search size={16} className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search recipient, sender, or slug..."
                      className="search-field"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Gift Slug</th>
                        <th>Recipient</th>
                        <th>Sender</th>
                        <th>Theme</th>
                        <th>Plan</th>
                        <th>Status</th>
                        <th>Photos</th>
                        <th>Views</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGifts.map((gift) => (
                        <tr key={gift.id}>
                          <td>
                            <code className="slug-code">/g/{gift.slug}</code>
                          </td>
                          <td>
                            <strong>{gift.recipientName}</strong>
                          </td>
                          <td>{gift.senderName}</td>
                          <td>{gift.theme}</td>
                          <td>
                            <span className="plan-badge">{gift.plan}</span>
                          </td>
                          <td>
                            <span className={`status-pill ${gift.status.toLowerCase()}`}>
                              {gift.status}
                            </span>
                          </td>
                          <td>{gift.photos?.length || 0}</td>
                          <td>{gift.viewCount || 0}</td>
                          <td>
                            <a
                              href={`/g/${gift.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-secondary btn-sm"
                            >
                              <span>Open</span>
                              <ExternalLink size={12} />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: PAYMENTS */}
          {/* ============================================================ */}
          {activeTab === 'payments' && (
            <div className="admin-tab-content animate-fade-in">
              <div className="admin-section-box paper-card">
                <h3 className="section-box-title">Financial & Razorpay Orders Audit</h3>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Razorpay Order ID</th>
                        <th>Plan</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Payment ID</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <code className="slug-code">{p.razorpayOrderId}</code>
                          </td>
                          <td>
                            <span className="plan-badge">{p.plan}</span>
                          </td>
                          <td>
                            <strong>₹{p.amount}</strong>
                          </td>
                          <td>
                            <span className={`status-pill ${p.status.toLowerCase()}`}>
                              {p.status}
                            </span>
                          </td>
                          <td>{p.razorpayPaymentId || '—'}</td>
                          <td>{new Date(p.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: FUNNEL ANALYTICS */}
          {/* ============================================================ */}
          {activeTab === 'analytics' && (
            <div className="admin-tab-content animate-fade-in">
              <div className="admin-section-box paper-card">
                <h3 className="section-box-title">Conversion Funnel Pipeline</h3>
                <p className="card-subtitle">
                  Anonymous event tracking for marketing and creator conversion.
                </p>

                <div className="funnel-metrics-list">
                  <div className="funnel-row">
                    <span className="funnel-name">01. Landing Page Views</span>
                    <span className="funnel-count">{analytics?.counts?.landing_view || 0}</span>
                  </div>
                  <div className="funnel-row">
                    <span className="funnel-name">02. Create Flow Started</span>
                    <span className="funnel-count">{analytics?.counts?.create_started || 0}</span>
                  </div>
                  <div className="funnel-row">
                    <span className="funnel-name">03. 3D Preview Viewed</span>
                    <span className="funnel-count">{analytics?.counts?.preview_viewed || 0}</span>
                  </div>
                  <div className="funnel-row">
                    <span className="funnel-name">04. Payments Initiated</span>
                    <span className="funnel-count">{analytics?.counts?.payment_started || 0}</span>
                  </div>
                  <div className="funnel-row">
                    <span className="funnel-name">05. Payments Succeeded</span>
                    <span className="funnel-count">{analytics?.counts?.payment_success || 0}</span>
                  </div>
                  <div className="funnel-row">
                    <span className="funnel-name">06. Public Keepsakes Viewed</span>
                    <span className="funnel-count">{analytics?.counts?.gift_viewed || 0}</span>
                  </div>
                  <div className="funnel-row">
                    <span className="funnel-name">07. Surprise Envelope Opened</span>
                    <span className="funnel-count">{analytics?.counts?.surprise_revealed || 0}</span>
                  </div>
                  <div className="funnel-row">
                    <span className="funnel-name">08. WhatsApp Shares</span>
                    <span className="funnel-count">{analytics?.counts?.whatsapp_share_clicked || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style>{`
        .admin-page-root {
          min-height: 100vh;
          background-color: var(--bg-primary);
          display: flex;
          flex-direction: column;
        }

        .admin-main {
          flex-grow: 1;
          padding-top: calc(var(--header-height) + 2rem);
          padding-bottom: var(--space-16);
        }

        .admin-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
          gap: var(--space-4);
        }

        .admin-badge {
          display: inline-block;
          font-size: var(--text-xs);
          font-weight: 700;
          color: var(--color-gold);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 2px;
        }

        .admin-heading {
          font-size: 2rem;
          color: var(--text-primary);
          margin: 0;
        }

        .admin-top-actions {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .logout-btn {
          color: var(--color-rakhi-red);
        }

        .admin-tabs {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-6);
          border-bottom: 1px solid var(--border-light);
          padding-bottom: var(--space-2);
          overflow-x: auto;
        }

        .admin-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-5);
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-secondary);
          background: transparent;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .admin-tab-btn:hover {
          background: var(--bg-subtle);
          color: var(--text-primary);
        }

        .admin-tab-btn.active {
          background: var(--bg-surface);
          color: var(--color-rakhi-red);
          box-shadow: var(--shadow-xs);
        }

        .admin-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-4);
          margin-bottom: var(--space-8);
        }

        .kpi-card {
          padding: var(--space-5);
        }

        .kpi-label {
          font-size: var(--text-xs);
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: var(--space-2);
        }

        .kpi-value {
          font-family: var(--font-serif);
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
          margin-bottom: var(--space-1);
        }

        .kpi-sub {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .admin-section-box {
          padding: var(--space-6);
        }

        .section-box-title {
          font-size: 1.35rem;
          margin-bottom: var(--space-4);
        }

        .table-filter-bar {
          margin-bottom: var(--space-5);
        }

        .search-input-wrap {
          position: relative;
          max-width: 380px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-field {
          width: 100%;
          padding: 8px 12px 8px 36px;
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
        }

        .table-responsive {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--text-sm);
        }

        .admin-table th {
          text-align: left;
          padding: var(--space-3) var(--space-4);
          border-bottom: 2px solid var(--border-default);
          font-size: var(--text-xs);
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .admin-table td {
          padding: var(--space-4);
          border-bottom: 1px solid var(--border-light);
          color: var(--text-primary);
        }

        .slug-code {
          font-family: monospace;
          font-size: var(--text-xs);
          background: #FAF5ED;
          padding: 2px 6px;
          border-radius: var(--radius-sm);
          color: var(--color-rakhi-red);
        }

        .plan-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          background: var(--bg-subtle);
          border-radius: var(--radius-sm);
        }

        .status-pill {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }

        .status-pill.active,
        .status-pill.paid {
          background: #EAF5EA;
          color: #2E7D32;
        }

        .status-pill.draft,
        .status-pill.pending {
          background: #FFF4E5;
          color: #B26A00;
        }

        .status-pill.failed,
        .status-pill.disabled {
          background: #FDE8E8;
          color: #C62828;
        }

        .table-link {
          color: var(--color-rakhi-red);
          display: inline-flex;
          align-items: center;
        }

        /* Funnel list */
        .funnel-metrics-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          max-width: 600px;
        }

        .funnel-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-3) var(--space-4);
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
        }

        .funnel-name {
          font-weight: 600;
          font-size: var(--text-sm);
        }

        .funnel-count {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--color-rakhi-red);
        }

        @media (max-width: 960px) {
          .admin-kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .admin-kpi-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardPage;
