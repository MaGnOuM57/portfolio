
export default async function handler(req, res) {
  // 1. Récupération des clés secrètes depuis les variables d'environnement Vercel (Serveur uniquement)
  const KEY_ID = process.env.VITE_ALPACA_KEY_ID;
  const SECRET_KEY = process.env.VITE_ALPACA_SECRET_KEY;
  const IS_PAPER = process.env.VITE_ALPACA_PAPER === 'true';

  // Sécurité : Refuser si pas de clés
  if (!KEY_ID || !SECRET_KEY) {
    return res.status(500).json({ error: 'Server misconfigured: Missing API Keys' });
  }

  // 2. Déterminer l'URL cible (Paper ou Live)
  const BASE_URL = IS_PAPER 
    ? 'https://paper-api.alpaca.markets/v2' 
    : 'https://api.alpaca.markets/v2';
  
  const DATA_URL = 'https://data.alpaca.markets/v2';

  // 3. Routage simple selon le paramètre 'endpoint'
  const { endpoint, ...queryParams } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: 'Missing endpoint parameter' });
  }

  let targetUrl = '';
  
  // Mapping des endpoints autorisés (Sécurité: on n'autorise QUE ce dont on a besoin)
  switch (endpoint) {
    case 'account':
      targetUrl = `${BASE_URL}/account`;
      break;
    case 'clock':
      targetUrl = `${BASE_URL}/clock`;
      break;
    case 'history':
      const period = queryParams.period || '1A';
      targetUrl = `${BASE_URL}/account/portfolio/history?period=${period}&timeframe=1D`;
      break;
    case 'bars':
      // Data API (Marché)
      const symbols = queryParams.symbols;
      const limit = queryParams.limit || 100;
      targetUrl = `${DATA_URL}/stocks/bars?symbols=${symbols}&timeframe=1Day&limit=${limit}&feed=iex`;
      if (queryParams.start) targetUrl += `&start=${queryParams.start}`;
      break;
    default:
      return res.status(400).json({ error: 'Invalid endpoint' });
  }

  try {
    // 4. Appel réel vers Alpaca (Côté Serveur)
    const response = await fetch(targetUrl, {
      headers: {
        'APCA-API-KEY-ID': KEY_ID,
        'APCA-API-SECRET-KEY': SECRET_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Alpaca Error:', errorText);
        return res.status(response.status).json({ error: 'Alpaca API Error' });
    }

    const data = await response.json();
    
    // 5. Renvoi des données propres au Frontend
    // On met un cache de 60 secondes pour ne pas spammer l'API
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(data);

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
