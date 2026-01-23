import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import TokenizationDemo from '../components/tokenization/TokenizationDemo';

const Tokenization = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-24 pb-12 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mb-2">
            <span className="text-emerald-400">DEMO</span>
            <span>/</span>
            <span className="text-white">
              <Trans i18nKey="tokenization.page_title" components={{ 1: <span className="text-emerald-400" /> }} />
            </span>
          </div>
          <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
             <Trans i18nKey="tokenization.page_title" components={{ 1: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 pr-2 pb-1 inline-block" /> }} />
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {t('tokenization.page_subtitle')}
          </p>
        </div>

        {/* Demo Component */}
        <TokenizationDemo />

      </div>
    </div>
  );
};

export default Tokenization;
