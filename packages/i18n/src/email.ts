import { createTranslator } from './core';
import type { TranslationValues } from './format';
import type { Locale } from './locales';
import type { MessageVariables } from './message-types';

export type { MessageVariables } from './message-types';

export type EmailMessageKey =
  | 'email.brand.name'
  | 'email.brand.footer'
  | 'email.brand.fallbackLink'
  | 'email.otp.signIn.subject'
  | 'email.otp.signIn.preview'
  | 'email.otp.signIn.message'
  | 'email.otp.changeEmail.subject'
  | 'email.otp.changeEmail.preview'
  | 'email.otp.changeEmail.message'
  | 'email.otp.verifyEmail.subject'
  | 'email.otp.verifyEmail.preview'
  | 'email.otp.verifyEmail.message'
  | 'email.otp.forgotPassword.subject'
  | 'email.otp.forgotPassword.preview'
  | 'email.otp.forgotPassword.message'
  | 'email.otp.title'
  | 'email.otp.expiry'
  | 'email.verifyEmail.subject'
  | 'email.verifyEmail.preview'
  | 'email.verifyEmail.title'
  | 'email.verifyEmail.message'
  | 'email.verifyEmail.action'
  | 'email.verifyEmail.detail'
  | 'email.memberJoined.subject'
  | 'email.memberJoined.preview'
  | 'email.memberJoined.title'
  | 'email.memberJoined.message'
  | 'email.newSignIn.subject'
  | 'email.newSignIn.preview'
  | 'email.newSignIn.title'
  | 'email.newSignIn.withIp'
  | 'email.newSignIn.withoutIp'
  | 'email.newSignIn.detail'
  | 'email.invite.subject'
  | 'email.invite.preview'
  | 'email.invite.title'
  | 'email.invite.message'
  | 'email.invite.action'
  | 'email.invite.expiry'
  | 'email.readerInvite.subject'
  | 'email.readerInvite.preview'
  | 'email.readerInvite.title'
  | 'email.readerInvite.message'
  | 'email.readerInvite.action'
  | 'email.readerInvite.expiry'
  | 'email.deployment.ready.subject'
  | 'email.deployment.ready.preview'
  | 'email.deployment.ready.title'
  | 'email.deployment.ready.message'
  | 'email.deployment.ready.action'
  | 'email.deployment.failed.subject'
  | 'email.deployment.failed.preview'
  | 'email.deployment.failed.title'
  | 'email.deployment.failed.message'
  | 'email.deployment.failed.detail';

export const emailT =
  (locale: Locale) =>
  (key: EmailMessageKey, variables?: MessageVariables): string => {
    const t = createTranslator(locale);
    return t(key, variables as TranslationValues);
  };
