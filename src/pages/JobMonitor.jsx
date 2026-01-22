import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { Briefcase, ExternalLink, Clock, Tag, Search, Filter, Bell, MapPin, Building2, Sparkles, CheckCircle2, XCircle, Info, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackEvent } from '../utils/analytics';
// import { getJobs } from '../services/supabase'; // Disabled for Demo Mode

const JobMonitor = () => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Mock Data for Demo - High Quality Examples
  const mockJobs = [
    {
      id: 1,
      title: "Senior Business Analyst (Finance)",
      company: "Société Générale CIB",
      location: "Paris (La Défense)",
      salary: "€65k - €80k",
      platform: "LinkedIn",
      postedAt: "15m ago",
      matchScore: 98,
      tags: ["SQL", "VBA", "Finance de Marché", "Agile"],
      url: "#"
    },
    {
      id: 2,
      title: "Data Analyst - Industrial IoT",
      company: "Airbus",
      location: "Toulouse / Remote",
      salary: "€55k - €70k",
      platform: "Welcome to the Jungle",
      postedAt: "42m ago",
      matchScore: 95,
      tags: ["Python", "PowerBI", "Predictive Maint.", "SAP"],
      url: "#"
    },
    {
      id: 3,
      title: "Chef de Projet Digital / IT",
      company: "Thales",
      location: "Bordeaux",
      salary: "€60k - €75k",
      platform: "Indeed",
      postedAt: "1h ago",
      matchScore: 92,
      tags: ["JIRA", "Scrum", "Cybersecurity", "Prince2"],
      url: "#"
    },
    {
      id: 4,
      title: "Quantitative Researcher",
      company: "Hedge Fund (Confidential)",
      location: "London (Remote)",
      salary: "£120k - £200k",
      platform: "EfinancialCareers",
      postedAt: "2h ago",
      matchScore: 88,
      tags: ["Python", "C++", "Alpha Gen", "Stats"],
      url: "#"
    },
    {
      id: 5,
      title: "Supply Chain Analyst",
      company: "Schneider Electric",
      location: "Grenoble",
      salary: "€45k - €58k",
      platform: "LinkedIn",
      postedAt: "3h ago",
      matchScore: 82,
      tags: ["Excel Expert", "Tableau", "Logistics", "SAP"],
      url: "#"
    }
  ];

  useEffect(() => {
    // Simulate loading for realism
    setLoading(true);
    const timer = setTimeout(() => {
        setJobs(mockJobs);
        setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [filter]);

  const filteredJobs = filter === 'All' ? jobs : jobs.filter(j => j.matchScore > 90);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 pt-20 pb-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Discord Reality Banner */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-sm"
        >
            <div className="flex items-start gap-4">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 mt-1 md:mt-0">
                    <MessageSquare size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        {t('job_monitor.discord_banner.title')}
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] uppercase font-bold tracking-wide">Live</span>
                    </h3>
                    <p className="text-indigo-200/80 text-sm mt-1 max-w-2xl">
                        {t('job_monitor.discord_banner.description')}
                    </p>
                </div>
            </div>
            <a 
                href="https://discord.gg/VE2wXagy"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('click_discord', 'social', 'job_monitor')}
                className="whitespace-nowrap px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
            >
                {t('job_monitor.discord_banner.button')} <ExternalLink size={16} />
            </a>
        </motion.div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
              <Link to="/" className="hover:text-emerald-400 transition-colors">{t('navbar.resume')}</Link>
              <span>/</span>
              <span className="text-white">
                <Trans i18nKey="job_monitor.title" components={{ 1: <span className="text-emerald-400" /> }} />
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              <Trans i18nKey="job_monitor.title" components={{ 1: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 pr-2 pb-2 inline-block" /> }} />
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed flex items-center gap-2 max-w-2xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"></span>
              {t('job_monitor.subtitle')}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2 bg-slate-900/50 p-1 rounded-xl border border-white/5"
          >
            {[
              { key: 'All', label: t('job_monitor.filters.all') },
              { key: 'High Match (>90%)', label: t('job_monitor.filters.high_match') }
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => { setFilter(f.key); trackEvent('filter_jobs', 'interaction', f.key); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === f.key 
                    ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            icon={<Search size={24} />} 
            value="1,240" 
            label={t('job_monitor.stats.scanned')} 
            color="blue" 
            delay={0.1}
          />
          <StatCard 
            icon={<Sparkles size={24} />} 
            value="15" 
            label={t('job_monitor.stats.matches')} 
            color="purple" 
            delay={0.2}
          />
          <StatCard 
            icon={<Clock size={24} />} 
            value="~5m" 
            label={t('job_monitor.stats.detection_time')} 
            color="emerald" 
            delay={0.3}
          />
        </div>

        {/* Job Feed */}
        <div className="space-y-4">
          <AnimatePresence mode='popLayout'>
            {loading ? (
              <div className="text-center py-12 text-slate-500">{t('job_monitor.loading')}</div>
            ) : (
              filteredJobs.map((job, index) => (
                <JobCard key={job.id} job={job} index={index} />
              ))
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label, color, delay }) => {
  const colors = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-6 flex items-center gap-5 group hover:border-white/10 transition-colors"
    >
      <div className={`p-4 rounded-2xl ${colors[color]} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div>
        <div className="text-3xl font-bold text-white tracking-tight mb-1">{value}</div>
        <div className="text-sm text-slate-500 font-medium">{label}</div>
      </div>
    </motion.div>
  );
};

const JobCard = ({ job, index }) => {
  const { t } = useTranslation();
  return (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ delay: index * 0.1 }}
    className="glass-card p-6 group relative overflow-hidden hover:border-blue-500/30 transition-all duration-300"
  >
    {/* Match Score Indicator */}
    <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-slate-800 to-slate-900">
      <div 
        className={`w-full transition-all duration-1000 ease-out ${job.matchScore > 90 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : job.matchScore > 75 ? 'bg-blue-500' : 'bg-slate-600'}`}
        style={{ height: `${job.matchScore}%` }}
      ></div>
    </div>

    <div className="flex flex-col md:flex-row gap-6 pr-4">
      {/* Left: Company Logo Placeholder & Info */}
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight mb-1">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Building2 size={14} /> {job.company}
              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
              <MapPin size={14} /> {job.location}
            </div>
          </div>
          
          {/* Mobile Match Score Badge */}
          <div className="md:hidden flex flex-col items-end">
             <span className={`text-lg font-bold ${job.matchScore > 90 ? 'text-emerald-400' : 'text-blue-400'}`}>
              {job.matchScore}%
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">{t('job_monitor.card.match')}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {job.tags.map(tag => {
             const key = tag.toLowerCase().replace(/ /g, '_').replace(/\./g, '').replace(/é/g, 'e');
             return (
              <span key={tag} className="px-2.5 py-1 rounded-md bg-slate-800/50 text-slate-300 text-xs font-medium border border-white/5 group-hover:border-white/10 transition-colors">
                {t(`tags.${key}`, tag)}
              </span>
             );
          })}
        </div>
      </div>

      {/* Right: Meta & Actions */}
      <div className="flex flex-col items-end justify-between gap-4 min-w-[140px]">
        <div className="hidden md:flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${job.matchScore > 90 ? 'text-emerald-400' : 'text-blue-400'}`}>
              {job.matchScore}%
            </span>
            <Sparkles size={16} className={job.matchScore > 90 ? 'text-emerald-400' : 'text-blue-400'} />
          </div>
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('job_monitor.card.ai_match_score')}</span>
        </div>

        <div className="flex flex-col items-end gap-1 text-xs text-slate-500 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <Clock size={12} /> {t('job_monitor.card.posted')} {job.postedAt}
          </div>
          <div className="flex items-center gap-1.5">
            <Tag size={12} /> {job.salary}
          </div>
        </div>

        <a 
          href={job.url} 
          onClick={(e) => {
            trackEvent('click_job', 'exit_link', job.platform, 1);
            if (job.url === '#' || job.url.startsWith('javascript')) {
              e.preventDefault();
              alert(t('job_monitor.demo_link_alert') || "This is a demo link. In production, this would redirect to the job board.");
            }
          }}
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full md:w-auto px-4 py-2 bg-white text-slate-950 hover:bg-blue-50 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 group/btn"
        >
          {t('job_monitor.card.apply')} <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </div>
  </motion.div>
  );
};

export default JobMonitor;
