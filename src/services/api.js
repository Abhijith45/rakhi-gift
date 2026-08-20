/**
 * Centralized API Client for Rakhi Memory Gift
 */

const API_BASE = import.meta.env?.VITE_API_URL || import.meta.env?.VITE_API_BASE_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...options.headers
  };

  // If payload is not FormData, default to application/json
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      const error = new Error(data.error?.message || 'An API error occurred.');
      error.code = data.error?.code || 'API_ERROR';
      error.status = response.status;
      throw error;
    }

    return data.data;
  } catch (err) {
    if (err.code) throw err;
    const networkError = new Error('Network error: Could not reach the server.');
    networkError.code = 'NETWORK_ERROR';
    throw networkError;
  }
}

// --- GIFTS API ---
export const createDraftGift = (payload) =>
  request('/gifts', { method: 'POST', body: payload });

export const updateGiftDraft = (id, payload) =>
  request(`/gifts/${id}`, { method: 'PATCH', body: payload });

export const getGiftDraft = (id) =>
  request(`/gifts/${id}`, { method: 'GET' });

export const uploadGiftPhotos = (id, payload) =>
  request(`/gifts/${id}/photos`, { method: 'POST', body: payload });

export const updateGiftPhoto = (id, photoId, payload) =>
  request(`/gifts/${id}/photos/${photoId}`, { method: 'PATCH', body: payload });

export const reorderGiftPhotos = (id, photoIds) =>
  request(`/gifts/${id}/photos/reorder`, { method: 'PUT', body: { photoIds } });

export const deleteGiftPhoto = (id, photoId) =>
  request(`/gifts/${id}/photos/${photoId}`, { method: 'DELETE' });

export const getPublicGift = (slug) =>
  request(`/gifts/public/${slug}`, { method: 'GET' });

// --- PAYMENTS API ---
export const createPaymentOrder = (giftId, plan) =>
  request('/payments/create-order', { method: 'POST', body: { giftId, plan } });

export const verifyPaymentSignature = (verificationPayload) =>
  request('/payments/verify', { method: 'POST', body: verificationPayload });

export const getPaymentOrderStatus = (orderId) =>
  request(`/payments/${orderId}/status`, { method: 'GET' });

// --- ANALYTICS API ---
export const trackEvent = (event, metadata = {}) =>
  request('/analytics/event', {
    method: 'POST',
    body: {
      event,
      sessionId: window.__rakhi_session_id || 'anon',
      device: window.innerWidth < 768 ? 'mobile' : 'desktop',
      referrer: document.referrer || null,
      ...metadata
    }
  }).catch(() => {}); // Non-blocking analytics

// --- ADMIN API ---
export const adminLogin = (email, password) =>
  request('/admin/auth/login', { method: 'POST', body: { email, password } });

export const getAdminDashboard = (token) =>
  request('/admin/dashboard', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });

export const getAdminGifts = (token) =>
  request('/admin/gifts', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });

export const getAdminGiftDetails = (token, id) =>
  request(`/admin/gifts/${id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });

export const toggleAdminGiftStatus = (token, id, status) =>
  request(`/admin/gifts/${id}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: { status }
  });

export const getAdminPayments = (token) =>
  request('/admin/payments', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });

export const getAdminAnalytics = (token) =>
  request('/admin/analytics', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });

export default {
  createDraftGift,
  updateGiftDraft,
  getGiftDraft,
  uploadGiftPhotos,
  deleteGiftPhoto,
  getPublicGift,
  createPaymentOrder,
  verifyPaymentSignature,
  trackEvent,
  adminLogin,
  getAdminDashboard,
  getAdminGifts,
  getAdminGiftDetails,
  toggleAdminGiftStatus,
  getAdminPayments,
  getAdminAnalytics
};
