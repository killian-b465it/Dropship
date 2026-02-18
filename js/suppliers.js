import { requireAuth } from './auth.js';
import { getConnectedSuppliers, setConnectedSuppliers, showToast, openModal, closeModal } from './app.js';
import * as db from './db.js';

const SUPPLIERS_DATA = [
  {
    id: 'aliexpress',
    name: 'AliExpress',
    logo: '🛒',
    color: '#e62e04',
    type: 'Marketplace',
    desc: 'The world\'s largest dropshipping marketplace with 100M+ products. Best for beginners. Pairs with DSers for auto-fulfillment.',
    products: '100M+',
    shipping: '7–30 days',
    minOrder: 'None',
    url: 'https://www.aliexpress.com',
    dsersUrl: 'https://apps.shopify.com/dsers',
    tags: ['Free', 'Huge Selection', 'Beginner Friendly'],
    pros: ['No minimum order', 'Massive product range', 'Free to use', 'DSers integration'],
    cons: ['Slow shipping', 'Quality varies', 'No US warehouse']
  },
  {
    id: 'cj',
    name: 'CJ Dropshipping',
    logo: '📦',
    color: '#0066cc',
    type: 'Full-Service',
    desc: 'Free all-in-one dropshipping platform with warehouses in the US, EU, and Asia. Faster shipping than AliExpress.',
    products: '400K+',
    shipping: '5–15 days',
    minOrder: 'None',
    url: 'https://cjdropshipping.com',
    dsersUrl: 'https://cjdropshipping.com',
    tags: ['Free', 'US Warehouse', 'Fast Shipping'],
    pros: ['US/EU warehouses', 'Free to use', 'Custom packaging', 'Product sourcing'],
    cons: ['Smaller catalog than AliExpress', 'Interface can be complex']
  },
  {
    id: 'spocket',
    name: 'Spocket',
    logo: '⚡',
    color: '#7c3aed',
    type: 'Curated Marketplace',
    desc: 'Curated marketplace focused on US and EU suppliers. Faster shipping (2–7 days) and higher quality products.',
    products: '100K+',
    shipping: '2–7 days',
    minOrder: 'None',
    url: 'https://www.spocket.co',
    dsersUrl: 'https://www.spocket.co',
    tags: ['US/EU Products', 'Fast Shipping', '$24.99/mo'],
    pros: ['Fast shipping', 'High quality products', 'Branded invoicing', 'Shopify/WooCommerce'],
    cons: ['Paid plans only', 'Smaller catalog', 'Higher product costs']
  },
  {
    id: 'zendrop',
    name: 'Zendrop',
    logo: '🌊',
    color: '#06b6d4',
    type: 'Full-Service',
    desc: 'US-based dropshipping platform with 1M+ products, custom branding, and fast fulfillment. Free plan available.',
    products: '1M+',
    shipping: '5–10 days',
    minOrder: 'None',
    url: 'https://zendrop.com',
    dsersUrl: 'https://zendrop.com',
    tags: ['Free Plan', 'Custom Branding', 'US Based'],
    pros: ['Custom packaging', 'US warehouse', 'Auto-fulfillment', 'Free plan'],
    cons: ['Premium features require paid plan', 'Smaller than AliExpress']
  },
  {
    id: 'autods',
    name: 'AutoDS',
    logo: '🤖',
    color: '#f59e0b',
    type: 'Automation Platform',
    desc: 'All-in-one automation platform that sources from 500M+ products across multiple suppliers and auto-fulfills orders.',
    products: '500M+',
    shipping: '3–15 days',
    minOrder: 'None',
    url: 'https://autods.com',
    dsersUrl: 'https://autods.com',
    tags: ['Automation', 'Multi-Supplier', '$26.90/mo'],
    pros: ['Massive product range', 'Full automation', 'Price monitoring', 'Multiple suppliers'],
    cons: ['Paid plans only', 'Learning curve', 'Monthly fee']
  },
  {
    id: 'printful',
    name: 'Printful',
    logo: '🎨',
    color: '#ec4899',
    type: 'Print-on-Demand',
    desc: 'Print-on-demand supplier for custom t-shirts, hoodies, mugs, phone cases, and more. No inventory needed.',
    products: '300+',
    shipping: '3–7 days',
    minOrder: 'None',
    url: 'https://www.printful.com',
    dsersUrl: 'https://www.printful.com',
    tags: ['Free', 'Custom Designs', 'Print-on-Demand'],
    pros: ['No inventory', 'Custom branding', 'High quality', 'US/EU production'],
    cons: ['Higher product cost', 'Limited to print products', 'Smaller margins']
  }
];

