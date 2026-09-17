import { en } from './en';
import { ja } from './ja';
import type { Locale } from '../locales';

export const messages = {
  en,
  ja,
} as const;

export type AppMessages = typeof en;
export type MessageNamespace = keyof AppMessages;

export function getAppMessages(locale: Locale): AppMessages {
  return messages[locale] ?? messages.en;
}
