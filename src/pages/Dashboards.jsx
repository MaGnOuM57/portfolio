import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { BarChart3, PieChart, Activity, Users, DollarSign, TrendingUp, Calendar, LayoutDashboard, FileBarChart, ShieldCheck, Box, Truck, CheckCircle, Link as LinkIcon, Lock, ShoppingCart, Percent, CreditCard, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, ComposedChart, Line, Legend } from 'recharts';

// Specific Sales Data
const salesData = [
  { name: 'Jan', revenue: 4000, margin: 24, profit: 960 },
  { name: 'Feb', revenue: 3000, margin: 28, profit: 840 },
  { name: 'Mar', revenue: 2000, margin: 35, profit: 700 }, // Low revenue but high efficiency
  { name: 'Apr', revenue: 2780, margin: 30, profit: 834 },
  { name: 'May', revenue: 1890, margin: 42, profit: 793 }, // Optimization phase
  { name: 'Jun', revenue: 2390, margin: 38, profit: 908 },
  { name: 'Jul', revenue: 3490, margin: 32, profit: 1116 },
  { name: 'Aug', revenue: 4200, margin: 31, profit: 1302 },
];

const buData = [
    { name: 'Europe', profit: 45 },
    { name: 'USA', profit: 32 },
    { name: 'Asia', profit: 18 },
    { name: 'Other', profit: 5 }
];

