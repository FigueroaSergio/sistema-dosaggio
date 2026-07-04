import { createI18n } from 'vue-i18n';
import it from './locales/it';
import es from './locales/es';

const savedLocale = localStorage.getItem('bilancia-locale') || 'it';

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'it',
  messages: { it, es },
});

export default i18n;
