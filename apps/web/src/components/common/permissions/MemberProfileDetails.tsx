'use client';

import { useTranslations } from '@repo/i18n/react';
import { formatDate } from '@/utils/dates';

// The member's profile, shown inside the opened row. The description is empty until
// someone writes one.
export default function MemberProfileDetails({
  description,
  timezone,
  joinedAt,
}: {
  description: string;
  timezone: string;
  joinedAt: string;
}) {
  const t = useTranslations('members');
  const tCommon = useTranslations('common');

  const rows = [
    ...(description ? [{ label: tCommon('description'), value: description }] : []),
    { label: t('columns.timezone'), value: timezone },
    { label: t('columns.joined'), value: formatDate(joinedAt) },
  ];

  return (
    <section>
      <h4 className="mb-2 text-sm font-medium">{t('profileHeading')}</h4>
      <dl className="text-xs">
        {rows.map((row) => (
          <div key={row.label} className="flex gap-2 border-b py-1.5 last:border-b-0">
            <dt className="w-32 shrink-0 text-muted-foreground">{row.label}</dt>
            <dd className="min-w-0">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
