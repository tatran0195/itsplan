import { describe, expect, it } from 'bun:test';
import { formatMessage, formatRichMessage } from './format';

describe('formatMessage', () => {
  it('formats simple variables', () => {
    expect(formatMessage('Hello, {name}!', { name: 'World' })).toBe('Hello, World!');
  });

  it('handles plurals with =0, one, and other', () => {
    const pattern =
      '{count, plural, =0 {Nothing is left.} one {# item stays.} other {# items stay.}}';
    expect(formatMessage(pattern, { count: 0 }, 'en')).toBe('Nothing is left.');
    expect(formatMessage(pattern, { count: 1 }, 'en')).toBe('1 item stays.');
    expect(formatMessage(pattern, { count: 5 }, 'en')).toBe('5 items stay.');
  });

  it('handles select expressions', () => {
    const pattern =
      'This invite was already {status, select, accepted {accepted} rejected {declined} other {closed}}';
    expect(formatMessage(pattern, { status: 'accepted' }, 'en')).toBe(
      'This invite was already accepted',
    );
    expect(formatMessage(pattern, { status: 'rejected' }, 'en')).toBe(
      'This invite was already declined',
    );
    expect(formatMessage(pattern, { status: 'unknown' }, 'en')).toBe(
      'This invite was already closed',
    );
  });
});

describe('formatRichMessage', () => {
  it('formats rich tags with handlers', () => {
    const pattern = 'Click <link>here</link> to continue';
    const result = formatRichMessage(pattern, {
      link: (chunks) => `[LINK:${chunks}]`,
    });
    expect(result).toEqual(['Click ', '[LINK:here]', ' to continue']);
  });
});
