// ===== ORDERS PAGE =====

const ORDERS_KEY = 'dropship_orders';

const MOCK_ORDERS = [
    { id: '#DS-1001', customer: 'Sarah Johnson', location: 'New York, US', product: 'Posture Corrector', salePrice: 39.99, costPrice: 12.50, supplier: 'AliExpress', status: 'delivered', date: '2026-02-10', tracking: 'YT2134567890CN' },
    { id: '#DS-1002', customer: 'Mike Chen', location: 'Los Angeles, US', product: 'Wireless Earbuds Pro', salePrice: 49.99, costPrice: 18.00, supplier: 'CJ Dropshipping', status: 'shipped', date: '2026-02-14', tracking: 'CJ9876543210' },
    { id: '#DS-1003', customer: 'Emma Wilson', location: 'London, UK', product: 'LED Ring Light', salePrice: 34.99, costPrice: 9.50, supplier: 'AliExpress', status: 'processing', date: '2026-02-16', tracking: '' },
    { id: '#DS-1004', customer: 'James Brown', location: 'Toronto, CA', product: 'Smart Watch Fitness', salePrice: 59.99, costPrice: 22.00, supplier: 'Zendrop', status: 'pending', date: '2026-02-17', tracking: '' },
    { id: '#DS-1005', customer: 'Olivia Davis', location: 'Sydney, AU', product: 'Massage Gun Pro', salePrice: 89.99, costPrice: 35.00, supplier: 'AutoDS', status: 'delivered', date: '2026-02-05', tracking: 'AU5647382910' },
    { id: '#DS-1006', customer: 'Liam Martinez', location: 'Miami, US', product: 'Portable Blender', salePrice: 29.99, costPrice: 8.00, supplier: 'CJ Dropshipping', status: 'refunded', date: '2026-02-08', tracking: 'CJ1122334455' },
    { id: '#DS-1007', customer: 'Ava Thompson', location: 'Chicago, US', product: 'Posture Corrector', salePrice: 39.99, costPrice: 12.50, supplier: 'AliExpress', status: 'shipped', date: '2026-02-15', tracking: 'YT9988776655CN' },
    { id: '#DS-1008', customer: 'Noah Garcia', location: 'Houston, US', product: 'Smart Watch Fitness', salePrice: 59.99, costPrice: 22.00, supplier: 'Zendrop', status: 'delivered', date: '2026-02-03', tracking: 'ZD4433221100' },
];

function getOrders() {
    try {
        const stored = JSON.parse(localStorage.getItem(ORDERS_KEY));
        return stored && stored.length > 0 ? stored : MOCK_ORDERS;
    } catch { return MOCK_ORDERS; }
}

function saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

let currentStatusFilter = 'all';

function filterOrders(btn, status) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    currentStatusFilter = status;
    renderOrdersTable();
}

function renderStats(orders) {
    const delivered = orders.filter(o => o.status === 'delivered');
    const totalRevenue = orders.filter(o => o.status !== 'refunded').reduce((s, o) => s + o.salePrice, 0);
    const totalProfit = orders.filter(o => o.status !== 'refunded').reduce((s, o) => s + (o.salePrice - o.costPrice), 0);
    const pending = orders.filter(o => ['pending', 'processing'].includes(o.status)).length;

    document.getElementById('orderStats').innerHTML = `
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
    const orders = getOrders();
    const search = (document.getElementById('orderSearch')?.value || '').toLowerCase();
    let filtered = currentStatusFilter === 'all' ? orders : orders.filter(o => o.status === currentStatusFilter);
    if (search) filtered = filtered.filter(o => o.id.toLowerCase().includes(search) || o.customer.toLowerCase().includes(search) || o.product.toLowerCase().includes(search));

    const statusConfig = {
        pending: { class: 'status-pending', icon: '⏳', label: 'Pending' },
        processing: { class: 'status-processing', icon: '⚙️', label: 'Processing' },
        shipped: { class: 'status-shipped', icon: '🚚', label: 'Shipped' },
        delivered: { class: 'status-delivered', icon: '✅', label: 'Delivered' },
        refunded: { class: 'status-refunded', icon: '↩️', label: 'Refunded' },
    };

    document.getElementById('ordersBody').innerHTML = filtered.length === 0
        ? `<tr><td colspan="10" style="text-align:center;padding:40px;color:var(--text-muted);">No orders found</td></tr>`
        : filtered.map(o => {
            const profit = o.salePrice - o.costPrice;
            const sc = statusConfig[o.status] || statusConfig.pending;
            return `
          <tr>
            <td><span class="order-id">${o.id}</span></td>
            <td><div class="customer-name">${o.customer}</div><div class="customer-loc">${o.location}</div></td>
            <td>${o.product}</td>
            <td>$${o.salePrice.toFixed(2)}</td>
            <td style="color:var(--text-secondary);">$${o.costPrice.toFixed(2)}</td>
            <td class="${profit > 0 ? 'profit-pos' : 'profit-neg'}">$${profit.toFixed(2)}</td>
            <td><span class="tag tag-purple">${o.supplier}</span></td>
            <td><span class="status-badge ${sc.class}">${sc.icon} ${sc.label}</span></td>
            <td style="color:var(--text-secondary);white-space:nowrap;">${o.date}</td>
            <td>${o.tracking ? `<span style="font-family:monospace;font-size:11px;color:var(--accent-teal);">${o.tracking}</span>` : '<span style="color:var(--text-muted);font-size:11px;">—</span>'}</td>
          </tr>
        `;
        }).join('');
}

function addOrder() {
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

    const orders = getOrders();
    const newOrder = {
        id: `#DS-${1000 + orders.length + 1}`,
        customer, location: location || 'Unknown',
        product, salePrice, costPrice, supplier,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        tracking
    };
    orders.unshift(newOrder);
    saveOrders(orders);
    closeModal('addOrderModal');
    renderStats(orders);
    renderOrdersTable();
    showToast('Order added!', 'success', '📦');
}

document.addEventListener('DOMContentLoaded', () => {
    const orders = getOrders();
    renderStats(orders);
    renderOrdersTable();
    const search = document.getElementById('orderSearch');
    if (search) search.addEventListener('input', debounce(renderOrdersTable, 250));
});
