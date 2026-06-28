import React from 'react';
import { Link } from '@/i18n/navigation';

/**
 * Contenedor de páginas legales (Privacidad, Términos, Eliminación de datos).
 * Público, sin auth. Estilo "prose" sobrio con tokens de marca.
 */
export function LegalShell({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--border-color)]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-[var(--color-green)] text-lg">
            Minibox
          </Link>
          <nav className="flex gap-4 text-sm text-[var(--text-muted)]">
            <Link href="/privacy" className="hover:text-[var(--text-primary)]">
              Privacidad
            </Link>
            <Link href="/terms" className="hover:text-[var(--text-primary)]">
              Términos
            </Link>
            <Link href="/data-deletion" className="hover:text-[var(--text-primary)]">
              Eliminar datos
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">{title}</h1>
        <p className="text-sm text-[var(--text-muted)] mb-8">Última actualización: {updatedAt}</p>
        <div className="legal-prose flex flex-col gap-5 text-[var(--text-secondary)] leading-relaxed">
          {children}
        </div>
      </main>

      <footer className="border-t border-[var(--border-color)] mt-10">
        <div className="max-w-3xl mx-auto px-4 py-6 text-xs text-[var(--text-muted)]">
          Minibox · Operado por Alexander Eberle (CUIT 20-38674516-2) · Argentina ·{' '}
          <a href="mailto:alexander171294@gmail.com" className="underline">
            alexander171294@gmail.com
          </a>
        </div>
      </footer>
    </div>
  );
}

/** Encabezado de sección reutilizable. */
export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mt-2">{title}</h2>
      {children}
    </section>
  );
}
