#!/usr/bin/env bun
import { existsSync } from 'node:fs';
import { connect } from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as p from '@clack/prompts';
import { EnvFile } from './env-file.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = (name: string) => join(root, name);

const answer = <T>(value: T | symbol): T => {
  if (p.isCancel(value)) {
    p.cancel('Setup cancelled.');
    process.exit(0);
  }
  return value as T;
};

const exec = async (...cmd: string[]) => {
  const proc = Bun.spawn(cmd, { cwd: root, env: process.env, stdout: 'pipe', stderr: 'pipe' });
  const [code, stdout, stderr] = await Promise.all([
    proc.exited,
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ]);
  return { ok: code === 0, code, stdout, stderr };
};

const run = async (...cmd: string[]) => {
  const { ok, code, stdout, stderr } = await exec(...cmd);
  if (!ok) {
    p.cancel(`\`${cmd.join(' ')}\` failed:\n${`${stderr}\n${stdout}`.trim()}`);
    process.exit(code);
  }
};

const accepts = (host: string, port: number) =>
  new Promise<boolean>((resolve) => {
    const socket = connect({ host, port });
    const done = (reachable: boolean) => {
      socket.destroy();
      resolve(reachable);
    };
    socket.setTimeout(500);
    socket.once('connect', () => done(true));
    socket.once('timeout', () => done(false));
    socket.once('error', () => done(false));
  });

const portFree = async (port: number) =>
  !(await accepts('127.0.0.1', port)) && !(await accepts('::1', port));

const askPort = async (what: string, wanted: number) => {
  if (await portFree(wanted)) return wanted;

  let free = wanted + 1;
  while (!(await portFree(free))) free += 1;

  return Number(
    answer(
      await p.text({
        message: `Port ${wanted} is in use. Pick another for ${what}:`,
        initialValue: String(free),
        validate: (value = '') => (/^\d+$/.test(value) ? undefined : 'Enter a port number.'),
      }),
    ),
  );
};

const secrets = ['BETTER_AUTH_SECRET', 'APP_ENCRYPTION_KEY'];

const generated: Record<string, string> = {
  POSTGRES_USER: 'itsaplan',
  POSTGRES_PASSWORD: 'itsaplan',
  POSTGRES_DB: 'itsaplan',
  ...Object.fromEntries(secrets.map((key) => [key, ''])),
};

const walk = async (env: EnvFile, fields: Record<string, string>) => {
  for (const [key, fallback] of Object.entries(fields)) {
    const value = answer(
      await p.text({
        message: key,
        initialValue: env.get(key) || fallback,
        validate: (input = '') => (input.trim() === '' ? 'Enter a value.' : undefined),
      }),
    );
    env.set(key, value.trim());
  }
};

p.intro("It's a Plan setup");

const mode = answer(
  await p.select({
    message: 'What do you want to set up?',
    options: [
      {
        value: 'dev',
        label: 'Develop',
        hint: 'Configure .env, test DB, and run migrations',
      },
      { value: 'env', label: 'Generate env', hint: 'the secrets and every value, step by step' },
    ],
  }),
);

const env = new EnvFile(file('.env'), mode === 'env');

if (mode === 'env') {
  secrets.forEach((key) => env.generate(key));
  await walk(env, generated);

  const web = new EnvFile(file('apps/web/.env'), true);
  web.set('API_URL', env.get('API_URL'));

  let write = answer(
    await p.confirm({ message: 'Write .env and apps/web/.env? No prints them instead.' }),
  );

  if (write && existsSync(file('.env')))
    write = answer(
      await p.confirm({
        message:
          'Overwrite the .env you have? Copy its secrets first — an instance built on them cannot read its data without them.',
        initialValue: false,
      }),
    );

  if (write) {
    env.save();
    web.save();
    p.outro('.env and apps/web/.env are written.');
  } else {
    p.outro('Nothing was written.');
    console.log(`# .env\n${env}\n# apps/web/.env\n${web}`);
  }
}

if (mode === 'dev') {
  const dbPort = Number(env.get('POSTGRES_PORT') || 5432);
  const apiPort = await askPort('the api', Number(env.get('API_PORT') || 3000));

  env.set('POSTGRES_PORT', String(dbPort));
  env.set('API_PORT', String(apiPort));
  env.set('API_URL', `http://localhost:${apiPort}`);
  secrets.forEach((key) => env.generate(key));

  const user = env.get('POSTGRES_USER') || 'itsaplan';
  const database = env.get('POSTGRES_DB') || 'itsaplan';
  const password = encodeURIComponent(env.get('POSTGRES_PASSWORD') || 'itsaplan');

  env.set('DATABASE_URL', `postgres://${user}:${password}@localhost:${dbPort}/${database}`);
  env.save();

  const web = new EnvFile(file('apps/web/.env'));
  web.set('API_URL', `http://localhost:${apiPort}`);
  web.save();

  const testDatabase = `${database}_test`;
  const test = new EnvFile(file('.env.test'));
  test.set('DATABASE_URL', `postgres://${user}:${password}@localhost:${dbPort}/${testDatabase}`);
  test.set('API_URL', `http://localhost:${apiPort}`);
  test.set('APP_URL', env.get('APP_URL'));
  for (const key of ['S3_ENDPOINT', 'S3_BUCKET', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY'])
    test.set(key, env.get(key));
  test.save();

  const isDbReachable = await accepts('127.0.0.1', dbPort);
  if (isDbReachable) {
    const migrations = p.spinner();
    migrations.start('Applying migrations');
    process.env.SKIP_PRE_MIGRATION_BACKUP = '1';
    await run('bun', '--env-file=.env', 'packages/db/src/migrate.ts');
    migrations.stop(`Migrated database ${database}`);
  } else {
    p.log.warn(
      `PostgreSQL is not answering on port ${dbPort}. Start it and run \`bun run db:migrate\`.`,
    );
  }

  p.outro(
    `Setup complete! Run \`bun run dev\` — web on http://localhost:3001, api on http://localhost:${apiPort}.`,
  );
}
