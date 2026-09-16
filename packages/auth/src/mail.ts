import { createLogger } from '@repo/logger';
import { sendEmail, emailBody } from '@repo/mailer';
import { getInstanceEmailConfig } from '@repo/db';

const logger = createLogger({ module: 'auth' });

// Authentication email: password reset, address verification, magic link. It uses
// the instance mail provider configured in god mode, which is separate from the
// per-project notification providers.
//
// Delivery is best effort and never blocks the request that triggered it: when no
// provider is configured, or the provider rejects the message, this logs and
// returns false. The caller keeps working — a reset link that cannot be delivered
// must not turn into a failed sign-in flow that leaks whether an account exists.
export async function sendAuthEmail(input: {
  to: string;
  subject: string;
  text: string;
  url?: string;
  html?: string;
}): Promise<boolean> {
  const config = await getInstanceEmailConfig();
  if (!config) {
    logger.warn({ subject: input.subject }, 'no email provider configured, dropping mail');
    return false;
  }
  const { text, html } = input.html
    ? { text: input.text, html: input.html }
    : emailBody(input.text, input.url);
  const result = await sendEmail(config, {
    to: input.to,
    subject: input.subject,
    text,
    html,
  });
  if (!result.ok) logger.error({ error: result.error }, 'email send failed');
  return result.ok;
}
