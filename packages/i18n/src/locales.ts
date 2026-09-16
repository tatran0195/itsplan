export const LOCALES = ['en', 'ja'] as const;
export type Locale = (typeof LOCALES)[number];

export const INTERFACE_LOCALES = [
  { code: 'en', label: 'English', native: 'English', direction: 'ltr' },
  { code: 'ja', label: 'Japanese', native: '日本語', direction: 'ltr' },
] as const;
export type InterfaceLocale = (typeof INTERFACE_LOCALES)[number];
export type Direction = InterfaceLocale['direction'];

export const DEFAULT_LOCALE = 'en' as const satisfies Locale;
export const REQUEST_LOCALE_HEADER = 'x-repo-locale';
export const RTL_LOCALES = new Set<Locale>([]);

const localeByCode = new Map<string, InterfaceLocale>(
  INTERFACE_LOCALES.map((locale) => [locale.code.toLowerCase(), locale]),
);
const preferredByBase = new Map<string, Locale>([
  ['en', 'en'],
  ['ja', 'ja'],
]);

export const resolveLocale = (value?: string | null): Locale | null => {
  const normalized = value?.trim().replaceAll('_', '-').toLowerCase();
  if (!normalized) return null;
  const exact = localeByCode.get(normalized);
  if (exact) return exact.code;
  return preferredByBase.get(normalized.split('-')[0] ?? '') ?? null;
};

/** Resolve the interface locale sent by Paraglide, then fall back to the
 * browser's standard language preferences for clients that do not set it. */
export const resolveRequestLocale = (headers?: Headers | null): Locale => {
  const requested = resolveLocale(headers?.get(REQUEST_LOCALE_HEADER));
  if (requested) return requested;
  for (const preference of headers?.get('accept-language')?.split(',') ?? []) {
    const locale = resolveLocale(preference.split(';')[0]);
    if (locale) return locale;
  }
  return DEFAULT_LOCALE;
};

export const isRtl = (locale: Locale): boolean => RTL_LOCALES.has(locale);
export const isSupportedLocale = (value: string): value is Locale => resolveLocale(value) === value;
