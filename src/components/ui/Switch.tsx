'use client';

import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  id,
}: SwitchProps) {
  const switchId = id ?? label?.toLowerCase().replace(/\s+/g, '-') ?? 'switch';

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        id={switchId}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-6 w-11 flex-shrink-0',
          'rounded-full border-2 border-transparent',
          'transition-colors duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-violet)] focus-visible:ring-offset-2',
          checked
            ? 'bg-[var(--color-green)]'
            : 'bg-[var(--border-color)]',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ].join(' ')}
      >
        <span
          className={[
            'pointer-events-none inline-block h-5 w-5',
            'transform rounded-full bg-white shadow',
            'transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0',
          ].join(' ')}
          aria-hidden="true"
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={switchId}
              className="text-sm font-medium text-[var(--text-primary)] cursor-pointer"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-[var(--text-muted)]">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
