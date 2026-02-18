// ===== ORDERS PAGE =====
import { requireAuth } from './auth.js';
import * as db from './db.js';

let currentOrders = [];
let currentStatusFilter = 'all';

async function init() {
  const user = await requireAuth();

  // Initial fetch
  currentOrders = await db.getOrders(user.uid);

  renderStats(currentOrders);
  renderOrdersTable();

  const search = document.getElementById('orderSearch');
  if (search) search.addEventListener('input', debounce(() => renderOrdersTable(), 250));
}

function filterOrders(btn, status) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  currentStatusFilter = status;
  renderOrdersTable();
}
window.filterOrders = filterOrders;

function renderStats(orders) {
  const totalRevenue = orders.filter(o => o.status !== 'refunded').reduce((s, o) => s + (o.salePrice || 0), 0);
  const totalProfit = orders.filter(o => o.status !== 'refunded').reduce((s, o) => s + ((o.salePrice || 0) - (o.costPrice || 0)), 0);
  const pending = orders.filter(o => ['pending', 'processing'].includes(o.status)).length;

  const statsEl = document.getElementById('orderStats');
  if (!statsEl) return;

  statsEl.innerHTML = `
    <div class="stat-card">
      <div class="stat-icon" style="background:rgba(16,185,129,0.15)">💰</div>
      <div class="stat-value">${formatCurrency(totalRevenue)}</div>
      <div class="stat-label">Total Revenue</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon" style="background:rgba(124,58,237,0.15)">📈</div>
      <div class="stat-value">${formatCurrency(totalProfit)}</div>
      <div class="stat-label">Total Profit</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon" style="background:rgba(6,182,212,0.15)">📦</div>
      <div class="stat-value">${orders.length}</div>
      <div class="stat-label">Total Orders</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon" style="background:rgba(245,158,11,0.15)">⏳</div>
      <div class="stat-value">${pending}</div>
      <div class="stat-label">Pending Fulfillment</div>
    </div>
  `;
}

function renderOrdersTable() {
  const orders = currentOrders;
  const search = (document.getElementById('orderSearch')?.value || '').toLowerCase();
  let filtered = currentStatusFilter === 'all' ? orders : orders.filter(o => o.status === currentStatusFilter);
  if (search) filtered = filtered.filter(o => (o.id || o.firestoreId).toLowerCase().includes(search) || o.customer.toLowerCase().includes(search) || o.product.toLowerCase().includes(search));

  const statusConfig = {
    pending: { class: 'status-pending', icon: '⏳', label: 'Pending' },
    processing: { class: 'status-processing', icon: '⚙️', label: 'Processing' },
    shipped: { class: 'status-shipped', icon: '🚚', label: 'Shipped' },
    delivered: { class: 'status-delivered', icon: '✅', label: 'Delivered' },
    refunded: { class: 'status-refunded', icon: '↩️', label: 'Refunded' },
  };

  const body = document.getElementById('ordersBody');
  if (!body) return;

  body.innerHTML = filtered.length === 0
    ? `<tr><td colspan="10" style="text-align:center;padding:40px;color:var(--text-muted);">No orders found</td></tr>`
    : filtered.map(o => {
      const profit = (o.salePrice || 0) - (o.costPrice || 0);
      const sc = statusConfig[o.status] || statusConfig.pending;
      const displayId = o.id || `#${o.firestoreId.substring(0, 6).toUpperCase()}`;
      return `
          <tr>
            <td><span class="order-id">${displayId}</span></td>
            <td><div class="customer-name">${o.customer}</div><div class="customer-loc">${o.location}</div></td>
            <td>${o.product}</td>
            <td>$${(o.salePrice || 0).toFixed(2)}</td>
            <td style="color:var(--text-secondary);">$${(o.costPrice || 0).toFixed(2)}</td>
            <td class="${profit > 0 ? 'profit-pos' : 'profit-neg'}">$${profit.toFixed(2)}</td>
            <td><span class="tag tag-purple">${o.supplier}</span></td>
            <td><span class="status-badge ${sc.class}">${sc.icon} ${sc.label}</span></td>
            <td style="color:var(--text-secondary);white-space:nowrap;">${o.date || 'Today'}</td>
            <td>${o.tracking ? `<span style="font-family:monospace;font-size:11px;color:var(--accent-teal);">${o.tracking}</span>` : '<span style="color:var(--text-muted);font-size:11px;">—</span>'}</td>
          </tr>
        `;
    }).join('');
}

async function addOrder() {
  const customer = document.getElementById('newCustomer').value.trim();
  const location = document.getElementById('newLocation').value.trim();
  const product = document.getElementById('newProduct').value.trim();
  const salePrice = parseFloat(document.getElementById('newSalePrice').value);
  const costPrice = parseFloat(document.getElementById('newCostPrice').value);
  const supplier = document.getElementById('newSupplier').value;
  const tracking = document.getElementById('newTracking').value.trim();

  if (!customer || !product || isNaN(salePrice) || isNaN(costPrice)) {
    showToast('Please fill in all required fields', 'error'); return;
  }

  const { getCurrentUser } = await import('./auth.js');
  const user = getCurrentUser();
  if (!user) return;

  const newOrder = {
    customer, location: location || 'Unknown',
    product, salePrice, costPrice, supplier,
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
    tracking
  };

  try {
    await db.addOrder(user.uid, newOrder);
    closeModal('addOrderModal');
    showToast('Order added!', 'success', '📦');

    // Refresh
    currentOrders = await db.getOrders(user.uid);
    renderStats(currentOrders);
    renderOrdersTable();
  } catch (e) {
    showToast('Failed to save order.', 'error');
  }
}
window.addOrder = addOrder;

document.addEventListener('DOMContentLoaded', init);

