'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { isSupportedLocale, type Locale } from './locales';
import { setClientLocale } from './locale-store';

export interface I18nProviderProps {
  children: ReactNode;
  locale?: Locale | string;
  messages?: unknown;
  now?: Date | number;
  timeZone?: string;
  [key: string]: unknown;
}

export function I18nProvider({ children, locale }: I18nProviderProps) {
  if (locale && isSupportedLocale(locale)) {
    setClientLocale(locale);
  }

  useEffect(() => {
    if (locale && isSupportedLocale(locale)) {
      setClientLocale(locale);
    }
  }, [locale]);

  return <>{children}</>;
}

export const NextIntlClientProvider = I18nProvider;

export function useNow(options?: { updateInterval?: number }): Date {
  const [now, setNow] = useState(() => new Date());
  const interval = options?.updateInterval;

  useEffect(() => {
    if (!interval || interval <= 0) return;
    const timer = setInterval(() => {
      setNow(new Date());
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return now;
}
