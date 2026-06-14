// ===== ALERT BANNER ROTATION =====
const alerts = [
    "🚨 NEW ALERT — ADANIENT: Suspicious pre-announcement trading detected — Risk Score: 91/100",
    "🚨 NEW ALERT — WIPRO: Unusual volume spike 3.8x above average — Risk Score: 85/100",
    "🚨 NEW ALERT — TCS: ML model flagged statistical anomaly — Risk Score: 72/100",
    "🚨 NEW ALERT — RELIANCE: Connected insider trades detected — Risk Score: 87/100",
];

let alertIndex = 0;
setInterval(() => {
    alertIndex = (alertIndex + 1) % alerts.length;
    const banner = document.getElementById('alertText');
    banner.style.opacity = '0';
    setTimeout(() => {
        banner.textContent = alerts[alertIndex];
        banner.style.opacity = '1';
    }, 300);
}, 4000);

// ===== STOCK DATA (Simulated fallback) =====
const stockData = {
    "RELIANCE": {
        price: [2180, 2195, 2210, 2198, 2225, 2240, 2198, 2180, 2265, 2290,
                2310, 2298, 2315, 2330, 2298, 2280, 2350, 2380, 2410, 2395,
                2420, 2398, 2445, 2460, 2440, 2480, 2510, 2498, 2530, 2560],
        volume: [12000000, 13500000, 11000000, 14000000, 15500000, 12000000,
                 13000000, 11500000, 16000000, 14500000, 12500000, 13000000,
                 15000000, 14000000, 12000000, 11000000, 58000000, 62000000,
                 55000000, 14000000, 13500000, 12000000, 14500000, 13000000,
                 12500000, 11000000, 13000000, 14000000, 12000000, 13500000],
        riskScore: 87,
        reasons: [
            "Volume 4.2x above 30-day average on Nov 17-19",
            "Trade occurred 11 days before merger announcement",
            "ML model flagged as statistical anomaly",
            "3 connected insider trades in same window"
        ]
    },
    "TCS": {
        price: [3450, 3480, 3465, 3510, 3498, 3520, 3545, 3530, 3560, 3580,
                3565, 3590, 3610, 3598, 3625, 3640, 3628, 3655, 3670, 3658,
                3680, 3695, 3710, 3698, 3725, 3740, 3728, 3755, 3770, 3758],
        volume: [8000000, 8500000, 7500000, 9000000, 8200000, 7800000,
                 8600000, 9200000, 7900000, 8400000, 8100000, 7700000,
                 8900000, 8300000, 7600000, 42000000, 38000000, 35000000,
                 8500000, 8000000, 7800000, 9100000, 8400000, 7900000,
                 8200000, 8700000, 8000000, 9300000, 8600000, 7700000],
        riskScore: 72,
        reasons: [
            "Volume 4.8x above average on Dec 15-17",
            "ML model flagged as statistical anomaly",
            "Unusual options activity detected"
        ]
    },
    "INFY": {
        price: [1420, 1435, 1448, 1432, 1460, 1475, 1462, 1488, 1502, 1495,
                1515, 1528, 1512, 1540, 1555, 1542, 1568, 1582, 1570, 1595,
                1610, 1598, 1622, 1638, 1625, 1648, 1662, 1650, 1675, 1690],
        volume: [6000000, 6500000, 5800000, 7000000, 6200000, 5900000,
                 6800000, 7200000, 6100000, 6600000, 6300000, 5700000,
                 7100000, 6400000, 5800000, 6900000, 6200000, 28000000,
                 25000000, 6500000, 6000000, 5900000, 7300000, 6600000,
                 5800000, 6400000, 6700000, 6100000, 7000000, 6300000],
        riskScore: 65,
        reasons: [
            "Volume 3.9x above average on Jan 17",
            "Unusual options activity detected",
            "Minor pre-announcement correlation found"
        ]
    },
    "ADANIENT": {
        price: [2580, 2610, 2595, 2630, 2650, 2638, 2670, 2695, 2680, 2710,
                2730, 2718, 2745, 2760, 2748, 2775, 2790, 2778, 2810, 2835,
                2820, 2850, 2875, 2860, 2890, 2915, 2900, 2930, 2955, 2940],
        volume: [10000000, 11000000, 9500000, 12000000, 10500000, 9800000,
                 11500000, 12500000, 10200000, 11200000, 10800000, 9600000,
                 12200000, 11000000, 9900000, 10600000, 11800000, 62000000,
                 58000000, 54000000, 11000000, 10200000, 12000000, 11500000,
                 10000000, 9800000, 11200000, 12100000, 10500000, 11000000],
        riskScore: 91,
        reasons: [
            "Volume 5.1x above 30-day average on Feb 17-19",
            "Trade occurred 14 days before acquisition announcement",
            "ML model flagged as high-confidence anomaly",
            "5 connected insider trades detected in same window",
            "Unusual call options activity 3 weeks prior"
        ]
    },
    "WIPRO": {
        price: [420, 428, 435, 422, 440, 448, 435, 452, 460, 455,
                462, 470, 465, 472, 480, 475, 482, 490, 485, 492,
                500, 495, 502, 510, 505, 512, 520, 515, 522, 530],
        volume: [5000000, 5500000, 4800000, 6000000, 5200000, 4900000,
                 5800000, 6200000, 5100000, 5600000, 5300000, 4700000,
                 6100000, 5400000, 4800000, 5900000, 5200000, 38000000,
                 35000000, 5500000, 5000000, 4900000, 6300000, 5600000,
                 4800000, 5400000, 5700000, 5100000, 6000000, 5300000],
        riskScore: 85,
        reasons: [
            "Volume 3.8x above 30-day average",
            "Pre-announcement trade detected 9 days before earnings",
            "ML model flagged as statistical anomaly",
            "2 connected insider trades in same window"
        ]
    }
};

