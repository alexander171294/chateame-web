'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFaqs, createFaq, updateFaq, deleteFaq, getAccount, updateAccount } from '@/lib/api';
import type { Faq } from '@/lib/types';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { LoadingPage } from '@/components/ui/LoadingSpinner';

const BASE_PROMPT_PLACEHOLDER = `[BASE_GUIDE_PROMPT — instrucciones del sistema, solo lectura]

Sos un asistente de atención al cliente. Tu objetivo es responder consultas frecuentes de manera rápida y precisa. Solo respondé preguntas que estén dentro del alcance definido. Ante la duda, escalá al dueño del negocio. No inventes información ni hagas promesas que no estén confirmadas.`;

function FaqItem({ faq, onUpdate, onDelete }: {
  faq: Faq;
  onUpdate: (id: string, data: { question: string; answer: string; active?: boolean }) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
}) {
  const t = useTranslations('KnowledgeBase');
  const tCommon = useTranslations('Common');
  const [editing, setEditing] = useState(false);
  const [question, setQuestion] = useState(faq.question);
  const [answer, setAnswer] = useState(faq.answer);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(faq.id, { question, answer });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t('confirmDelete'))) return;
    setDeleting(true);
    try {
      await onDelete(faq.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={[
      'bg-[var(--bg-secondary)] border rounded-[var(--radius-lg)] p-4',
      faq.active ? 'border-[var(--border-color)]' : 'border-dashed border-[var(--border-color)] opacity-60',
    ].join(' ')}>
      {editing ? (
        <div className="flex flex-col gap-3">
          <Textarea
            label={t('question')}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={2}
          />
          <Textarea
            label={t('answer')}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { setEditing(false); setQuestion(faq.question); setAnswer(faq.answer); }}
              disabled={saving}
            >
              {tCommon('cancel')}
            </Button>
            <Button size="sm" onClick={handleSave} loading={saving}>
              {tCommon('save')}
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-[var(--text-primary)] mb-1">
                {faq.question}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">{faq.answer}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  faq.source === 'ai_seeded'
                    ? 'bg-[var(--color-violet-light)] text-[var(--color-violet)]'
                    : faq.source === 'user_edited'
                    ? 'bg-[var(--color-green-light)] text-[var(--color-green)]'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
                }`}>
                  {faq.source === 'ai_seeded' ? 'AI' : faq.source === 'user_edited' ? t('edited') : t('manual')}
                </span>
                {!faq.active && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                    {tCommon('inactive')}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => onUpdate(faq.id, { question: faq.question, answer: faq.answer, active: !faq.active })}
                title={faq.active ? tCommon('deactivate') : tCommon('activate')}
                aria-label={faq.active ? tCommon('deactivate') : tCommon('activate')}
                className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--color-green)] hover:bg-[var(--color-green-light)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--color-violet)]"
              >
                {faq.active ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={() => setEditing(true)}
                title={tCommon('edit')}
                aria-label={tCommon('edit')}
                className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--color-violet)] hover:bg-[var(--color-violet-light)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--color-violet)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                title={tCommon('delete')}
                aria-label={tCommon('delete')}
                className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--color-red)] hover:bg-[var(--color-red-light)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--color-red)] disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddFaqForm({ onAdd, onCancel }: {
  onAdd: (data: { question: string; answer: string }) => Promise<unknown>;
  onCancel: () => void;
}) {
  const t = useTranslations('KnowledgeBase');
  const tCommon = useTranslations('Common');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!question.trim() || !answer.trim()) return;
    setSaving(true);
    try {
      await onAdd({ question: question.trim(), answer: answer.trim() });
      setQuestion('');
      setAnswer('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--color-violet)] rounded-[var(--radius-lg)] p-4">
      <div className="flex flex-col gap-3">
        <Textarea
          label={t('question')}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t('questionPlaceholder')}
          rows={2}
        />
        <Textarea
          label={t('answer')}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={t('answerPlaceholder')}
          rows={3}
        />
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            {tCommon('cancel')}
          </Button>
          <Button size="sm" onClick={handleSave} loading={saving} disabled={!question.trim() || !answer.trim()}>
            {tCommon('save')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function KnowledgeBaseView() {
  const t = useTranslations('KnowledgeBase');
  const tCommon = useTranslations('Common');
  const qc = useQueryClient();
  const [addingFaq, setAddingFaq] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [editingPrompt, setEditingPrompt] = useState(false);
  const [savingPrompt, setSavingPrompt] = useState(false);

  const { data: faqs, isLoading: faqsLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: getFaqs,
    retry: false,
  });

  const { data: account } = useQuery({
    queryKey: ['account'],
    queryFn: getAccount,
    retry: false,
  });

  // Initialize system prompt from account data
  React.useEffect(() => {
    if (account?.system_prompt) {
      setSystemPrompt(account.system_prompt);
    }
  }, [account]);

  const createMutation = useMutation({
    mutationFn: createFaq,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['faqs'] });
      setAddingFaq(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateFaq>[1] }) =>
      updateFaq(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['faqs'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFaq,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['faqs'] }),
  });

  const handleSavePrompt = async () => {
    setSavingPrompt(true);
    try {
      await updateAccount({ system_prompt: systemPrompt });
      setEditingPrompt(false);
    } finally {
      setSavingPrompt(false);
    }
  };

  return (
    <AppShell>
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        {/* FAQs section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-bold text-xl text-[var(--text-primary)]">
              {t('title')}
            </h1>
            <Button size="sm" onClick={() => setAddingFaq(true)} disabled={addingFaq}>
              + {t('addFaq')}
            </Button>
          </div>

          {faqsLoading && <LoadingPage />}

          {!faqsLoading && (
            <div className="flex flex-col gap-3">
              {addingFaq && (
                <AddFaqForm
                  onAdd={(data) => createMutation.mutateAsync(data)}
                  onCancel={() => setAddingFaq(false)}
                />
              )}

              {faqs?.map((faq) => (
                <FaqItem
                  key={faq.id}
                  faq={faq}
                  onUpdate={(id, data) => updateMutation.mutateAsync({ id, data })}
                  onDelete={(id) => deleteMutation.mutateAsync(id)}
                />
              ))}

              {!faqs?.length && !addingFaq && (
                <div className="text-center py-8">
                  <p className="text-[var(--text-muted)] text-sm mb-3">{t('empty')}</p>
                  <Button size="sm" variant="outline" onClick={() => setAddingFaq(true)}>
                    + {t('addFaq')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* System prompt section */}
        <div className="border-t border-[var(--border-color)] pt-6">
          <h2 className="font-bold text-lg text-[var(--text-primary)] mb-4">
            {t('systemPrompt')}
          </h2>

          {/* Base block — read only */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-[var(--text-muted)] mb-2 uppercase tracking-wide">
              {t('basePrompt')}
            </p>
            <div className={[
              'p-3 rounded-[var(--radius-md)]',
              'bg-[var(--bg-tertiary)] border border-[var(--border-color)]',
              'text-xs text-[var(--text-muted)] font-mono whitespace-pre-wrap',
            ].join(' ')}>
              {BASE_PROMPT_PLACEHOLDER}
            </div>
          </div>

          {/* Dynamic block — editable */}
          <div>
            <p className="text-xs font-semibold text-[var(--text-muted)] mb-2 uppercase tracking-wide">
              {t('dynamicPrompt')}
            </p>
            {editingPrompt ? (
              <div className="flex flex-col gap-3">
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder={t('dynamicPromptPlaceholder')}
                  rows={6}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="secondary" size="sm" onClick={() => setEditingPrompt(false)} disabled={savingPrompt}>
                    {tCommon('cancel')}
                  </Button>
                  <Button size="sm" onClick={handleSavePrompt} loading={savingPrompt}>
                    {tCommon('save')}
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={[
                  'p-3 rounded-[var(--radius-md)] cursor-text min-h-[80px]',
                  'bg-[var(--bg-secondary)] border border-[var(--border-color)]',
                  'text-sm text-[var(--text-secondary)] whitespace-pre-wrap',
                  'hover:border-[var(--color-violet)]',
                  'transition-colors duration-[var(--transition)]',
                ].join(' ')}
                onClick={() => setEditingPrompt(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setEditingPrompt(true)}
              >
                {systemPrompt || <span className="text-[var(--text-muted)] italic">{t('dynamicPromptPlaceholder')}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
