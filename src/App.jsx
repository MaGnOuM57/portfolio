import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Globe, ChevronDown, Loader2 } from "lucide-react";
import { useTranslation } from 'react-i18next';
import Footer from "./components/Footer";
import Logo from "./components/Logo";
import ScrollToTop from "./components/ScrollToTop";
import { trackEvent } from './utils/analytics';

// Lazy Loading Pages
const Resume = React.lazy(() => import("./pages/Resume"));
const TradingPortfolio = React.lazy(() => import("./pages/TradingPortfolio"));
const JobMonitor = React.lazy(() => import("./pages/JobMonitor"));
const Projects = React.lazy(() => import("./pages/Projects"));
const Tokenization = React.lazy(() => import("./pages/Tokenization"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950">
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Loader2 size={48} className="text-emerald-500" />
    </motion.div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Resume />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tokenization" element={<Tokenization />} />
          <Route path="/trading" element={<TradingPortfolio />} />
          <Route path="/jobs" element={<JobMonitor />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30">
        <Navbar />
        <AnimatedRoutes />
        <Footer />
      </div>
    </Router>
  );
};

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('en') ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
    trackEvent('change_language', 'interaction', newLang);
  };

  const navLinks = [
    { path: '/', label: t('navbar.resume') },
    { path: '/projects', label: t('navbar.projects') },
    { 
      label: "Démos Interactives",
      children: [
        { path: '/tokenization', label: t('navbar.tokenization') },
        { path: '/trading', label: t('navbar.trading') },
        { path: '/jobs', label: t('navbar.jobs') },
      ]
    },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || isMobileMenuOpen ? "glass-nav py-3 shadow-lg shadow-emerald-900/5" : "bg-transparent py-6"}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 font-sans text-lg font-bold tracking-tight group z-50 relative">
          <Logo className="w-10 h-10 md:w-12 md:h-12" />
          <span className="text-white group-hover:text-emerald-400 transition-colors">Jordan<span className="text-slate-500 group-hover:text-slate-400">.Fausta</span></span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
          {navLinks.map((link, index) => (
            link.children ? (
              <div key={index} className="relative group">
                <button className={`flex items-center gap-1 hover:text-emerald-400 transition-colors py-2 ${link.children.some(c => c.path === location.pathname) ? 'text-white' : ''}`}>
                  {link.label} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-56 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-xl shadow-xl overflow-hidden p-1">
                    {link.children.map((child) => (
                      <Link 
                        key={child.path}
                        to={child.path}
                        className={`block px-4 py-2.5 rounded-lg text-sm hover:bg-slate-800 hover:text-emerald-400 transition-colors ${location.pathname === child.path ? 'text-emerald-400 bg-slate-800/50' : 'text-slate-400'}`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                key={link.path}
                to={link.path} 
                className={`hover:text-emerald-400 transition-colors ${location.pathname === link.path ? 'text-white' : ''}`}
              >
                {link.label}
              </Link>
            )
          ))}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-white/5 hover:border-white/10"
          >
            <Globe size={14} />
            <span className="uppercase text-xs font-bold">{i18n.language.split('-')[0]}</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden z-50 relative">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 text-slate-300 border border-white/5"
          >
            <span className="uppercase text-xs font-bold">{i18n.language.split('-')[0]}</span>
          </button>
          <button 
            className="text-slate-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 w-full bg-slate-950/95 backdrop-blur-xl border-b border-white/10 p-6 pt-24 md:hidden flex flex-col gap-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {navLinks.map((link, index) => (
                link.children ? (
                  <div key={index} className="flex flex-col gap-3">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{link.label}</span>
                    <div className="flex flex-col gap-2 pl-4 border-l border-slate-800">
                      {link.children.map((child) => (
                        <Link 
                          key={child.path}
                          to={child.path} 
                          className={`text-lg font-medium ${location.pathname === child.path ? 'text-emerald-400' : 'text-slate-400'}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`text-lg font-medium ${location.pathname === link.path ? 'text-emerald-400' : 'text-slate-400'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default App;
