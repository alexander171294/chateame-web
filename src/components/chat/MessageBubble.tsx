import React from 'react';

interface MessageBubbleProps {
  message: string;
  role: 'user' | 'assistant';
  timestamp?: string;
}

export function MessageBubble({ message, role, timestamp }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div
      className={[
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start',
      ].join(' ')}
    >
      {!isUser && (
        <div
          aria-hidden="true"
          className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-violet)] flex items-center justify-center mr-2 mt-1"
        >
          <span className="text-white text-xs font-bold">AI</span>
        </div>
      )}
      <div
        className={[
          'max-w-[80%] md:max-w-[70%] rounded-[var(--radius-lg)] px-4 py-3',
          isUser
            ? 'bg-[var(--color-green)] text-white rounded-br-sm'
            : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-bl-sm',
        ].join(' ')}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message}
        </p>
        {timestamp && (
          <p
            className={[
              'text-xs mt-1',
              isUser ? 'text-white/70' : 'text-[var(--text-muted)]',
            ].join(' ')}
          >
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}
