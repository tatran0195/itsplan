import { describe, expect, it } from 'bun:test';
import { createTranslator } from './core';
import { emailT, type EmailMessageKey } from './email';
import { LOCALES } from './locales';
import { messages } from './messages';

describe('Unified message catalogs', () => {
  it('has matching namespaces for all supported locales', () => {
    const enNamespaces = Object.keys(messages.en).sort();
    const jaNamespaces = Object.keys(messages.ja).sort();
    expect(jaNamespaces).toEqual(enNamespaces);
  });

  it('translates common keys in English and Japanese', () => {
    const tEn = createTranslator('en', 'common');
    const tJa = createTranslator('ja', 'common');

    expect(tEn('cancel')).toBe('Cancel');
    expect(tJa('cancel')).toBe('キャンセル');
    expect(tEn('save')).toBe('Save');
    expect(tJa('save')).toBe('保存');
  });

  it('translates auth keys in English and Japanese', () => {
    const tEn = createTranslator('en', 'auth');
    const tJa = createTranslator('ja', 'auth');

    expect(tEn('login.title')).toBe('Welcome back');
    expect(tJa('login.title')).toBe('おかえりなさい');
    expect(tEn('login.submit')).toBe('Sign in');
    expect(tJa('login.submit')).toBe('サインイン');
  });

  it('supports email translations with variables for all locales', () => {
    for (const locale of LOCALES) {
      const t = emailT(locale);
      const subject = t('email.otp.signIn.subject');
      const expiry = t('email.otp.expiry', { minutes: 10 });
      expect(typeof subject).toBe('string');
      expect(subject.length).toBeGreaterThan(0);
      expect(expiry).toContain('10');
    }
  });

  it('translates all email keys without missing values', () => {
    const emailKeys: EmailMessageKey[] = [
      'email.brand.name',
      'email.brand.footer',
      'email.brand.fallbackLink',
      'email.otp.signIn.subject',
      'email.otp.signIn.preview',
      'email.otp.signIn.message',
      'email.otp.title',
      'email.otp.expiry',
      'email.verifyEmail.subject',
      'email.verifyEmail.action',
      'email.memberJoined.subject',
      'email.newSignIn.subject',
      'email.invite.subject',
      'email.invite.action',
      'email.deployment.ready.subject',
      'email.deployment.failed.subject',
    ];

    for (const locale of LOCALES) {
      const t = emailT(locale);
      for (const key of emailKeys) {
        const text = t(key, {
          minutes: 10,
          days: 7,
          memberName: 'Alice',
          organizationName: 'Acme',
          role: 'Admin',
          projectName: 'Test',
          version: 1,
        });
        expect(text).not.toBe(key);
        expect(text.length).toBeGreaterThan(0);
      }
    }
  });
});
