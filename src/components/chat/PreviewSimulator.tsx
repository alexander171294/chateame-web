'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import { previewAssistant } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

/**
 * GL1 — "Probá tu asistente". El dueño escribe una pregunta y ve cómo
 * respondería el bot AHORA (cache / IA) o si escalaría, sin esperar un DM real.
 * Es el momento "aha" que adelanta el time-to-value antes de activar.
 */
export function PreviewSimulator() {
  const t = useTranslations('Onboarding');
  const [question, setQuestion] = useState('');
  const mutation = useMutation({ mutationFn: (m: string) => previewAssistant(m) });
  const result = mutation.data;

  const run = () => {
    const q = question.trim();
    if (q) mutation.mutate(q);
  };

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--color-violet)] rounded-[var(--radius-lg)] p-4">
      <p className="font-semibold text-[var(--text-primary)] mb-1">{t('tryTitle')}</p>
      <p className="text-sm text-[var(--text-muted)] mb-3">{t('tryDescription')}</p>

      <div className="flex gap-2">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          placeholder={t('tryPlaceholder')}
          aria-label={t('tryPlaceholder')}
        />
        <Button onClick={run} loading={mutation.isPending} disabled={!question.trim()}>
          {t('trySend')}
        </Button>
      </div>

      {result && (
        <div className="mt-3" role="status">
          {result.willRespond ? (
            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-3">
              <span
                className={[
                  'inline-block mb-2 px-2 py-0.5 text-xs rounded-full',
                  result.source === 'cache'
                    ? 'bg-[var(--color-green-light)] text-[var(--color-green)]'
                    : 'bg-[var(--color-violet-light)] text-[var(--color-violet)]',
                ].join(' ')}
              >
                {result.source === 'cache' ? t('tryResultCache') : t('tryResultLlm')}
              </span>
              <p className="text-sm text-[var(--text-primary)]">{result.answer}</p>
            </div>
          ) : (
            <p className="text-sm text-[var(--color-red)]">{t('tryWillEscalate')}</p>
          )}
        </div>
      )}

      {mutation.isError && (
        <p className="mt-2 text-sm text-[var(--color-red)]">{t('tryError')}</p>
      )}
    </div>
  );
}
