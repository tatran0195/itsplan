import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { localeFromAcceptLanguage } from './accept-language';

describe('localeFromAcceptLanguage', () => {
  it('uses the preferred supported language', () => {
    assert.equal(localeFromAcceptLanguage('fr;q=0.4,ja;q=0.9,en;q=0.8'), 'ja');
  });

  it('matches a supported base language to a regional browser locale', () => {
    assert.equal(localeFromAcceptLanguage('ja-JP,ja;q=0.9,en;q=0.8'), 'ja');
  });

  it('uses the fallback for a preferred wildcard', () => {
    assert.equal(localeFromAcceptLanguage('de-DE,*;q=0.9,zh;q=0.8'), 'en');
  });

  it('falls back to English when no requested language is supported', () => {
    assert.equal(localeFromAcceptLanguage('de-DE,fr;q=0.9'), 'en');
  });
});
