from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from datetime import datetime, timedelta

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

WATCHLIST = [
    "RELIANCE", "TCS", "INFY", "HDFCBANK",
    "WIPRO", "TATAMOTORS", "ADANIENT",
    "BAJFINANCE", "ICICIBANK", "SBIN"
]

CORPORATE_EVENTS = {
    "RELIANCE": [
        {"date": "2024-11-28", "event": "Merger Announcement"},
        {"date": "2024-08-15", "event": "Q1 Earnings"},
    ],
    "TCS": [
        {"date": "2024-12-30", "event": "Q3 Earnings"},
        {"date": "2024-09-10", "event": "Board Meeting"},
    ],
    "ADANIENT": [
        {"date": "2024-12-03", "event": "Acquisition Announced"},
        {"date": "2024-07-20", "event": "Q1 Earnings"},
    ],
    "WIPRO": [
        {"date": "2024-11-22", "event": "Q2 Earnings"},
        {"date": "2024-06-15", "event": "Board Meeting"},
    ],
    "INFY": [
        {"date": "2025-01-18", "event": "Q3 Earnings"},
        {"date": "2024-10-05", "event": "Acquisition Announced"},
    ],
}

def fetch_stock_data(ticker, period="3mo"):
    try:
        stock = yf.Ticker(ticker + ".NS")
        df = stock.history(period=period)
        if df.empty:
            stock = yf.Ticker(ticker)
            df = stock.history(period=period)
        return df
    except Exception as e:
        print(f"Error fetching {ticker}: {e}")
        return pd.DataFrame()

def detect_anomalies(df):
    if df.empty or len(df) < 10:
        return df

    avg_volume = df['Volume'].rolling(30, min_periods=5).mean()
    df['volume_spike'] = df['Volume'] / avg_volume
    df['price_change_pct'] = df['Close'].pct_change() * 100
    df['volume_change_pct'] = df['Volume'].pct_change() * 100
    df['volume_suspicious'] = df['volume_spike'] > 3.0

    features = df[['volume_spike', 'price_change_pct', 'volume_change_pct']].fillna(0)

    if len(features) >= 10:
        model = IsolationForest(contamination=0.05, random_state=42)
        df['ml_anomaly'] = model.fit_predict(features)
    else:
        df['ml_anomaly'] = 1

    return df

def check_pre_announcement(ticker, spike_dates):
    events = CORPORATE_EVENTS.get(ticker, [])
    results = []

    for spike_date in spike_dates:
        for event in events:
            event_date = datetime.strptime(event['date'], '%Y-%m-%d')
            spike_dt = pd.Timestamp(spike_date).to_pydatetime().replace(tzinfo=None)
            days_before = (event_date - spike_dt).days
            if 3 <= days_before <= 30:
                results.append({
                    "spike_date": str(spike_date)[:10],
                    "event": event['event'],
                    "event_date": event['date'],
                    "days_before": days_before
                })

    return results

def calculate_risk_score(df, ticker):
    if df.empty:
        return 0, [], []

    reasons = []
    score = 0

    max_spike = df['volume_spike'].max() if 'volume_spike' in df.columns else 0
    if max_spike > 5:
        score += 35
        reasons.append(f"Volume {max_spike:.1f}x above 30-day average")
    elif max_spike > 3:
        score += 20
        reasons.append(f"Volume {max_spike:.1f}x above 30-day average")

    if 'ml_anomaly' in df.columns:
        anomaly_count = (df['ml_anomaly'] == -1).sum()
        if anomaly_count > 3:
            score += 25
            reasons.append(f"ML model flagged {anomaly_count} statistical anomalies")
        elif anomaly_count > 0:
            score += 15
            reasons.append(f"ML model flagged {anomaly_count} anomaly")

    spike_dates = df[df['volume_suspicious']].index.tolist() if 'volume_suspicious' in df.columns else []
    pre_announcements = check_pre_announcement(ticker, spike_dates)
    if pre_announcements:
        score += 40
        pa = pre_announcements[0]
        reasons.append(f"Trade occurred {pa['days_before']} days before {pa['event']}")

    return min(score, 100), reasons, pre_announcements

@app.get("/")
def root():
    return {"message": "InsiderWatch API is live!"}

@app.get("/api/stock/{ticker}")
def get_stock(ticker: str):
    ticker = ticker.upper()
    df = fetch_stock_data(ticker)

    if df.empty:
        return {"error": f"Could not fetch data for {ticker}"}

    df = detect_anomalies(df)
    risk_score, reasons, pre_announcements = calculate_risk_score(df, ticker)

    prices = [round(float(p), 2) for p in df['Close'].tolist()]
    volumes = [int(v) for v in df['Volume'].tolist()]
    dates = [str(d)[:10] for d in df.index.tolist()]
    suspicious = df['volume_suspicious'].tolist() if 'volume_suspicious' in df.columns else []
    ml_flags = (df['ml_anomaly'] == -1).tolist() if 'ml_anomaly' in df.columns else []
    avg_volume = int(df['Volume'].mean())

    return {
        "ticker": ticker,
        "prices": prices,
        "volumes": volumes,
        "dates": dates,
        "suspicious_flags": suspicious,
        "ml_flags": ml_flags,
        "avg_volume": avg_volume,
        "risk_score": risk_score,
        "reasons": reasons,
        "pre_announcements": pre_announcements,
        "current_price": prices[-1] if prices else 0,
        "price_change": round(prices[-1] - prices[-2], 2) if len(prices) > 1 else 0,
    }

@app.get("/api/alerts")
def get_alerts():
    alerts = []
    for ticker in WATCHLIST[:6]:
        df = fetch_stock_data(ticker, period="1mo")
        if not df.empty:
            df = detect_anomalies(df)
            risk_score, reasons, _ = calculate_risk_score(df, ticker)
            if risk_score > 30:
                alerts.append({
                    "ticker": ticker,
                    "risk_score": risk_score,
                    "reason": reasons[0] if reasons else "Anomaly detected",
                    "level": "high" if risk_score >= 70 else "medium" if risk_score >= 40 else "low"
                })

    alerts.sort(key=lambda x: x['risk_score'], reverse=True)
    return {"alerts": alerts}

@app.get("/api/watchlist")
def get_watchlist():
    return {"watchlist": WATCHLIST}