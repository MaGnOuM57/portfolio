import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calculator, Clock, Coins, TrendingUp, Zap } from 'lucide-react';

const ROICalculator = () => {
  const { t } = useTranslation();
  const [secondsOnPage, setSecondsOnPage] = useState(0);
  const [hoursPerWeek, setHoursPerWeek] = useState(5);
  const [hourlyRate, setHourlyRate] = useState(50);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsOnPage(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const annualSavings = hoursPerWeek * 52 * hourlyRate;
  const tasksAutomated = Math.floor(secondsOnPage * 1.5); // Fake metric: 1.5 tasks per second

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Calculator size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{t('roi.title')}</h2>
              <p className="text-slate-400 text-sm">{t('roi.subtitle')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Inputs */}
            <div className="space-y-8">
              <div>
                <label className="flex justify-between text-sm font-medium text-slate-300 mb-4">
                  <span className="flex items-center gap-2"><Clock size={16} className="text-blue-400"/> {t('roi.hours_label')}</span>
                  <span className="text-white font-bold bg-slate-800 px-3 py-1 rounded-lg">{hoursPerWeek} h</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="40" 
                  value={hoursPerWeek} 
                  onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <p className="text-xs text-slate-500 mt-2">{t('roi.hours_hint')}</p>
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-slate-300 mb-4">
                  <span className="flex items-center gap-2"><Coins size={16} className="text-yellow-400"/> {t('roi.rate_label')}</span>
                  <span className="text-white font-bold bg-slate-800 px-3 py-1 rounded-lg">{hourlyRate} €/h</span>
                </label>
                <input 
                  type="range" 
                  min="20" 
                  max="200" 
                  step="5"
                  value={hourlyRate} 
                  onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-900/10 border border-emerald-500/20 rounded-xl p-6 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p className="text-slate-400 text-sm uppercase tracking-wider font-bold mb-2">{t('roi.annual_savings')}</p>
                <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(annualSavings)}
                </div>
                <div className="mt-2 flex items-center justify-center gap-2 text-emerald-400 text-xs font-medium">
                  <TrendingUp size={14} />
                  <span>{t('roi.potential_gain')}</span>
                </div>
              </div>

              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <Zap size={18} />
                  </div>
                  <div className="text-sm">
                    <p className="text-slate-300">{t('roi.reading_time', { seconds: secondsOnPage })}</p>
                    <p className="text-slate-500 text-xs">{t('roi.bot_work')}</p>
                  </div>
                </div>
                <div className="text-xl font-bold text-white">
                  ~{tasksAutomated} <span className="text-xs font-normal text-slate-500">tasks</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ROICalculator;
