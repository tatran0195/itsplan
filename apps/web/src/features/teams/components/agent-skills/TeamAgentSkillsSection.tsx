'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslations } from '@repo/i18n/react';
import { useTeamQuery } from '@/services/teams.service';
import SectionPageView from '@/components/common/page/SectionPageView';
import ListSkeleton from '@/components/common/skeleton/ListSkeleton';
import { Button } from '@/components/ui/button';
import { SkillCreateDialog } from './SkillCreateDialog';
import TeamAgentSkills from './TeamAgentSkills';

// The skill library of a team: the SKILL.md documents its projects' internal agents
// load on demand, shared by every one of them.
export default function TeamAgentSkillsSection({ teamId }: { teamId: number }) {
  const t = useTranslations('teams');
  const { data: team } = useTeamQuery(teamId);
  const permissions = team?.permissions.agent_skills;
  const [creating, setCreating] = useState(false);

  return (
    <SectionPageView
      title={t('sections.agentSkills.title')}
      description={t('sections.agentSkills.description')}
      wide
      actions={
        permissions?.create ? (
          <Button size="sm" className="h-8 gap-1.5" onClick={() => setCreating(true)}>
            <Plus className="size-3.5" />
            {t('skills.newSkill')}
          </Button>
        ) : undefined
      }
    >
      {!permissions || !team ? (
        <ListSkeleton rows={3} rowClassName="h-12" />
      ) : !permissions.read ? (
        <p className="text-sm text-muted-foreground">{t('skills.noAccess')}</p>
      ) : (
        <TeamAgentSkills teamId={teamId} teamName={team.name} permissions={permissions} />
      )}

      {creating && team && (
        <SkillCreateDialog
          teamId={teamId}
          teamName={team.name}
          onClose={() => setCreating(false)}
        />
      )}
    </SectionPageView>
  );
}
