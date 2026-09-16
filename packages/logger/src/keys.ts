import { createEnv } from '@t3-oss/env-core';
import * as zod from 'zod';

const z =
  (zod as unknown as { z: typeof zod.z }).z ??
  (zod as unknown as { default: typeof zod.z }).default ??
  zod;

export const keys = () =>
  createEnv({
    server: {
      EVLOG_FS_DIR: z.string().trim().min(1).optional(),
      EVLOG_FS_MAX_FILES: z.coerce.number().int().positive().default(14),
      EVLOG_FS_MAX_SIZE_BYTES: z.coerce.number().int().positive().default(10_000_000),
      EVLOG_LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug', 'silent']).optional(),
      NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
      /** Deprecated compatibility aliases. Prefer the EVLOG_* variables. */
      PINO_LOG_LEVEL: z
        .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
        .optional(),
      PINO_LOG_FILE: z.string().trim().min(1).optional(),
      SERVICE_NAME: z.string().default('repo'),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
  });
