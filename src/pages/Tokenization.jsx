import React from 'react';
import { useTranslation } from 'react-i18next';
import TokenizationDemo from '../components/tokenization/TokenizationDemo';

const Tokenization = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-24 pb-12 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4">
            {t('tokenization.page_title')}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
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
