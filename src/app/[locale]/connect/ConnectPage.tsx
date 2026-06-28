'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { AppShell } from '@/components/layout/AppShell';
import { Link } from '@/i18n/navigation';
import { ConnectButtons } from '@/components/connect/ConnectButtons';

export function ConnectPage() {
  const t = useTranslations('Connect');

  return (
    <AppShell showNav={false}>
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        {/* Hero */}
        <div className="text-center max-w-lg mx-auto mb-12">
          {/* Logo mark */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-green)] mb-6 shadow-[var(--shadow-md)]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8" aria-hidden="true">
              <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
              <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3 text-balance">
            {t('title')}
          </h1>
          <p className="text-base md:text-lg text-[var(--text-secondary)] text-balance">
            {t('subtitle')}
          </p>
        </div>

        <ConnectButtons />

        {/* Footer note */}
        <p className="mt-10 text-xs text-[var(--text-muted)] text-center max-w-xs">
          {t('noSignupRequired')}
        </p>

        {/* Identidad del negocio + links legales (requerido por Meta y mejora confianza) */}
        <footer className="mt-8 flex flex-col items-center gap-2 text-center">
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
            <Link href="/privacy" className="hover:text-[var(--text-primary)] underline">
              Privacidad
            </Link>
            <Link href="/terms" className="hover:text-[var(--text-primary)] underline">
              Términos
            </Link>
            <Link href="/data-deletion" className="hover:text-[var(--text-primary)] underline">
              Eliminar datos
            </Link>
          </nav>
          <p className="text-[11px] text-[var(--text-muted)]">
            Minibox · Operado por Alexander Eberle · Argentina
          </p>
        </footer>
      </div>
    </AppShell>
  );
}
