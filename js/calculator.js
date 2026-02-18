// ===== PROFIT CALCULATOR =====

window.calculate = function () {
  const costPrice = parseFloat(document.getElementById('costPrice').value) || 0;
  const sellPrice = parseFloat(document.getElementById('sellPrice').value) || 0;
  const shippingCost = parseFloat(document.getElementById('shippingCost').value) || 0;
  const processingFee = parseFloat(document.getElementById('processingFee').value) || 2.9;
  const platformFee = parseFloat(document.getElementById('platformFee').value) || 0;
  const adSpend = parseFloat(document.getElementById('adSpend').value) || 0;
  const ordersPerDay = parseInt(document.getElementById('ordersPerDay').value) || 1;
  const refundRate = parseFloat(document.getElementById('refundRate').value) || 0;

  if (sellPrice <= 0) return;

  const processingFeeAmt = sellPrice * (processingFee / 100);
  const totalCosts = costPrice + shippingCost + processingFeeAmt + platformFee + adSpend;
  const grossMargin = sellPrice - costPrice - shippingCost;
  const netProfit = sellPrice - totalCosts;
  const grossMarginPct = Math.round((grossMargin / sellPrice) * 100);
  const roas = adSpend > 0 ? (sellPrice / adSpend).toFixed(2) : '∞';
  const roasNum = adSpend > 0 ? sellPrice / adSpend : 10;

  // Break-even
  const fixedDailyCosts = 1.00; // ~$30/mo platform
  const breakEven = netProfit > 0 ? Math.ceil(fixedDailyCosts / netProfit) : '∞';

  // Update results
  document.getElementById('res-gross-margin').textContent = `${grossMarginPct}%`;
  document.getElementById('res-gross-margin').className = `result-val ${grossMarginPct >= 30 ? 'result-positive' : grossMarginPct >= 15 ? 'result-neutral' : 'result-negative'}`;
  document.getElementById('res-net-profit').textContent = `$${netProfit.toFixed(2)}`;
  document.getElementById('res-net-profit').className = `result-val ${netProfit > 0 ? 'result-neutral' : 'result-negative'}`;
  document.getElementById('res-roas').textContent = typeof roas === 'string' ? roas : `${roas}x`;
  document.getElementById('res-breakeven').textContent = breakEven;

  // ROAS meter
  const roasPct = Math.min(100, (roasNum / 5) * 100);
  const roasColor = roasNum >= 3 ? 'var(--accent-green)' : roasNum >= 2 ? 'var(--accent-orange)' : 'var(--accent-red)';
  document.getElementById('roas-fill').style.width = `${roasPct}%`;
  document.getElementById('roas-fill').style.background = roasColor;

  // Projections (accounting for refund rate)
  const effectiveProfit = netProfit * (1 - refundRate / 100);
  const dailyProfit = effectiveProfit * ordersPerDay;
  const weeklyProfit = dailyProfit * 7;
  const monthlyProfit = dailyProfit * 30;
  const dailyRevenue = sellPrice * ordersPerDay * (1 - refundRate / 100);

  document.getElementById('projections').innerHTML = `
    <div class="scenario-row">
      <span class="scenario-label">📅 Daily Revenue</span>
      <span class="scenario-val text-teal">$${dailyRevenue.toFixed(2)}</span>
    </div>
    <div class="scenario-row">
      <span class="scenario-label">📅 Daily Profit</span>
      <span class="scenario-val ${dailyProfit > 0 ? 'text-green' : 'text-red'}">$${dailyProfit.toFixed(2)}</span>
    </div>
    <div class="scenario-row">
      <span class="scenario-label">📆 Weekly Profit</span>
      <span class="scenario-val ${weeklyProfit > 0 ? 'text-green' : 'text-red'}">$${weeklyProfit.toFixed(2)}</span>
    </div>
    <div class="scenario-row">
      <span class="scenario-label">🗓️ Monthly Profit</span>
      <span class="scenario-val ${monthlyProfit > 0 ? 'text-green' : 'text-red'}" style="font-size:16px;">$${monthlyProfit.toFixed(2)}</span>
    </div>
    <div class="scenario-row">
      <span class="scenario-label">📈 Annual Profit</span>
      <span class="scenario-val ${monthlyProfit > 0 ? 'text-purple' : 'text-red'}" style="font-size:16px;">$${(monthlyProfit * 12).toFixed(2)}</span>
    </div>
  `;

  // Tip
  let tip = '';
  if (netProfit < 0) {
    tip = `<strong>⚠️ Warning:</strong> You're losing money per order. Lower your ad spend, find a cheaper supplier, or increase your selling price.`;
  } else if (grossMarginPct < 30) {
    tip = `<strong>💡 Tip:</strong> Your margin is below 30%. Try to find a cheaper supplier or increase your price slightly. Aim for 40%+ gross margin.`;
  } else if (roasNum < 2) {
    tip = `<strong>💡 Tip:</strong> Your ROAS is below 2x. Try to reduce ad spend by improving your ad creative or targeting. A good ROAS is 3x+.`;
  } else {
    tip = `<strong>✅ Looking good!</strong> Your margins are healthy. Consider scaling your ad spend to increase daily orders.`;
  }
  document.getElementById('profitTip').innerHTML = tip;

  // Cost breakdown
  const costs = [
    { label: 'Product Cost', val: costPrice, color: 'var(--accent-red)' },
    { label: 'Ad Spend', val: adSpend, color: 'var(--accent-orange)' },
    { label: 'Processing Fee', val: processingFeeAmt, color: 'var(--accent-purple-light)' },
    { label: 'Shipping', val: shippingCost, color: 'var(--accent-teal)' },
    { label: 'Platform Fee', val: platformFee, color: 'var(--text-muted)' },
  ].filter(c => c.val > 0);

  document.getElementById('costBreakdown').innerHTML = costs.map(c => `
    <div class="source-row" style="margin-bottom:10px;">
      <div class="source-label" style="width:130px;">${c.label}</div>
      <div class="source-bar-wrap" style="height:8px;border-radius:4px;">
        <div class="source-bar" style="width:${Math.round((c.val / sellPrice) * 100)}%;background:${c.color};height:8px;border-radius:4px;"></div>
      </div>
      <div class="source-pct" style="color:${c.color};width:50px;">$${c.val.toFixed(2)}</div>
    </div>
  `).join('') + `
    <div class="scenario-row" style="margin-top:8px;border-top:1px solid var(--border);padding-top:8px;">
      <span style="font-size:13px;font-weight:700;">Total Costs</span>
      <span style="font-size:13px;font-weight:700;color:var(--accent-red);">$${totalCosts.toFixed(2)}</span>
    </div>
    <div class="scenario-row">
      <span style="font-size:13px;font-weight:700;">Selling Price</span>
      <span style="font-size:13px;font-weight:700;color:var(--accent-green);">$${sellPrice.toFixed(2)}</span>
    </div>
    <div class="scenario-row">
      <span style="font-size:14px;font-weight:800;">Net Profit</span>
      <span style="font-size:14px;font-weight:800;color:${netProfit > 0 ? 'var(--accent-green)' : 'var(--accent-red)'};">$${netProfit.toFixed(2)}</span>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', calculate);
