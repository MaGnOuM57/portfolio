import yfinance as yf
import pandas as pd
import json
import sys

# List of assets from the portfolio
assets = [
    'AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMD', 'META', # Tech
    'TSLA', 'AMZN', 'COST', # Consumer/Auto
    'JPM', 'BAC', 'V', 'MA', 'GS', 'BLK', # Finance
    'XOM', 'CVX', 'COP', # Energy
    'JNJ', 'PFE', 'UNH', 'LLY', 'MRK', 'ABBV', # Health
    'KO', 'PEP', 'WMT', # Consumer Staples
    'BTC-USD', 'ETH-USD', 'SOL-USD', # Crypto
    'COIN', 'MSTR', 'PLTR', 'MARA', 'RIOT', 'DKNG' # High Beta / Crypto Proxy
]

def get_correlations():
    print("Fetching data...")
    try:
        # Download data for the last 6 months
        # Use auto_adjust=True to avoid the warning and get adjusted close directly if possible, 
        # but yfinance structure might vary. Let's stick to simple download and handle errors.
        data = yf.download(assets, period="6mo", interval="1d")
        
        # Handle multi-level columns if present (yfinance often returns (Price, Ticker))
        if isinstance(data.columns, pd.MultiIndex):
            if 'Adj Close' in data.columns.levels[0]:
                data = data['Adj Close']
            elif 'Close' in data.columns.levels[0]:
                data = data['Close']
            else:
                # Fallback, just take the first level if it looks like price
                data = data.iloc[:, 0] 
        elif 'Adj Close' in data.columns:
            data = data['Adj Close']
        
        # Drop columns that are all NaN (failed downloads)
        data = data.dropna(axis=1, how='all')
        
        # Calculate daily returns
        # fill_method=None to suppress warning, handle NaNs after
        returns = data.pct_change(fill_method=None)
        
        # Calculate correlation matrix (pandas corr handles NaNs by ignoring them pairwise usually)
        corr_matrix = returns.corr()
        
        links = []
        nodes = []
        
        # Create Nodes list from the columns we actually have
        valid_assets = corr_matrix.columns.tolist()
        
        for asset in valid_assets:
            display_name = asset.replace('-USD', '')
            # Simple sector mapping based on known list
            group = "Unknown"
            if asset in ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMD', 'META', 'PLTR']: group = 'Tech'
            elif asset in ['TSLA', 'AMZN', 'COST', 'DKNG']: group = 'Consumer'
            elif asset in ['JPM', 'BAC', 'V', 'MA', 'GS', 'BLK']: group = 'Finance'
            elif asset in ['XOM', 'CVX', 'COP']: group = 'Energy'
            elif asset in ['JNJ', 'PFE', 'UNH', 'LLY', 'MRK', 'ABBV']: group = 'Health'
            elif asset in ['KO', 'PEP', 'WMT']: group = 'Consumer'
            elif asset in ['BTC-USD', 'ETH-USD', 'SOL-USD', 'COIN', 'MSTR', 'MARA', 'RIOT']: group = 'Crypto'
            
            nodes.append({"id": display_name, "group": group})

        # Create Links
        cols = corr_matrix.columns
        for i in range(len(cols)):
            for j in range(i + 1, len(cols)):
                val = corr_matrix.iloc[i, j]
                # Check if val is NaN
                if pd.isna(val): continue
                
                if abs(val) > 0.5: # Threshold
                    source = cols[i].replace('-USD', '')
                    target = cols[j].replace('-USD', '')
                    links.append({
                        "source": source,
                        "target": target,
                        "value": round(float(val), 2),
                        "isPositive": bool(val > 0)
                    })
        
        output = {
            "nodes": nodes,
            "links": links
        }
        
        # Write to src/data/correlations.json
        output_path = os.path.join('src', 'data', 'correlations.json')
        with open(output_path, 'w') as f:
            json.dump(output, f, indent=2)
            
        print(f"Successfully updated {output_path}")
        
        # Also save to a file for easy reading
        with open('correlation_data.json', 'w') as f:
            json.dump(output, f, indent=2)
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Check if yfinance is installed
    try:
        import yfinance
        get_correlations()
    except ImportError:
        print("yfinance not found. Please run: pip install yfinance")
