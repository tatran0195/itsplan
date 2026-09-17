'use client';

import { useLocale } from '@repo/i18n';
import { enUS, ja, type Locale as DateFnsLocale } from 'date-fns/locale';

// The date-fns locale matching the interface language, for the components that
// format dates themselves (the calendar's month and weekday names).
const LOCALES: Record<string, DateFnsLocale> = {
  en: enUS,
  ja,
};

export function useDateFnsLocale(): DateFnsLocale {
  return LOCALES[useLocale()] ?? enUS;
}
