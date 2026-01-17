import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  ShieldCheck, Users, LayoutDashboard, Wallet, Server, 
  Building2, User, Clock, ArrowRight, FileCode, Check, 
  Coins, Link as LinkIcon, Bot, Lock, Unlock, Play, AlertCircle,
  Landmark, HandCoins, Building, ArrowUpRight, ArrowDownRight,
  FileText, Download, Pause, Users as UsersIcon, FileCheck,
  Vote, LogOut, PlusCircle, Eye
} from 'lucide-react';
import { getMarketBars } from '../../services/alpaca';

// --- MOCK DATA & SIMULATION ENGINE ---
const INITIAL_NAV = 92.50; // Closer to real VNQ price
const INITIAL_HOLDINGS = 12500;

const TokenizationDemo = () => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState('pedagogy'); // pedagogy, investor, fund
  
  // Simulation State
  const [navPrice, setNavPrice] = useState(INITIAL_NAV);
  const [userHoldings, setUserHoldings] = useState(INITIAL_HOLDINGS);
  const [priceHistory, setPriceHistory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [transactions, setTransactions] = useState([
    { type: 'dividend', amount: '+ 12 500,00 €', sentiment: 'positive', hash: '0x7a...9f2b' },
    { type: 'sell', amount: '- 50 Parts', sentiment: 'negative', hash: '0x3c...1a4d' }
  ]);
  const [isSimulating, setIsSimulating] = useState(true);
  const logsContainerRef = useRef(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'invest', 'sell'
  const [modalValue, setModalValue] = useState('');

  // Scroll to bottom of logs
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // --- SIMULATION LOOP ---
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        // Fetch Real Estate ETF (VNQ) data to simulate a Real Estate Token Fund
        // Using 2024 data to ensure we have history if running in 2025
        const bars = await getMarketBars(['VNQ'], '1Day', 50);
        
        if (bars && bars.bars) {
           // Handle different key possibilities (VNQ or other)
           const key = Object.keys(bars.bars)[0];
           if (key && bars.bars[key]) {
             const realHistory = bars.bars[key].map(bar => ({
               time: new Date(bar.t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
               value: bar.c
             }));
             
             setPriceHistory(realHistory);
             setNavPrice(realHistory[realHistory.length - 1].value);
             return;
           }
        }
        
        // Fallback if no data
        console.log("No real fund data found, using fallback.");
        const MOCK_FUND_HISTORY = [
          { time: 'Jan', value: 82.50 }, { time: 'Feb', value: 83.20 }, { time: 'Mar', value: 84.10 },
          { time: 'Apr', value: 83.50 }, { time: 'May', value: 85.00 }, { time: 'Jun', value: 86.20 },
          { time: 'Jul', value: 88.50 }, { time: 'Aug', value: 89.10 }, { time: 'Sep', value: 90.50 },
          { time: 'Oct', value: 89.80 }, { time: 'Nov', value: 92.40 }, { time: 'Dec', value: 93.50 }
        ];
        setPriceHistory(MOCK_FUND_HISTORY);
        setNavPrice(MOCK_FUND_HISTORY[MOCK_FUND_HISTORY.length - 1].value);

      } catch (e) {
        console.error("Error fetching fund data:", e);
      }
    };

    fetchRealData();

    if (!isSimulating) return;

    // Only update logs occasionally
    const interval = setInterval(() => {
      // Random Background Activity (Logs only)
      if (Math.random() > 0.7) {
        addLog('tx', t('tokenization.log_new_tx', { hash: `0x${Math.random().toString(16).substr(2, 8)}` }));
      }
      if (Math.random() > 0.9) {
         addLog('block', t('tokenization.log_block_mined', { block: Math.floor(Math.random() * 100000) }));
      }
    }, 3000); 

    return () => clearInterval(interval);
  }, [isSimulating]);

  const addLog = (type, msg) => {
    setLogs(prev => [...prev, { id: Date.now(), type, msg, time: new Date().toLocaleTimeString() }]);
  };

  const handleTransaction = () => {
    const amount = parseInt(modalValue);
    if (!amount || amount <= 0) return;

    if (modalType === 'invest') {
      setUserHoldings(prev => prev + amount);
      setTransactions(prev => [{ type: t('tokenization.buy_action'), amount: `+ ${amount} ${t('tokenization.shares')}`, sentiment: 'positive', hash: `0x${Math.random().toString(16).substr(2, 8)}` }, ...prev]);
      addLog('success', t('tokenization.log_buy_success', { amount }));
    } else if (modalType === 'sell') {
      if (amount > userHoldings) {
        alert(t('tokenization.insufficient_funds'));
        return;
      }
      setUserHoldings(prev => prev - amount);
      setTransactions(prev => [{ type: t('tokenization.sell_action'), amount: `- ${amount} ${t('tokenization.shares')}`, sentiment: 'negative', hash: `0x${Math.random().toString(16).substr(2, 8)}` }, ...prev]);
      addLog('success', t('tokenization.log_sell_success', { amount }));
    }
    setModalOpen(false);
    setModalValue('');
  };

  const openModal = (type) => {
    setModalType(type);
    setModalValue(type === 'invest' ? 100 : 50);
    setModalOpen(true);
  };

  const generateReport = () => {
    addLog('admin', t('tokenization.log_gen_report'));
    setTimeout(() => {
      addLog('success', t('tokenization.log_report_done'));
      alert(t('tokenization.alert_report_downloaded'));
    }, 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[auto] lg:min-h-[800px] bg-slate-900/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 text-slate-200 font-sans shadow-2xl relative">
      
      {/* SIDEBAR */}
      <aside className="w-full lg:w-64 bg-slate-950/50 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col shrink-0 z-20">
        <div className="p-4 lg:p-6 border-b border-white/5 flex justify-between lg:block items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-900/20">
              <ShieldCheck size={18} />
            </div>
            <span className="font-extrabold text-white tracking-tight text-lg">TokenFund</span>
          </div>
          {/* Mobile Status Indicator (moved from bottom) */}
          <div className="lg:hidden bg-emerald-900/20 p-2 rounded-lg border border-emerald-500/20 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-emerald-400">{t('tokenization.network_active')}</span>
          </div>
        </div>

        <nav className="p-2 lg:p-4 grid grid-cols-3 lg:flex lg:flex-col gap-2 lg:gap-2 lg:space-y-2 overflow-x-auto">
          <NavButton 
            active={activeView === 'pedagogy'} 
            onClick={() => setActiveView('pedagogy')} 
            icon={<Users size={18} />} 
            label={t('tokenization.nav_pedagogy')} 
          />
          <NavButton 
            active={activeView === 'investor'} 
            onClick={() => setActiveView('investor')} 
            icon={<Wallet size={18} />} 
            label={t('tokenization.nav_investor')} 
          />
          <NavButton 
            active={activeView === 'fund'} 
            onClick={() => setActiveView('fund')} 
            icon={<Server size={18} />} 
            label={t('tokenization.nav_fund')} 
          />
        </nav>

        <div className="hidden lg:block p-4 border-t border-white/5 mt-auto">
          <div className="bg-emerald-900/20 p-3 rounded-lg border border-emerald-500/20 flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-emerald-400">{t('tokenization.network_active')}</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto relative bg-slate-950/30 p-4 lg:p-8 custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeView === 'pedagogy' && (
            <PedagogyView key="pedagogy" />
          )}
          {activeView === 'investor' && (
            <InvestorView 
              key="investor" 
              navPrice={navPrice} 
              priceHistory={priceHistory} 
              userHoldings={userHoldings}
              transactions={transactions}
              openModal={openModal}
            />
          )}
          {activeView === 'fund' && (
            <FundView 
              key="fund" 
              logs={logs} 
              logsContainerRef={logsContainerRef}
              generateReport={generateReport}
            />
          )}
        </AnimatePresence>
      </main>

      {/* MODAL */}
      {modalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              {modalType === 'invest' ? t('tokenization.modal_invest_title') : t('tokenization.modal_sell_title')}
            </h3>
            <p className="text-slate-400 mb-4">
              {modalType === 'invest' ? t('tokenization.modal_invest_prompt') : t('tokenization.modal_sell_prompt')}
            </p>
            <input 
              type="number" 
              value={modalValue}
              onChange={(e) => setModalValue(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white mb-6 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                {t('tokenization.cancel')}
              </button>
              <button 
                onClick={handleTransaction}
                className={`flex-1 py-2 rounded-lg font-bold text-white ${
                  modalType === 'invest' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'
                }`}
              >
                {modalType === 'invest' ? t('tokenization.buy') : t('tokenization.sell_btn')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const NavButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`w-full text-center lg:text-left px-2 lg:px-4 py-2 lg:py-3 rounded-xl font-bold transition-all duration-300 flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1 lg:gap-3 text-[10px] lg:text-base ${
      active 
        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {icon} <span className="truncate w-full lg:w-auto">{label}</span>
  </button>
);

const PedagogyView = () => {
  const { t } = useTranslation();
  return (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, y: -10 }}
    className="max-w-6xl mx-auto"
  >
    <div className="text-center mb-12">
      <h2 className="text-3xl font-extrabold text-white mb-4">{t('pedagogy.title')}</h2>
      <p className="text-slate-400 text-lg max-w-3xl mx-auto">
        {t('pedagogy.subtitle')}
      </p>
    </div>

    {/* COMPARISON */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* OLD WORLD */}
      <div className="bg-slate-900/50 p-5 md:p-8 rounded-2xl border-l-4 border-l-slate-600 border-y border-r border-white/5 shadow-lg relative overflow-hidden group hover:border-slate-500/50 transition-all">
        <div className="absolute top-0 right-0 bg-slate-700 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">{t('pedagogy.traditional')}</div>
        <h3 className="text-xl md:text-2xl font-bold text-slate-200 mb-8 flex items-center gap-3">
          <Landmark className="text-slate-500" size={28} /> {t('pedagogy.banking_maze')}
        </h3>
        
        <div className="space-y-8 relative">
          <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-700 -z-10"></div>
          
          <StepItem 
            icon={<User />} 
            title={t('pedagogy.you_investor')} 
            desc={t('pedagogy.you_want_buy')} 
            color="slate"
          />
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-slate-800 border-2 border-slate-600 rounded-full flex items-center justify-center text-slate-400 shrink-0 z-10">
              <HandCoins size={20} />
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5 w-full">
              <h4 className="font-bold text-slate-300 text-sm mb-3">{t('pedagogy.intermediaries')}</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {[t('pedagogy.broker'), t('pedagogy.bank'), t('pedagogy.clearing_house'), t('pedagogy.custodian')].map(t => (
                  <span key={t} className="text-[10px] bg-slate-900 border border-slate-700 px-2 py-1 rounded text-slate-400">{t}</span>
                ))}
              </div>
              <div className="flex flex-col gap-2 text-xs font-bold text-red-400 bg-red-500/10 p-2 rounded">
                <span className="flex items-center gap-2"><Clock size={14} /> {t('pedagogy.delay')}</span>
                <span className="flex items-center gap-2"><Coins size={14} /> {t('pedagogy.high_fees')}</span>
              </div>
            </div>
          </div>

          <StepItem 
            icon={<Building />} 
            title={t('pedagogy.asset_company')} 
            desc={t('pedagogy.share_delivered')} 
            color="slate"
          />
        </div>
      </div>

      {/* NEW WORLD */}
      <div className="bg-emerald-900/10 p-5 md:p-8 rounded-2xl border-l-4 border-l-emerald-500 border-y border-r border-emerald-500/20 shadow-lg relative overflow-hidden group hover:shadow-emerald-900/20 transition-all">
        <div className="absolute top-0 right-0 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">{t('pedagogy.tokenization')}</div>
        <h3 className="text-xl md:text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <ShieldCheck className="text-emerald-400" size={28} /> {t('pedagogy.digital_highway')}
        </h3>
        
        <div className="space-y-8 relative">
          <div className="absolute left-6 top-4 bottom-4 w-1 bg-emerald-500/30 -z-10"></div>
          
          <StepItem 
            icon={<User />} 
            title={t('pedagogy.you')} 
            desc={t('pedagogy.you_want_buy')} 
            active 
            color="emerald"
          />
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-slate-900 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 shrink-0 z-10 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <FileCode size={20} />
            </div>
            <div className="bg-emerald-900/20 p-4 rounded-xl border border-emerald-500/30 shadow-sm w-full">
              <h4 className="font-bold text-emerald-400 text-sm">{t('pedagogy.smart_contract')}</h4>
              <p className="text-xs text-slate-400 mt-1 mb-3">{t('pedagogy.smart_contract_desc')}</p>
              <div className="flex gap-3">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded"><Check size={12} /> {t('pedagogy.instant_settlement')}</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded"><Check size={12} /> {t('pedagogy.near_zero_fees')}</span>
              </div>
            </div>
          </div>

          <StepItem 
            icon={<Building />} 
            title={t('pedagogy.asset')} 
            desc={t('pedagogy.share_delivered')} 
            active 
            color="emerald"
          />
        </div>
      </div>
    </div>

    {/* DEFINITIONS */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <InfoCard 
        icon={<Coins />} 
        title={t('pedagogy.what_is_token')} 
        desc={t('pedagogy.token_desc')} 
        color="blue" 
      />
      <InfoCard 
        icon={<LinkIcon />} 
        title={t('pedagogy.what_is_blockchain')} 
        desc={t('pedagogy.blockchain_desc')} 
        color="purple" 
      />
      <InfoCard 
        icon={<Bot />} 
        title={t('pedagogy.what_is_smart_contract')} 
        desc={t('pedagogy.smart_contract_def')} 
        color="orange" 
      />
    </div>

    {/* BUSINESS MODEL */}
    <div className="mb-12">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">{t('pedagogy.business_model_title')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BusinessCard 
          number="1" 
          title={t('pedagogy.volume_effect')} 
          desc={t('pedagogy.volume_desc')}
          highlight={t('pedagogy.volume_highlight')}
          color="blue"
        />
        <BusinessCard 
          number="2" 
          title={t('pedagogy.new_tech_jobs')} 
          desc={t('pedagogy.tech_jobs_desc')}
          color="purple"
        />
        <BusinessCard 
          number="3" 
          title={t('pedagogy.improved_margin')} 
          desc={t('pedagogy.margin_desc')}
          highlight={t('pedagogy.margin_highlight')}
          color="emerald"
        />
      </div>
    </div>

    {/* TABLE */}
    <div className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/5">
        <h3 className="text-xl font-bold text-white">{t('pedagogy.tech_comparison')}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-950/50 border-b border-white/5 text-xs uppercase tracking-wider text-slate-500">
              <th className="p-4 font-bold w-1/4">{t('pedagogy.service_financial')}</th>
              <th className="p-4 font-bold w-1/3">{t('pedagogy.model_trad')}</th>
              <th className="p-4 font-bold w-1/3 text-emerald-400">{t('pedagogy.model_token')}</th>
              <th className="p-4 font-bold text-right">{t('pedagogy.advantage')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            <TableRow 
              service={t('pedagogy.custody')} 
              trad={t('pedagogy.custody_trad')} 
              token={t('pedagogy.custody_token')} 
              benefit={t('pedagogy.custody_benefit')} 
            />
            <TableRow 
              service={t('pedagogy.compliance')} 
              trad={t('pedagogy.verification_trad')} 
              token={t('pedagogy.verification_token')} 
              benefit={t('pedagogy.verification_benefit')} 
            />
            <TableRow 
              service={t('pedagogy.registry')} 
              trad={t('pedagogy.registry_trad')} 
              token={t('pedagogy.registry_token')} 
              benefit={t('pedagogy.registry_benefit')} 
            />
            <TableRow 
              service={t('pedagogy.settlement')} 
              trad={t('pedagogy.settlement_trad')} 
              token={t('pedagogy.settlement_token')} 
              benefit={t('pedagogy.settlement_benefit')} 
            />
            <tr className="bg-emerald-900/10">
              <td className="p-4 font-bold text-slate-300">{t('pedagogy.admin_costs')}</td>
              <td className="p-4 text-red-400 font-bold">{t('pedagogy.costs_high')}</td>
              <td className="p-4 text-emerald-400 font-bold">{t('pedagogy.costs_low')}</td>
              <td className="p-4 text-right text-emerald-400 font-bold">{t('pedagogy.profitability')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </motion.div>
  );
};

const InvestorView = ({ navPrice, priceHistory, userHoldings, transactions, openModal }) => {
  const { t } = useTranslation();
  const calculateDailyChange = () => {
    if (!priceHistory || priceHistory.length < 2) return 0;
    const current = priceHistory[priceHistory.length - 1].value;
    const previous = priceHistory[priceHistory.length - 2].value;
    return ((current - previous) / previous) * 100;
  };

  const change = calculateDailyChange();
  const isPositive = change >= 0;

  return (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }} 
    animate={{ opacity: 1, scale: 1 }} 
    exit={{ opacity: 0, scale: 0.95 }}
    className="max-w-7xl mx-auto flex flex-col gap-6"
  >
    {/* HEADER */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div>
        <h2 className="text-2xl font-extrabold text-white">{t('tokenization.title')}</h2>
        <p className="text-slate-500">{t('tokenization.welcome')}</p>
      </div>
      <div className="text-right self-end md:self-auto">
        <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20 flex items-center gap-2">
          <Check size={12} /> {t('tokenization.kyc_validated')}
        </span>
      </div>
    </div>

    {/* STATS & CHART */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT: STATS */}
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
        <div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">{t('tokenization.total_valuation')}</p>
          <div className="text-4xl font-extrabold text-white mb-2">
            {(userHoldings * navPrice).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} €
          </div>
          <div className={`inline-flex items-center gap-2 ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'} px-3 py-1 rounded-lg text-sm font-bold`}>
            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />} 
            {isPositive ? '+' : ''} {change.toFixed(2)}% (24h)
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{t('tokenization.holdings')}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-200">{userHoldings.toLocaleString('fr-FR')}</span>
              <span className="text-slate-500 text-xs font-medium">{t('tokenization.shares')}</span>
            </div>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{t('tokenization.nav_price')}</p>
            <div className="text-xl font-bold text-white">{navPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
          </div>
        </div>
      </div>

      {/* RIGHT: CHART */}
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 lg:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-300">{t('tokenization.portfolio_evolution')}</h3>
          <select className="bg-slate-800 border border-white/10 text-xs rounded px-2 py-1 text-slate-400">
            <option>{t('tokenization.time_1m')}</option>
            <option>{t('tokenization.time_6m')}</option>
            <option>{t('tokenization.time_1y')}</option>
          </select>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceHistory.map(p => ({...p, portfolioValue: p.value * userHoldings}))}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#10b981' }}
                formatter={(value) => [value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }), 'Valeur']}
              />
              <Area type="basis" dataKey="portfolioValue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    {/* ACTIONS */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button onClick={() => openModal('invest')} className="bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-black/20 flex items-center justify-center gap-3 transition border border-white/5">
        <PlusCircle className="text-emerald-400" /> {t('tokenization.invest')}
      </button>
      <button onClick={() => openModal('sell')} className="bg-slate-900/50 hover:bg-slate-800 text-slate-300 border border-white/10 py-4 rounded-xl font-bold text-lg shadow-sm flex items-center justify-center gap-3 transition">
        <LogOut className="text-slate-500" /> {t('tokenization.sell')}
      </button>
      <button onClick={() => alert('Vote enregistré !')} className="bg-slate-900/50 hover:bg-slate-800 text-slate-300 border border-white/10 py-4 rounded-xl font-bold text-lg shadow-sm flex items-center justify-center gap-3 transition">
        <Vote className="text-blue-500" /> {t('tokenization.vote')}
      </button>
    </div>

    {/* TRANSACTIONS */}
    <div className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-slate-950/30 flex justify-between items-center">
        <h3 className="font-bold text-slate-300">{t('tokenization.transactions_title')}</h3>
      </div>
      <div className="overflow-auto max-h-64">
        <table className="w-full text-left text-sm min-w-[500px]">
          <thead className="bg-slate-950/50 text-slate-500 uppercase text-xs font-bold sticky top-0">
            <tr>
              <th className="p-4">{t('tokenization.tx_type')}</th>
              <th className="p-4">{t('tokenization.tx_hash')}</th>
              <th className="p-4 text-right">{t('tokenization.tx_amount')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((tx, i) => (
              <tr key={i} className="hover:bg-white/5 transition">
                <td className="p-4 font-bold text-slate-300">{t(`tokenization.transactions.${tx.type}`)}</td>
                <td className="p-4 font-mono text-xs text-slate-500">{tx.hash}</td>
                <td className={`p-4 text-right font-bold ${
                  tx.sentiment === 'positive' ? 'text-emerald-400' : 'text-red-400'
                }`}>{tx.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion.div>
  );
};

const FundView = ({ logs, logsContainerRef, generateReport }) => {
  const { t } = useTranslation();
  return (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }}
    className="max-w-7xl mx-auto flex flex-col gap-6"
  >
    {/* INFO BOX */}
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
      <AlertCircle className="text-blue-400 mt-1" size={20} />
      <div>
        <h4 className="font-bold text-blue-400 text-sm">{t('tokenization.who_sees_what')}</h4>
        <p className="text-sm text-blue-300/80 mt-1">
          <Trans i18nKey="tokenization.admin_desc" /><br/>
          <span className="block mt-1 ml-2">• <strong>{t('tokenization.public_data')}</strong> {t('tokenization.public_desc')}</span>
          <span className="block ml-2">• <strong>{t('tokenization.private_actions')}</strong> {t('tokenization.private_desc')}</span>
        </p>
      </div>
    </div>

    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-extrabold text-white">{t('tokenization.admin_title')}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="bg-slate-800 text-white text-xs px-2 py-0.5 rounded font-mono border border-white/10">{t('tokenization.role_admin')}</span>
          <span className="text-slate-500 text-sm">{t('tokenization.global_view')}</span>
        </div>
      </div>
      <button onClick={generateReport} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition">
        <FileText size={18} /> {t('tokenization.generate_report')}
      </button>
    </div>

    {/* KPI CARDS */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <KpiCard title={t('tokenization.total_aum')} value="125.4 M€" color="emerald" />
      <KpiCard title={t('tokenization.investors')} value="1,248" />
      <KpiCard title={t('tokenization.circulating_shares')} value="1,254,000" />
      <KpiCard title={t('tokenization.last_block')} value="#89214" color="blue" pulse />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LIVE LEDGER */}
      <div className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden h-96 flex flex-col">
        <div className="p-4 border-b border-white/5 bg-slate-950/30 font-bold text-slate-300 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Server size={16} /> 
            <span>{t('tokenization.live_ledger')}</span>
          </div>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded font-bold flex items-center gap-1">
            <Eye size={12} /> {t('tokenization.visible_by_all')}
          </span>
        </div>
        <div 
          ref={logsContainerRef}
          className="flex-1 overflow-auto bg-black/40 p-4 font-mono text-xs text-emerald-400 custom-scrollbar"
        >
          {logs.length === 0 && <div className="opacity-50">{t('tokenization.waiting_tx')}</div>}
          {logs.map((log) => (
            <div key={log.id} className="mb-1 animate-in fade-in slide-in-from-left-2">
              <span className="opacity-50">[{log.time}]</span> {log.msg}
            </div>
          ))}
        </div>
      </div>

      {/* DOCUMENTS */}
      <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-white">{t('tokenization.regulatory_docs')}</h3>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded font-bold border border-emerald-500/20 flex items-center gap-1">
            <Lock size={10} /> {t('tokenization.admin_only')}
          </span>
        </div>
        <ul className="space-y-3 flex-1">
          <DocItem title={t('tokenization.doc_esg')} date={t('tokenization.doc_esg_date')} icon={<FileCheck />} />
          <DocItem title={t('tokenization.doc_nav')} date={t('tokenization.doc_nav_date')} icon={<FileText />} />
        </ul>
        
        <div className="mt-6 pt-6 border-t border-white/5">
          <h4 className="font-bold text-slate-400 text-sm mb-3">{t('tokenization.sensitive_actions')}</h4>
          <div className="flex gap-2">
            <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded text-xs font-bold border border-white/5 flex items-center justify-center gap-2">
              <Pause size={12} /> {t('tokenization.pause_contract')}
            </button>
            <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded text-xs font-bold border border-white/5 flex items-center justify-center gap-2">
              <UsersIcon size={12} /> {t('tokenization.whitelist')}
            </button>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
  );
};

const StepItem = ({ icon, title, desc, active, color }) => (
  <div className="flex items-start gap-4">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 ${
      color === 'emerald' 
        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' 
        : 'bg-slate-800 border-2 border-slate-600 text-slate-400'
    }`}>
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <h4 className={`font-bold ${active ? 'text-white' : 'text-slate-300'}`}>{title}</h4>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  </div>
);

const InfoCard = ({ icon, title, desc, color }) => {
  const colors = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' }
  };
  const style = colors[color];
  
  return (
    <div className={`bg-slate-900/50 p-6 rounded-xl border ${style.border} hover:-translate-y-1 transition duration-300 shadow-lg`}>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${style.bg} ${style.text}`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
};

const BusinessCard = ({ number, title, desc, highlight, color }) => {
  const colors = {
    blue: 'border-t-blue-500',
    purple: 'border-t-purple-500',
    emerald: 'border-t-emerald-500'
  };
  const textColors = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    emerald: 'text-emerald-400'
  };
  const bgColors = {
    blue: 'bg-blue-500/10 text-blue-400',
    purple: 'bg-purple-500/10 text-purple-400',
    emerald: 'bg-emerald-500/10 text-emerald-400'
  };

  return (
    <div className={`bg-slate-900/50 p-6 rounded-xl border border-white/5 ${colors[color]} border-t-4 shadow-lg`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl font-bold ${bgColors[color]}`}>
        {number}
      </div>
      <h4 className="font-bold text-lg text-white mb-2">{title}</h4>
      <p className="text-sm text-slate-400">
        {desc}
        {highlight && (
          <>
            <br/>
            <strong className={`block mt-2 ${textColors[color]}`}>{highlight}</strong>
          </>
        )}
      </p>
    </div>
  );
};

const TableRow = ({ service, trad, token, benefit }) => (
  <tr className="hover:bg-white/5 transition">
    <td className="p-4 font-bold text-slate-300">{service}</td>
    <td className="p-4 text-slate-500">{trad}</td>
    <td className="p-4 text-white font-medium">{token}</td>
    <td className="p-4 text-right text-emerald-400 font-bold">{benefit}</td>
  </tr>
);

const KpiCard = ({ title, value, color, pulse }) => {
  const { t } = useTranslation();
  return (
  <div className="bg-slate-900/50 p-4 rounded-xl border border-white/10 relative overflow-hidden">
    <div className="absolute top-2 right-2 text-slate-600 text-[10px] border border-slate-700 px-1 rounded">{t('tokenization.public')}</div>
    <div className="text-slate-500 text-xs font-bold uppercase mb-1">{title}</div>
    <div className={`text-2xl font-bold ${color === 'emerald' ? 'text-emerald-400' : color === 'blue' ? 'text-blue-400' : 'text-white'} ${pulse ? 'animate-pulse' : ''}`}>
      {value}
    </div>
  </div>
  );
};

const DocItem = ({ title, date, icon }) => (
  <li className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-white/5 hover:bg-slate-800 cursor-pointer transition group">
    <div className="flex items-center gap-3">
      <div className="text-slate-400 group-hover:text-white transition">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div>
        <div className="font-bold text-sm text-slate-200">{title}</div>
        <div className="text-xs text-slate-500">{date}</div>
      </div>
    </div>
    <Download className="text-slate-500 group-hover:text-emerald-400 transition" size={18} />
  </li>
);

export default TokenizationDemo;
