import { describe, expect, it } from 'bun:test';
import {
  renderEmailVerificationEmail,
  renderNewSignInEmail,
  renderVerificationCodeEmail,
} from './index';

describe('localized transactional email rendering', () => {
  it('renders an English verification code with a plain-text body', async () => {
    const email = await renderVerificationCodeEmail({ code: '123456', purpose: 'sign-in' });

    expect(email.subject).toBe('Your Nibleaf sign-in code');
    expect(email.html).toContain('lang="en"');
    expect(email.html).toContain('123456');
    expect(email.text).toContain('123456');
  });

  it('renders Japanese email chrome with ja lang', async () => {
    const email = await renderNewSignInEmail({ language: 'ja' });

    expect(email.subject).toBe('New sign-in to your Nibleaf account');
    expect(email.html).toContain('lang="ja"');
  });

  it('escapes a dynamic action URL in HTML while preserving it in text', async () => {
    const email = await renderEmailVerificationEmail({
      url: 'https://example.com/verify?token=abc&next=<home>',
    });

    expect(email.html).toContain('token=abc&amp;next=&lt;home&gt;');
    expect(email.html).not.toContain('next=<home>');
    expect(email.text).toContain('https://example.com/verify?token=abc&next=<home>');
  });
});
