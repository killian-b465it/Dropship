// ===== PRODUCT RESEARCH PAGE =====
import { getSavedProducts, saveProduct, removeProduct, isProductSaved, placeOrder, formatCurrency, formatNumber, createSparkline, showToast, debounce, openModal, closeModal } from './app.js';

let currentSort = 'revenue';
let currentProducts = [...PRODUCTS];
let savedProductIds = new Set();

async function init() {
  // Populate niche filter
  const nicheSelect = document.getElementById('filterNiche');
  if (nicheSelect) {
    NICHES.forEach(n => {
      const opt = document.createElement('option');
      opt.value = n;
      opt.textContent = n;
      nicheSelect.appendChild(opt);
    });
  }

  // Check URL params for search
  const params = new URLSearchParams(window.location.search);
  const searchParam = params.get('search');
  if (searchParam) {
    const productSearch = document.getElementById('productSearch');
    const searchInput = document.getElementById('searchInput');
    if (productSearch) productSearch.value = searchParam;
    if (searchInput) searchInput.value = searchParam;
  }

  await renderProducts();
  bindFilters();
}

function bindFilters() {
  const debouncedRender = debounce(renderProducts, 250);
  document.getElementById('productSearch')?.addEventListener('input', debouncedRender);
  document.getElementById('searchInput')?.addEventListener('input', e => {
    const productSearch = document.getElementById('productSearch');
    if (productSearch) productSearch.value = e.target.value;
    debouncedRender();
  });
  document.getElementById('filterNiche')?.addEventListener('change', renderProducts);
  document.getElementById('filterCompetition')?.addEventListener('change', renderProducts);
  document.getElementById('filterMargin')?.addEventListener('change', renderProducts);
}

window.setSort = function (btn, sort) {
  currentSort = sort;
  document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts();
}

function getFilteredProducts() {
  const search = (document.getElementById('productSearch')?.value || '').toLowerCase();
  const niche = document.getElementById('filterNiche')?.value || '';
  const competition = document.getElementById('filterCompetition')?.value || '';
  const margin = parseInt(document.getElementById('filterMargin')?.value || '0');

  return PRODUCTS.filter(p => {
    if (search && !p.name.toLowerCase().includes(search) && !p.niche.toLowerCase().includes(search) && !p.tags.some(t => t.includes(search))) return false;
    if (niche && p.niche !== niche) return false;
    if (competition && p.competition !== competition) return false;
    if (margin && p.margin < margin) return false;
    return true;
  }).sort((a, b) => {
    if (currentSort === 'revenue') return b.revenue - a.revenue;
    if (currentSort === 'sales') return b.monthlySales - a.monthlySales;
    if (currentSort === 'margin') return b.margin - a.margin;
    if (currentSort === 'price') return a.price - b.price;
    return 0;
  });
}

