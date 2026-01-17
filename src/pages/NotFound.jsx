import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative inline-block"
        >
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 blur-sm absolute inset-0 select-none">
            404
          </h1>
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 relative">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('not_found.title', 'Page Not Found')}
          </h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            {t('not_found.description', "Oops! The page you are looking for doesn't exist. It might have been moved or deleted.")}
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 group"
          >
            <Home size={20} />
            {t('not_found.back_home', 'Back to Home')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
