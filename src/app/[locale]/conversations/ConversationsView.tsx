'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConversations, getConversation, answerEscalation } from '@/lib/api';
import type { Conversation, Message, Escalation } from '@/lib/types';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/LoadingSpinner';

function HandledByBadge({ handledBy }: { handledBy: Message['handled_by'] }) {
  const t = useTranslations('Conversations');

  const styles: Record<Message['handled_by'], string> = {
    cache: 'bg-[var(--color-green-light)] text-[var(--color-green)]',
    llm: 'bg-[var(--color-violet-light)] text-[var(--color-violet)]',
    human: 'bg-[var(--color-green-light)] text-[var(--color-green)]',
    none: 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]',
  };

  const labels: Record<Message['handled_by'], string> = {
    cache: 'Cache',
    llm: 'IA',
    human: t('handledByHuman'),
    none: '—',
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[handledBy]}`}>
      {labels[handledBy]}
    </span>
  );
}

function EscalationPanel({
  escalation,
  onAnswer,
}: {
  escalation: Escalation;
  onAnswer: (id: string, answer: string) => Promise<void>;
}) {
  const t = useTranslations('Conversations');
  const [answer, setAnswer] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!answer.trim()) return;
    setSending(true);
    try {
      await onAnswer(escalation.id, answer.trim());
      setAnswer('');
    } finally {
      setSending(false);
    }
  };

  if (escalation.status !== 'pending') return null;

  return (
    <div className="mt-3 p-3 bg-[var(--color-red-light)] border border-[var(--color-red)] rounded-[var(--radius-md)]">
      <p className="text-xs font-semibold text-[var(--color-red)] mb-2">
        {t('escalationPending')}
      </p>
      <p className="text-sm text-[var(--text-secondary)] mb-3">
        {escalation.message.body}
      </p>
      <div className="flex gap-2">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={t('yourAnswer')}
          rows={2}
          className={[
            'flex-1 px-3 py-2 text-sm rounded-[var(--radius-md)]',
            'border border-[var(--border-color)] bg-[var(--bg-secondary)]',
            'text-[var(--text-primary)] placeholder-[var(--text-muted)]',
            'focus:outline-none focus:border-[var(--color-violet)]',
            'resize-none',
          ].join(' ')}
        />
        <Button
          size="sm"
          onClick={handleSend}
          loading={sending}
          disabled={!answer.trim()}
          className="self-end"
        >
          {t('answerEscalation')}
        </Button>
      </div>
    </div>
  );
}

function ConversationDetail({ conversationId }: { conversationId: string }) {
  const t = useTranslations('Conversations');
  const qc = useQueryClient();

  const { data: conv, isLoading } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => getConversation(conversationId),
    retry: false,
  });

  const answerMutation = useMutation({
    mutationFn: ({ id, answer }: { id: string; answer: string }) =>
      answerEscalation(id, answer),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['conversation', conversationId] });
    },
  });

  if (isLoading) return <LoadingPage />;
  if (!conv) return null;

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-sm font-bold text-[var(--text-muted)]">
          {conv.contact_external_id?.[0]?.toUpperCase() ?? '?'}
        </div>
        <span className="font-medium text-[var(--text-primary)] text-sm">
          {conv.contact_external_id}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {conv.messages?.map((msg) => (
          <div key={msg.id} className={`flex ${msg.direction === 'in' ? 'justify-start' : 'justify-end'}`}>
            <div
              className={[
                'max-w-[80%] px-3 py-2 rounded-[var(--radius-lg)] text-sm',
                msg.direction === 'in'
                  ? 'bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-bl-sm'
                  : 'bg-[var(--color-green)] text-white rounded-br-sm',
              ].join(' ')}
            >
              <p>{msg.body}</p>
              {msg.direction === 'out' && (
                <div className="mt-1 flex justify-end">
                  <HandledByBadge handledBy={msg.handled_by} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {conv.escalations?.filter((e) => e.status === 'pending').map((esc) => (
        <EscalationPanel
          key={esc.id}
          escalation={esc}
          onAnswer={(id, answer) => answerMutation.mutateAsync({ id, answer })}
        />
      ))}

      {(!conv.messages || conv.messages.length === 0) && (
        <p className="text-sm text-[var(--text-muted)] text-center py-4">{t('noMessages')}</p>
      )}
    </div>
  );
}

export function ConversationsView() {
  const t = useTranslations('Conversations');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: conversations, isLoading, isError } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
    retry: false,
  });

  return (
    <AppShell>
      <div className="flex-1 flex flex-col md:flex-row max-w-5xl mx-auto w-full">
        {/* List panel */}
        <div className={[
          'w-full md:w-80 md:flex-shrink-0',
          'border-b md:border-b-0 md:border-r border-[var(--border-color)]',
          'overflow-y-auto',
          selectedId ? 'hidden md:block' : 'block',
        ].join(' ')}>
          <div className="p-4 border-b border-[var(--border-color)]">
            <h1 className="font-bold text-xl text-[var(--text-primary)]">
              {t('title')}
            </h1>
          </div>

          {isLoading && <LoadingPage />}

          {isError && (
            <div className="p-4 text-center text-sm text-[var(--color-red)]">
              {t('errorLoading')}
            </div>
          )}

          {!isLoading && !isError && (!conversations || conversations.length === 0) && (
            <div className="p-6 text-center">
              <p className="text-[var(--text-muted)] text-sm">{t('empty')}</p>
            </div>
          )}

          {conversations?.map((conv: Conversation) => (
            <button
              key={conv.id}
              type="button"
              onClick={() => setSelectedId(conv.id)}
              className={[
                'w-full text-left px-4 py-3',
                'border-b border-[var(--border-color)]',
                'transition-colors duration-[var(--transition)]',
                selectedId === conv.id
                  ? 'bg-[var(--color-violet-light)]'
                  : 'hover:bg-[var(--bg-tertiary)]',
                'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-violet)]',
              ].join(' ')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-sm font-bold text-[var(--text-muted)] flex-shrink-0">
                  {conv.contact_external_id?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[var(--text-primary)] truncate">
                    {conv.contact_external_id}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {conv.channel?.platform === 'instagram' ? 'Instagram' : 'Facebook'}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className={[
          'flex-1 overflow-y-auto',
          selectedId ? 'block' : 'hidden md:block',
        ].join(' ')}>
          {selectedId ? (
            <div>
              <div className="p-4 border-b border-[var(--border-color)] flex items-center gap-2 md:hidden">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="text-[var(--color-violet)] text-sm font-medium"
                >
                  ← {t('backToList')}
                </button>
              </div>
              <ConversationDetail conversationId={selectedId} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <p className="text-[var(--text-muted)] text-sm">{t('selectConversation')}</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
