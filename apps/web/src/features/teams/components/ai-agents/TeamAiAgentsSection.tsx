'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslations } from '@repo/i18n/react';
import { useTeamQuery } from '@/services/teams.service';
import SectionPageView from '@/components/common/page/SectionPageView';
import ListSkeleton from '@/components/common/skeleton/ListSkeleton';
import { Button } from '@/components/ui/button';
import { AgentSectionProvider } from '../../context/agentSection';
import TeamAiAgents from './TeamAiAgents';
import { TeamAiAgentSheet } from './TeamAiAgentSheet';

// The agents of a team: created, configured and attached to the team's projects here,
// because the team owns them and their key reaches every project it attaches them to.
export default function TeamAiAgentsSection({ teamId }: { teamId: number }) {
  const t = useTranslations('teams');
  const { data: team } = useTeamQuery(teamId);
  const permissions = team?.permissions.ai_agents;
  const [creating, setCreating] = useState(false);

  return (
    <SectionPageView
      title={t('sections.agents.title')}
      description={t('sections.agents.description')}
      wide
      actions={
        permissions?.create ? (
          <Button size="sm" className="h-8 gap-1.5" onClick={() => setCreating(true)}>
            <Plus className="size-3.5" />
            {t('agents.newAgent')}
          </Button>
        ) : undefined
      }
    >
      {!permissions ? (
        <ListSkeleton rows={3} rowClassName="h-12" />
      ) : !permissions.read ? (
        <p className="text-sm text-muted-foreground">{t('agents.noAccess')}</p>
      ) : (
        <AgentSectionProvider teamId={teamId} permissions={permissions}>
          <TeamAiAgents />
          <TeamAiAgentSheet open={creating} agent={null} onClose={() => setCreating(false)} />
        </AgentSectionProvider>
      )}
    </SectionPageView>
  );
}
