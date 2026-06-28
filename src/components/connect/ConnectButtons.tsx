'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Tooltip } from '@/components/ui/Tooltip';

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

type Status = 'idle' | 'submitting' | 'success' | 'error';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Botones de conexión. Durante la beta cerrada, en lugar de iniciar el OAuth
 * abren un formulario de waitlist que guarda el email en Cloudflare D1
 * (route handler /api/waitlist del propio Worker). Reusable en landing y connect.
 */
export function ConnectButtons() {
  const t = useTranslations('Connect');

  const [open, setOpen] = React.useState(false);
  const [source, setSource] = React.useState<string>('instagram');
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<Status>('idle');
  const [errorMsg, setErrorMsg] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const openModal = (platform: string) => {
    setSource(platform);
    setStatus('idle');
    setErrorMsg('');
    setEmail('');
    setOpen(true);
  };
  const closeModal = () => setOpen(false);

  React.useEffect(() => {
    if (open) {
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeModal();
      window.addEventListener('keydown', onKey);
      setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.removeEventListener('keydown', onKey);
    }
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setStatus('error');
      setErrorMsg(t('betaErrorEmail'));
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value, source }),
      });
      if (!res.ok) throw new Error('bad status');
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg(t('betaError'));
    }
  };

  return (
    <>
      <div className="w-full max-w-sm flex flex-col gap-3">
        <button
          type="button"
          onClick={() => openModal('instagram')}
          className={[
            'flex items-center justify-center gap-3',
            'w-full px-6 py-4 rounded-[var(--radius-lg)]',
            'font-semibold text-base text-white',
            'transition-all duration-[var(--transition)]',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-violet)]',
            'shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]',
            'hover:opacity-90 active:scale-[0.98]',
          ].join(' ')}
          style={{
            background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          }}
        >
          <InstagramIcon />
          {t('connectInstagram')}
        </button>

        <button
          type="button"
          onClick={() => openModal('facebook')}
          className={[
            'flex items-center justify-center gap-3',
            'w-full px-6 py-4 rounded-[var(--radius-lg)]',
            'font-semibold text-base text-white',
            'bg-[#1877F2] hover:bg-[#1666d9]',
            'transition-all duration-[var(--transition)]',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-violet)]',
            'shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]',
            'active:scale-[0.98]',
          ].join(' ')}
        >
          <FacebookIcon />
          {t('connectFacebook')}
        </button>

        <Tooltip content={t('whatsappTooltip')} position="bottom">
          <button
            type="button"
            disabled
            aria-disabled="true"
            className={[
              'flex items-center justify-center gap-3',
              'w-full px-6 py-4 rounded-[var(--radius-lg)]',
              'font-semibold text-base',
              'bg-[var(--bg-tertiary)] text-[var(--text-muted)]',
              'border border-[var(--border-color)]',
              'cursor-not-allowed opacity-60',
            ].join(' ')}
          >
            <WhatsAppIcon />
            {t('connectWhatsApp')}
            <span className="ml-auto text-xs font-normal px-2 py-0.5 bg-[var(--border-color)] rounded-full">
              {t('comingSoon')}
            </span>
          </button>
        </Tooltip>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="beta-title"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 id="beta-title" className="text-xl font-bold text-[var(--text-primary)]">
                {t('betaTitle')}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                aria-label={t('betaClose')}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xl leading-none"
              >
                ×
              </button>
            </div>

            {status === 'success' ? (
              <div className="py-6 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--color-green)] flex items-center justify-center text-white text-2xl">
                  ✓
                </div>
                <p className="font-semibold text-[var(--text-primary)]">{t('betaSuccessTitle')}</p>
                <p className="text-sm text-[var(--text-secondary)]">{t('betaSuccess')}</p>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-2 px-5 py-2 rounded-[var(--radius-md)] font-semibold text-white bg-[var(--color-green)] hover:opacity-90"
                >
                  {t('betaCloseButton')}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-4">
                <p className="text-sm text-[var(--text-secondary)]">{t('betaSubtitle')}</p>
                <input
                  ref={inputRef}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder={t('betaEmailPlaceholder')}
                  className={[
                    'w-full px-4 py-3 rounded-[var(--radius-md)] text-[var(--text-primary)]',
                    'bg-[var(--bg-secondary)] border border-[var(--border-color)]',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--color-violet)]',
                  ].join(' ')}
                />
                {status === 'error' && (
                  <p className="text-sm text-[var(--color-red)]" role="alert">
                    {errorMsg}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className={[
                    'w-full px-6 py-3 rounded-[var(--radius-lg)] font-semibold text-white',
                    'bg-[var(--color-green)] hover:opacity-90 active:scale-[0.98]',
                    'disabled:opacity-60 disabled:cursor-not-allowed transition-all',
                  ].join(' ')}
                >
                  {status === 'submitting' ? t('betaSubmitting') : t('betaSubmit')}
                </button>
                <p className="text-[11px] text-[var(--text-muted)] text-center">{t('betaPrivacy')}</p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
