import { cookies, headers } from 'next/headers';
import { createTranslator, type TranslationFunction } from '@repo/i18n';
import { localeFromAcceptLanguage } from './accept-language';
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from './locales';

export async function getLocale(): Promise<Locale> {
  try {
    const cookie = (await cookies()).get(LOCALE_COOKIE)?.value;
    if (isLocale(cookie)) {
      return cookie;
    }
    const acceptLang = (await headers()).get('accept-language');
    return localeFromAcceptLanguage(acceptLang);
  } catch {
    return DEFAULT_LOCALE;
  }
}

export async function getTranslations(namespace?: string): Promise<TranslationFunction> {
  const locale = await getLocale();
  return createTranslator(locale, namespace);
}
