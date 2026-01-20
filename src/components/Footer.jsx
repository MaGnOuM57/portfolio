import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import { trackEvent } from '../utils/analytics';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 font-sans text-xl font-bold tracking-tight mb-4">
              <Logo className="w-10 h-10" />
              <span className="text-white">Jordan<span className="text-slate-500">.Fausta</span></span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <a href="https://linkedin.com/in/jordan-fausta" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('click_linkedin', 'social', 'footer')} className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all border border-white/5">
                <Linkedin size={18} />
              </a>
              <a href="mailto:jordanfaupro@gmail.com" onClick={() => trackEvent('click_email', 'contact', 'footer')} className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-all border border-white/5">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">{t('footer.navigation')}</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">{t('footer.home')}</Link></li>
              <li><Link to="/projects" className="hover:text-emerald-400 transition-colors">{t('footer.projects')}</Link></li>
              <li><Link to="/tokenization" className="hover:text-emerald-400 transition-colors">{t('navbar.tokenization')}</Link></li>
              <li><Link to="/jobs" className="hover:text-emerald-400 transition-colors">{t('navbar.jobs')}</Link></li>
              <li><Link to="/trading" className="hover:text-emerald-400 transition-colors">{t('footer.trading')}</Link></li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h4 className="text-white font-bold mb-6">{t('footer.contact')}</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>{t('footer.location')}</li>
              <li>jordanfaupro@gmail.com</li>
              <li className="pt-4">
                <a href="mailto:jordanfaupro@gmail.com" className="text-emerald-400 hover:underline">{t('footer.contact_me')}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {currentYear} Jordan Fausta. {t('footer.rights')}</p>
          <p className="flex items-center gap-1">
            {t('footer.made_with')} <Heart size={12} className="text-red-500 fill-red-500" /> {t('footer.and_react')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
