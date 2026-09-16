import { describe, expect, it } from 'bun:test';
import { INTERFACE_LOCALES, isRtl, resolveLocale } from './locales';

describe('interface locales', () => {
  it('normalizes BCP-47 variants and preserves direction', () => {
    expect(resolveLocale('en-US')).toBe('en');
    expect(resolveLocale('ja-JP')).toBe('ja');
    expect(isRtl('en')).toBe(false);
    expect(isRtl('ja')).toBe(false);
    expect(INTERFACE_LOCALES.find(({ code }) => code === 'ja')?.native).toBe('日本語');
  });
});
