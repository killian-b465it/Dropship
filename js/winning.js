// ===== WINNING PRODUCTS PAGE =====

let currentCat = 'all';

// Products with 'winning' or 'hot' badges, sorted by revenue
const WINNING_PRODUCTS = PRODUCTS
    .filter(p => p.badges.includes('winning') || p.badges.includes('hot'))
    .sort((a, b) => b.revenue - a.revenue);

function filterCat(btn, cat) {
    currentCat = cat;
    document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderWinning();
}

function renderWinning() {
    const filtered = currentCat === 'all'
        ? WINNING_PRODUCTS
        : WINNING_PRODUCTS.filter(p => p.niche === currentCat);

    const grid = document.getElementById('winningGrid');
    const count = document.getElementById('winningCount');
    count.textContent = `${filtered.length} products`;

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-state-icon">🔍</div>
      <div class="empty-state-title">No winning products in this category</div>
      <div class="empty-state-text">Try selecting a different category</div>
    </div>`;
        return;
    }

    grid.innerHTML = filtered.map((p, i) => {
        const saved = isProductSaved(p.id);
        const trendPct = Math.round(((p.trend[11] - p.trend[0]) / p.trend[0]) * 100);
        const badgeHtml = p.badges.map(b => `<span class="badge badge-${b}">${b === 'hot' ? '🔥' : b === 'trending' ? '📈' : b === 'new' ? '✨' : '🏆'}</span>`).join(' ');

        return `
      <div class="winning-card">
        <div class="winning-rank">${i + 1}</div>
        <img src="${p.image}" alt="${p.name}" class="winning-img" loading="lazy">
        <div class="winning-body">
          <div style="display:flex;gap:4px;margin-bottom:6px;">${badgeHtml}</div>
          <div class="winning-niche">${p.niche}</div>
          <div class="winning-name">${p.name}</div>
          <div class="winning-metrics">
            <div class="wm">
              <div class="wm-val text-green">$${p.sellPrice}</div>
              <div class="wm-lbl">Price</div>
            </div>
            <div class="wm">
              <div class="wm-val text-purple">${p.margin}%</div>
              <div class="wm-lbl">Margin</div>
            </div>
            <div class="wm">
              <div class="wm-val text-teal">${formatNumber(p.monthlySales)}</div>
              <div class="wm-lbl">Sales/mo</div>
            </div>
          </div>
          <div style="margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <span style="font-size:11px;color:var(--text-muted);">6-month trend</span>
              <span class="trend-up">↑ +${trendPct}%</span>
            </div>
            <div class="sparkline">${createSparkline(p.trend.slice(6))}</div>
          </div>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-primary btn-sm" style="flex:1" onclick="quickSave(${p.id}, this)">
              ${saved ? '❤️ Saved' : '💾 Save to Store'}
            </button>
            <a href="products.html" class="btn btn-secondary btn-sm">Details</a>
          </div>
        </div>
      </div>
    `;
    }).join('');
}

function quickSave(productId, btn) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    if (isProductSaved(productId)) {
        removeProduct(productId);
        btn.innerHTML = '💾 Save to Store';
        showToast('Removed from My Store', 'info', '🗑️');
    } else {
        saveProduct(product);
        btn.innerHTML = '❤️ Saved';
    }
}

document.addEventListener('DOMContentLoaded', renderWinning);
