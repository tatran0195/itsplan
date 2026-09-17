'use client';

import { useTranslations } from '@repo/i18n/react';
import { useTeamQuery } from '@/services/teams.service';
import Avatar from '@/components/common/Avatar';
import SettingsCard from '@/components/common/page/SettingsCard';
import SettingsSection from '@/components/common/page/SettingsSection';
import ListSkeleton from '@/components/common/skeleton/ListSkeleton';
import { Badge } from '@/components/ui/badge';

// The people who run the team, owners first. They come with the team detail, so the
// section reads no page of the member list.
export default function TeamLeadsSection({ teamId }: { teamId: number }) {
  const t = useTranslations('teams.info');
  const tManage = useTranslations('teams.manage');
  const { data: team } = useTeamQuery(teamId);

  return (
    <SettingsSection title={t('leads')} description={t('leadsHint')}>
      {!team ? (
        <ListSkeleton rows={2} rowClassName="h-12" />
      ) : (
        <SettingsCard className="divide-y divide-border/60">
          {team.leads.map((lead) => (
            <div key={lead.userId} className="flex items-center gap-3 p-3">
              <Avatar
                name={lead.name || lead.email}
                image={lead.image}
                className="size-8 shrink-0 text-[11px]"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{lead.name || lead.email}</p>
                <p className="truncate text-xs text-muted-foreground">{lead.email}</p>
              </div>
              <Badge variant="secondary" className="shrink-0 font-normal">
                {tManage(`roles.${lead.role}`)}
              </Badge>
            </div>
          ))}
        </SettingsCard>
      )}
    </SettingsSection>
  );
}
