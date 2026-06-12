// ===== CHARTS =====
let priceChartInstance = null;
let volumeChartInstance = null;

// Generate dates for last 30 days
function getLast30Days() {
    const dates = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }));
    }
    return dates;
}

function updateCharts(ticker) {
    const data = stockData[ticker];
    const labels = getLast30Days();
    const avgVolume = data.volume.reduce((a, b) => a + b) / data.volume.length;

    // ===== PRICE CHART =====
    if (priceChartInstance) priceChartInstance.destroy();

    const priceCtx = document.getElementById('priceChart').getContext('2d');

    // Find spike points for annotation
    const pointColors = data.volume.map(v =>
        v > avgVolume * 3 ? '#ef4444' : '#3b82f6'
    );
    const pointRadius = data.volume.map(v =>
        v > avgVolume * 3 ? 6 : 3
    );

    priceChartInstance = new Chart(priceCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${ticker} Price (₹)`,
                data: data.price,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                borderWidth: 2,
                pointBackgroundColor: pointColors,
                pointRadius: pointRadius,
                pointHoverRadius: 8,
                tension: 0.3,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#9ca3af', font: { size: 12 } }
                },
                tooltip: {
                    backgroundColor: '#1a2235',
                    titleColor: '#f3f4f6',
                    bodyColor: '#9ca3af',
                    borderColor: '#1f2d45',
                    borderWidth: 1,
                    callbacks: {
                        afterBody: function(context) {
                            const idx = context[0].dataIndex;
                            if (data.volume[idx] > avgVolume * 3) {
                                return '⚠️ SUSPICIOUS — Volume spike detected!';
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#9ca3af', font: { size: 10 } },
                    grid: { color: '#1f2d45' }
                },
                y: {
                    ticks: {
                        color: '#9ca3af',
                        font: { size: 10 },
                        callback: v => '₹' + v.toLocaleString('en-IN')
                    },
                    grid: { color: '#1f2d45' }
                }
            }
        }
    });

    // ===== VOLUME CHART =====
    if (volumeChartInstance) volumeChartInstance.destroy();

    const volumeCtx = document.getElementById('volumeChart').getContext('2d');

    const barColors = data.volume.map(v =>
        v > avgVolume * 3 ? '#ef4444' :
        v > avgVolume * 2 ? '#f59e0b' : '#3b82f6'
    );

    volumeChartInstance = new Chart(volumeCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Volume',
                    data: data.volume,
                    backgroundColor: barColors,
                    borderRadius: 3,
                },
                {
                    label: '30-Day Avg',
                    data: Array(30).fill(avgVolume),
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
                legend: {
                    labels: { color: '#9ca3af', font: { size: 12 } }
                },
                tooltip: {
                    backgroundColor: '#1a2235',
                    titleColor: '#f3f4f6',
                    bodyColor: '#9ca3af',
                    borderColor: '#1f2d45',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const v = context.raw;
                            const ratio = (v / avgVolume).toFixed(1);
                            if (v > avgVolume * 3) {
                                return `Volume: ${(v/1000000).toFixed(1)}M ⚠️ (${ratio}x avg)`;
                            }
                            return `Volume: ${(v/1000000).toFixed(1)}M (${ratio}x avg)`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#9ca3af', font: { size: 10 } },
                    grid: { color: '#1f2d45' }
                },
                y: {
                    ticks: {
                        color: '#9ca3af',
                        font: { size: 10 },
                        callback: v => (v/1000000).toFixed(0) + 'M'
                    },
                    grid: { color: '#1f2d45' }
                }
            }
        }
    });
}