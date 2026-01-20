import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { ArrowUpRight, ChevronDown, ChevronUp, Target, Zap, X } from 'lucide-react';
import { projects } from '../data/projects';
import { trackEvent } from '../utils/analytics';

const themeStyles = {
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", hoverBorder: "group-hover:border-blue-500/50", glow: "shadow-blue-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", hoverBorder: "group-hover:border-emerald-500/50", glow: "shadow-emerald-500/20" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", hoverBorder: "group-hover:border-purple-500/50", glow: "shadow-purple-500/20" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20", hoverBorder: "group-hover:border-orange-500/50", glow: "shadow-orange-500/20" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20", hoverBorder: "group-hover:border-pink-500/50", glow: "shadow-pink-500/20" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20", hoverBorder: "group-hover:border-cyan-500/50", glow: "shadow-cyan-500/20" },
};

const STATUS_CONFIG = {
  production: { 
    color: "emerald", 
    icon: <Target size={12} />, 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/20", 
    text: "text-emerald-400" 
  },
  prototype: { 
    color: "blue", 
    icon: <Zap size={12} />, 
    bg: "bg-blue-500/10", 
    border: "border-blue-500/20", 
    text: "text-blue-400" 
  },
  development: { 
    color: "amber", 
    icon: <Zap size={12} />, 
    bg: "bg-amber-500/10", 
    border: "border-amber-500/20", 
    text: "text-amber-400" 
  }
};

const ProjectCard = ({ project, index, isHighlighted }) => {
  const styles = themeStyles[project.theme];
  const statusStyle = STATUS_CONFIG[project.status] || STATUS_CONFIG.production;
  const [isExpanded, setIsExpanded] = useState(isHighlighted);
  const { t } = useTranslation();
  const cardRef = useRef(null);

  useEffect(() => {
    if (isHighlighted) {
      setIsExpanded(true);
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [isHighlighted]);
  
  return (
    <motion.div
      ref={cardRef}
      id={project.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative rounded-2xl bg-slate-900/40 backdrop-blur-xl border ${isHighlighted ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : styles.border} ${styles.hoverBorder} transition-all duration-500 overflow-hidden hover:shadow-2xl ${styles.glow} ${isExpanded ? 'row-span-2' : ''}`}
    >
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-${project.theme}-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      <div className="p-5 md:p-8 relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className={`p-3 rounded-xl ${styles.bg} ${styles.text} ring-1 ring-white/5`}>
            {project.icon}
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1.5 rounded-full ${statusStyle.bg} ${statusStyle.border} border flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${statusStyle.text} shadow-sm`}>
              {statusStyle.icon}
              {t(`projects.status.${project.status}`)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
            {t(`projects_list.${project.id}.title`)}
          </h3>
          <p className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">{t(`projects.categories.${project.category}`)}</p>
          
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6"
              >
                <p className="text-slate-300 leading-relaxed text-sm border-l-2 border-slate-700 pl-4 italic">
                  "{t(`projects_list.${project.id}.context`)}"
                </p>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-slate-800/30 p-4 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <Target size={14} /> {t('projects.challenge')}
                    </div>
                    <p className="text-slate-400 text-sm">{t(`projects_list.${project.id}.challenge`)}</p>
                  </div>
                  
                  <div className="bg-slate-800/30 p-4 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <Zap size={14} /> {t('projects.solution')}
                    </div>
                    <p className="text-slate-400 text-sm">{t(`projects_list.${project.id}.solution`)}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {t(`projects_list.${project.id}.fullDesc`)}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-slate-400 leading-relaxed text-sm line-clamp-4"
              >
                {t(`projects_list.${project.id}.shortDesc`)}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-8 mt-auto">
          {project.tech.map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-md bg-slate-800/50 border border-white/5 text-xs font-medium text-slate-300 group-hover:border-white/10 transition-colors">
              {t}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-6 border-t border-white/5">
          <button 
            onClick={() => {
              const newState = !isExpanded;
              setIsExpanded(newState);
              if (newState) trackEvent('project_expand', 'interaction', project.id);
            }}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors group/btn"
          >
            {isExpanded ? (
              <>{t('projects.read_less')} <ChevronUp size={16} /></>
            ) : (
              <>{t('projects.read_more')} <ChevronDown size={16} /></>
            )}
          </button>
          
          <div className="ml-auto flex gap-3">
            {project.demoLink && (
              project.demoLink.startsWith('http') ? (
                <a 
                  href={project.demoLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={() => trackEvent('project_demo_click', 'navigation', project.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${styles.bg} ${styles.text} text-sm font-bold hover:bg-opacity-20 transition-all group/btn`}
                >
                  {t('projects.demo')} <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              ) : (
                <Link 
                  to={project.demoLink} 
                  onClick={() => trackEvent('project_demo_click', 'navigation', project.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${styles.bg} ${styles.text} text-sm font-bold hover:bg-opacity-20 transition-all group/btn`}
                >
                  {t('projects.demo')} <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [filter, setFilter] = useState('All');
  const { t } = useTranslation();
  const location = useLocation();
  const [highlightedId, setHighlightedId] = useState(null);
  const categories = [
    { label: t('projects.filters.all'), value: 'All' },
    { label: t('projects.categories.finance_blockchain'), value: 'finance_blockchain' },
    { label: t('projects.categories.ai_automation'), value: 'ai_automation' },
    { label: t('projects.categories.web_data'), value: 'web_data' }
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tag = params.get('tag');
    const id = params.get('id');

    if (tag) {
      setFilter(`Tag: ${tag}`);
    } else if (id) {
      setHighlightedId(id);
      setFilter('All'); // Ensure the project is visible
    }
  }, [location]);

  const filteredProjects = filter.startsWith('Tag: ')
    ? projects.filter(p => p.tech.some(tech => tech.toLowerCase() === filter.replace('Tag: ', '').toLowerCase()))
    : filter === 'All' 
      ? projects 
      : projects.filter(p => p.category === filter);

  const clearFilter = () => {
    setFilter('All');
    setHighlightedId(null);
    // Remove query params without reloading
    window.history.pushState({}, '', '/projects');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 pt-20 pb-12 relative overflow-hidden">
       {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
              <Link to="/" className="hover:text-emerald-400 transition-colors">{t('footer.home')}</Link>
              <span>/</span>
              <span className="text-white">{t('navbar.projects')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              <Trans i18nKey="projects.title" components={{ 1: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500" /> }} />
            </h1>
            <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
              {t('projects.subtitle')}
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-wrap gap-2 items-center"
          >
            {filter.startsWith('Tag: ') && (
              <button
                onClick={clearFilter}
                className="px-4 py-2 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center gap-2 hover:bg-emerald-500/30 transition-all"
              >
                {filter} <X size={14} />
              </button>
            )}
            
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setFilter(cat.value);
                  setHighlightedId(null);
                  window.history.pushState({}, '', '/projects');
                  trackEvent('filter_projects', 'interaction', cat.value);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === cat.value 
                    ? 'bg-white text-slate-950 shadow-lg shadow-white/10 scale-105' 
                    : 'bg-slate-900/50 text-slate-400 border border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={index} 
                isHighlighted={project.id === highlightedId}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;
