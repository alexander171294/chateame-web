'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFaqs, updateFaq, updateAccount, assistantChat } from '@/lib/api';
import type { Faq, ChatMessage } from '@/lib/types';
import { AppShell } from '@/components/layout/AppShell';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { PreviewSimulator } from '@/components/chat/PreviewSimulator';
import { ReferralShare } from '@/components/layout/ReferralShare';

function FaqCard({
  faq,
  onSave,
}: {
  faq: Faq;
  onSave: (id: string, data: { question: string; answer: string }) => Promise<void>;
}) {
  const t = useTranslations('Onboarding');
  const tCommon = useTranslations('Common');
  const [editing, setEditing] = useState(false);
  const [question, setQuestion] = useState(faq.question);
  const [answer, setAnswer] = useState(faq.answer);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(faq.id, { question, answer });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setEditing(false);
  };

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-4">
      {editing ? (
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1 uppercase tracking-wide">
              {t('question')}
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={[
                'w-full px-3 py-2 text-sm text-[var(--text-primary)]',
                'bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)]',
                'focus:outline-none focus:border-[var(--color-violet)]',
                'resize-y min-h-[60px]',
              ].join(' ')}
              rows={2}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1 uppercase tracking-wide">
              {t('answer')}
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className={[
                'w-full px-3 py-2 text-sm text-[var(--text-primary)]',
                'bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)]',
                'focus:outline-none focus:border-[var(--color-violet)]',
                'resize-y min-h-[80px]',
              ].join(' ')}
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={handleCancel} disabled={saving}>
              {tCommon('cancel')}
            </Button>
            <Button size="sm" onClick={handleSave} loading={saving}>
              {tCommon('save')}
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="font-semibold text-sm text-[var(--text-primary)] flex-1">
              {faq.question}
            </p>
            <button
              type="button"
              onClick={() => setEditing(true)}
              aria-label={tCommon('edit')}
              title={tCommon('edit')}
              className={[
                'flex-shrink-0 p-1.5 rounded-[var(--radius-sm)]',
                'text-[var(--text-muted)] hover:text-[var(--color-violet)] hover:bg-[var(--color-violet-light)]',
                'transition-all duration-[var(--transition)]',
                'focus-visible:ring-2 focus-visible:ring-[var(--color-violet)]',
              ].join(' ')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">{faq.answer}</p>
          {faq.source === 'ai_seeded' && (
            <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-[var(--color-violet-light)] text-[var(--color-violet)]">
              AI
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function OnboardingView() {
  const t = useTranslations('Onboarding');
  const qc = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: faqs, isLoading: faqsLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: getFaqs,
    retry: false,
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [responsesActive, setResponsesActive] = useState(false);
  const [activating, setActivating] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  // Add initial greeting
  useEffect(() => {
    setChatMessages([
      {
        role: 'assistant',
        content: t('greeting'),
      },
    ]);
  }, [t]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const updateFaqMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { question: string; answer: string } }) =>
      updateFaq(id, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['faqs'] });
    },
  });

  const handleFaqSave = async (id: string, data: { question: string; answer: string }) => {
    await updateFaqMutation.mutateAsync({ id, data });
  };

  const handleChatSend = async (message: string) => {
    const userMsg: ChatMessage = { role: 'user', content: message };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatLoading(true);

    try {
      const response = await assistantChat(newMessages);
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.message },
      ]);
      // Refresh FAQs in case assistant modified them
      void qc.invalidateQueries({ queryKey: ['faqs'] });
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: t('errorMessage') },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleActivate = async () => {
    setActivating(true);
    try {
      await updateAccount({ responses_active: !responsesActive });
      setResponsesActive(!responsesActive);
    } catch {
      // Silently fail — user will see the toggle didn't change
    } finally {
      setActivating(false);
    }
  };

  return (
    <AppShell>
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-6 gap-6">
        {/* Chat messages */}
        <div className="flex flex-col gap-4 flex-1">
          {chatMessages.map((msg, i) => (
            <MessageBubble key={i} message={msg.content} role={msg.role} />
          ))}

          {/* FAQ Cards */}
          {!faqsLoading && faqs && faqs.length > 0 && (
            <div className="my-2">
              <p className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
                {t('proposedFaqs')}
              </p>
              <div className="flex flex-col gap-3">
                {faqs.map((faq) => (
                  <FaqCard key={faq.id} faq={faq} onSave={handleFaqSave} />
                ))}
              </div>
            </div>
          )}

          {faqsLoading && (
            <div className="flex justify-center py-4">
              <LoadingPage />
            </div>
          )}

          {!faqsLoading && faqs && faqs.length === 0 && (
            <div className="text-center text-sm text-[var(--text-muted)] py-4">
              {t('noFaqs')}
            </div>
          )}

          {chatLoading && (
            <div className="flex justify-start gap-2 items-center">
              <div className="w-8 h-8 rounded-full bg-[var(--color-violet)] flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <div className="flex gap-1 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] rounded-bl-sm">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* GL1: simulador "probá tu asistente" (aha antes de activar) */}
        <PreviewSimulator />

        {/* Activate switch */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-[var(--text-primary)]">
                {t('activateResponses')}
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                {responsesActive ? t('activeDescription') : t('inactiveDescription')}
              </p>
            </div>
            <Switch
              checked={responsesActive}
              onChange={handleActivate}
              disabled={activating}
              id="responses-active"
            />
          </div>
          {/* GL3: invitar a otro negocio (referral) */}
          <div className="mt-3 pt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-2">
            <span className="text-sm text-[var(--text-muted)]">{t('referralPrompt')}</span>
            <ReferralShare />
          </div>
        </div>

        {/* Chat input */}
        <div className="sticky bottom-4">
          <ChatInput
            onSend={handleChatSend}
            loading={chatLoading}
            placeholder={t('chatPlaceholder')}
          />
        </div>
      </div>
    </AppShell>
  );
}
