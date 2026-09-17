'use client';

import { Label } from '@/components/ui/label';
import SettingsSection from '@/components/common/page/SettingsSection';
import EnabledSwitch from '@/components/common/inputs/EnabledSwitch';
import SecretInput from '@/components/common/inputs/SecretInput';
import type { TelegramForm } from '../../hooks/useTelegramForm';
import { useTranslations } from '@repo/i18n/react';

// The bot the team delivers through. The token is optional: left empty, the team
// sends through the instance bot that members connect their Telegram account to.
// Members do not enter a chat anywhere, it comes from that connected account. The
// token is sent only when changed.
export default function TelegramSettings({ form }: { form: TelegramForm }) {
  const t = useTranslations('teams.notifications');
  const { settings } = form;
  return (
    <SettingsSection
      title={t('telegramBot')}
      description={t('telegramBotHint')}
      action={<EnabledSwitch checked={form.enabled} onChange={form.setEnabled} />}
    >
      <div className="space-y-1.5 sm:max-w-md">
        <Label htmlFor="telegram-token">{t('botToken')}</Label>
        <SecretInput
          id="telegram-token"
          value={form.botToken}
          onChange={form.setBotToken}
          hasStored={settings.telegram.hasBotToken}
          placeholder="123456:ABC-DEF…"
        />
      </div>
    </SettingsSection>
  );
}
