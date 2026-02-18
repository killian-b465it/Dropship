// ===== NICHE FINDER PAGE =====
import { isProductSaved, saveProduct, removeProduct, getSavedProducts } from './app.js';

let savedProductIds = new Set();

async function init() {
  const saved = await getSavedProducts();
  savedProductIds = new Set(saved.map(p => p.id));
  renderNiches();
}

function renderNiches() {
  const sortBy = document.getElementById('sortNiches')?.value || 'trend';
  const sorted = [...NICHES_DATA].sort((a, b) => {
    if (sortBy === 'trend') return b.trendScore - a.trendScore;
    if (sortBy === 'margin') return b.avgMargin - a.avgMargin;
    if (sortBy === 'searches') return b.monthlySearches - a.monthlySearches;
    return 0;
  });

  const grid = document.getElementById('nichesGrid');
  if (!grid) return;

  grid.innerHTML = sorted.map(n => {
    const compClass = n.competition === 'Low' ? 'comp-low' : n.competition === 'Medium' ? 'comp-medium' : 'comp-high';
    const compIcon = n.competition === 'Low' ? '🟢' : n.competition === 'Medium' ? '🟡' : '🔴';

    return `
      <div class="niche-card" style="--niche-color:${n.color}" onclick="openNiche(${n.id})">
        <div class="niche-icon">${n.icon}</div>
        <div class="niche-name">${n.name}</div>
        <div class="niche-desc">${n.description}</div>
        <div class="niche-metrics">
          <div class="nm">
            <div class="nm-val" style="color:${n.color}">${n.avgMargin}%</div>
            <div class="nm-lbl">Avg Margin</div>
          </div>
          <div class="nm">
            <div class="nm-val text-teal">${formatNumber(n.monthlySearches)}</div>
            <div class="nm-lbl">Monthly Searches</div>
          </div>
        </div>
        <div class="trend-score-wrap">
          <div class="trend-score-label">
            <span style="font-size:11px;color:var(--text-muted);">Trend Score</span>
            <span style="font-weight:700;font-size:12px;">${n.trendScore}/100</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${n.trendScore}%;background:${n.color};"></div>
          </div>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span class="comp-badge ${compClass}">${compIcon} ${n.competition} Competition</span>
          <span style="font-size:12px;font-weight:700;color:var(--accent-green);">${n.growth}</span>
        </div>
      </div>
    `;
  }).join('');
}
window.renderNiches = renderNiches;

window.openNiche = function (nicheId) {
  const niche = NICHES_DATA.find(n => n.id === nicheId);
  if (!niche) return;

  document.getElementById('nicheListView').style.display = 'none';
  document.getElementById('nicheDetailView').classList.add('show');

  const nicheProducts = PRODUCTS.filter(p => p.niche === niche.name);
  const compClass = niche.competition === 'Low' ? 'comp-low' : niche.competition === 'Medium' ? 'comp-medium' : 'comp-high';

  document.getElementById('nicheDetailContent').innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;">
      <div style="font-size:56px;">${niche.icon}</div>
      <div>
        <div style="font-size:26px;font-weight:800;">${niche.name}</div>
        <div style="color:var(--text-secondary);font-size:14px;margin-top:4px;">${niche.description}</div>
        <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
          <span class="comp-badge ${compClass}">${niche.competition} Competition</span>
          <span class="tag tag-green">${niche.growth} Growth</span>
          <span class="tag tag-purple">Trend: ${niche.trendScore}/100</span>
        </div>
      </div>
    </div>

    <div class="stats-grid" style="margin-bottom:24px;">
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(16,185,129,0.15)">📈</div>
        <div class="stat-value">${niche.avgMargin}%</div>
        <div class="stat-label">Avg Profit Margin</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(6,182,212,0.15)">🔍</div>
        <div class="stat-value">${formatNumber(niche.monthlySearches)}</div>
        <div class="stat-label">Monthly Searches</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(124,58,237,0.15)">🔥</div>
        <div class="stat-value">${niche.trendScore}</div>
        <div class="stat-label">Trend Score</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(245,158,11,0.15)">📦</div>
        <div class="stat-value">${nicheProducts.length}</div>
        <div class="stat-label">Products Available</div>
      </div>
    </div>

    <div class="section-header mb-3">
      <div class="section-title">Products in ${niche.name}</div>
      <a href="products.html?niche=${encodeURIComponent(niche.name)}" class="btn btn-primary btn-sm">View All in Research</a>
    </div>

    ${nicheProducts.length > 0 ? `
      <div class="products-grid">
        ${nicheProducts.map(p => {
    const saved = savedProductIds.has(p.id);
    return `
            <div class="product-card">
              <div class="product-img-wrap">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
                <div class="product-badges">
                  ${p.badges.map(b => `<span class="badge badge-${b}">${b === 'hot' ? '🔥' : b === 'trending' ? '📈' : b === 'new' ? '✨' : '🏆'}</span>`).join('')}
                </div>
              </div>
              <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-stats">
                  <div class="product-stat"><div class="product-stat-label">Price</div><div class="product-stat-value green">$${p.sellPrice}</div></div>
                  <div class="product-stat"><div class="product-stat-label">Margin</div><div class="product-stat-value purple">${p.margin}%</div></div>
                  <div class="product-stat"><div class="product-stat-label">Sales/mo</div><div class="product-stat-value teal">${formatNumber(p.monthlySales)}</div></div>
                  <div class="product-stat"><div class="product-stat-label">Revenue</div><div class="product-stat-value orange">${formatCurrency(p.revenue)}</div></div>
                </div>
                <button class="btn btn-primary btn-sm btn-full" onclick="quickNicheSave(${p.id}, this)">
                  ${saved ? '❤️ Saved' : '💾 Save to Store'}
                </button>
              </div>
            </div>
          `;
  }).join('')}
      </div>
    ` : `<div class="empty-state"><div class="empty-state-icon">${niche.icon}</div><div class="empty-state-title">No products yet</div><div class="empty-state-text">Check back soon for products in this niche</div></div>`}
  `;
}

window.quickNicheSave = async function (productId, btn) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  if (savedProductIds.has(productId)) {
    await removeProduct(productId);
    savedProductIds.delete(productId);
    btn.innerHTML = '💾 Save to Store';
    showToast('Removed from My Store', 'info', '🗑️');
  } else {
    await saveProduct(product);
    savedProductIds.add(productId);
    btn.innerHTML = '❤️ Saved';
  }
}

window.backToNiches = function () {
  document.getElementById('nicheListView').style.display = '';
  document.getElementById('nicheDetailView').classList.remove('show');
}

document.addEventListener('DOMContentLoaded', init);

