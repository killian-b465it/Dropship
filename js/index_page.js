// ===== DASHBOARD PAGE =====
import { getSavedProducts, saveProduct } from './app.js';
import { onAuthStateChanged } from './auth.js';

async function refreshStats() {
    const saved = await getSavedProducts();
    const statSavedEl = document.getElementById('statSaved');
    if (statSavedEl) statSavedEl.textContent = saved.length;
}

window.savePOD = async function () {
    const pod = PRODUCTS.find(p => p.id === 6);
    if (pod) {
        await saveProduct(pod);
        await refreshStats();
    }
};

async function init() {
    // Render top niches
    const topNiches = NICHES_DATA.sort((a, b) => b.trendScore - a.trendScore).slice(0, 4);
    const topNichesEl = document.getElementById('topNiches');
    if (topNichesEl) {
        topNichesEl.innerHTML = topNiches.map(n => `
      <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);">
        <div style="font-size:22px;">${n.icon}</div>
        <div style="flex:1;">
          <div style="font-size:13px;font-weight:600;">${n.name}</div>
          <div class="progress-bar" style="margin-top:4px;">
            <div class="progress-fill" style="width:${n.trendScore}%"></div>
          </div>
        </div>
        <div style="font-size:12px;font-weight:700;color:var(--accent-green);">${n.growth}</div>
      </div>
    `).join('').replace(/border-bottom:1px solid var\(--border\);">(?=[^<]*<\/div>\s*<\/div>\s*$)/, '>');
    }

    // Global search redirect
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('keydown', e => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                window.location.href = `products.html?search=${encodeURIComponent(e.target.value.trim())}`;
            }
        });
    }

    onAuthStateChanged(async (user) => {
        await refreshStats();
    });
}

document.addEventListener('DOMContentLoaded', init);
