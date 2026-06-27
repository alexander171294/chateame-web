'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { getAccount } from '@/lib/api';
import { Button } from '@/components/ui/Button';

/**
 * GL3 — Referral loop. El dueño satisfecho comparte un link con su `?ref` para
 * invitar a otro negocio (el caso "embajador"). Atribución básica en el backend.
 */
export function ReferralShare() {
  const t = useTranslations('Referral');
  const [copied, setCopied] = useState(false);
  const { data: account } = useQuery({ queryKey: ['account'], queryFn: getAccount, retry: false });

  const share = async () => {
    if (!account) return;
    const url = `${window.location.origin}/connect?ref=${account.id}`;
    const text = t('shareText');
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: t('shareTitle'), text, url });
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // El usuario canceló el share o no hay permisos de portapapeles: no romper.
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={share} disabled={!account}>
      {copied ? t('copied') : t('button')}
    </Button>
  );
}
