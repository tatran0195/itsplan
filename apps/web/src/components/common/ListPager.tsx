'use client';

import { useEffect } from 'react';
import { useTranslations } from '@repo/i18n/react';
import PageNav from '@/components/common/PageNav';
import type { Paging } from '@/hooks/usePaging';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SIZES = [5, 10, 25, 50, 100];

// The footer under every server-paged list: how many rows a page holds, which rows
// are on screen, and the pages themselves. Deleting the last rows of a list can leave
// the reader past its end, so the page is pulled back to the last one that exists —
// otherwise the table above reads as empty with no way back.
export default function ListPager({ paging, total }: { paging: Paging; total: number }) {
  const t = useTranslations('common.pager');
  const { page, pageSize } = paging.params;
  const { setPage, setPageSize } = paging;
  const pageCount = Math.max(Math.ceil(total / pageSize), 1);
  const current = Math.min(page, pageCount);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount, setPage]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
          <SelectTrigger size="sm" className="w-18" aria-label={t('perPage')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SIZES.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{t('perPage')}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground" dir="ltr">
          {t('range', {
            first: total === 0 ? 0 : (current - 1) * pageSize + 1,
            last: Math.min(current * pageSize, total),
            total,
          })}
        </span>
        <PageNav
          page={current}
          pageCount={pageCount}
          onPageChange={setPage}
          className="mx-0 w-auto justify-end"
        />
      </div>
    </div>
  );
}
