import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Legend,
  ReferenceLine
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity, TrendingUp, DollarSign, RefreshCw, Lock, Bitcoin, Layers, Target, Zap, BarChart3, Network, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAccount, getPortfolioHistory, getMarketBars } from '../services/alpaca';

const TradingPortfolio = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('1Y');
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [equityValue, setEquityValue] = useState(0);
  const [monthlyPnL, setMonthlyPnL] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [annualPerformance, setAnnualPerformance] = useState(0);
  const [sharpeRatio, setSharpeRatio] = useState(0);
  const [marketPerformance, setMarketPerformance] = useState(0);
  const ANNUAL_TARGET = 50; // 50% target
  
  // Helper: Calculate Sharpe Ratio
  const calculateSharpeRatio = (equityCurve) => {
    if (!equityCurve || equityCurve.length < 2) return 0;

    // Calculate daily returns
    const returns = [];
    for (let i = 1; i < equityCurve.length; i++) {
      const prev = equityCurve[i - 1];
      const curr = equityCurve[i];
      if (prev > 0) {
        returns.push((curr - prev) / prev);
      }
    }

    if (returns.length === 0) return 0;

    // Average Daily Return
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;

    // Standard Deviation
    const variance = returns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) return 0;

    // Annualized Sharpe Ratio (assuming risk-free rate ~ 4% annual)
    const riskFreeRateDaily = 0.04 / 252;
    const annualizedSharpe = ((meanReturn - riskFreeRateDaily) / stdDev) * Math.sqrt(252);

    return annualizedSharpe;
  };

  // Mock Data for Fallback
  const mockChartData = [];

  // Fetch Alpaca Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const account = await getAccount();
        if (account) {
          setIsConnected(true);
          const currentEquity = parseFloat(account.equity);
          const lastEquity = parseFloat(account.last_equity);
          const dailyPnL = currentEquity - lastEquity;
          const dailyPct = lastEquity > 0 ? (dailyPnL / lastEquity) * 100 : 0;
          
          setMonthlyPnL(dailyPct); // Now storing Daily %
          setEquityValue(currentEquity); // Store absolute Equity Value
          
          // Fetch History - ALWAYS fetch 1Y to have full context for KPIs (YTD/Total)
          // We will slice this data locally for the specific Chart view (1W, 1M, etc)
          const history = await getPortfolioHistory('1Y');
          
          if (history && history.timestamp && history.timestamp.length > 0) {
            
            // 1. Map to Objects
            let rawData = history.timestamp.map((t, i) => ({
                timestamp: t,
                date: new Date(t * 1000).toLocaleDateString(),
                sysDate: new Date(t * 1000), // Keep Date Object for filtering
                value: parseFloat(history.equity[i]) || 0
            }));

            // 2. Filter Date (Start Dec 12, 2025) - GLOBAL FILTER (Project Start)
            const PROJECT_START_DATE = new Date('2025-12-12T00:00:00');
            let globalData = rawData.filter(d => d.sysDate >= PROJECT_START_DATE);
            
            // Fallback if filter removes everything
            if (globalData.length === 0) globalData = rawData;

            // 3. Clean Data (Remove unfunded periods < $500)
            const FUNDING_THRESHOLD = 500; 
            const significantStart = globalData.findIndex(d => d.value > FUNDING_THRESHOLD);
            if (significantStart !== -1) {
                globalData = globalData.slice(significantStart);
            } else {
                 setChartData([]);
                 return;
            }

            if (globalData.length === 0) return;

            // 4. Calculate Global KPIs (YTD / Total) - Based on GLOBAL DATA, not Chart View
            const globalBaseValue = globalData[0].value || 1;
            // FIX: Use currentEquity (Live) instead of history end (Yesterday Close) for the KPI calculation
            // This ensures the % matches the displayed Dollar amount perfectly.
            let globalReturnPct = ((currentEquity - globalBaseValue) / globalBaseValue) * 100;
            globalReturnPct = Number.isFinite(globalReturnPct) ? globalReturnPct : 0;
            
            // Set KPIs that should remain stable regardless of zoom
            setPortfolioValue(globalReturnPct); 
            setAnnualPerformance(globalReturnPct);

            // 5. Slice Data for Chart View (1W, 1M, etc)
            let viewData = [...globalData];
            const now = new Date();
            let viewCutoff = new Date(PROJECT_START_DATE); // Default ALL/1Y

            if (timeRange === '1W') {
                viewCutoff = new Date();
                viewCutoff.setDate(now.getDate() - 7);
            } else if (timeRange === '1M') {
                 viewCutoff = new Date();
                 viewCutoff.setDate(now.getDate() - 30);
            } else if (timeRange === '3M') {
                 viewCutoff = new Date();
                 viewCutoff.setDate(now.getDate() - 90);
            }

            // Apply View Filter (Ensure we don't go before Project Start)
            if (viewCutoff < PROJECT_START_DATE) viewCutoff = PROJECT_START_DATE;
            
            viewData = viewData.filter(d => d.sysDate >= viewCutoff);
            
            // If view slice is empty (e.g. market closed today and 1W requested but no data?), fallback to last few points
            if (viewData.length === 0) {
                 viewData = globalData.slice(-5); 
            }

            // [NEW] Append the Current Live Equity as the final Data Point for the Chart
            // This ensures the Chart Curve meets the KPI Value, even if history is laggy (yesterday close).
            if (currentEquity && viewData.length > 0) {
               const lastHistDate = viewData[viewData.length - 1].sysDate;
               const today = new Date();
               
               // Only add if the last history point is not already today
               if (lastHistDate.toDateString() !== today.toDateString()) {
                   viewData.push({
                       timestamp: Math.floor(today.getTime() / 1000),
                       date: today.toLocaleDateString(),
                       sysDate: today,
                       value: currentEquity
                   });
               } else {
                   // Update the last point if it is today (ensure it matches live equity)
                   viewData[viewData.length - 1].value = currentEquity;
               }
            }

            // 6. Normalize Chart Data (Start at 0% for the VISIBLE view)
            const viewBaseValue = viewData[0].value || 1;

            // 7. Fetch SPY Benchmark for the VIEW Period
            const startTime = viewData[0].timestamp;
            const startDateObj = new Date(startTime * 1000);
            const apiStartDate = startDateObj.toISOString().split('T')[0];

            let mergedData = [];
            let spyDataValid = false;
            let rangeAlpha = 0;

            try {
                // Fetch SPY (Buffer of 5 days before just in case of weekend start)
                const spyBars = await getMarketBars(['SPY'], '1Day', 1000, apiStartDate);
                if (spyBars && spyBars.bars && spyBars.bars['SPY']) {
                    const spyData = spyBars.bars['SPY'];
                    const spyMap = new Map();
                    spyData.forEach(bar => {
                        const d = new Date(bar.t);
                        const key = d.toISOString().split('T')[0];
                        spyMap.set(key, bar.c);
                    });
                    
                    // Find matching start price for SPY (closest to view start)
                    const spyStartBar = spyData.find(b => new Date(b.t) >= startDateObj);
                    const baseSpyValue = spyStartBar ? spyStartBar.c : spyData[0].c;

                    if (baseSpyValue > 0) {
                         spyDataValid = true;
                         
                         // Merge
                         mergedData = viewData.map(item => {
                            const d = new Date(item.timestamp * 1000);
                            const key = d.toISOString().split('T')[0];
                            const spyPrice = spyMap.get(key);
                            
                            // Portfolio % (Relative to View Start)
                            let pPct = ((item.value - viewBaseValue) / viewBaseValue) * 100;
                            pPct = Number.isFinite(pPct) ? pPct : 0;

                            // Market % (Relative to View Start)
                            let mPct = null;
                            if (spyPrice) {
                                let rawMPct = ((spyPrice - baseSpyValue) / baseSpyValue) * 100;
                                mPct = Number.isFinite(rawMPct) ? rawMPct : 0;
                            }
                            
                            return {
                                ...item,
                                value: pPct,
                                market: mPct
                            };
                        });
                        
                        // Fill Forward Market Data
                        let lastMarket = 0;
                        mergedData = mergedData.map(d => {
                            if (d.market !== null) {
                                lastMarket = d.market;
                            } else {
                                d.market = lastMarket;
                            }
                            return d;
                        });
                        
                         // Calculate Alpha for the Range (Chart Metric)
                         const finalPort = mergedData[mergedData.length - 1].value;
                         const finalMkt = mergedData[mergedData.length - 1].market;
                         rangeAlpha = finalPort - finalMkt;
                    }
                }
            } catch (err) {
                console.error("SPY Fetch Failed", err);
            }

            // Fallback if SPY failed
            if (!spyDataValid) {
                 mergedData = viewData.map(item => {
                    let pPct = ((item.value - viewBaseValue) / viewBaseValue) * 100;
                    return {
                        ...item,
                        value: Number.isFinite(pPct) ? pPct : 0,
                        market: null
                    };
                });
            }

            // Set Data
            setSharpeRatio(Number.isFinite(rangeAlpha) ? rangeAlpha : 0); // Updates Alpha based on VIEW
            setChartData(mergedData);
          }

        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [timeRange]);

  // Simulate Live Data Updates (Only if connected or mock live)
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      // Random fluctuation for portfolio
      const fluctuation = (Math.random() - 0.5) * (isConnected ? 5 : 50);
      setPortfolioValue(prev => prev + fluctuation);
      // Update PnL as well since it's Total P&L based on 100k
      setMonthlyPnL(prev => prev + fluctuation);
    }, 1500);

    return () => clearInterval(interval);
  }, [isLive, isConnected]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    // Trigger re-fetch in useEffect
  };

  return (
    <motion.div 
      className="min-h-screen bg-slate-950 text-slate-200 font-sans pt-20 pb-12 relative overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
              <Link to="/" className="hover:text-emerald-400 transition-colors">{t('navbar.resume')}</Link>
              <span>/</span>
              <span className="text-white">{t('trading.title')}</span>
            </div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
              {t('trading.header.title')}
              {isConnected && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30">ALPACA LIVE</span>}
            </h1>
            <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
              {isConnected ? t('trading.header.realtime_desc') : t('trading.header.simulation_desc')}
              {isConnected && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsLive(!isLive)}
              className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-all ${isLive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
            >
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></div>
              <span className="text-sm font-mono font-bold">{isLive ? t('trading.header.live_feed') : t('trading.header.paused')}</span>
            </button>
          </div>
        </div>

        {/* Automated Trading Explanation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/40 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-6 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Zap size={100} className="text-emerald-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-emerald-400 mb-2 flex items-center gap-2">
              <Zap size={18} /> Système de Trading Automatisé
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-4xl">
              Ce tableau de bord reflète l'activité d'un <strong>algorithme de trading autonome</strong> développé en Python. 
              Le système analyse les marchés en temps réel, exécute des stratégies basées sur l'analyse technique et fondamentale, 
              et gère le risque automatiquement via l'API Alpaca. Aucune intervention humaine n'est requise pour l'exécution des ordres affichés ici.
            </p>
          </div>
        </motion.div>


        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <KpiCard 
            title={t('trading.kpi.total_value')}  
            value={(portfolioValue > 0 ? "+" : "") + portfolioValue.toFixed(2) + "%"} 
            change={t('trading.kpi.return_global')} 
            isPositive={portfolioValue >= 0} 
            icon={<TrendingUp size={20} />} 
            animateValue={true}
          />
          <KpiCard 
            title={t('trading.kpi.pnl')} // Now "Daily Return"
            value={(monthlyPnL > 0 ? "+" : "") + monthlyPnL.toFixed(1) + "%"} 
            change={t('trading.kpi.today')} 
            isPositive={monthlyPnL >= 0} 
            icon={<Activity size={20} />} 
            animateValue={true}
          />
          
          {/* New KPI: Annual Growth Target */}
          <div className="glass-card p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-800/50 rounded-lg text-slate-400 border border-slate-700/50">
                <Target size={20} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${annualPerformance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {annualPerformance >= ANNUAL_TARGET ? t('trading.kpi.on_track') : (annualPerformance > 0 ? "Growing" : "Needs Focus")}
              </div>
            </div>
            <h3 className="text-slate-400 text-sm mb-1 font-medium">{t('trading.kpi.ytd_growth')}</h3>
            <div className="flex items-end gap-2 mb-2">
              <div className="text-2xl font-bold text-white font-mono tracking-tight">{annualPerformance.toFixed(1)}%</div>
              <div className="text-sm text-slate-500 mb-1">/ {ANNUAL_TARGET}%</div>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((annualPerformance / ANNUAL_TARGET) * 100, 100)}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* New KPI: Sharpe Ratio */}
          <KpiCard 
            title={t('trading.kpi.sharpe_ratio')} 
            value={(sharpeRatio > 0 ? "+" : "") + sharpeRatio.toFixed(2) + "%"} 
            change={sharpeRatio > 2 ? t('trading.kpi.excellent') : (sharpeRatio > 0 ? "Positive Alpha" : "Underperforming")} 
            isPositive={sharpeRatio > 0} 
            icon={<Wallet size={20} />} 
          />
        </div>

        {/* Main Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Performance Chart - Full Width */}
          <div className="lg:col-span-3 glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white tracking-tight">{t('trading.charts.performance')} vs S&P 500</h3>
              <div className="flex bg-slate-800/50 rounded-lg p-1 gap-1 border border-slate-700/50">
                {['1W', '1M', '1Y', 'ALL'].map((range) => (
                  <button
                    key={range}
                    onClick={() => handleTimeRangeChange(range)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeRange === range ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#64748b" stopOpacity={0.1}/>
                       <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255,255,255,0.1)', color: '#f1f5f9', borderRadius: '8px', backdropFilter: 'blur(8px)' }}
                    itemStyle={{ color: '#10b981' }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '0.5rem' }}
                    formatter={(value, name) => [
                      `${(value !== null && value !== undefined && Number.isFinite(value)) ? Number(value).toFixed(2) + '%' : 'N/A'}`,
                      name === 'value' ? 'Stratégie Algo' : (name === 'sp500' || name === 'market' ? 'S&P 500' : name)
                    ]}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  
                  {/* Market Benchmark Area - Made more readable: Thicker line, less transparency */}
                  <Area 
                    type="monotone" 
                    dataKey="market" 
                    name="S&P 500"
                    stroke="#94a3b8" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    fill="url(#colorMarket)"
                    fillOpacity={0}
                    animationDuration={1000}
                  />

                  {/* Portfolio Line */}
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    name="Portfolio"
                    stroke="#10b981" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    animationDuration={1000}
                  />
                  <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

const KpiCard = ({ title, value, change, isPositive, icon, animateValue }) => (
  <motion.div 
    className="glass-card p-6"
    whileHover={{ y: -5, borderColor: '#10b981' }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-800/50 rounded-lg text-slate-400 border border-slate-700/50">
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {change}
      </div>
    </div>
    <h3 className="text-slate-400 text-sm mb-1 font-medium">{title}</h3>
    <div className="text-2xl font-bold text-white font-mono tracking-tight">
      {/* Simple flash effect key could be added here if needed */}
      {value}
    </div>
  </motion.div>
);

export default TradingPortfolio;
