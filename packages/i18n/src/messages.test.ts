import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'bun:test';
import { INTERFACE_LOCALES } from './locales';

type Catalog = Record<string, string>;
const messagesDirectory = resolve(import.meta.dirname, '../messages');
const loadCatalog = (locale: string): Catalog =>
  JSON.parse(readFileSync(resolve(messagesDirectory, `${locale}.json`), 'utf8')) as Catalog;
const placeholders = (value: string) =>
  [...value.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]).sort();

describe('Paraglide message catalogs', () => {
  const english = loadCatalog('en');
  const orderedKeys = Object.keys(english).filter((key) => key !== '$schema');
  const expectedKeys = [...orderedKeys].sort();

  it.each(INTERFACE_LOCALES.map(({ code }) => code))(
    '%s is key-complete with compatible variables',
    (locale) => {
      const catalog = loadCatalog(locale);
      expect(
        Object.keys(catalog)
          .filter((key) => key !== '$schema')
          .sort(),
      ).toEqual(expectedKeys);
      for (const key of expectedKeys)
        expect(placeholders(catalog[key] ?? '')).toEqual(placeholders(english[key] ?? ''));
    },
  );

  it.each(
    INTERFACE_LOCALES.filter(({ code }) => !['en', 'ar'].includes(code)).map(({ code }) => code),
  )('%s localizes the complete new add-on and managed-consent copy', (locale) => {
    const catalog = loadCatalog(locale);
    const firstAddonKey = orderedKeys.indexOf('settings_addons_group_engagement_title');
    const lastAddonKey = orderedKeys.indexOf('settings_addons_boundary');
    const localizedKeys = orderedKeys
      .slice(Math.min(firstAddonKey, lastAddonKey), Math.max(firstAddonKey, lastAddonKey) + 1)
      .filter((key) => !key.endsWith('_placeholder'))
      .concat('settings_analytics_cookieconsent_managed');

    for (const key of localizedKeys) expect(catalog[key]).not.toBe(english[key]);
  });

  it.each(INTERFACE_LOCALES.map(({ code }) => code))(
    '%s contains no external translation-service artifacts',
    (locale) => {
      expect(Object.values(loadCatalog(locale)).join('\n')).not.toMatch(
        /NO QUERY|EXAMPLE REQUEST|LANGPAIR|GET\?Q=|MYMEMORY|translated\.net/i,
      );
    },
  );

  it.each(INTERFACE_LOCALES.map(({ code }) => code))(
    '%s keeps integration copy free of translation artifacts',
    (locale) => {
      const integrationCopy = Object.entries(loadCatalog(locale))
        .filter(([key]) => key.startsWith('settings_integrations_'))
        .map(([, value]) => value)
        .join('\n');

      expect(integrationCopy).not.toMatch(
        /@ info|\bName\b|NO QUERY|EXAMPLE REQUEST|LANGPAIR|GET\?Q=/,
      );
      expect(integrationCopy).not.toMatch(/مثال|দৃষ্টান্ত|Пример Нибулафа|Exemplo repo/);
    },
  );

  it.each(INTERFACE_LOCALES.map(({ code }) => code))(
    '%s keeps opposite integration states distinct',
    (locale) => {
      const catalog = loadCatalog(locale);
      const pairs = [
        ['settings_integrations_connected', 'settings_integrations_notconnected'],
        ['settings_integrations_health_healthy', 'settings_integrations_health_unhealthy'],
        ['settings_integrations_status_active', 'settings_integrations_status_inactive'],
        [
          'settings_integrations_availability_available',
          'settings_integrations_availability_unavailable',
        ],
      ] as const;

      for (const [positive, negative] of pairs)
        expect(catalog[positive]).not.toBe(catalog[negative]);
    },
  );

  it.each(INTERFACE_LOCALES.filter(({ code }) => code !== 'en').map(({ code }) => code))(
    '%s preserves integration provider and product names',
    (locale) => {
      const catalog = loadCatalog(locale);
      const protectedNames = [
        'Amazon S3',
        'Backblaze B2',
        'ClickHouse',
        'Discord',
        'GitHub',
        'GitLab',
        'Google Analytics',
        'Maxio',
        'MinIO',
        'OpenRouter',
        'Plausible',
        'Postmark',
        'Public Git',
        'Qdrant',
        'Slack',
        'SMTP',
        'Zapier',
      ];

      for (const [key, englishValue] of Object.entries(english)) {
        if (!key.startsWith('settings_integrations_')) continue;
        for (const protectedName of protectedNames) {
          if (englishValue.includes(protectedName)) expect(catalog[key]).toContain(protectedName);
        }
      }
    },
  );

  it.each(INTERFACE_LOCALES.filter(({ code }) => code !== 'en').map(({ code }) => code))(
    '%s localizes the integration settings surface without English fallbacks',
    (locale) => {
      const catalog = loadCatalog(locale);
      const intentionallyIdentical = new Set([
        ...orderedKeys.filter((key) => key.startsWith('settings_integrations_provider_')),
        ...orderedKeys.filter((key) => key.startsWith('settings_integrations_placeholder_')),
        'settings_integrations_value_mode_clickhouse',
      ]);
      const integrationKeys = orderedKeys.filter(
        (key) => key.startsWith('settings_integrations_') && !intentionallyIdentical.has(key),
      );

      for (const key of integrationKeys) expect(catalog[key]).not.toBe(english[key]);
    },
  );
});
