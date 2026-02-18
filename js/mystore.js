// ===== MY STORE PAGE =====

function renderStore() {
    const saved = getSavedProducts();
    const searchVal = (document.getElementById('storeSearch')?.value || '').toLowerCase();
    const filtered = searchVal ? saved.filter(p => p.name.toLowerCase().includes(searchVal) || p.niche.toLowerCase().includes(searchVal)) : saved;

    const container = document.getElementById('storeContent');

    if (saved.length === 0) {
        container.innerHTML = `
      <div class="store-empty">
        <div class="store-empty-icon">🛒</div>
        <div class="store-empty-title">Your store is empty</div>
        <div class="store-empty-text">Save products from Product Research or Winning Products to build your store list.</div>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
          <a href="products.html" class="btn btn-primary">🔍 Browse Products</a>
          <a href="winning.html" class="btn btn-secondary">🔥 Winning Products</a>
        </div>
      </div>
    `;
        return;
    }

    // Calculate totals
    const totalRevenue = saved.reduce((sum, p) => sum + p.revenue, 0);
    const avgMargin = Math.round(saved.reduce((sum, p) => sum + p.margin, 0) / saved.length);
    const totalSales = saved.reduce((sum, p) => sum + p.monthlySales, 0);

    container.innerHTML = `
    <div class="section-header mb-4">
      <div>
        <div class="section-title">🛒 My Product List</div>
        <div class="section-subtitle">${saved.length} saved product${saved.length !== 1 ? 's' : ''}</div>
      </div>
      <div class="store-header-actions">
        <button class="btn btn-secondary" onclick="exportCSV()">📥 Export CSV</button>
        <button class="btn btn-secondary" onclick="clearAll()" style="color:var(--accent-red);">🗑️ Clear All</button>
      </div>
    </div>

    <!-- Store Stats -->
    <div class="store-stats">
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(16,185,129,0.15)">💰</div>
        <div class="stat-value">${formatCurrency(totalRevenue)}</div>
        <div class="stat-label">Combined Revenue Potential</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(124,58,237,0.15)">📈</div>
        <div class="stat-value">${avgMargin}%</div>
        <div class="stat-label">Average Margin</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(6,182,212,0.15)">📦</div>
        <div class="stat-value">${formatNumber(totalSales)}</div>
        <div class="stat-label">Combined Monthly Sales</div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="saved-grid">
      ${filtered.map(p => renderSavedCard(p)).join('')}
    </div>

    ${filtered.length === 0 && searchVal ? `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-title">No results for "${searchVal}"</div>
      </div>
    ` : ''}
  `;
}

function renderSavedCard(p) {
    return `
    <div class="saved-card" id="card-${p.id}">
      <img src="${p.image}" alt="${p.name}" class="saved-img" loading="lazy">
      <div class="saved-body">
        <div class="saved-niche">${p.niche}</div>
        <div class="saved-name">${p.name}</div>
        <div class="saved-metrics">
          <div class="sm"><div class="sm-val text-green">$${p.sellPrice}</div><div class="sm-lbl">Price</div></div>
          <div class="sm"><div class="sm-val text-purple">${p.margin}%</div><div class="sm-lbl">Margin</div></div>
          <div class="sm"><div class="sm-val text-teal">${formatNumber(p.monthlySales)}</div><div class="sm-lbl">Sales/mo</div></div>
        </div>

        <!-- Profit Calculator -->
        <div class="calc-section">
          <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">💰 Profit Calculator</div>
          <div class="calc-row">
            <span class="calc-label">Units/month</span>
            <input type="number" class="calc-input" value="100" min="1" id="units-${p.id}" oninput="calcProfit(${p.id}, ${p.sellPrice}, ${p.price})">
          </div>
          <div class="calc-row">
            <span class="calc-label">Ad spend/unit</span>
            <input type="number" class="calc-input" value="5" min="0" step="0.5" id="adspend-${p.id}" oninput="calcProfit(${p.id}, ${p.sellPrice}, ${p.price})">
          </div>
          <div class="calc-result">
            <span>Monthly Profit</span>
            <span class="text-green" id="profit-${p.id}">$${((p.sellPrice - p.price - 5) * 100).toFixed(0)}</span>
          </div>
        </div>

        <div style="display:flex;gap:6px;">
          <a href="https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(p.name)}" target="_blank" class="btn btn-teal btn-sm" style="flex:1">🔗 Supplier</a>
          <button class="btn btn-secondary btn-sm" onclick="removeSaved(${p.id})" style="color:var(--accent-red);">🗑️</button>
        </div>
      </div>
    </div>
  `;
}

function calcProfit(productId, sellPrice, costPrice) {
    const units = parseFloat(document.getElementById(`units-${productId}`)?.value || 100);
    const adSpend = parseFloat(document.getElementById(`adspend-${productId}`)?.value || 5);
    const profit = (sellPrice - costPrice - adSpend) * units;
    const el = document.getElementById(`profit-${productId}`);
    if (el) {
        el.textContent = `$${Math.max(0, profit).toFixed(0)}`;
        el.style.color = profit > 0 ? 'var(--accent-green)' : 'var(--accent-red)';
    }
}

function removeSaved(productId) {
    removeProduct(productId);
    showToast('Product removed from My Store', 'info', '🗑️');
    renderStore();
}

function clearAll() {
    if (confirm('Remove all saved products from My Store?')) {
        localStorage.removeItem('dropship_saved_products');
        showToast('All products removed', 'info', '🗑️');
        renderStore();
    }
}

function exportCSV() {
    const saved = getSavedProducts();
    if (saved.length === 0) { showToast('No products to export', 'error'); return; }

    const headers = ['Name', 'Niche', 'Cost Price', 'Sell Price', 'Margin %', 'Monthly Sales', 'Monthly Revenue', 'Competition', 'Supplier'];
    const rows = saved.map(p => [
        `"${p.name}"`, p.niche, `$${p.price}`, `$${p.sellPrice}`, `${p.margin}%`,
        p.monthlySales, `$${p.revenue}`, p.competition, p.supplier
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dropship-products.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully!', 'success', '📥');
}

document.addEventListener('DOMContentLoaded', () => {
    renderStore();
    const search = document.getElementById('storeSearch');
    if (search) search.addEventListener('input', debounce(renderStore, 250));
});
