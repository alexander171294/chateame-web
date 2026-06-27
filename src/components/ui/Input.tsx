'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--text-secondary)]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        className={[
          'w-full px-3 py-2',
          'text-[var(--text-primary)] placeholder-[var(--text-muted)]',
          'bg-[var(--bg-secondary)]',
          'border border-[var(--border-color)] rounded-[var(--radius-md)]',
          'transition-colors duration-[var(--transition)]',
          'focus:outline-none focus:border-[var(--color-violet)] focus:ring-2 focus:ring-[var(--color-violet)] focus:ring-opacity-20',
          error ? 'border-[var(--color-red)]' : '',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className,
        ].join(' ')}
      />
      {error && (
        <p className="text-xs text-[var(--color-red)]">{error}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, id, className = '', ...props }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--text-secondary)]"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        {...props}
        className={[
          'w-full px-3 py-2',
          'text-[var(--text-primary)] placeholder-[var(--text-muted)]',
          'bg-[var(--bg-secondary)]',
          'border border-[var(--border-color)] rounded-[var(--radius-md)]',
          'transition-colors duration-[var(--transition)]',
          'focus:outline-none focus:border-[var(--color-violet)] focus:ring-2 focus:ring-[var(--color-violet)] focus:ring-opacity-20',
          'resize-y min-h-[80px]',
          error ? 'border-[var(--color-red)]' : '',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className,
        ].join(' ')}
      />
      {error && (
        <p className="text-xs text-[var(--color-red)]">{error}</p>
      )}
    </div>
  );
}
