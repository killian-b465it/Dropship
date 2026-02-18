// ===== SHARED APP UTILITIES =====

// Theme Management
const THEME_KEY = 'dropship_theme';

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.querySelector('.theme-icon').textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.querySelector('.theme-label').textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  }
}

// Sidebar Mobile Toggle
function initSidebar() {
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
function showToast(message, type = 'info', icon = '') {
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

// Saved Products (localStorage)
const SAVED_KEY = 'dropship_saved_products';

function getSavedProducts() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY)) || [];
  } catch { return []; }
}

function saveProduct(product) {
  const saved = getSavedProducts();
  if (!saved.find(p => p.id === product.id)) {
    saved.push({ ...product, savedAt: Date.now() });
    localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
    showToast(`"${product.name}" saved to My Store!`, 'success');
    return true;
  } else {
    showToast('Product already in My Store', 'info');
    return false;
  }
}

function removeProduct(productId) {
  const saved = getSavedProducts().filter(p => p.id !== productId);
  localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
}

function isProductSaved(productId) {
  return getSavedProducts().some(p => p.id === productId);
}

// Saved Ads
const SAVED_ADS_KEY = 'dropship_saved_ads';

function getSavedAds() {
  try { return JSON.parse(localStorage.getItem(SAVED_ADS_KEY)) || []; }
  catch { return []; }
}

function saveAd(ad) {
  const saved = getSavedAds();
  if (!saved.find(a => a.id === ad.id)) {
    saved.push(ad);
    localStorage.setItem(SAVED_ADS_KEY, JSON.stringify(saved));
    showToast('Ad saved to collection!', 'success', '📌');
  } else {
    showToast('Ad already collected', 'info');
  }
}

// Format numbers
function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function formatCurrency(n) {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}

// Sparkline generator
function createSparkline(data) {
  const max = Math.max(...data);
  return data.map(v => {
    const pct = Math.round((v / max) * 100);
    return `<div class="sparkline-bar" style="height:${Math.max(pct, 8)}%" title="${v}"></div>`;
  }).join('');
}

// Modal helpers
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

// Set active nav item
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === page) {
      item.classList.add('active');
    }
  });
}

// Debounce
function debounce(fn, delay = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  setActiveNav();
});
