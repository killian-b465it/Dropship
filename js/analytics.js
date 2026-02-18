// ===== ANALYTICS PAGE =====

const DAYS_DATA = {
  7: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    revenue: [312, 489, 267, 543, 721, 892, 634],
    profit: [124, 196, 107, 217, 288, 357, 254],
  },
  30: {
    labels: ['W1', 'W2', 'W3', 'W4'],
    revenue: [2840, 3210, 4120, 5340],
    profit: [1136, 1284, 1648, 2136],
  },
  90: {
    labels: ['Jan', 'Feb', 'Mar'],
    revenue: [9200, 12400, 15800],
    profit: [3680, 4960, 6320],
  }
};

let currentPeriod = 7;

window.setPeriod = function (days, btn) {
  currentPeriod = days;
  document.querySelectorAll('[id^="period"]').forEach(b => b.className = 'btn btn-secondary btn-sm');
  btn.className = 'btn btn-primary btn-sm';
  renderAll();
}

function renderKPIs() {
  const d = DAYS_DATA[currentPeriod];
  const totalRevenue = d.revenue.reduce((a, b) => a + b, 0);
  const totalProfit = d.profit.reduce((a, b) => a + b, 0);
  const margin = Math.round((totalProfit / totalRevenue) * 100);
  const orders = Math.round(totalRevenue / 42);
  const aov = (totalRevenue / orders).toFixed(2);

  document.getElementById('kpiGrid').innerHTML = `
    <div class="kpi-card">
      <div class="kpi-val text-green">${formatCurrency(totalRevenue)}</div>
      <div class="kpi-label">Total Revenue</div>
      <div class="kpi-change kpi-up">↑ 23% vs last period</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val text-purple">${formatCurrency(totalProfit)}</div>
      <div class="kpi-label">Net Profit</div>
      <div class="kpi-change kpi-up">↑ 18% vs last period</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val text-teal">${margin}%</div>
      <div class="kpi-label">Profit Margin</div>
      <div class="kpi-change kpi-up">↑ 2% vs last period</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val">${orders}</div>
      <div class="kpi-label">Total Orders</div>
      <div class="kpi-change kpi-up">↑ 31% vs last period</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val text-orange">$${aov}</div>
      <div class="kpi-label">Avg Order Value</div>
      <div class="kpi-change kpi-down">↓ 3% vs last period</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val" style="color:var(--accent-red);">2.1%</div>
      <div class="kpi-label">Refund Rate</div>
      <div class="kpi-change kpi-up">↓ 0.4% vs last period</div>
    </div>
  `;
}

function renderBarChart() {
  const d = DAYS_DATA[currentPeriod];
  const maxRev = Math.max(...d.revenue);
  document.getElementById('revenueChart').innerHTML = d.labels.map((label, i) => {
    const revH = Math.round((d.revenue[i] / maxRev) * 130);
    const profH = Math.round((d.profit[i] / maxRev) * 130);
    return `
      <div class="bar-wrap">
        <div class="bar-val">${formatCurrency(d.revenue[i])}</div>
        <div style="display:flex;align-items:flex-end;gap:2px;height:${revH}px;">
          <div class="bar" style="height:100%;background:linear-gradient(180deg,var(--accent-purple),rgba(124,58,237,0.4));"></div>
          <div class="bar" style="height:${Math.round((d.profit[i] / d.revenue[i]) * 100)}%;background:linear-gradient(180deg,var(--accent-teal),rgba(6,182,212,0.4));"></div>
        </div>
        <div class="bar-label">${label}</div>
      </div>
    `;
  }).join('') + `
    <div style="position:absolute;bottom:0;right:0;display:flex;gap:12px;font-size:11px;">
      <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:2px;background:var(--accent-purple);display:inline-block;"></span>Revenue</span>
      <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:2px;background:var(--accent-teal);display:inline-block;"></span>Profit</span>
    </div>
  `;
}

function renderTopProducts() {
  const topProducts = [
    { name: 'Massage Gun Pro', revenue: 8999, pct: 100 },
    { name: 'Smart Watch Fitness', revenue: 7199, pct: 80 },
    { name: 'Posture Corrector', revenue: 5999, pct: 67 },
    { name: 'Wireless Earbuds Pro', revenue: 4999, pct: 56 },
    { name: 'LED Ring Light', revenue: 3499, pct: 39 },
  ];

  document.getElementById('topProductsList').innerHTML = topProducts.map((p, i) => {
    const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other';
    const rankLabel = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
    return `
      <div class="top-product-row">
        <div class="top-rank ${rankClass}">${rankLabel}</div>
        <div class="top-product-name">${p.name}</div>
        <div class="top-product-bar-wrap">
          <div class="top-product-bar" style="width:${p.pct}%;"></div>
        </div>
        <div class="top-product-val">${formatCurrency(p.revenue)}</div>
      </div>
    `;
  }).join('');
}

function renderTrafficSources() {
  const sources = [
    { label: 'Facebook Ads', pct: 42, color: '#4267B2' },
    { label: 'TikTok Ads', pct: 28, color: '#010101' },
    { label: 'Organic Search', pct: 15, color: 'var(--accent-green)' },
    { label: 'Instagram', pct: 10, color: '#C13584' },
    { label: 'Direct', pct: 5, color: 'var(--text-muted)' },
  ];
  document.getElementById('trafficSources').innerHTML = sources.map(s => `
    <div class="source-row">
      <div class="source-label">${s.label}</div>
      <div class="source-bar-wrap"><div class="source-bar" style="width:${s.pct}%;background:${s.color};"></div></div>
      <div class="source-pct" style="color:${s.color};">${s.pct}%</div>
    </div>
  `).join('');
}

function renderNicheBreakdown() {
  const niches = [
    { name: 'Health & Wellness', revenue: 12400, color: 'var(--accent-green)' },
    { name: 'Tech Gadgets', revenue: 9800, color: 'var(--accent-teal)' },
    { name: 'Fitness', revenue: 7200, color: 'var(--accent-purple)' },
    { name: 'Beauty & Skincare', revenue: 5600, color: '#ec4899' },
    { name: 'Home & Garden', revenue: 3900, color: 'var(--accent-orange)' },
  ];
  const max = niches[0].revenue;
  document.getElementById('nicheBreakdown').innerHTML = niches.map(n => `
    <div class="source-row" style="margin-bottom:14px;">
      <div class="source-label" style="width:140px;">${n.name}</div>
      <div class="source-bar-wrap" style="height:12px;border-radius:6px;">
        <div class="source-bar" style="width:${Math.round((n.revenue / max) * 100)}%;background:${n.color};height:12px;border-radius:6px;"></div>
      </div>
      <div class="source-pct" style="color:${n.color};width:60px;">${formatCurrency(n.revenue)}</div>
    </div>
  `).join('');
}

function renderAll() {
  renderKPIs();
  renderBarChart();
  renderTopProducts();
  renderTrafficSources();
  renderNicheBreakdown();
}

document.addEventListener('DOMContentLoaded', renderAll);