let currentConnected = [];

async function init() {
  await requireAuth();
  currentConnected = await getConnectedSuppliers();
  renderSuppliers();
}

async function toggleConnect(supplierId) {
  const idx = currentConnected.indexOf(supplierId);
  if (idx > -1) {
    currentConnected.splice(idx, 1);
    showToast('Supplier disconnected', 'info', '🔌');
  } else {
    currentConnected.push(supplierId);
    showToast('Supplier connected!', 'success', '🔗');
  }

  await setConnectedSuppliers(currentConnected);
  renderSuppliers();
}
window.toggleConnect = toggleConnect;

window.openConnectModal = function (supplierId) {
  const s = SUPPLIERS_DATA.find(x => x.id === supplierId);
  if (!s) return;
  const isConnected = currentConnected.includes(supplierId);

  document.getElementById('connectModalTitle').textContent = `Connect to ${s.name}`;
  document.getElementById('connectModalBody').innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
      <div style="font-size:40px;">${s.logo}</div>
      <div>
        <div style="font-size:18px;font-weight:800;">${s.name}</div>
        <div style="font-size:13px;color:var(--text-secondary);">${s.type}</div>
      </div>
    </div>
    <div style="margin-bottom:16px;">
      <div style="font-size:13px;font-weight:600;margin-bottom:8px;">✅ Pros</div>
      ${s.pros.map(p => `<div style="font-size:13px;color:var(--text-secondary);padding:3px 0;">• ${p}</div>`).join('')}
    </div>
    <div style="margin-bottom:20px;">
      <div style="font-size:13px;font-weight:600;margin-bottom:8px;">⚠️ Cons</div>
      ${s.cons.map(c => `<div style="font-size:13px;color:var(--text-secondary);padding:3px 0;">• ${c}</div>`).join('')}
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <a href="${s.url}" target="_blank" class="btn btn-teal" style="flex:1;">🌐 Visit ${s.name}</a>
      <button class="btn ${isConnected ? 'btn-secondary' : 'btn-primary'}" style="flex:1;" onclick="toggleConnect('${s.id}');closeModal('connectModal');">
        ${isConnected ? '🔌 Disconnect' : '🔗 Mark as Connected'}
      </button>
    </div>
    <div style="margin-top:12px;padding:12px;background:var(--bg-primary);border-radius:10px;font-size:12px;color:var(--text-muted);">
      💡 After signing up on ${s.name}, install their Shopify app to enable one-click order fulfillment.
    </div>
  `;
  openModal('connectModal');
}

function renderSuppliers() {
  const connected = currentConnected;
  document.getElementById('connectedCount').textContent = `${connected.length} Connected`;

  document.getElementById('supplierGrid').innerHTML = SUPPLIERS_DATA.map(s => {
    const isConnected = connected.includes(s.id);
    return `
      <div class="supplier-card ${isConnected ? 'connected' : ''}">
        ${isConnected ? '<div class="connected-badge">✓ Connected</div>' : ''}
        <div class="supplier-header">
          <div class="supplier-logo" style="background:${s.color}22;">${s.logo}</div>
          <div>
            <div class="supplier-name">${s.name}</div>
            <div class="supplier-type">${s.type}</div>
          </div>
        </div>
        <div class="supplier-desc">${s.desc}</div>
        <div class="supplier-stats">
          <div class="ss"><div class="ss-val text-teal">${s.products}</div><div class="ss-lbl">Products</div></div>
          <div class="ss"><div class="ss-val text-green">${s.shipping}</div><div class="ss-lbl">Shipping</div></div>
          <div class="ss"><div class="ss-val text-purple">${s.minOrder}</div><div class="ss-lbl">Min Order</div></div>
        </div>
        <div class="supplier-tags">
          ${s.tags.map(t => `<span class="tag tag-purple">${t}</span>`).join('')}
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn ${isConnected ? 'btn-secondary' : 'btn-primary'} btn-sm" style="flex:1;" onclick="openConnectModal('${s.id}')">
            ${isConnected ? '✓ Connected' : '🔗 Connect'}
          </button>
          <a href="${s.url}" target="_blank" class="btn btn-secondary btn-sm">🌐 Visit</a>
        </div>
      </div>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', init);