const DashboardCard = ({ title, children, className = "" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors ${className}`}
  >
    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
      {title}
    </h3>
    {children}
  </motion.div>
);

const StatCard = ({ icon: Icon, label, value, trend, trendUp }) => (
  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 group hover:bg-slate-800 transition-colors">
    <div className="flex justify-between items-start mb-2">
      <div className="p-2 bg-slate-700/50 rounded-lg text-slate-300 group-hover:text-white transition-colors">
        <Icon size={18} />
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
        {trend}
      </span>
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-xs text-slate-500">{label}</div>
  </div>
);

// --- ADVANCED BI SHOWCASE (Financial Bridge & Matrix) ---

const bridgeData = [
  { name: 'Total Revenue 2023', value: 120, start: 0, end: 120, type: 'total' },
  { name: 'Price Effect', value: 15, start: 120, end: 135, type: 'positive' },
  { name: 'Volume Effect', value: 8, start: 135, end: 143, type: 'positive' },
  { name: 'Mix Effect', value: -4, start: 143, end: 139, type: 'negative' },
  { name: 'FX Impact', value: -2, start: 139, end: 137, type: 'negative' },
  { name: 'Total Revenue 2024', value: 137, start: 0, end: 137, type: 'total' },
];

const matrixData = [
    { category: 'Software', sub: 'License', ytd: 45000, yoy: 12.5, var: 5000 },
    { category: 'Software', sub: 'Subscription', ytd: 75000, yoy: 25.0, var: 15000 },
    { category: 'Hardware', sub: 'Servers', ytd: 120000, yoy: -5.2, var: -6000 },
    { category: 'Hardware', sub: 'IoT Devices', ytd: 60000, yoy: 45.8, var: 18500 },
    { category: 'Services', sub: 'Consulting', ytd: 35000, yoy: 8.4, var: 2800 },
];

const AdvancedAnalyticsShowcase = () => {
  const { t } = useTranslation();
  const [selectedMeasure, setSelectedMeasure] = React.useState('Revenue');
  const [activeView, setActiveView] = React.useState('report'); // report, semantic, dax

  // Custom Waterfall Bar
  const renderCustomBar = (props) => {
    const { x, y, width, height, payload } = props;
    let fill = '#94a3b8'; // default grey for totals
    if (payload.type === 'positive') fill = '#10b981'; // green
    if (payload.type === 'negative') fill = '#ef4444'; // red
    if (payload.type === 'total') fill = '#3b82f6'; // blue
    return <rect x={x} y={y} width={width} height={height} fill={fill} rx={2} />;
  };

  const navClass = (view) => `cursor-pointer transition-colors ${activeView === view ? 'font-bold text-[#0078D4] border-b-2 border-[#0078D4] pb-1' : 'text-slate-600 hover:text-slate-900'}`;

  return (
    <div className="w-full bg-[#FAFAFA] rounded-xl shadow-2xl overflow-hidden text-slate-900 font-sans border border-slate-300">
        
        {/* Fake Power BI Toolbar - Pro Level */}
        <div className="bg-[#F3F2F1] border-b border-slate-300 px-4 py-2 flex items-center justify-between text-xs select-none">
            <div className="flex gap-4">
                <span className={navClass('report')} onClick={() => setActiveView('report')}>Report View</span>
                <span className={navClass('semantic')} onClick={() => setActiveView('semantic')}>Semantic Model</span>
                <span className={navClass('dax')} onClick={() => setActiveView('dax')}>DAX Query View</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
                <span>Last refresh: 10:42 AM</span>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
        </div>

        <div className="flex flex-col md:flex-row h-[700px] overflow-hidden">
             
             {/* CONTENT SWITCHER */}
             {activeView === 'report' && (
                 <div className="flex-1 p-6 md:p-8 bg-white overflow-y-auto h-full">
                     {/* Header & Slicers */}
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                         <div>
                             <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                 Global P&L Variance Analysis
                                 <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-xs font-normal border border-slate-300">Fiscal Year 2024</span>
                             </h2>
                             <p className="text-slate-500 text-sm mt-1">
                                 Bridge Analysis (Actual vs Budget) • <span className="font-mono text-xs bg-slate-100 px-1 rounded text-purple-600">CALCULATE(SUM(..), FILTER(..))</span>
                             </p>
                         </div>
                         <div className="flex gap-2">
                             {['Revenue', 'Gross Margin', 'EBITDA'].map(m => (
                                 <button 
                                    key={m}
                                    onClick={() => setSelectedMeasure(m)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${selectedMeasure === m ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                 >
                                     {m}
                                 </button>
                             ))}
                         </div>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         {/* CHART 1: The Waterfall */}
                         <div className="border border-slate-200 rounded-lg p-4 shadow-sm relative group h-[350px]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-700">Evolution du {selectedMeasure} (Bridge N-1 vs N)</h3>
                                <div className="text-xs text-slate-400 italic group-hover:text-purple-600 transition-colors">
                                    DAX: [Total N] = [Total N-1] + [Price] + [Vol] + [Mix]
                                </div>
                            </div>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={bridgeData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} interval={0} tick={{width: 50}} />
                                        <YAxis hide />
                                        <Tooltip 
                                            cursor={{fill: 'transparent'}}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-slate-900 text-white p-3 rounded shadow-xl text-xs">
                                                        <div className="font-bold mb-1">{data.name}</div>
                                                        <div>Impact: {data.value > 0 ? '+' : ''}{data.value}M€</div>
                                                        <div className="mt-2 text-slate-400 pt-2 border-t border-slate-700">
                                                            Start: {data.start}M • End: {data.end}M
                                                        </div>
                                                    </div>
                                                );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar dataKey="start" stackId="a" fill="transparent" />
                                        <Bar dataKey="value" stackId="a" shape={renderCustomBar} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                         </div>

                         {/* CHART 2: The Advanced Matrix */}
                         <div className="border border-slate-200 rounded-lg p-4 shadow-sm overflow-hidden flex flex-col h-[350px]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-700">Performance Matrix by BU</h3>
                                <div className="flex gap-1">
                                    <Activity size={16} className="text-slate-400" />
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3">Hierarchy / Measure</th>
                                            <th className="px-4 py-3 text-right">YTD Actual</th>
                                            <th className="px-4 py-3 text-right">YoY %</th>
                                            <th className="px-4 py-3 text-right">Var</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {matrixData.map((row, idx) => (
                                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer">
                                                <td className="px-4 py-3">
                                                    <div className="font-bold text-slate-700">{row.category}</div>
                                                    <div className="text-xs text-slate-400 pl-2">↳ {row.sub}</div>
                                                </td>
                                                <td className="px-4 py-3 text-right font-mono text-slate-600">
                                                    {row.ytd.toLocaleString()} €
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className={`inline-block px-2 py-1 rounded text-xs font-bold ${row.yoy > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                        {row.yoy > 0 ? '+' : ''}{row.yoy}%
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <span className={`text-xs ${row.var > 0 ? 'text-emerald-600' : 'text-red-600'}`}>{row.var > 0 ? '+' : ''}{row.var.toLocaleString()}</span>
                                                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden flex justify-start relative">
                                                            {row.var > 0 ? (
                                                                <div className="h-full bg-emerald-500 absolute left-0" style={{ width: `${Math.min(Math.abs(row.var)/200, 100)}%` }}></div>
                                                            ) : (
                                                                <div className="h-full bg-red-500 absolute left-0" style={{ width: `${Math.min(Math.abs(row.var)/200, 100)}%` }}></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-auto pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between">
                                 <span>Row Level Security (RLS) Active</span>
                                 <span>Source: Analysis Services</span>
                            </div>
                         </div>
                     </div>
                 </div>
             )}

             {/* SEMANTIC MODEL VIEW */}
             {activeView === 'semantic' && (
                 <div className="flex-1 bg-slate-50 p-0 overflow-auto flex items-center justify-center">
                    <div className="relative w-[800px] h-[600px] bg-slate-50 shadow-sm border border-slate-200 rounded-lg overflow-hidden shrink-0 scale-90 origin-center transition-all">
                        
                        <div className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-widest z-0">Model View • Star Schema</div>

                        {/* LINES LAYER */}
                        <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                                </marker>
                                <marker id="circle" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                                    <circle cx="4" cy="4" r="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
                                </marker>
                            </defs>
                            
                            {/* RELATIONSHIP 1: Product(Top) -> Fact(Center) */}
                            <path d="M400 160 L 400 240" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5,5" markerStart="url(#circle)" markerEnd="url(#arrowhead)" />
                            {/* RELATIONSHIP 2: Customer(Left) -> Fact(Center) */}
                            <path d="M230 300 L 300 300" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5,5" markerStart="url(#circle)" markerEnd="url(#arrowhead)" />
                            {/* RELATIONSHIP 3: Calendar(Right) -> Fact(Center) */}
                            <path d="M570 300 L 500 300" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5,5" markerStart="url(#circle)" markerEnd="url(#arrowhead)" />
                            {/* RELATIONSHIP 4: Region(Bottom) -> Fact(Center) */}
                            <path d="M400 440 L 400 360" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5,5" markerStart="url(#circle)" markerEnd="url(#arrowhead)" />
                        </svg>
                        
                        {/* DIM PRODUCT (TOP) - Center (400, 100) */}
                        <div className="absolute top-[60px] left-[310px] w-[180px] bg-white border border-slate-200 rounded shadow-sm z-10 hover:shadow-md transition-shadow cursor-default">
                            <div className="bg-emerald-50 px-3 py-2 border-b border-emerald-100 flex justify-between items-center">
                                <span className="text-xs font-bold text-emerald-800">DIM_Product</span>
                                <Box size={14} className="text-emerald-500"/>
                            </div>
                            <div className="p-2 text-[10px] text-slate-600 space-y-1 font-mono">
                                <div className="flex justify-between"><span>ProductKey</span><span className="text-slate-300">PK</span></div>
                                <div className="flex justify-between"><span>Name</span></div>
                                <div className="flex justify-between"><span>Category</span></div>
                            </div>
                        </div>
                        
                        {/* DIM CUSTOMER (LEFT) - Center (130, 300) */}
                        <div className="absolute top-[240px] left-[50px] w-[180px] bg-white border border-slate-200 rounded shadow-sm z-10 hover:shadow-md transition-shadow cursor-default">
                            <div className="bg-orange-50 px-3 py-2 border-b border-orange-100 flex justify-between items-center">
                                <span className="text-xs font-bold text-orange-800">DIM_Customer</span>
                                <Users size={14} className="text-orange-500"/>
                            </div>
                            <div className="p-2 text-[10px] text-slate-600 space-y-1 font-mono">
                                <div className="flex justify-between"><span>CustomerKey</span><span className="text-slate-300">PK</span></div>
                                <div className="flex justify-between"><span>FullName</span></div>
                                <div className="flex justify-between"><span>Segment</span></div>
                            </div>
                        </div>

                         {/* FACT TABLE (CENTER) - Center (400, 300) */}
                         <div className="absolute top-[240px] left-[300px] w-[200px] bg-white border-2 border-blue-500 rounded shadow-md z-20 hover:shadow-lg transition-shadow cursor-default">
                            <div className="bg-blue-500 text-white px-3 py-2 flex justify-between items-center">
                                <span className="text-xs font-bold">FACT_Sales</span>
                                <LayoutDashboard size={14} className="text-blue-100"/>
                            </div>
                            <div className="p-2 text-[10px] text-slate-700 space-y-1 font-mono bg-blue-50/10">
                                <div className="flex justify-between font-bold text-blue-700"><span>* SalesAmount</span><span>∑</span></div>
                                <div className="flex justify-between font-bold text-blue-700"><span>* Quantity</span><span>∑</span></div>
                                <div className="h-px bg-slate-100 my-1"></div>
                                <div className="flex justify-between text-slate-400"><span>ProductKey</span><span>FK</span></div>
                                <div className="flex justify-between text-slate-400"><span>CustomerKey</span><span>FK</span></div>
                                <div className="flex justify-between text-slate-400"><span>DateKey</span><span>FK</span></div>
                                <div className="flex justify-between text-slate-400"><span>RegionKey</span><span>FK</span></div>
                            </div>
                        </div>

                        {/* DIM CALENDAR (RIGHT) - Center (670, 300) */}
                         <div className="absolute top-[240px] right-[50px] w-[180px] bg-white border border-slate-200 rounded shadow-sm z-10 hover:shadow-md transition-shadow cursor-default">
                            <div className="bg-purple-50 px-3 py-2 border-b border-purple-100 flex justify-between items-center">
                                <span className="text-xs font-bold text-purple-800">DIM_Calendar</span>
                                <Calendar size={14} className="text-purple-500"/>
                            </div>
                            <div className="p-2 text-[10px] text-slate-600 space-y-1 font-mono">
                                <div className="flex justify-between"><span>DateKey</span><span className="text-slate-300">PK</span></div>
                                <div className="flex justify-between"><span>Date</span></div>
                                <div className="flex justify-between"><span>Year</span></div>
                                <div className="flex justify-between"><span>Month</span></div>
                            </div>
                        </div>

                        {/* DIM REGION (BOTTOM) - Center (400, 500) */}
                         <div className="absolute top-[440px] left-[310px] w-[180px] bg-white border border-slate-200 rounded shadow-sm z-10 hover:shadow-md transition-shadow cursor-default">
                            <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-800">DIM_Region</span>
                                <Truck size={14} className="text-slate-500"/>
                            </div>
                            <div className="p-2 text-[10px] text-slate-600 space-y-1 font-mono">
                                <div className="flex justify-between"><span>RegionKey</span><span className="text-slate-300">PK</span></div>
                                <div className="flex justify-between"><span>City</span></div>
                                <div className="flex justify-between"><span>Country</span></div>
                            </div>
                        </div>

                        {/* Cardinality Labels (1 and *) */}
                        <div className="absolute top-[180px] left-[380px] text-[10px] text-slate-400 font-bold bg-white px-1">1</div>
                        <div className="absolute top-[220px] left-[390px] text-[10px] text-slate-500 font-bold bg-white px-1">*</div>
                        
                        <div className="absolute top-[280px] left-[240px] text-[10px] text-slate-400 font-bold bg-white px-1">1</div>
                        <div className="absolute top-[280px] left-[290px] text-[10px] text-slate-500 font-bold bg-white px-1">*</div>

                        <div className="absolute top-[280px] right-[240px] text-[10px] text-slate-400 font-bold bg-white px-1">1</div>
                        <div className="absolute top-[280px] right-[290px] text-[10px] text-slate-500 font-bold bg-white px-1">*</div>
                        
                        <div className="absolute top-[420px] left-[380px] text-[10px] text-slate-400 font-bold bg-white px-1">1</div>
                        <div className="absolute top-[370px] left-[390px] text-[10px] text-slate-500 font-bold bg-white px-1">*</div>

                    </div>
                 </div>
             )}

             {/* DAX VIEW */}
             {activeView === 'dax' && (
                 <div className="flex-1 bg-[#1e1e1e] text-white p-0 overflow-hidden flex flex-col font-mono text-sm leading-6">
                    <div className="bg-[#2d2d2d] px-4 py-2 text-xs text-slate-300 flex items-center gap-4">
                        <span>EVALUATE</span>
                        <span className="text-green-400">run_time: 12ms</span>
                    </div>
                    <div className="p-6 overflow-auto">
                        <div className="text-slate-400 mb-4">-- Complex Measure: Dynamic EBITDA Calculation with Time Intelligence</div>
                        
                        <div><span className="text-[#569cd6]">MEASURE</span> 'Financials'[EBITDA_YoY_%] = </div>
                        <div className="pl-4">
                            <div className="text-[#569cd6]">VAR</div> CurrentEBITDA = <span className="text-[#dcdcaa]">CALCULATE</span>(
                                <span className="text-[#dcdcaa]">SUM</span>('Fact_Sales'[Amount]),
                                'Dim_Account'[Type] = <span className="text-[#ce9178]">"Revenue"</span>
                            ) - <span className="text-[#dcdcaa]">CALCULATE</span>(
                                <span className="text-[#dcdcaa]">SUM</span>('Fact_Sales'[Cost]),
                                'Dim_Account'[Type] = <span className="text-[#ce9178]">"Opex"</span>
                            )
                        </div>
                        <div className="pl-4 mt-2">
                            <div className="text-[#569cd6]">VAR</div> PreviousEBITDA = <span className="text-[#dcdcaa]">CALCULATE</span>(
                                CurrentEBITDA,
                                <span className="text-[#dcdcaa]">SAMEPERIODLASTYEAR</span>('Dim_Calendar'[Date])
                            )
                        </div>
                        <div className="pl-4 mt-2">
                             <span className="text-[#c586c0]">RETURN</span>
                        </div>
                        <div className="pl-8">
                            <span className="text-[#dcdcaa]">DIVIDE</span>(
                                CurrentEBITDA - PreviousEBITDA,
                                PreviousEBITDA,
                                <span className="text-[#b5cea8]">0</span>
                            )
                        </div>
                    </div>
                    <div className="mt-auto border-t border-[#333] p-2 bg-[#252526] text-xs text-slate-400">
                        Result: 1 Table, 1 Row
                    </div>
                 </div>
             )}

        </div>
    </div>
  );
};

// --- END ADVANCED BI SHOWCASE ---

// ... (Existing components kept for context if needed, but we replace usage)
const BlockchainTraceability = () => {
  const { t } = useTranslation();
  
  const steps = [
    { id: 1, key: 'production', icon: Box, hash: '0x7f...3a2b', time: '10:00 AM' },
    { id: 2, key: 'quality', icon: ShieldCheck, hash: '0x8a...4b1c', time: '12:30 PM' },
    { id: 3, key: 'shipping', icon: Truck, hash: '0x9c...5d2e', time: '02:15 PM' },
    { id: 4, key: 'delivery', icon: CheckCircle, hash: '0x1d...6e3f', time: '05:45 PM' },
  ];

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <LinkIcon size={120} className="text-emerald-500" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <LinkIcon size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{t('dashboards.blockchain_title')}</h3>
            <p className="text-slate-400 text-sm">{t('dashboards.blockchain_desc')}</p>
          </div>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-slate-800 md:left-0 md:right-0 md:top-8 md:h-0.5 md:w-full md:bottom-auto"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative flex md:flex-col items-center gap-4 md:gap-6 group"
              >
                {/* Icon Circle */}
                <div className="relative z-10 w-16 h-16 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center group-hover:border-emerald-500 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-500">
                  <step.icon size={24} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
                  <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-1">
                    <Lock size={12} className="text-emerald-500" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 md:text-center">
                  <h4 className="text-lg font-bold text-white mb-1">{t(`dashboards.steps.${step.key}`)}</h4>
                  <div className="flex flex-col md:items-center gap-1">
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {step.hash}
                    </span>
                    <span className="text-xs text-slate-500">{step.time}</span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-8 pointer-events-none">
                      <motion.div 
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                        className="h-0.5 bg-emerald-500"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 text-sm font-medium animate-pulse">
            <ShieldCheck size={16} />
            {t('dashboards.verified')}
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboards = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pt-24 pb-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <Trans i18nKey="dashboards.title" components={{ 1: <span className="text-emerald-400" /> }} />
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg">
            {t('dashboards.subtitle')}
          </p>
        </div>

        {/* Interactive Analytics Section - UPDATED for Business Analyst Profile */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <LayoutDashboard className="text-emerald-400" /> {t('dashboards.analytics_title')}
          </h2>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard 
              icon={Percent} 
              label={t('dashboards.total_users')} // Marge Brute
              value="32.4%" 
              trend="+2.1%" 
              trendUp={true} 
            />
            <StatCard 
              icon={DollarSign} 
              label={t('dashboards.total_revenue')} // CA
              value="$4.2M" 
              trend="+8.5%" 
              trendUp={true} 
            />
            <StatCard 
              icon={Users} 
              label={t('dashboards.active_sessions')} // CAC
              value="$145" 
              trend="-3.2%" 
              trendUp={true} // Lower Cost is Good
            />
            <StatCard 
              icon={ShoppingCart} 
              label={t('dashboards.conversion_rate')} // AOV
              value="$85.60" 
              trend="+1.2%" 
              trendUp={true} 
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart: Revenue vs Margin (Composed) */}
            <DashboardCard title={t('dashboards.revenue_overview')} className="lg:col-span-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={salesData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" name="Chiffre d'Affaires" fill="url(#colorRev)" radius={[4, 4, 0, 0]} barSize={40} />
                    <Line yAxisId="right" type="monotone" dataKey="margin" name="Marge Nette %" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill:'#10b981'}} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>

            {/* Secondary Chart: Profit by BU (Bar) */}
            <DashboardCard title={t('dashboards.user_activity')}>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={buData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                    <YAxis dataKey="name" type="category" stroke="#fff" fontSize={12} tickLine={false} axisLine={false} width={60} />
                    <Tooltip 
                      cursor={{ fill: '#1e293b', opacity: 0.5 }}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    />
                    <Bar dataKey="profit" name="Profitabilité" radius={[0, 4, 4, 0]}>
                      {buData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#3b82f6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* Power BI Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <FileBarChart className="text-[#F2C811]" /> {t('dashboards.power_bi_title')}
          </h2>
          <AdvancedAnalyticsShowcase />
        </div>

        {/* Blockchain Traceability Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <LinkIcon className="text-emerald-400" /> {t('dashboards.blockchain_title')}
          </h2>
          <BlockchainTraceability />
        </div>

      </div>
    </div>
  );
};

export default Dashboards;
