import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enHome  from './locales/en/home.json';
import esHome  from './locales/es/home.json';
import enAuth  from './locales/en/auth.json';
import esAuth  from './locales/es/auth.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { home: enHome, auth: enAuth},
      es: { home: esHome, auth: esAuth},
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
