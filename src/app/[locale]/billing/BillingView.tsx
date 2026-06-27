'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getBilling, createCheckout } from '@/lib/api';
import type { PaymentProvider } from '@/lib/types';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/LoadingSpinner';

function UsageStat({ label, value, max }: { label: string; value: number; max?: number }) {
  const percentage = max ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
        <span className="text-sm font-semibold text-[var(--text-primary)]">{value.toLocaleString()}</span>
      </div>
      {max !== undefined && (
        <div className="w-full h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-green)] rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemax={max}
            aria-valuemin={0}
          />
        </div>
      )}
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    free: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]',
    starter: 'bg-[var(--color-green-light)] text-[var(--color-green)]',
    pro: 'bg-[var(--color-violet-light)] text-[var(--color-violet)]',
    enterprise: 'bg-[var(--text-primary)] text-[var(--bg-primary)]',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${styles[plan.toLowerCase()] ?? styles['free']}`}>
      {plan}
    </span>
  );
}

export function BillingView() {
  const t = useTranslations('Billing');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const { data: billing, isLoading, isError } = useQuery({
    queryKey: ['billing'],
    queryFn: getBilling,
    retry: false,
  });

  const checkoutMutation = useMutation({
    mutationFn: (provider: PaymentProvider) => createCheckout(provider),
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, '_blank', 'noopener,noreferrer');
      }
    },
  });

  const pay = async (provider: PaymentProvider) => {
    setCheckoutLoading(true);
    try {
      await checkoutMutation.mutateAsync(provider);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Período actual a partir de la forma real del backend (billing.usage).
  const u = billing?.usage;
  const currentPeriod = u
    ? {
        period: billing?.period ?? '',
        responses_sent: u.responsesSent,
        cache_hits: u.cacheHits,
        llm_calls: u.llmCalls,
        escalations: u.escalations,
      }
    : undefined;
  const resolutionPct =
    billing?.resolvedWithoutHumanRate != null
      ? Math.round(billing.resolvedWithoutHumanRate * 100)
      : null;
  const paywall = billing?.paywall;

  return (
    <AppShell>
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <h1 className="font-bold text-xl text-[var(--text-primary)] mb-6">
          {t('title')}
        </h1>

        {isLoading && <LoadingPage />}

        {isError && (
          <div className="bg-[var(--color-red-light)] border border-[var(--color-red)] rounded-[var(--radius-lg)] p-4">
            <p className="text-sm text-[var(--color-red)]">{t('errorLoading')}</p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="flex flex-col gap-6">
            {/* Paywall (§17): primeras N respuestas gratis, luego activar plan */}
            {paywall?.requiresPayment && (
              <div
                role="alert"
                className="bg-[var(--color-violet-light)] border border-[var(--color-violet)] rounded-[var(--radius-lg)] p-6"
              >
                <h2 className="font-bold text-[var(--text-primary)] mb-1">{t('paywallTitle')}</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-4">{t('paywallDesc')}</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={() => pay('mercadopago')} loading={checkoutLoading}>
                    {t('payMercadoPago')}
                  </Button>
                  <Button onClick={() => pay('creem')} loading={checkoutLoading} variant="outline">
                    {t('payCard')}
                  </Button>
                </div>
              </div>
            )}

            {/* Current plan */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[var(--text-primary)]">
                  {t('currentPlan')}
                </h2>
                <PlanBadge plan={billing?.plan ?? 'free'} />
              </div>
              {paywall && (
                <p className="text-sm text-[var(--text-muted)] mb-3">
                  {t('freeLeft', { n: paywall.freeResponsesLeft })}
                </p>
              )}
              <Button
                onClick={() => pay('creem')}
                loading={checkoutLoading}
                variant="outline"
                size="sm"
              >
                {t('checkout')}
              </Button>
            </div>

            {/* Current period usage */}
            {currentPeriod ? (
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[var(--text-primary)]">
                    {t('usage')}
                  </h2>
                  <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-1 rounded-full">
                    {t('period')}: {currentPeriod.period}
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  <UsageStat
                    label={t('responsesSent')}
                    value={currentPeriod.responses_sent}
                  />
                  <UsageStat
                    label={t('cacheHits')}
                    value={currentPeriod.cache_hits}
                  />
                  <UsageStat
                    label={t('llmCalls')}
                    value={currentPeriod.llm_calls}
                  />
                  <UsageStat
                    label={t('escalations')}
                    value={currentPeriod.escalations}
                  />
                </div>

                {/* Resolution rate (métrica que aprueba el proyecto) */}
                {resolutionPct != null && (
                  <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">
                        {t('resolutionRate')}
                      </span>
                      <span className="text-lg font-bold text-[var(--color-green)]">
                        {resolutionPct}%
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {t('resolutionRateDesc')}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-6 text-center">
                <p className="text-sm text-[var(--text-muted)]">{t('noUsageData')}</p>
              </div>
            )}

            {/* History */}
            {billing?.usage_counters && billing.usage_counters.length > 1 && (
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-6">
                <h2 className="font-semibold text-[var(--text-primary)] mb-4">
                  {t('history')}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border-color)]">
                        <th className="text-left py-2 text-[var(--text-muted)] font-medium">{t('period')}</th>
                        <th className="text-right py-2 text-[var(--text-muted)] font-medium">{t('responsesSent')}</th>
                        <th className="text-right py-2 text-[var(--text-muted)] font-medium">{t('escalations')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billing.usage_counters.map((counter) => (
                        <tr key={counter.period} className="border-b border-[var(--border-color)] last:border-0">
                          <td className="py-2 text-[var(--text-primary)]">{counter.period}</td>
                          <td className="py-2 text-right text-[var(--text-secondary)]">{counter.responses_sent.toLocaleString()}</td>
                          <td className="py-2 text-right text-[var(--text-secondary)]">{counter.escalations.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
