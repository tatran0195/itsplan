import { describe, expect, it } from 'bun:test';
import { createFormatter } from './formatter';

describe('createFormatter', () => {
  const formatter = createFormatter('en');

  it('formats dates', () => {
    const d = new Date('2026-01-01T00:00:00Z');
    expect(formatter.dateTime(d, { month: 'long', year: 'numeric', timeZone: 'UTC' })).toBe(
      'January 2026',
    );
  });

  it('formats numbers', () => {
    expect(formatter.number(12345.67)).toBe('12,345.67');
  });

  it('formats relative times', () => {
    const now = new Date('2026-01-01T12:00:00Z');
    const past = new Date('2026-01-01T11:58:00Z');
    expect(formatter.relativeTime(past, now)).toBe('2 minutes ago');
  });
});
