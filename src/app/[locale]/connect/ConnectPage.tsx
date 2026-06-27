'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Tooltip } from '@/components/ui/Tooltip';
import { AppShell } from '@/components/layout/AppShell';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export function ConnectPage() {
  const t = useTranslations('Connect');

  // GL3 referral: capturar ?ref de la URL y propagarlo al inicio de OAuth.
  const [ref, setRef] = React.useState<string | null>(null);
  React.useEffect(() => {
    const r = new URLSearchParams(window.location.search).get('ref');
    if (r) setRef(r);
  }, []);
  const startUrl = (platform: string) =>
    `${API_URL}/auth/meta/${platform}/start${ref ? `?ref=${encodeURIComponent(ref)}` : ''}`;

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

        {/* Connect buttons */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          {/* Instagram */}
          <a
            href={startUrl('instagram')}
            className={[
              'flex items-center justify-center gap-3',
              'w-full px-6 py-4 rounded-[var(--radius-lg)]',
              'font-semibold text-base text-white',
              'transition-all duration-[var(--transition)]',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-violet)]',
              'shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]',
              'hover:opacity-90 active:scale-[0.98]',
            ].join(' ')}
            style={{
              background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            }}
          >
            <InstagramIcon />
            {t('connectInstagram')}
          </a>

          {/* Facebook */}
          <a
            href={startUrl('facebook')}
            className={[
              'flex items-center justify-center gap-3',
              'w-full px-6 py-4 rounded-[var(--radius-lg)]',
              'font-semibold text-base text-white',
              'bg-[#1877F2] hover:bg-[#1666d9]',
              'transition-all duration-[var(--transition)]',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-violet)]',
              'shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]',
              'active:scale-[0.98]',
            ].join(' ')}
          >
            <FacebookIcon />
            {t('connectFacebook')}
          </a>

          {/* WhatsApp — disabled with tooltip */}
          <Tooltip content={t('whatsappTooltip')} position="bottom">
            <button
              type="button"
              disabled
              aria-disabled="true"
              className={[
                'flex items-center justify-center gap-3',
                'w-full px-6 py-4 rounded-[var(--radius-lg)]',
                'font-semibold text-base',
                'bg-[var(--bg-tertiary)] text-[var(--text-muted)]',
                'border border-[var(--border-color)]',
                'cursor-not-allowed opacity-60',
              ].join(' ')}
            >
              <WhatsAppIcon />
              {t('connectWhatsApp')}
              <span className="ml-auto text-xs font-normal px-2 py-0.5 bg-[var(--border-color)] rounded-full">
                {t('comingSoon')}
              </span>
            </button>
          </Tooltip>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-xs text-[var(--text-muted)] text-center max-w-xs">
          {t('noSignupRequired')}
        </p>
      </div>
    </AppShell>
  );
}
