'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface ChatInputProps {
  onSend: (message: string) => void | Promise<void>;
  loading?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  onSend,
  loading = false,
  placeholder,
  disabled = false,
}: ChatInputProps) {
  const t = useTranslations('Common');
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(async () => {
    const trimmed = value.trim();
    if (!trimmed || loading || disabled) return;
    setValue('');
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    await onSend(trimmed);
  }, [value, loading, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  return (
    <div
      className={[
        'flex items-end gap-2 p-3',
        'bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-lg)]',
        'shadow-[var(--shadow-md)]',
      ].join(' ')}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? t('chatPlaceholder')}
        disabled={disabled || loading}
        rows={1}
        className={[
          'flex-1 resize-none bg-transparent outline-none',
          'text-[var(--text-primary)] placeholder-[var(--text-muted)]',
          'text-sm leading-relaxed',
          'min-h-[36px] max-h-[200px]',
          'py-1 px-1',
          'disabled:opacity-50',
        ].join(' ')}
        aria-label={placeholder ?? t('chatPlaceholder')}
      />
      <button
        type="button"
        onClick={() => void handleSubmit()}
        disabled={!value.trim() || loading || disabled}
        aria-label={t('send')}
        className={[
          'flex-shrink-0 flex items-center justify-center',
          'w-9 h-9 rounded-full',
          'transition-all duration-[var(--transition)]',
          'focus-visible:ring-2 focus-visible:ring-[var(--color-violet)] focus-visible:ring-offset-2',
          value.trim() && !loading && !disabled
            ? 'bg-[var(--color-green)] text-white hover:bg-[var(--color-green-hover)]'
            : 'bg-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed',
        ].join(' ')}
      >
        {loading ? (
          <span
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
