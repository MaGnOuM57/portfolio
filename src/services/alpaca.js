// PROD MODE: Calls Vercel Serverless Function (No keys in client)
const API_URL = '/api/alpaca-proxy';

export const getAccount = async () => {
  try {
    const response = await fetch(`${API_URL}?endpoint=account`);
    if (!response.ok) throw new Error('Failed to fetch account');
    return await response.json();
  } catch (error) {
    console.error('Alpaca Account Error:', error);
    return null;
  }
};

export const getClock = async () => {
  try {
    const response = await fetch(`${API_URL}?endpoint=clock`);
    if (!response.ok) throw new Error('Failed to fetch clock');
    return await response.json();
  } catch (error) {
    console.error('Alpaca Clock Error:', error);
    return null;
  }
};

export const getPortfolioHistory = async (period = '1Y') => {
  const periodMap = {
    '1W': '1W',
    '1M': '1M',
    '1Y': '1A', 
    'ALL': 'all'
  };

  try {
    const response = await fetch(`${API_URL}?endpoint=history&period=${periodMap[period] || '1A'}`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return await response.json();
  } catch (error) {
    console.error('Alpaca History Error:', error);
    return null;
  }
};

export const getMarketBars = async (symbols, timeframe = '1Day', limit = 100, start = null) => {
  try {
    const symbolsStr = Array.isArray(symbols) ? symbols.join(',') : symbols;
    let url = `${API_URL}?endpoint=bars&symbols=${symbolsStr}&limit=${limit}`;
    if (start) {
      url += `&start=${start}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch market bars');
    return await response.json();
  } catch (error) {
    console.error('Alpaca Market Data Error:', error);
    return null;
  }
};
