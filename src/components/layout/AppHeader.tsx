'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';

interface AppHeaderProps {
  showNav?: boolean;
}

export function AppHeader({ showNav = true }: AppHeaderProps) {
  const t = useTranslations('Nav');

  return (
    <header
      className={[
        'sticky top-0 z-30',
        'flex items-center justify-between',
        'px-4 md:px-6 h-14',
        'bg-[var(--bg-secondary)]/90 backdrop-blur-sm',
        'border-b border-[var(--border-color)]',
      ].join(' ')}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[var(--color-violet)] focus-visible:ring-offset-2 rounded-[var(--radius-sm)]"
      >
        <div
          aria-hidden="true"
          className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-green)] flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
            <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
            <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
          </svg>
        </div>
        <span className="font-bold text-lg text-[var(--text-primary)] hidden sm:inline">
          chateame
        </span>
      </Link>

      {/* Nav links (only for authenticated layout) */}
      {showNav && (
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          <Link
            href="/conversations"
            className={[
              'px-3 py-1.5 text-sm font-medium rounded-[var(--radius-md)]',
              'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]',
              'transition-all duration-[var(--transition)]',
              'focus-visible:ring-2 focus-visible:ring-[var(--color-violet)] focus-visible:ring-offset-2',
            ].join(' ')}
          >
            {t('conversations')}
          </Link>
          <Link
            href="/knowledge-base"
            className={[
              'px-3 py-1.5 text-sm font-medium rounded-[var(--radius-md)]',
              'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]',
              'transition-all duration-[var(--transition)]',
              'focus-visible:ring-2 focus-visible:ring-[var(--color-violet)] focus-visible:ring-offset-2',
            ].join(' ')}
          >
            {t('knowledgeBase')}
          </Link>
          <Link
            href="/billing"
            className={[
              'px-3 py-1.5 text-sm font-medium rounded-[var(--radius-md)]',
              'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]',
              'transition-all duration-[var(--transition)]',
              'focus-visible:ring-2 focus-visible:ring-[var(--color-violet)] focus-visible:ring-offset-2',
            ].join(' ')}
          >
            {t('billing')}
          </Link>
        </nav>
      )}

      {/* Controls */}
      <div className="flex items-center gap-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </header>
  );
}
