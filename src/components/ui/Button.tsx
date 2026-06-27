'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'text-white font-semibold',
    'bg-[var(--color-green)] hover:bg-[var(--color-green-hover)]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  secondary: [
    'text-[var(--text-primary)] font-medium',
    'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]',
    'border border-[var(--border-color)]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  destructive: [
    'text-white font-semibold',
    'bg-[var(--color-red)] hover:bg-[var(--color-red-hover)]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  ghost: [
    'text-[var(--text-primary)] font-medium',
    'hover:bg-[var(--bg-tertiary)]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  outline: [
    'text-[var(--color-violet)] font-semibold',
    'border-2 border-[var(--color-violet)]',
    'hover:bg-[var(--color-violet-light)]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-[var(--radius-sm)]',
  md: 'px-4 py-2 text-base rounded-[var(--radius-md)]',
  lg: 'px-6 py-3 text-lg rounded-[var(--radius-lg)]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2',
        'transition-all duration-[var(--transition)]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-violet)] focus-visible:outline-offset-2',
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(' ')}
    >
      {loading && (
        <span
          className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
