'use client';

import { useTranslations } from '@repo/i18n/react';
import { useNotificationSettingsQuery, useTeam } from '@/services/teams.service';
import SectionPageView from '@/components/common/page/SectionPageView';
import ListSkeleton from '@/components/common/skeleton/ListSkeleton';
import TeamNotificationProviders from './TeamNotificationProviders';

// The notification providers of a team: the email (SMTP or Resend) and Telegram bot
// credentials every project of the team delivers through. Only the team owner reads
// or changes them, so anyone else gets a notice instead.
export default function TeamNotificationsSection({ teamId }: { teamId: number }) {
  const t = useTranslations('teams');
  const team = useTeam(teamId);
  const canManage = team?.role === 'owner';
  const { data } = useNotificationSettingsQuery(canManage ? teamId : null);

  return (
    <SectionPageView
      title={t('sections.notifications.title')}
      description={t('sections.notifications.description')}
    >
      {team && !canManage ? (
        <p className="text-sm text-muted-foreground">{t('notifications.ownerOnly')}</p>
      ) : !data ? (
        <ListSkeleton rows={3} rowClassName="h-12" />
      ) : (
        <TeamNotificationProviders teamId={teamId} settings={data} />
      )}
    </SectionPageView>
  );
}