async function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  // Show loading skeleton or spinner
  grid.style.opacity = '0.5';

  const [filtered, saved] = await Promise.all([
    getFilteredProducts(),
    getSavedProducts()
  ]);

  savedProductIds = new Set(saved.map(p => p.id));

  const count = document.getElementById('resultsCount');
  if (count) count.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-state-icon">🔍</div>
      <div class="empty-state-title">No products found</div>
      <div class="empty-state-text">Try adjusting your filters or search term</div>
    </div>`;
  } else {
    grid.innerHTML = filtered.map(p => renderProductCard(p)).join('');
  }

  grid.style.opacity = '1';
}

function renderProductCard(p) {
  const saved = savedProductIds.has(p.id);
  const badgeHtml = p.badges.map(b => `<span class="badge badge-${b}">${b === 'hot' ? '🔥 Hot' : b === 'trending' ? '📈 Trending' : b === 'new' ? '✨ New' : '🏆 Winning'}</span>`).join('');

  return `
    <div class="product-card" onclick="openProductModal(${p.id})">
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <div class="product-badges">${badgeHtml}</div>
        <button class="save-btn ${saved ? 'saved' : ''}" onclick="event.stopPropagation(); toggleSave(${p.id}, this)" title="${saved ? 'Saved' : 'Save to My Store'}">
          ${saved ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="product-info">
        <div class="product-niche">${p.niche}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-stats">
          <div class="product-stat">
            <div class="product-stat-label">Sell Price</div>
            <div class="product-stat-value green">$${p.sellPrice}</div>
          </div>
          <div class="product-stat">
            <div class="product-stat-label">Margin</div>
            <div class="product-stat-value purple">${p.margin}%</div>
          </div>
          <div class="product-stat">
            <div class="product-stat-label">Monthly Sales</div>
            <div class="product-stat-value teal">${formatNumber(p.monthlySales)}</div>
          </div>
          <div class="product-stat">
            <div class="product-stat-label">Revenue/mo</div>
            <div class="product-stat-value orange">${formatCurrency(p.revenue)}</div>
          </div>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-primary btn-sm" style="flex:1" onclick="event.stopPropagation(); openProductModal(${p.id})">View Details</button>
          <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); toggleSave(${p.id}, null)">${saved ? '❤️' : '💾'}</button>
        </div>
      </div>
    </div>
  `;
}

window.toggleSave = async function (productId, btn) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  if (savedProductIds.has(productId)) {
    await removeProduct(productId);
    savedProductIds.delete(productId);
    showToast(`Removed from My Store`, 'info', '🗑️');
  } else {
    await saveProduct(product);
    savedProductIds.add(productId);
  }

  // Efficiently update UI without full re-render if possible
  const cards = document.querySelectorAll(`[onclick*="openProductModal(${productId})"]`);
  cards.forEach(card => {
    const saveBtn = card.querySelector('.save-btn');
    if (saveBtn) {
      saveBtn.classList.toggle('saved', savedProductIds.has(productId));
      saveBtn.textContent = savedProductIds.has(productId) ? '❤️' : '🤍';
    }
    const bottomBtn = card.querySelector('.product-info .btn-secondary');
    if (bottomBtn) bottomBtn.textContent = savedProductIds.has(productId) ? '❤️' : '💾';
  });
}

window.handlePlaceOrder = async function (productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (product) {
    const success = await placeOrder(product);
    if (success) closeModal('productModal');
  }
}

window.openProductModal = async function (productId) {
  const p = PRODUCTS.find(prod => prod.id === productId);
  if (!p) return;

  document.getElementById('modalTitle').textContent = p.name;

  const saved = savedProductIds.has(p.id);
  const badgeHtml = p.badges.map(b => `<span class="badge badge-${b}">${b === 'hot' ? '🔥 Hot' : b === 'trending' ? '📈 Trending' : b === 'new' ? '✨ New' : '🏆 Winning'}</span>`).join(' ');

  document.getElementById('modalBody').innerHTML = `
    <img src="${p.image}" alt="${p.name}" class="modal-product-img">
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">${badgeHtml}</div>
    <div class="modal-stats-grid">
      <div class="modal-stat">
        <div class="modal-stat-val text-green">$${p.sellPrice}</div>
        <div class="modal-stat-lbl">Sell Price</div>
      </div>
      <div class="modal-stat">
        <div class="modal-stat-val text-purple">${p.margin}%</div>
        <div class="modal-stat-lbl">Profit Margin</div>
      </div>
      <div class="modal-stat">
        <div class="modal-stat-val text-teal">${formatNumber(p.monthlySales)}</div>
        <div class="modal-stat-lbl">Monthly Sales</div>
      </div>
    </div>
    <div style="margin-bottom:16px;">
      <div style="font-size:13px;font-weight:600;margin-bottom:8px;">Sales Trend (12 months)</div>
      <div class="sparkline">${createSparkline(p.trend)}</div>
    </div>
    <div style="margin-bottom:16px;">
      <div class="detail-row"><span class="detail-label">Cost Price</span><span class="detail-value">$${p.price.toFixed(2)}</span></div>
      <div class="detail-row"><span class="detail-label">Monthly Revenue</span><span class="detail-value text-green">${formatCurrency(p.revenue)}</span></div>
      <div class="detail-row"><span class="detail-label">Competition</span><span class="detail-value">${p.competition}</span></div>
      <div class="detail-row"><span class="detail-label">Market Saturation</span><span class="detail-value">${p.saturation}%</span></div>
      <div class="detail-row"><span class="detail-label">Supplier</span><span class="detail-value">${p.supplier}</span></div>
      <div class="detail-row"><span class="detail-label">Rating</span><span class="detail-value">⭐ ${p.rating} (${formatNumber(p.reviews)} reviews)</span></div>
    </div>
    <div style="margin-bottom:16px;">
      <div style="font-size:13px;font-weight:600;margin-bottom:6px;">Description</div>
      <div style="font-size:13px;color:var(--text-secondary);line-height:1.6;">${p.description}</div>
    </div>
    <div class="tags-wrap">${p.tags.map(t => `<span class="tag tag-purple">#${t}</span>`).join('')}</div>
    <div style="display:flex;gap:10px;margin-top:20px;">
      <button class="btn btn-primary" style="flex:1" onclick="handlePlaceOrder(${p.id})">📦 Place Test Order</button>
      <button class="btn btn-secondary" style="flex:1" onclick="toggleSaveModal(${p.id})" id="modalSaveBtn">
        ${saved ? '❤️ Saved' : '💾 Save to Store'}
      </button>
    </div>
    <div style="margin-top:10px;">
      <a href="https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(p.name)}" target="_blank" class="btn btn-teal btn-full">🔗 Find Supplier on AliExpress</a>
    </div>
  `;

  openModal('productModal');
}

window.toggleSaveModal = async function (productId) {
  await toggleSave(productId, null);
  const btn = document.getElementById('modalSaveBtn');
  if (btn) btn.innerHTML = savedProductIds.has(productId) ? '❤️ Saved to Store' : '💾 Save to My Store';
}

window.handleModalClick = function (e) {
  if (e.target === e.currentTarget) closeModal('productModal');
}

document.addEventListener('DOMContentLoaded', init);

