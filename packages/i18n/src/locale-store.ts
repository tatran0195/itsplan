import { DEFAULT_LOCALE, isSupportedLocale, type Locale } from './locales';

let currentLocale: Locale = DEFAULT_LOCALE;
const clientListeners = new Set<() => void>();

export function getClientLocale(): Locale {
  if (typeof document !== 'undefined') {
    const lang = document.documentElement?.lang;
    if (isSupportedLocale(lang)) return lang;
  }
  return currentLocale;
}

export function setClientLocale(locale: Locale): void {
  if (!isSupportedLocale(locale)) return;
  const docLang = typeof document !== 'undefined' ? document.documentElement?.lang : undefined;
  if (currentLocale === locale && docLang === locale) return;
  currentLocale = locale;
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = locale;
  }
  for (const listener of clientListeners) {
    listener();
  }
}

export function subscribeClientLocale(listener: () => void): () => void {
  clientListeners.add(listener);
  return () => {
    clientListeners.delete(listener);
  };
}

export function getCurrentLocale(): Locale {
  if (typeof window !== 'undefined' || typeof document !== 'undefined') {
    return getClientLocale();
  }
  return currentLocale;
}
