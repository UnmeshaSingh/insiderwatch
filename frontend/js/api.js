// ===== API CONNECTION =====
const API_URL = 'https://insiderwatch.onrender.com';

async function fetchStockFromAPI(ticker) {
    try {
        const response = await fetch(`${API_URL}/api/stock/${ticker}`);
        const data = await response.json();

        if (data.error) {
            console.error('API Error:', data.error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Failed to connect to API:', error);
        return null;
    }
}

async function fetchAlertsFromAPI() {
    try {
        const response = await fetch(`${API_URL}/api/alerts`);
        const data = await response.json();
        return data.alerts || [];
    } catch (error) {
        console.error('Failed to fetch alerts:', error);
        return [];
    }
}

async function loadRealStock(ticker) {
    // Show loading state
    document.getElementById('riskNumber').textContent = '...';
    document.getElementById('chartTitle').textContent = `${ticker} — Loading real data...`;

    const data = await fetchStockFromAPI(ticker);

    if (!data) {
        console.log('API unavailable — using simulated data');
        return false;
    }

    // Update chart title
    document.getElementById('chartTitle').textContent =
        `${ticker} — Live NSE Data | ₹${data.current_price}`;

    // Update risk card
    document.getElementById('riskNumber').textContent = data.risk_score;
    document.getElementById('currentTicker').textContent = ticker;

    const circle = document.getElementById('riskCircle');
    const level = document.getElementById('riskLevel');
    const score = data.risk_score;

    if (score >= 70) {
        circle.style.borderColor = '#ef4444';
        circle.style.background = 'rgba(239, 68, 68, 0.1)';
        document.getElementById('riskNumber').style.color = '#ef4444';
        level.style.color = '#ef4444';
        level.textContent = 'HIGH RISK';
    } else if (score >= 40) {
        circle.style.borderColor = '#f59e0b';
        circle.style.background = 'rgba(245, 158, 11, 0.1)';
        document.getElementById('riskNumber').style.color = '#f59e0b';
        level.style.color = '#f59e0b';
        level.textContent = 'MEDIUM RISK';
    } else {
        circle.style.borderColor = '#10b981';
        circle.style.background = 'rgba(16, 185, 129, 0.1)';
        document.getElementById('riskNumber').style.color = '#10b981';
        level.style.color = '#10b981';
        level.textContent = 'LOW RISK';
    }

    // Update reasons
    const reasons = data.reasons.length > 0
        ? data.reasons.map(r => `<li>${r}</li>`).join('')
        : '<li>No suspicious activity detected</li>';

    document.getElementById('riskReasons').innerHTML = `
        <h4>⚠️ Why this was flagged:</h4>
        <ul>${reasons}</ul>
    `;

    // Update charts with real data
    updateChartsWithRealData(ticker, data);

    return true;
}

function updateChartsWithRealData(ticker, data) {
    const avgVolume = data.avg_volume;

    // Destroy existing charts
    if (priceChartInstance) priceChartInstance.destroy();
    if (volumeChartInstance) volumeChartInstance.destroy();

    // Point colors — red for suspicious, blue for normal
    const pointColors = data.suspicious_flags.map(s => s ? '#ef4444' : '#3b82f6');
    const pointRadius = data.suspicious_flags.map(s => s ? 7 : 3);

    // Price chart
    const priceCtx = document.getElementById('priceChart').getContext('2d');
    priceChartInstance = new Chart(priceCtx, {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: [{
                label: `${ticker} Price (₹)`,
                data: data.prices,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                borderWidth: 2,
                pointBackgroundColor: pointColors,
                pointRadius: pointRadius,
                tension: 0.3,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#9ca3af' } },
                tooltip: {
                    backgroundColor: '#1a2235',
                    titleColor: '#f3f4f6',
                    bodyColor: '#9ca3af',
                    callbacks: {
                        afterBody: function(context) {
                            const idx = context[0].dataIndex;
                            if (data.suspicious_flags[idx]) {
                                return '⚠️ SUSPICIOUS VOLUME DETECTED';
                            }
                            if (data.ml_flags[idx]) {
                                return '🤖 ML ANOMALY FLAGGED';
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                x: { ticks: { color: '#9ca3af', font: { size: 10 } }, grid: { color: '#1f2d45' } },
                y: {
                    ticks: {
                        color: '#9ca3af',
                        callback: v => '₹' + v.toLocaleString('en-IN')
                    },
                    grid: { color: '#1f2d45' }
                }
            }
        }
    });

    // Volume chart
    const barColors = data.volumes.map(v =>
        v > avgVolume * 3 ? '#ef4444' :
        v > avgVolume * 2 ? '#f59e0b' : '#3b82f6'
    );

    const volumeCtx = document.getElementById('volumeChart').getContext('2d');
    volumeChartInstance = new Chart(volumeCtx, {
        type: 'bar',
        data: {
            labels: data.dates,
            datasets: [
                {
                    label: 'Volume',
                    data: data.volumes,
                    backgroundColor: barColors,
                    borderRadius: 3,
                },
                {
                    label: '30-Day Avg',
                    data: Array(data.volumes.length).fill(avgVolume),
                    type: 'line',
                    borderColor: '#10b981',
                    borderDash: [5, 5],
                    borderWidth: 2,
                    pointRadius: 0,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#9ca3af' } },
                tooltip: {
                    backgroundColor: '#1a2235',
                    callbacks: {
                        label: function(context) {
                            const v = context.raw;
                            const ratio = (v / avgVolume).toFixed(1);
                            return `Volume: ${(v/1000000).toFixed(1)}M (${ratio}x avg)`;
                        }
                    }
                }
            },
            scales: {
                x: { ticks: { color: '#9ca3af', font: { size: 10 } }, grid: { color: '#1f2d45' } },
                y: {
                    ticks: {
                        color: '#9ca3af',
                        callback: v => (v/1000000).toFixed(0) + 'M'
                    },
                    grid: { color: '#1f2d45' }
                }
            }
        }
    });
}

async function loadRealAlerts() {
    const alerts = await fetchAlertsFromAPI();
    if (alerts.length === 0) return;

    const feed = document.getElementById('alertsFeed');
    feed.innerHTML = alerts.map(alert => `
        <div class="alert-item ${alert.level}" onclick="searchStock('${alert.ticker}')">
            <div class="alert-ticker">${alert.ticker}</div>
            <div class="alert-desc">${alert.reason}</div>
            <div class="alert-score ${alert.level}">${alert.risk_score}</div>
        </div>
    `).join('');
}

// Override the searchStock function to use real API
const originalSearchStock = window.searchStock;
window.searchStock = async function(ticker) {
    document.getElementById('stockSearch').value = ticker;
    const success = await loadRealStock(ticker);
    if (!success) {
        analyseStock(ticker);
    }
    updateNetworkGraph(ticker);
};

// Load real data on startup
window.addEventListener('load', async function() {
    await loadRealAlerts();
    await loadRealStock('RELIANCE');
    updateNetworkGraph('RELIANCE');
});