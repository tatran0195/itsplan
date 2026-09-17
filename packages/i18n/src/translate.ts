import { createTranslator } from './core';
import type { TranslationValues } from './format';
import type { Locale } from './locales';
import type { MessageVariables } from './message-types';

export function translateFn(key: string, variables?: MessageVariables, locale?: Locale): string {
  const t = createTranslator(locale);
  return t(key, variables as TranslationValues);
}
