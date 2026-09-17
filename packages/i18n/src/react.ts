'use client';

import { useSyncExternalStore } from 'react';
import { createTranslator, type TranslationFunction } from './core';
import { createFormatter, type Formatter } from './formatter';
import type { Locale } from './locales';
import { getClientLocale, getCurrentLocale, subscribeClientLocale } from './locale-store';
import type { MessageKey } from './message-ids';
import type { MessageVariables } from './runtime';
import { translateFn } from './translate';

export { translateFn } from './translate';
export type { TranslationFunction } from './core';
export type { Formatter } from './formatter';
export { I18nProvider, NextIntlClientProvider, useNow, type I18nProviderProps } from './provider';
export { getClientLocale, setClientLocale } from './locale-store';

function useReactiveLocale(): Locale {
  return useSyncExternalStore(subscribeClientLocale, getClientLocale, getCurrentLocale);
}

export function useLocale(): Locale {
  return useReactiveLocale();
}

export function useTranslations<Namespace extends string = string>(
  namespace?: Namespace,
): TranslationFunction {
  const locale = useReactiveLocale();
  return createTranslator(locale, namespace);
}

export function useFormatter(): Formatter {
  const locale = useReactiveLocale();
  return createFormatter(locale);
}

export function useT(): (key: MessageKey, variables?: MessageVariables) => string {
  const locale = useReactiveLocale();
  return (key: MessageKey, variables?: MessageVariables) => translateFn(key, variables, locale);
}
