import { createLogger } from '@repo/logger';
import { startSupervisor } from './supervisor';

const logger = createLogger({ service: 'bot' });

// Entry point for the Telegram bot service. It runs long polling for the instance
// bot and completes the account links users start from their profile. The token
// comes from the api at runtime, so this starts even before a bot is configured and
// picks one up when an administrator adds it.
logger.info('bot service starting');
const supervisor = startSupervisor();

function shutdown(signal: string): void {
  logger.info(`${signal} received, stopping`);
  // Stopping ends the current getUpdates call, so Telegram hands the next update to
  // the replacement process instead of timing out against this one.
  // Exit either way: bot.stop() makes a final getUpdates call, and a failure there
  // must not leave the process hanging.
  void supervisor
    .stop()
    .catch((err: unknown) => logger.error(err, 'stop failed'))
    .finally(() => process.exit(0));
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
