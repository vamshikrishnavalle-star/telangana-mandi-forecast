import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="mt-4 border-t border-black/5 bg-surface py-6 px-4 sm:px-8 text-center text-sm text-ink-600">
      <div className="max-w-[1240px] mx-auto space-y-3.5">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-brand-900 font-bold text-sm sm:text-base">
          <span>🌾 {language === 'te' ? 'స్మార్ట్ మండి సలహా వేదిక' : 'Smart Mandi Advisory'}</span>
          <span className="hidden sm:inline">•</span>
          <span>{t('footer.dept')}</span>
        </div>
        <p className="max-w-2xl mx-auto text-ink-600 text-xs sm:text-sm leading-relaxed">
          <strong>{language === 'te' ? 'ముఖ్య గమనిక:' : 'Advisory Disclaimer:'}</strong> {t('footer.disclaimer')}
        </p>
        <p className="text-xs text-ink-600">
          {t('footer.validation')}
        </p>
      </div>
    </footer>
  );
};
