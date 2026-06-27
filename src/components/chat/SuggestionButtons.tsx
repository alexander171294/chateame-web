'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

interface SuggestionButton {
  labelKey: string;
  href: string;
  icon: React.ReactNode;
}

export function SuggestionButtons() {
  const t = useTranslations('Nav');

  const buttons: SuggestionButton[] = [
    {
      labelKey: 'conversations',
      href: '/conversations',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      labelKey: 'knowledgeBase',
      href: '/knowledge-base',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
    {
      labelKey: 'billing',
      href: '/billing',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {buttons.map((button) => (
        <Link
          key={button.labelKey}
          href={button.href}
          className={[
            'inline-flex items-center gap-2 px-4 py-2',
            'text-sm font-medium text-[var(--text-primary)]',
            'bg-[var(--bg-secondary)] border border-[var(--border-color)]',
            'rounded-[var(--radius-full)]',
            'hover:border-[var(--color-violet)] hover:text-[var(--color-violet)]',
            'transition-all duration-[var(--transition)]',
            'focus-visible:ring-2 focus-visible:ring-[var(--color-violet)] focus-visible:ring-offset-2',
            'shadow-[var(--shadow-sm)]',
          ].join(' ')}
        >
          {button.icon}
          {t(button.labelKey as Parameters<typeof t>[0])}
        </Link>
      ))}
    </div>
  );
}
