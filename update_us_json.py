import urllib.request
import json
import time
from pathlib import Path

tickers = [
    'AAPL', 'NVDA', 'TSLA', 'GOOGL', 'AMZN', 'PLTR', 'AVGO', 
    'DIS', 'F', 'NKE', 'ETN', 'VOO', 'CONY'
]
names = {
    'AAPL': 'Apple Inc.', 'NVDA': 'NVIDIA Corp.', 'TSLA': 'Tesla Inc.', 
    'GOOGL': 'Alphabet Inc.', 'AMZN': 'Amazon.com Inc.', 'PLTR': 'Palantir Technologies', 
    'AVGO': 'Broadcom Inc.', 'DIS': 'Walt Disney Co.', 'F': 'Ford Motor Co.', 
    'NKE': 'Nike Inc.', 'ETN': 'Eaton Corp.', 'VOO': 'Vanguard S&P 500', 'CONY': 'YieldMax CONY'
}

quotes = []
print("Fetching US data from Yahoo...")

for code in tickers:
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{code}?interval=1d&range=1d"
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.load(resp)
        
        meta = data['chart']['result'][0]['meta']
        price = meta.get('regularMarketPrice', 0)
        prev = meta.get('previousClose', 0)
        
        # Calculate change
        change = price - prev
        rate = (change / prev) * 100 if prev else 0
        
        quotes.append({
            'code': code,
            'name': names.get(code, code),
            'price': price,
            'change': change,
            'rate': rate,
            'high': meta.get('regularMarketDayHigh', 0),
            'low': meta.get('regularMarketDayLow', 0),
            'prev': prev
        })
        print(f"Success: {code}")
            
    except Exception as e:
        print(f"Failed {code}: {e}")
        quotes.append({
            'code': code, 'name': names.get(code, code),
            'price': 0, 'change': 0, 'rate': 0.0,
            'high': 0, 'low': 0, 'prev': 0
        })
    time.sleep(0.2)

out_dir = Path('/tmp/stockmanager/data')
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / 'latest_us_prices.json'

out_file.write_text(json.dumps(quotes, ensure_ascii=False, indent=2), encoding='utf-8')
print("US JSON updated successfully.")
