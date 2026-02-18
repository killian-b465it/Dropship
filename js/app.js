// ===== SHARED APP UTILITIES =====
import { onAuthStateChanged } from './auth.js';

// Theme Management
const THEME_KEY = 'dropship_theme';

export function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  updateThemeIcon(next);
}

export function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.querySelector('.theme-icon').textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.querySelector('.theme-label').textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  }
}

// Sidebar Mobile Toggle
export function initSidebar() {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }
}

// Toast Notifications
export function showToast(message, type = 'info', icon = '') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: '💡' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icon || icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Format numbers
export function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

export function formatCurrency(n) {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}

// Sparkline generator
export function createSparkline(data) {
  const max = Math.max(...data);
  return data.map(v => {
    const pct = Math.round((v / max) * 100);
    return `<div class="sparkline-bar" style="height:${Math.max(pct, 8)}%" title="${v}"></div>`;
  }).join('');
}

// Modal helpers
export function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

// Set active nav item
export function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === page) {
      item.classList.add('active');
    }
  });
}

// Debounce
export function debounce(fn, delay = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

// Auth UI Updates
function updateAuthUI(user) {
  const avatar = document.querySelector('.avatar');
  if (avatar) {
    if (user) {
      const initial = (user.displayName || user.email || 'U')[0].toUpperCase();
      avatar.textContent = initial;
      avatar.style.cursor = 'pointer';
      avatar.title = user.displayName || user.email;
      avatar.onclick = () => window.location.href = 'profile.html';
    } else {
      avatar.textContent = '?';
      avatar.title = 'Sign In';
      avatar.onclick = () => window.location.href = 'login.html';
    }
  }
}

// Data Persistence (Wrappers for DB helpers)
import * as db from './db.js';
import { getCurrentUser } from './auth.js';

export async function getSavedProducts() {
  const user = getCurrentUser();
  if (user) return await db.getSavedProducts(user.uid);
  try { return JSON.parse(localStorage.getItem('dropship_saved_products')) || []; } catch { return []; }
}

export async function saveProduct(product) {
  const user = getCurrentUser();
  if (user) {
    await db.saveProduct(user.uid, product);
    showToast(`"${product.name}" saved to cloud!`, 'success');
    return true;
  } else {
    // Fallback to local storage for guests, but encourage login
    const saved = JSON.parse(localStorage.getItem('dropship_saved_products') || '[]');
    if (!saved.find(p => p.id === product.id)) {
      saved.push({ ...product, savedAt: Date.now() });
      localStorage.setItem('dropship_saved_products', JSON.stringify(saved));
      showToast(`"${product.name}" saved locally! Sign in to sync.`, 'info');
      return true;
    }
    showToast('Already in My Store', 'info');
    return false;
  }
}

export async function removeProduct(productId) {
  const user = getCurrentUser();
  if (user) await db.removeSavedProduct(user.uid, productId);
  const local = JSON.parse(localStorage.getItem('dropship_saved_products') || '[]').filter(p => p.id !== productId);
  localStorage.setItem('dropship_saved_products', JSON.stringify(local));
}

export async function isProductSaved(productId) {
  const user = getCurrentUser();
  if (user) return await db.isProductSaved(user.uid, productId);
  return JSON.parse(localStorage.getItem('dropship_saved_products') || '[]').some(p => p.id === productId);
}

// Attach to window for global access (backward compatibility with legacy scripts)
window.showToast = showToast;
window.formatCurrency = formatCurrency;
window.formatNumber = formatNumber;
window.toggleTheme = toggleTheme;
window.openModal = openModal;
window.closeModal = closeModal;
window.debounce = debounce;
window.getSavedProducts = getSavedProducts;
window.saveProduct = saveProduct;
window.removeProduct = removeProduct;
window.isProductSaved = isProductSaved;

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  setActiveNav();

  // Global Auth State Listener
  onAuthStateChanged((user) => {
    updateAuthUI(user);
    // If on a page that is not login.html and no user, we could redirect here, 
    // but we'll use requireAuth() in specific page scripts for better control.
  });
});

