import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translation_en from './locales/en.json';
import translation_es from './locales/es.json';
import translation_fr from './locales/fr.json';
import translation_pt from './locales/pt.json';
import { DEFAULT_LANGUAGE, getLanguage } from '@/flyweights/LanguageFlyweight';

export const resources = {
  [getLanguage('en').code]: {
    translation: translation_en,
  },
  [getLanguage('es').code]: {
    translation: translation_es,
  },
  [getLanguage('fr').code]: {
    translation: translation_fr,
  },
  [getLanguage('pt').code]: {
    translation: translation_pt,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || DEFAULT_LANGUAGE, // default language
    fallbackLng: getLanguage('en').code, // fallback language if translation is not found

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
