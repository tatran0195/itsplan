'use client';

import { UsersRound } from 'lucide-react';
import { useTranslations } from '@repo/i18n/react';
import { Badge } from '@/components/ui/badge';

export default function MemberProvisionedBadge() {
  const t = useTranslations('members');

  return (
    <Badge variant="outline" className="gap-1 px-1.5 py-0 text-[10px] font-normal">
      <UsersRound className="size-3" />
      {t('provisioned')}
    </Badge>
  );
}
