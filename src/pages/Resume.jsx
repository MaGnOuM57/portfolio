import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import ROICalculator from '../components/ROICalculator';
import { trackEvent } from '../utils/analytics';
import { getAccount, getClock } from '../services/alpaca';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages, 
  Mail, 
  Linkedin, 
  MapPin, 
  ExternalLink,
  Download,
  ChevronRight,
  ChevronDown,
  Rocket,
  Code,
  Cpu,
  Activity,
  FileText,
  Search,
  MessageSquare,
  Quote,
  User,
  Send,
  Zap,
  Globe,
  Wifi
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';

const LiveStatusBadge = () => {
    const { t } = useTranslation();
    const [account, setAccount] = useState(null);
    const [clock, setClock] = useState(null);
    const [performance, setPerformance] = useState(0);
    const [latency, setLatency] = useState(0);

    useEffect(() => {
        const fetchStatus = async () => {
            const start = window.performance.now();
            const [accountData, clockData] = await Promise.all([
              getAccount(),
              getClock()
            ]);
            const end = window.performance.now();
            setLatency(Math.round(end - start));

            if (accountData) {
                setAccount(accountData);
                if (accountData.equity && accountData.last_equity) {
                   const perf = ((parseFloat(accountData.equity) - parseFloat(accountData.last_equity)) / parseFloat(accountData.last_equity)) * 100;
                   setPerformance(perf);
                }
            }
            if (clockData) {
              setClock(clockData);
            }
        };
        fetchStatus();
    }, []);

    const isMarketOpen = clock?.is_open || false;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return (
        <div className="w-full max-w-5xl px-4 mt-8 md:mt-16 mx-auto">
            <div className="bg-slate-900/60 border border-emerald-500/20 rounded-3xl md:rounded-full py-6 md:py-5 px-6 md:px-16 grid grid-cols-2 md:flex items-center justify-between md:justify-around gap-6 md:gap-8 backdrop-blur-md shadow-2xl shadow-emerald-900/20">
                
                {/* 1. Latency (Tech Proof) */}
                <div className="flex flex-col md:flex-row items-center md:gap-2.5 text-center md:text-left justify-center md:justify-start">
                    <div className="flex items-center gap-2 mb-1 md:mb-0">
                        <Wifi size={16} className={latency < 100 ? "text-emerald-400" : "text-yellow-400"} />
                        <span className="uppercase tracking-wider opacity-70 text-[10px] md:text-xs text-slate-400">{t('resume.metrics.latency')}:</span>
                    </div>
                    <span className="text-white font-mono font-bold text-sm md:text-base">{latency > 0 ? `${latency}ms` : '...'}</span>
                </div>

                <div className="h-4 w-px bg-white/10 hidden md:block"></div>

                {/* 2. Market Status (Context) */}
                <div className="flex flex-col md:flex-row items-center md:gap-2.5 text-center md:text-left justify-center md:justify-start">
                    <div className="flex items-center gap-2 mb-1 md:mb-0">
                        <Briefcase size={16} className={isMarketOpen ? "text-emerald-400" : "text-slate-500"} />
                        <span className="uppercase tracking-wider opacity-70 text-[10px] md:text-xs text-slate-400">{t('resume.metrics.market_us')}:</span>
                    </div>
                    <span className={`font-bold text-sm md:text-base ${isMarketOpen ? "text-emerald-400" : "text-slate-500"}`}>{isMarketOpen ? t('resume.metrics.open') : t('resume.metrics.closed')}</span>
                </div>

                <div className="h-4 w-px bg-white/10 hidden md:block"></div>

                {/* 3. Daily Performance (Results) */}
                <div className="flex flex-col md:flex-row items-center md:gap-2.5 text-center md:text-left justify-center md:justify-start">
                    <div className="flex items-center gap-2 mb-1 md:mb-0">
                        <Activity size={16} className={performance >= 0 ? "text-emerald-400" : "text-red-400"} />
                        <span className="uppercase tracking-wider opacity-70 text-[10px] md:text-xs text-slate-400">{t('resume.metrics.daily_pnl')}:</span>
                    </div>
                    <span className={`font-mono font-bold text-sm md:text-base ${performance >= 0 ? "text-emerald-400" : "text-red-400"}`}>{performance > 0 ? '+' : ''}{performance.toFixed(2)}%</span>
                </div>

                <div className="h-4 w-px bg-white/10 hidden md:block"></div>

                {/* 4. Visitor Zone (Personalization) */}
                <div className="flex flex-col md:flex-row items-center md:gap-2.5 text-center md:text-left justify-center md:justify-start">
                    <div className="flex items-center gap-2 mb-1 md:mb-0">
                        <Globe size={14} className="text-blue-400" />
                        <span className="uppercase tracking-wider opacity-80 text-[10px] md:text-xs text-slate-400">Zone:</span>
                    </div>
                    <span className="text-emerald-50 text-sm md:text-base">{timezone.split('/')[1] || timezone}</span>
                </div>
            </div>
        </div>
    );
};


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Resume = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [contactForm, setContactForm] = useState({ name: '', email: '', company: '' });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const subject = `Prise de contact - ${contactForm.name || 'Recruteur'} (${contactForm.company || 'Entreprise'})`;
    const body = `Bonjour Jordan,\n\nJe suis ${contactForm.name} de chez ${contactForm.company}.\nTon profil m'intéresse (Expertise Automation/Data).\n\nVoici mes coordonnées pour me recontacter :\nEmail: ${contactForm.email}\n\nCordialement,`;
    
    const mailtoUrl = `mailto:jordanfaupro@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Tentative d'ouverture du client mail
    window.location.href = mailtoUrl;

    // Feedback visuel pour l'utilisateur
    alert(t('resume.email_client_opening') || "Ouverture de votre client mail en cours...");
  };

  return (
    <motion.div 
      className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 pt-20 pb-12 relative overflow-hidden"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -20 }}
      variants={containerVariants}
    >
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        
        {/* Header / Contact Info */}
        <motion.header 
          className="min-h-[calc(100vh-100px)] flex flex-col justify-center items-center text-center mb-12 md:mb-24 relative pt-8 md:pt-0" 
          variants={itemVariants}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-4 md:mb-6 tracking-tight">
              Jordan Fausta
            </h1>
          </motion.div>
          
          <motion.h2 
            className="text-xl md:text-3xl text-emerald-400 font-medium mb-6 md:mb-10 flex items-center justify-center gap-2 md:gap-3 tracking-wide"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('resume.role')}
          </motion.h2>
          
          <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed md:leading-loose text-base md:text-xl font-light mb-8 md:mb-12 px-4">
            <Trans 
              i18nKey="resume.intro"
              components={{ 
                1: <span className="text-white font-medium" />,
                2: <span className="text-white font-medium" />,
                3: <span className="text-white font-medium" />
              }}
            />
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10 md:mb-16">
            <a href="mailto:jordanfaupro@gmail.com" onClick={() => trackEvent('click_email', 'contact', 'header')} className="flex items-center gap-2 md:gap-3 text-slate-300 hover:text-emerald-400 transition-colors px-4 py-2 md:px-6 md:py-3 rounded-full bg-slate-900/50 border border-white/5 hover:border-emerald-500/30 backdrop-blur-sm">
              <Mail size={16} className="md:w-5 md:h-5" />
              <span className="text-sm font-medium">jordanfaupro@gmail.com</span>
            </a>
            <a href="https://www.linkedin.com/in/jordan-fausta" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('click_linkedin', 'social', 'header')} className="flex items-center gap-2 md:gap-3 text-slate-300 hover:text-emerald-400 transition-colors px-4 py-2 md:px-6 md:py-3 rounded-full bg-slate-900/50 border border-white/5 hover:border-emerald-500/30 backdrop-blur-sm">
              <Linkedin size={16} className="md:w-5 md:h-5" />
              <span className="text-sm font-medium">LinkedIn</span>
            </a>
            <div className="flex items-center gap-2 md:gap-3 text-slate-300 px-4 py-2 md:px-6 md:py-3 rounded-full bg-slate-900/50 border border-white/5 backdrop-blur-sm">
              <MapPin size={16} className="md:w-5 md:h-5" />
              <span className="text-sm font-medium">{t('resume.location')}</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-12 md:mb-20">
            <motion.button 
              className="inline-flex items-center gap-2 md:gap-3 px-8 py-4 md:px-10 md:py-5 bg-emerald-500/10 text-emerald-400 rounded-full hover:bg-emerald-500/20 transition-all border border-emerald-500/30 text-base md:text-lg font-medium shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { window.print(); trackEvent('download_cv', 'conversion', 'header'); }}
            >
              <Download size={20} className="md:w-[22px] md:h-[22px]" /> {t('resume.cta_download_cv')}
            </motion.button>
            
            <Link to="/projects" onClick={() => trackEvent('nav_projects', 'navigation', 'header_link')} className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-base md:text-lg">
              <span className="border-b border-transparent group-hover:border-emerald-500 transition-all">{t('resume.see_all')}</span>
              <ChevronRight size={18} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform text-emerald-500" />
            </Link>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl w-full px-4 mb-8">
            <Link to="/trading" onClick={() => trackEvent('card_click', 'navigation', 'trading')} className="group bg-slate-900/40 border border-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 hover:bg-slate-800/60 hover:border-emerald-500/40 transition-all text-left backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-emerald-500/10 text-emerald-400 rounded-lg md:rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors shadow-lg shadow-emerald-900/20">
                  <Activity size={20} className="md:w-6 md:h-6" />
                </div>
                <span className="text-[10px] md:text-[11px] font-bold font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 md:px-3 py-1 rounded-full border border-emerald-500/20">Live Demo</span>
              </div>
              <h3 className="text-white text-base md:text-lg font-bold mb-1 md:mb-2 group-hover:text-emerald-300 transition-colors">Algo Trading</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">Bot de trading autonome connecté à l'API Alpaca.</p>
            </Link>

            <Link to="/tokenization" onClick={() => trackEvent('card_click', 'navigation', 'tokenization')} className="group bg-slate-900/40 border border-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 hover:bg-slate-800/60 hover:border-blue-500/40 transition-all text-left backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-blue-500/10 text-blue-400 rounded-lg md:rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-lg shadow-blue-900/20">
                  <Code size={20} className="md:w-6 md:h-6" />
                </div>
                <span className="text-[10px] md:text-[11px] font-bold font-mono text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 md:px-3 py-1 rounded-full border border-blue-500/20">POC</span>
              </div>
              <h3 className="text-white text-base md:text-lg font-bold mb-1 md:mb-2 group-hover:text-blue-300 transition-colors">RWA Tokenization</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">Plateforme d'investissement immobilier sur Blockchain.</p>
            </Link>

            <Link to="/jobs" onClick={() => trackEvent('card_click', 'navigation', 'jobmonitor')} className="group bg-slate-900/40 border border-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 hover:bg-slate-800/60 hover:border-purple-500/40 transition-all text-left backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-purple-500/10 text-purple-400 rounded-lg md:rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-colors shadow-lg shadow-purple-900/20">
                  <Briefcase size={20} className="md:w-6 md:h-6" />
                </div>
                <span className="text-[10px] md:text-[11px] font-bold font-mono text-purple-400 uppercase tracking-widest bg-purple-500/10 px-2 md:px-3 py-1 rounded-full border border-purple-500/20">AI Tool</span>
              </div>
              <h3 className="text-white text-base md:text-lg font-bold mb-1 md:mb-2 group-hover:text-purple-300 transition-colors">Job Monitor</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">Agrégateur d'offres d'emploi avec scoring IA.</p>
            </Link>
          </div>

          <LiveStatusBadge />

          <motion.button 
            className="flex flex-col items-center gap-3 mt-12 md:mt-20 cursor-pointer group z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            onClick={() => { document.getElementById('experience').scrollIntoView({ behavior: 'smooth' }); trackEvent('scroll_experience', 'interaction', 'header'); }}
          >
            <span className="text-[10px] md:text-xs font-bold text-slate-500 font-mono tracking-[0.2em] uppercase group-hover:text-emerald-400 transition-colors duration-300">{t('resume.scroll_text')}</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="p-2 md:p-3 rounded-full bg-slate-800/50 border border-white/5 group-hover:border-emerald-500/50 group-hover:bg-slate-800 group-hover:text-emerald-400 text-slate-500 transition-all duration-300 shadow-lg"
            >
              <ChevronDown size={24} className="md:w-7 md:h-7" />
            </motion.div>
          </motion.button>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Experience Section */}
            <motion.section 
              id="experience"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="scroll-mt-24"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="p-2 bg-slate-900/50 rounded-lg border border-slate-800 text-emerald-400 shadow-lg shadow-emerald-900/10">
                  <Briefcase size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">{t('resume.experience_title')}</h3>
              </div>

              <div className="space-y-12 relative">
                {/* Timeline Line */}
                <motion.div 
                  className="absolute left-[19px] top-2 bottom-0 w-[2px] bg-gradient-to-b from-emerald-500/50 via-slate-800 to-transparent"
                  initial={{ height: 0 }}
                  whileInView={{ height: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                ></motion.div>
                
                <ExperienceItem 
                  role={t('resume.experiences.sgss.role')}
                  company={t('resume.experiences.sgss.company')}
                  period={t('resume.experiences.sgss.period')}
                  location={t('resume.experiences.sgss.location')}
                  details={t('resume.experiences.sgss.details', { returnObjects: true })}
                />

                <ExperienceItem 
                  role={t('resume.experiences.kpeye.role')}
                  company={t('resume.experiences.kpeye.company')}
                  period={t('resume.experiences.kpeye.period')}
                  location={t('resume.experiences.kpeye.location')}
                  details={t('resume.experiences.kpeye.details', { returnObjects: true })}
                />

                <ExperienceItem 
                  role={t('resume.experiences.arcelor.role')}
                  company={t('resume.experiences.arcelor.company')}
                  period={t('resume.experiences.arcelor.period')}
                  location={t('resume.experiences.arcelor.location')}
                  details={t('resume.experiences.arcelor.details', { returnObjects: true })}
                />

                <ExperienceItem 
                  role={t('resume.experiences.pumpup.role')}
                  company={t('resume.experiences.pumpup.company')}
                  period={t('resume.experiences.pumpup.period')}
                  location={t('resume.experiences.pumpup.location')}
                  details={t('resume.experiences.pumpup.details', { returnObjects: true })}
                />

                <ExperienceItem 
                  role={t('resume.experiences.interdit.role')}
                  company={t('resume.experiences.interdit.company')}
                  period={t('resume.experiences.interdit.period')}
                  location={t('resume.experiences.interdit.location')}
                  details={t('resume.experiences.interdit.details', { returnObjects: true })}
                />

              </div>
            </motion.section>

            {/* Education Section */}
            <motion.section 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <div className="absolute left-[19px] top-12 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/50 via-emerald-500/20 to-transparent"></div>
              
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/50">
                  <GraduationCap size={24} />
                </div>
                {t('resume.education_title')}
              </h3>

              <div className="space-y-8">
                {(t('resume.education_list', { returnObjects: true }) || []).map((edu, index) => (
                  <EducationItem 
                    key={index}
                    school={edu.school}
                    degree={edu.degree}
                    year={edu.year}
                  />
                ))}
              </div>
            </motion.section>

            {/* Testimonials Section */}
            <motion.section 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <div className="absolute left-[19px] top-12 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/50 via-emerald-500/20 to-transparent"></div>
              
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/50">
                  <MessageSquare size={24} />
                </div>
                {t('resume.testimonials_title')}
              </h3>

              <div className="grid grid-cols-1 gap-6 pl-8">
                {(t('resume.testimonials_list', { returnObjects: true }) || []).map((item, i) => (
                  <div key={i} className="glass-card p-8 relative group hover:-translate-y-1 transition-transform duration-300">
                    <Quote className="absolute top-6 right-6 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors" size={40} />
                    <p className="text-slate-300 italic mb-6 relative z-10 leading-relaxed">"{item.text}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-700">
                        <User size={24} />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{item.name}</div>
                        <div className="text-emerald-400 text-xs font-medium">{item.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="space-y-8">
            
            {/* Projects Section */}
            <motion.div 
              className="glass-card p-6 relative overflow-hidden group"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors"></div>
              
              <h4 className="text-sm font-bold text-white mb-6 flex items-center justify-between uppercase tracking-wider relative z-10">
                <span className="flex items-center gap-2"><Rocket className="text-blue-400" size={18} /> {t('resume.projects_autos')}</span>
                <Link to="/projects" className="flex items-center gap-1 text-[10px] normal-case font-medium text-slate-500 group-hover:text-blue-400 transition-colors hover:underline">
                  {t('resume.see_all')} <ExternalLink size={12} />
                </Link>
              </h4>
              
              <div className="space-y-4 relative z-10">
                {projects.filter(p => p.featured).slice(0, 6).map(project => (
                  <ProjectItem 
                    key={project.id}
                    id={project.id}
                    icon={React.cloneElement(project.icon, { size: 14 })}
                  />
                ))}
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div 
              className="glass-card p-6 relative overflow-hidden group"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-colors"></div>
              
              <h4 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider relative z-10">
                <Award className="text-emerald-400" size={18} /> {t('resume.key_skills')}
              </h4>
              <div className="flex flex-wrap gap-2 relative z-10">
                {['Business Intelligence', 'Automatisation', 'Innovation', 'SQL', 'Python', 'Power BI', 'Tableau', 'ETL', 'Google Analytics', 'SEO', 'Azure AI'].map((skill) => (
                  <Link 
                    key={skill} 
                    to={`/projects?tag=${encodeURIComponent(skill)}`}
                    className="px-3 py-1.5 bg-slate-800/50 text-slate-300 text-xs font-medium rounded-lg border border-slate-700/50 cursor-pointer transition-all hover:scale-105 hover:bg-[#064e3b] hover:border-[#10b981] hover:text-white hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    {skill}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Languages */}
            <motion.div 
              className="glass-card p-6 relative overflow-hidden group"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors"></div>

              <h4 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider relative z-10">
                <Languages className="text-emerald-400" size={18} /> {t('resume.languages_title')}
              </h4>
              <ul className="space-y-4 relative z-10">
                {[
                  { lang: 'Français', level: 'Native', percent: 100 },
                  { lang: 'Anglais', level: 'Full Professional', percent: 90 },
                  { lang: 'Espagnol', level: 'Limited Working', percent: 60 },
                  { lang: 'Chinois', level: 'Elementary', percent: 30 },
                  { lang: 'Créole', level: 'Native', percent: 100 }
                ].map((item) => (
                  <li key={item.lang} className="group/lang">
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                      <span>{item.lang}</span>
                      <span className="text-slate-500">{item.level}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percent}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      ></motion.div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Certifications */}
            <motion.div 
              className="glass-card p-6 relative overflow-hidden group"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-colors"></div>

              <h4 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider relative z-10">
                <Award className="text-emerald-400" size={18} /> {t('resume.certifications')}
              </h4>
              <ul className="space-y-4 relative z-10">
                {(t('resume.certifications_list', { returnObjects: true }) || []).map((cert, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs font-medium text-slate-300 group/cert hover:text-white transition-colors">
                    <div className="mt-1 p-1 rounded-full bg-emerald-500/10 text-emerald-400 group-hover/cert:bg-emerald-500 group-hover/cert:text-white transition-colors">
                      <Award size={12} />
                    </div>
                    <span className="leading-relaxed">{cert}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

          </div>
        </div>

        {/* ROI Calculator */}
        <ROICalculator />

        {/* Contact Section */}
        <motion.section className="mt-24 mb-12" variants={itemVariants}>
           <div className="glass-card p-8 md:p-12 relative overflow-hidden border-emerald-500/20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4">{t('resume.contact_title')}</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed">{t('resume.contact_subtitle')}</p>
                  
                  <div className="space-y-6">
                    <a href="mailto:jordanfaupro@gmail.com" className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors group">
                      <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <Mail size={20} />
                      </div>
                      <span className="font-medium">jordanfaupro@gmail.com</span>
                    </a>
                    <a href="https://linkedin.com/in/jordan-fausta" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors group">
                      <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <Linkedin size={20} />
                      </div>
                      <span className="font-medium">linkedin.com/in/jordan-fausta</span>
                    </a>
                  </div>
                </div>

                <form className="space-y-4 bg-slate-900/30 p-6 rounded-2xl border border-white/5 relative overflow-hidden group" onSubmit={(e) => { handleContactSubmit(e); trackEvent('contact_submit', 'conversion', 'contact_form'); }}>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap size={80} className="text-emerald-500" />
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <Zap size={18} className="text-emerald-400" /> {t('resume.contact_automation_title')}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {t('resume.contact_automation_subtitle')}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t('resume.form_name')}</label>
                      <input 
                        type="text" 
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors" 
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t('resume.form_company')}</label>
                      <input 
                        type="text" 
                        value={contactForm.company}
                        onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t('resume.form_email')}</label>
                    <input 
                      type="email" 
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors" 
                      required
                    />
                  </div>
                  
                  <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 group mt-2">
                    {t('resume.form_auto_button')} <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
           </div>
        </motion.section>

      </div>
    </motion.div>
  );
};

const ExperienceItem = ({ role, company, period, location, details }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <motion.div 
      className="relative pl-8 group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ x: 5 }}
    >
      {/* Timeline Dot */}
      <div className="absolute left-[11px] top-2 w-[18px] h-[18px] rounded-full bg-slate-950 border-2 border-emerald-500 z-10 group-hover:scale-125 group-hover:border-emerald-400 transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-0 group-hover:opacity-100"></div>
      </div>
      
      <div 
        className="glass-card p-6 hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Briefcase size={48} />
        </div>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2 relative z-10">
          <div className="pr-8">
            <h4 className="text-lg font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">{role}</h4>
            <div className="text-emerald-400 font-medium text-sm">{company}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-xs font-medium text-slate-300">
              {period}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-end gap-1">
              <MapPin size={12} /> {location}
            </div>
          </div>
          
          {/* Chevron Indicator */}
          <div className="absolute right-0 top-1 text-slate-500 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
             <ChevronDown size={20} />
          </div>
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <ul className="space-y-2 relative z-10 pt-4 border-t border-white/5 mt-4">
                {details.map((detail, index) => (
                  <li key={index} className="text-slate-400 text-sm leading-relaxed flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500/50 shrink-0"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-slate-500 mt-2 italic flex items-center gap-1 group-hover:text-emerald-400/70 transition-colors"
          >
            {t('resume.see_details')} <ChevronDown size={12} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const EducationItem = ({ school, degree, year }) => (
  <motion.div 
    className="relative pl-8 group"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5 }}
    whileHover={{ x: 5 }}
  >
    {/* Timeline Dot */}
    <div className="absolute left-[11px] top-2 w-[18px] h-[18px] rounded-full bg-slate-950 border-2 border-emerald-500 z-10 group-hover:scale-125 group-hover:border-emerald-400 transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
      <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-0 group-hover:opacity-100"></div>
    </div>
    
    <div className="glass-card p-6 hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden">
       <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <GraduationCap size={48} />
        </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 relative z-10">
        <div>
          <h4 className="text-lg font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">{school}</h4>
          <div className="text-emerald-400 font-medium text-sm">{degree}</div>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-xs font-medium text-slate-300 whitespace-nowrap">
          {year}
        </div>
      </div>
    </div>
  </motion.div>
);

const ProjectItem = ({ id, icon }) => {
  const { t } = useTranslation();
  return (
    <Link to={`/projects?id=${id}`} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-800/30 transition-colors group/item">
      <div className="mt-1 p-1.5 rounded-lg bg-blue-500/10 text-blue-400 shrink-0 group-hover/item:bg-blue-500/20 group-hover/item:text-blue-300 transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-white mb-0.5 group-hover/item:text-blue-400 transition-colors">{t(`projects_list.${id}.title`)}</h4>
        <p className="text-xs text-slate-400 leading-relaxed font-light line-clamp-3">{t(`projects_list.${id}.shortDesc`)}</p>
      </div>
    </Link>
  );
};

export default Resume;
