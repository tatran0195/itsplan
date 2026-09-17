'use client';

import ConfirmDialog from '@/components/common/overlay/ConfirmDialog';
import { useTranslations } from '@repo/i18n/react';

export default function DocumentDiscardDraftDialog({
  onClose,
  onDiscard,
}: {
  onClose: () => void;
  onDiscard: () => Promise<void>;
}) {
  const t = useTranslations('documents');

  return (
    <ConfirmDialog
      title={t('discardTitle')}
      confirmLabel={t('discardAndReload')}
      onClose={onClose}
      onConfirm={onDiscard}
    >
      <p className="text-sm text-muted-foreground">{t('discardDescription')}</p>
    </ConfirmDialog>
  );
}
