'use client';

import { Bot } from 'lucide-react';
import { useTranslations } from '@repo/i18n/react';
import { Badge } from '@/components/ui/badge';

export default function MemberAgentBadge() {
  const t = useTranslations('members');

  return (
    <Badge variant="secondary" className="gap-1 px-1.5 py-0 text-[10px] font-medium">
      <Bot className="size-3" />
      {t('aiAgent')}
    </Badge>
  );
}
