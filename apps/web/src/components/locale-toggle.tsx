'use client';

import { useRouter } from 'next/navigation';
import { Check, Languages } from 'lucide-react';
import { setClientLocale, useLocale, useTranslations } from '@repo/i18n/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LOCALES, LOCALE_FLAGS, LOCALE_LABELS, type Locale } from '@/i18n/locales';
import { setLocaleCookie } from '@/i18n/cookie';
import { useSession } from '@/lib/auth-client';
import { useUpdateAccountPreferences } from '@/services/preferences.service';

// Picks the interface language. The choice is saved to the account when signed in,
// written to the cookie for the server to render from, and immediately updates the
// client locale store.
export function LocaleToggle() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const update = useUpdateAccountPreferences();

  const handleSelect = (value: Locale) => {
    setLocaleCookie(value);
    setClientLocale(value);
    if (session) {
      update.mutate({ locale: value });
    }
    router.refresh();
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              id="locale-toggle"
              data-testid="locale-toggle"
              variant="outline"
              size="icon"
              className="size-8 shrink-0"
              aria-label={t('language')}
            >
              <Languages />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{t('language')}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        {LOCALES.map((value) => (
          <DropdownMenuItem
            key={value}
            data-testid={`locale-option-${value}`}
            onSelect={() => handleSelect(value)}
          >
            <span aria-hidden>{LOCALE_FLAGS[value]}</span>
            {LOCALE_LABELS[value]}
            {value === (locale as Locale) && <Check className="ml-auto size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
