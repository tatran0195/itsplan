import { getAppMessages, messages, type AppMessages, type Locale } from '@repo/i18n';

export type Messages = AppMessages;

export async function loadMessages(locale: Locale): Promise<Messages> {
  return getAppMessages(locale);
}

export { messages };
