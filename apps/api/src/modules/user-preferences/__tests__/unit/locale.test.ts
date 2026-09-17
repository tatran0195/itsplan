import { describe, expect, it } from 'bun:test';
import { localeFromAcceptLanguage } from '../../locale';

describe('localeFromAcceptLanguage', () => {
  it('uses the preferred supported language', () => {
    expect(localeFromAcceptLanguage('fr;q=0.4,ja;q=0.9,en;q=0.8')).toBe('ja');
  });

  it('matches a supported base language to a regional browser locale', () => {
    expect(localeFromAcceptLanguage('ja-JP,ja;q=0.9,en;q=0.8')).toBe('ja');
  });

  it('uses the fallback for a preferred wildcard', () => {
    expect(localeFromAcceptLanguage('de-DE,*;q=0.9,zh;q=0.8')).toBe('en');
  });

  it('falls back to English when no requested language is supported', () => {
    expect(localeFromAcceptLanguage('de-DE,fr;q=0.9')).toBe('en');
  });
});
