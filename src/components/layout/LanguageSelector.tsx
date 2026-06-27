'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const LOCALE_LABELS: Record<string, string> = {
  'es-AR': 'ES (AR)',
  'es': 'ES',
  'en': 'EN',
  'pt-BR': 'PT (BR)',
};

export function LanguageSelector() {
  const t = useTranslations('Language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLocaleChange = (newLocale: string) => {
    // Persist preference in cookie (next-intl reads NEXT_LOCALE cookie)
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={t('select')}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          'flex items-center gap-1.5 px-3 py-1.5',
          'text-sm font-medium text-[var(--text-secondary)]',
          'bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)]',
          'hover:border-[var(--color-violet)] hover:text-[var(--color-violet)]',
          'transition-all duration-[var(--transition)]',
          'focus-visible:ring-2 focus-visible:ring-[var(--color-violet)] focus-visible:ring-offset-2',
        ].join(' ')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
        <span>{LOCALE_LABELS[locale] ?? locale.toUpperCase()}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop to close on click outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="listbox"
            aria-label={t('select')}
            className={[
              'absolute right-0 top-full mt-1 z-[var(--z-tooltip)]',
              'bg-[var(--bg-secondary)] border border-[var(--border-color)]',
              'rounded-[var(--radius-md)] shadow-[var(--shadow-md)]',
              'min-w-[140px] overflow-hidden',
            ].join(' ')}
          >
            {routing.locales.map((loc) => (
              <button
                key={loc}
                role="option"
                aria-selected={loc === locale}
                onClick={() => handleLocaleChange(loc)}
                className={[
                  'w-full text-left px-4 py-2 text-sm',
                  'transition-colors duration-[var(--transition)]',
                  loc === locale
                    ? 'text-[var(--color-violet)] font-semibold bg-[var(--color-violet-light)]'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]',
                ].join(' ')}
              >
                {t(loc.replace('-', '') as Parameters<typeof t>[0])}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
