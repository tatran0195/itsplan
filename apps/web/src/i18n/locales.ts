import {
  DEFAULT_LOCALE,
  isRtl,
  isSupportedLocale,
  LOCALES,
  type Direction,
  type Locale,
} from '@repo/i18n/locales';

export { DEFAULT_LOCALE, LOCALES, type Direction, type Locale };

// Read on the server to render the first paint in the right language. Written by
// the language switcher next to the account preference, so a signed-out screen
// (login, invite, shared issue) keeps the last choice too.
export const LOCALE_COOKIE = 'NEXT_LOCALE';

// Each language named in itself, which is what a person scanning the list looks for.
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: '🇬🇧',
  ja: '🇯🇵',
};

export function isLocale(value: string | undefined | null): value is Locale {
  return value != null && isSupportedLocale(value);
}

// Set on <html> during the server render, so the first paint is already mirrored
// and the layout does not flip after hydration.
export function localeDirection(locale: Locale): 'ltr' | 'rtl' {
  return isRtl(locale) ? 'rtl' : 'ltr';
}
