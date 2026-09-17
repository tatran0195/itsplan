import { describe, expect, it } from 'bun:test';
import { createTranslator } from './core';

describe('createTranslator', () => {
  it('translates common keys in English', () => {
    const t = createTranslator('en', 'common');
    expect(t('cancel')).toBe('Cancel');
    expect(t('save')).toBe('Save');
  });

  it('translates common keys in Japanese', () => {
    const t = createTranslator('ja', 'common');
    expect(t('cancel')).toBe('キャンセル');
  });

  it('translates nested namespace', () => {
    const t = createTranslator('en', 'account.accounts');
    expect(t.has('title')).toBe(true);
  });

  it('handles t.has for existing and missing keys', () => {
    const t = createTranslator('en', 'common');
    expect(t.has('cancel')).toBe(true);
    expect(t.has('nonExistentKeyxyz123')).toBe(false);
  });

  it('formats variables and plurals', () => {
    const t = createTranslator('en', 'common.agentChat');
    expect(t('usedTools', { count: 1 })).toBe('Used 1 tool');
    expect(t('usedTools', { count: 3 })).toBe('Used 3 tools');
  });
});
