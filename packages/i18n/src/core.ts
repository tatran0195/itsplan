import type { ReactNode } from 'react';
import { formatMessage, formatRichMessage, type TranslationValues } from './format';
import { DEFAULT_LOCALE, type Locale } from './locales';
import { messages } from './messages';

export type TranslationFunction = {
  (key: string, values?: TranslationValues): string;
  rich(key: string, values?: TranslationValues): ReactNode;
  has(key: string): boolean;
  raw(key: string): unknown;
};

function getNestedValue(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== 'object') return undefined;
  if (path in obj) return (obj as Record<string, unknown>)[path];

  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (!current || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

export function createTranslator(
  locale: Locale = DEFAULT_LOCALE,
  namespace?: string,
): TranslationFunction {
  const currentCatalog = messages[locale] ?? messages.en;
  const fallbackCatalog = messages.en;

  const resolveKey = (key: string): string => {
    return namespace ? `${namespace}.${key}` : key;
  };

  const getRaw = (key: string): unknown => {
    const fullPath = resolveKey(key);
    const val = getNestedValue(currentCatalog, fullPath);
    if (val !== undefined) return val;
    return getNestedValue(fallbackCatalog, fullPath);
  };

  const t: TranslationFunction = ((key: string, values?: TranslationValues): string => {
    const raw = getRaw(key);
    if (typeof raw === 'string') {
      return formatMessage(raw, values, locale);
    }
    // If not found or not string, return key or last part of key
    return raw !== undefined ? String(raw) : key;
  }) as TranslationFunction;

  t.rich = (key: string, values?: TranslationValues): ReactNode => {
    const raw = getRaw(key);
    if (typeof raw === 'string') {
      return formatRichMessage(raw, values, locale);
    }
    return raw !== undefined ? String(raw) : key;
  };

  t.has = (key: string): boolean => {
    const raw = getRaw(key);
    return raw !== undefined;
  };

  t.raw = (key: string): unknown => {
    return getRaw(key);
  };

  return t;
}
