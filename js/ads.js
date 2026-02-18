// ===== AD LIBRARY PAGE =====
import { collectAd } from './app.js';

function initAds() {
  // Populate niche filter
  const nicheSelect = document.getElementById('filterNiche');
  if (!nicheSelect) return;
  const niches = [...new Set(ADS.map(a => a.niche))];
  niches.forEach(n => {
    const opt = document.createElement('option');
    opt.value = n;
    opt.textContent = n;
    nicheSelect.appendChild(opt);
  });

  document.getElementById('filterPlatform').addEventListener('change', renderAds);
  document.getElementById('filterNiche').addEventListener('change', renderAds);
  document.getElementById('filterEngagement').addEventListener('change', renderAds);

  renderAds();
}

function renderAds() {
  const platform = document.getElementById('filterPlatform').value;
  const niche = document.getElementById('filterNiche').value;
  const engagement = document.getElementById('filterEngagement').value;

  const filtered = ADS.filter(a => {
    if (platform && a.platform !== platform) return false;
    if (niche && a.niche !== niche) return false;
    if (engagement && a.engagement !== engagement) return false;
    return true;
  });

  const countEl = document.getElementById('adsCount');
  if (countEl) countEl.textContent = `${filtered.length} ad${filtered.length !== 1 ? 's' : ''}`;

  const grid = document.getElementById('adsGrid');
  if (!grid) return;

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-state-icon">📢</div>
      <div class="empty-state-title">No ads match your filters</div>
      <div class="empty-state-text">Try adjusting the filters above</div>
    </div>`;
    return;
  }

  grid.innerHTML = filtered.map(ad => {
    const platformIcon = ad.platform === 'facebook' ? '📘' : '🎵';
    const platformLabel = ad.platform === 'facebook' ? 'Facebook' : 'TikTok';
    const platformBadge = ad.platform === 'facebook' ? 'badge-facebook' : 'badge-tiktok';
    const engClass = ad.engagement === 'Very High' ? 'eng-very-high' : ad.engagement === 'High' ? 'eng-high' : 'eng-medium';
    const engIcon = ad.engagement === 'Very High' ? '🔥' : ad.engagement === 'High' ? '📈' : '📊';

    return `
      <div class="ad-card">
        <div style="position:relative;">
          <img src="${ad.thumbnail}" alt="Ad thumbnail" class="ad-img" loading="lazy">
          <div style="position:absolute;top:10px;left:10px;">
            <span class="badge ${platformBadge}">${platformIcon} ${platformLabel}</span>
          </div>
          <div style="position:absolute;top:10px;right:10px;">
            <span class="engagement-badge ${engClass}">${engIcon} ${ad.engagement}</span>
          </div>
        </div>
        <div class="ad-body">
          <div class="ad-platform">
            <span class="tag tag-teal" style="font-size:10px;">${ad.niche}</span>
            <span style="font-size:11px;color:var(--text-muted);">Running ${ad.runningDays} days</span>
          </div>
          <div class="ad-headline">"${ad.headline}"</div>
          <div class="ad-copy">${ad.copy}</div>
          <div class="ad-metrics">
            <div class="ad-metric">
              <div class="ad-metric-val text-purple">${formatNumber(ad.likes)}</div>
              <div class="ad-metric-lbl">❤️ Likes</div>
            </div>
            <div class="ad-metric">
              <div class="ad-metric-val text-teal">${formatNumber(ad.comments)}</div>
              <div class="ad-metric-lbl">💬 Comments</div>
            </div>
            <div class="ad-metric">
              <div class="ad-metric-val text-green">${formatNumber(ad.shares)}</div>
              <div class="ad-metric-lbl">🔄 Shares</div>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:12px;color:var(--text-secondary);">Ad Spend: <strong>${ad.spend}</strong></span>
            <button class="btn btn-secondary btn-sm" onclick="collectAd(${ad.id})">📌 Collect</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.collectAd = async function (adId) {
  const ad = ADS.find(a => a.id === adId);
  if (ad) {
    await collectAd(ad);
  }
}

document.addEventListener('DOMContentLoaded', initAds);