// ===== CURRENT STOCK =====
let currentStock = "RELIANCE";

// ===== SEARCH FUNCTIONS =====
function searchStock(ticker) {
    document.getElementById('stockSearch').value = ticker;
    analyseStock(ticker);
}

function analyseStock(ticker) {
    ticker = ticker || document.getElementById('stockSearch').value.toUpperCase().trim();
    if (!ticker) return;

    if (!stockData[ticker]) {
        alert(`${ticker} not in watchlist yet. Try: RELIANCE, TCS, INFY, ADANIENT, WIPRO`);
        return;
    }

    currentStock = ticker;
    updateRiskCard(ticker);
    updateCharts(ticker);
    updateNetworkGraph(ticker);
    document.getElementById('chartTitle').textContent = `${ticker} — Price & Volume Chart`;
    document.getElementById('currentTicker').textContent = ticker;
}

// ===== UPDATE RISK CARD =====
function updateRiskCard(ticker) {
    const data = stockData[ticker];
    const score = data.riskScore;

    document.getElementById('riskNumber').textContent = score;

    const circle = document.getElementById('riskCircle');
    const level = document.getElementById('riskLevel');

    if (score >= 80) {
        circle.style.borderColor = '#ef4444';
        circle.style.background = 'rgba(239, 68, 68, 0.1)';
        document.getElementById('riskNumber').style.color = '#ef4444';
        level.style.color = '#ef4444';
        level.textContent = 'HIGH RISK';
    } else if (score >= 50) {
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

    const reasonsList = data.reasons.map(r => `<li>${r}</li>`).join('');
    document.getElementById('riskReasons').innerHTML = `
        <h4>⚠️ Why this was flagged:</h4>
        <ul>${reasonsList}</ul>
    `;
}

// ===== RANGE CONTROL =====
function setRange(range) {
    document.querySelectorAll('.chart-controls button').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    updateCharts(currentStock);
}

// ===== REPORT GENERATION =====
function generateReport() {
    const ticker = document.getElementById('currentTicker').textContent;
    const riskScore = document.getElementById('riskNumber').textContent;
    const riskLevel = document.getElementById('riskLevel').textContent;
    const reasons = document.querySelectorAll('#riskReasons li');
    const date = new Date().toLocaleDateString('en-IN', {
        day: '2-digit', month: 'long', year: 'numeric'
    });

    const reasonsList = Array.from(reasons).map(r => `• ${r.textContent}`).join('\n');

    const report = `
=====================================
        INSIDERWATCH
  Insider Trading Detection Report
=====================================

Report Generated: ${date}
Stock Analysed: ${ticker}
Risk Score: ${riskScore}/100
Risk Level: ${riskLevel}

-------------------------------------
SUSPICIOUS ACTIVITY DETECTED
-------------------------------------
${reasonsList}

-------------------------------------
REGULATORY REFERENCE
-------------------------------------
This activity may constitute a violation of:
SEBI (Prohibition of Insider Trading)
Regulations, 2015 — Regulation 4(1)

Under Regulation 4(1), no insider shall
trade in securities that are listed or
proposed to be listed on a stock exchange
when in possession of unpublished price
sensitive information.

Reference: https://www.sebi.gov.in

-------------------------------------
DISCLAIMER
-------------------------------------
This report is generated by InsiderWatch,
an AI-powered surveillance system.
This is for educational and research
purposes only. Not financial or legal advice.

=====================================
        END OF REPORT
=====================================
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `InsiderWatch_${ticker}_Report_${date.replace(/ /g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// ===== INIT =====
window.onload = function() {
    analyseStock('RELIANCE');
};