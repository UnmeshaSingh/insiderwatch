# InsiderWatch 🔍
### AI-Powered Insider Trading Detection System for Indian Capital Markets

A real-time stock market surveillance dashboard that detects suspicious insider 
trading activity across NSE-listed stocks using machine learning, statistical 
anomaly detection, and regulatory correlation — built for fintech compliance teams.

🔗 **Live Demo:** https://unmeshasingh.github.io/insiderwatch  
⚙️ **Backend API:** https://insiderwatch.onrender.com

---

## 🎯 Problem Statement

Insider trading costs Indian capital markets billions annually. SEBI receives 
thousands of complaints every year but manual surveillance is slow, expensive, 
and reactive. InsiderWatch automates the detection process using a 3-layer 
AI detection engine that flags suspicious activity before it becomes a scandal.

---

## 🚨 How It Works — 3-Layer Detection Engine

**Layer 1 — Statistical Volume Analysis**
Calculates 30-day rolling average volume for each stock and flags trades where 
volume exceeds 3x the average. Red bars on the volume chart indicate suspicious 
trading windows.

**Layer 2 — Pre-Announcement Correlation**
Cross-references suspicious trades against a corporate events calendar 
(earnings, mergers, acquisitions, board meetings). Trades occurring 3–30 days 
before a major announcement are flagged and scored.

**Layer 3 — ML Isolation Forest**
Uses scikit-learn's Isolation Forest algorithm to detect statistical anomalies 
in trading patterns. Features include volume spike ratio, price change %, 
volume change %, and price momentum. Model is trained on 3 months of 
historical data per stock.

**Risk Scoring Engine**
Combines all 3 layers into a 0–100 risk score with full explainability — 
tells you exactly why a stock was flagged, not just that it was.

---

## ✨ Features

- 📊 **Live NSE Stock Data** — Real-time price and volume charts via yfinance
- 🤖 **ML Anomaly Detection** — Isolation Forest model trained on historical data
- ⏰ **Pre-Announcement Detector** — Flags trades before earnings, mergers, acquisitions
- 🕸️ **Insider Trade Network Graph** — D3.js force-directed graph showing connected trades
- ⚠️ **Risk Score + Explainability** — 0-100 score with specific reasons for each flag
- 🚨 **Live Alerts Feed** — Real-time feed of suspicious stocks ranked by risk
- 📋 **SEBI Regulatory Reference** — Links each flag to SEBI PIT Regulations 2015
- 📄 **Compliance Report Generator** — One-click downloadable report for flagged stocks
- 🔴 **Live Surveillance Ticker** — Real-time alert ticker simulating active monitoring

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Charts | Chart.js |
| Network Graph | D3.js (force-directed) |
| Backend | Python, FastAPI |
| Stock Data | yfinance (NSE/BSE) |
| ML Model | scikit-learn (Isolation Forest) |
| Data Processing | Pandas, NumPy |
| Frontend Deployment | GitHub Pages |
| Backend Deployment | Render |

---

## 📁 Project Structure

insiderwatch/

├── frontend/

│   ├── index.html          # Main dashboard

│   ├── css/

│   │   └── styles.css      # Dark finance theme

│   └── js/

│       ├── dashboard.js    # Core dashboard + report generation

│       ├── charts.js       # Chart.js price + volume charts

│       ├── network.js      # D3.js insider network graph

│       └── api.js          # FastAPI integration + real data loader

├── backend/

│   ├── main.py             # FastAPI routes

│   └── requirements.txt    # Python dependencies

└── README.md

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| GET | `/api/stock/{ticker}` | Full analysis for any NSE stock |
| GET | `/api/alerts` | Current suspicious stocks ranked by risk |
| GET | `/api/watchlist` | List of monitored stocks |

**Example response for `/api/stock/RELIANCE`:**
```json
{
  "ticker": "RELIANCE",
  "current_price": 1293.0,
  "risk_score": 25,
  "reasons": ["ML model flagged 4 statistical anomalies"],
  "suspicious_flags": [...],
  "ml_flags": [...],
  "prices": [...],
  "volumes": [...]
}
```

---

## 🚀 How to Run Locally

**Frontend:**
```bash
# Clone the repo
git clone https://github.com/UnmeshaSingh/insiderwatch.git
cd insiderwatch

# Open frontend/index.html in your browser
# Or use Live Server in VS Code
```

**Backend:**
```bash
cd backend

# Install dependencies
pip install fastapi uvicorn yfinance pandas numpy scikit-learn requests

# Run the server
uvicorn main:app --reload

# API available at http://127.0.0.1:8000
# API docs at http://127.0.0.1:8000/docs
```

---

## 📊 Stocks Currently Monitored

RELIANCE  |  TCS  |  INFY  |  HDFCBANK  |  WIPRO

TATAMOTORS  |  ADANIENT  |  BAJFINANCE  |  ICICIBANK  |  SBIN

---

## 📋 Regulatory Framework

InsiderWatch references the **SEBI (Prohibition of Insider Trading) 
Regulations, 2015** — specifically:

- **Regulation 3** — Communication or procurement of unpublished price 
sensitive information
- **Regulation 4(1)** — Prohibition on insider trading
- **Regulation 9** — Code of conduct for listed companies

This is the same regulatory framework used by SEBI's surveillance 
department and compliance teams at major financial institutions.

---

## 🔮 Future Roadmap

- [ ] Expand to 500+ NSE stocks
- [ ] Integrate real SEBI insider trading disclosures (Form C filings)
- [ ] Add options market surveillance (unusual call/put activity)
- [ ] Build email alert system for compliance officers
- [ ] Train LSTM model for more accurate anomaly detection
- [ ] Add BSE stocks and cross-market correlation
- [ ] REST API for integration with existing compliance platforms

---

## 💼 Use Cases

This system is designed for:
- **Compliance teams** at banks and asset managers monitoring suspicious activity
- **Fintech startups** building regulatory technology (RegTech) products
- **Research analysts** studying market microstructure and trading patterns
- **Regulators** looking for automated surveillance tools

---

## 👩‍💻 Built By

**Unmesha Singh** — CS Student | Kolkata, India

[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github)](https://github.com/UnmeshaSingh)
---

## ⚠️ Disclaimer

InsiderWatch is built for educational and research purposes. The detection 
algorithms simulate real surveillance techniques but should not be used as 
the sole basis for legal or financial decisions. All data is sourced from 
publicly available market feeds.
