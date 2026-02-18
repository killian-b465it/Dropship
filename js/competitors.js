// ===== COMPETITOR ANALYSIS PAGE =====

function searchStore() {
    const input = document.getElementById('storeInput').value.trim().toLowerCase();
    if (!input) { showToast('Please enter a store name', 'error'); return; }

    // Find matching store
    const key = Object.keys(MOCK_STORES).find(k => k.includes(input) || input.includes(k));
    if (key) {
        loadStore(key);
    } else {
        showToast('Store not found. Try: gymshark, petparadise, techzone, glowskin', 'error', '🏪');
    }
}

function loadStore(key) {
    document.getElementById('storeInput').value = key;
    const store = MOCK_STORES[key];
    if (!store) return;

    showToast(`Analyzing ${store.name}...`, 'info', '🔍');

    setTimeout(() => {
        renderStoreResult(store);
        showToast('Analysis complete!', 'success', '✅');
    }, 800);
}

function renderStoreResult(store) {
    const result = document.getElementById('storeResult');
    result.classList.add('show');

    const trafficColors = { organic: '#10b981', paid: '#7c3aed', social: '#06b6d4', direct: '#f59e0b' };
    const trafficLabels = { organic: '🌿 Organic', paid: '💰 Paid Ads', social: '📱 Social', direct: '🔗 Direct' };

    result.innerHTML = `
    <!-- Store Header -->
    <div class="store-header">
      <div class="store-avatar">🏪</div>
      <div style="flex:1;">
        <div class="store-name">${store.name}</div>
        <div class="store-url">${store.url}</div>
        <div class="store-meta">
          <span class="store-meta-item">🛍️ ${store.platform}</span>
          <span class="store-meta-item">🎨 Theme: ${store.theme}</span>
          <span class="store-meta-item">📅 Founded: ${store.founded}</span>
          <span class="store-meta-item">🌍 ${store.country}</span>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:24px;font-weight:800;color:var(--accent-green);">${formatCurrency(store.monthlyRevenue)}</div>
        <div style="font-size:12px;color:var(--text-muted);">Monthly Revenue (est.)</div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="stats-grid" style="margin-bottom:20px;">
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(6,182,212,0.15)">👥</div>
        <div class="stat-value">${formatNumber(store.monthlyVisitors)}</div>
        <div class="stat-label">Monthly Visitors</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(16,185,129,0.15)">📊</div>
        <div class="stat-value">${store.conversionRate}%</div>
        <div class="stat-label">Conversion Rate</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(245,158,11,0.15)">🛒</div>
        <div class="stat-value">$${store.avgOrderValue}</div>
        <div class="stat-label">Avg. Order Value</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(124,58,237,0.15)">📦</div>
        <div class="stat-value">${store.topProducts.length}</div>
        <div class="stat-label">Top Products</div>
      </div>
    </div>

    <div class="result-grid">
      <!-- Top Products -->
      <div class="card">
        <div class="section-header mb-3">
          <div class="section-title">🏆 Top Products</div>
        </div>
        <div class="top-products-list">
          ${store.topProducts.map((p, i) => `
            <div class="top-product-item">
              <div class="tp-rank">${i + 1}</div>
              <div class="tp-name">${p.name}</div>
              <div style="text-align:right;">
                <div class="tp-revenue">${formatCurrency(p.revenue)}</div>
                <div style="font-size:11px;color:var(--text-muted);">${formatNumber(p.sales)} sales</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Traffic & Apps -->
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div class="card">
          <div class="section-title mb-3">📈 Traffic Sources</div>
          ${Object.entries(store.trafficSources).map(([key, val]) => `
            <div class="traffic-bar">
              <div class="traffic-label">
                <span>${trafficLabels[key]}</span>
                <span style="font-weight:700;">${val}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width:${val}%;background:${trafficColors[key]};"></div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="card">
          <div class="section-title mb-3">⚙️ Installed Apps</div>
          <div class="apps-grid">
            ${store.apps.map(app => `<span class="app-chip">${app}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
