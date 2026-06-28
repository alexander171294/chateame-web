'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ConnectButtons } from '@/components/connect/ConnectButtons';

function Check() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 text-[var(--color-green)]" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const STEP_KEYS = ['step1', 'step2', 'step3'] as const;
const FEATURE_KEYS = ['feature1', 'feature2', 'feature3', 'feature4'] as const;
const FAQ_KEYS = ['faq1', 'faq2', 'faq3', 'faq4', 'faq5', 'faq6'] as const;

export function LandingPage() {
  const t = useTranslations('Landing');

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="px-4 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-5">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)]">
            {t('badge')}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
            {t('heroH1')}
          </h1>
          <p className="text-base md:text-xl text-[var(--text-secondary)] max-w-2xl text-balance">
            {t('heroSub')}
          </p>
          <div className="mt-2 flex flex-col items-center gap-3">
            <ConnectButtons />
            <p className="text-xs text-[var(--text-muted)]">{t('heroNote')}</p>
          </div>
        </div>
      </section>

      {/* ── Dolor ──────────────────────────────────────────── */}
      <section className="px-4 py-12 bg-[var(--bg-secondary)] border-y border-[var(--border-color)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{t('painTitle')}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {['pain1', 'pain2', 'pain3'].map((k) => (
              <div
                key={k}
                className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-5 text-sm text-[var(--text-secondary)]"
              >
                {t(k)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ──────────────────────────────────── */}
      <section className="px-4 py-14">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">{t('stepsTitle')}</h2>
          <p className="text-center text-[var(--text-secondary)] mb-10">{t('stepsSub')}</p>
          <ol className="grid sm:grid-cols-3 gap-6">
            {STEP_KEYS.map((k, i) => (
              <li key={k} className="flex flex-col items-center text-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-green)] text-white font-bold">
                  {i + 1}
                </span>
                <h3 className="font-semibold">{t(`${k}Title`)}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{t(`${k}Desc`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Beneficios ─────────────────────────────────────── */}
      <section className="px-4 py-14 bg-[var(--bg-secondary)] border-y border-[var(--border-color)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{t('featuresTitle')}</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURE_KEYS.map((k) => (
              <div key={k} className="flex gap-3 items-start">
                <Check />
                <div>
                  <h3 className="font-semibold">{t(`${k}Title`)}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{t(`${k}Desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Para quién ─────────────────────────────────────── */}
      <section className="px-4 py-14">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{t('forWhoTitle')}</h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">{t('forWhoSub')}</p>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="px-4 py-14 bg-[var(--bg-secondary)] border-y border-[var(--border-color)]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{t('faqTitle')}</h2>
          <div className="flex flex-col gap-4">
            {FAQ_KEYS.map((k) => (
              <details
                key={k}
                className="group bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-4"
              >
                <summary className="cursor-pointer font-semibold list-none flex justify-between items-center gap-2">
                  {t(`${k}Q`)}
                  <span className="text-[var(--text-muted)] group-open:rotate-180 transition-transform" aria-hidden="true">
                    ⌄
                  </span>
                </summary>
                <p className="mt-3 text-sm text-[var(--text-secondary)]">{t(`${k}A`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ──────────────────────────────────────── */}
      <section className="px-4 py-16">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-5">
          <h2 className="text-2xl md:text-4xl font-bold text-balance">{t('finalCtaTitle')}</h2>
          <p className="text-[var(--text-secondary)] text-balance">{t('finalCtaSub')}</p>
          <ConnectButtons />
          <p className="text-xs text-[var(--text-muted)]">{t('heroNote')}</p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="px-4 py-8 border-t border-[var(--border-color)]">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-2 text-center">
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
        </div>
      </footer>
    </div>
  );
}
