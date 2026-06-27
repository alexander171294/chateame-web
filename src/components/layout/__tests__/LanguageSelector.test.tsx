import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSelector } from '../LanguageSelector';

// next-intl mocked: useLocale => 'en', useTranslations returns key=>key
// @/i18n/navigation mocked: useRouter, usePathname

// We need to also mock @/i18n/routing since LanguageSelector imports it directly
vi.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['es-AR', 'es', 'en', 'pt-BR'],
    defaultLocale: 'es-AR',
  },
}));

describe('LanguageSelector', () => {
  beforeEach(() => {
    document.cookie = '';
  });

  it('renders the toggle button', () => {
    render(<LanguageSelector />);
    // aria-label comes from t('select') => 'select'
    expect(screen.getByRole('button', { name: 'select' })).toBeInTheDocument();
  });

  it('dropdown is closed initially', () => {
    render(<LanguageSelector />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens dropdown on button click', async () => {
    render(<LanguageSelector />);
    await userEvent.click(screen.getByRole('button', { name: 'select' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('shows all 4 locales in dropdown', async () => {
    render(<LanguageSelector />);
    await userEvent.click(screen.getByRole('button', { name: 'select' }));
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
  });

  it('shows aria-selected=true for current locale (en)', async () => {
    render(<LanguageSelector />);
    await userEvent.click(screen.getByRole('button', { name: 'select' }));
    const options = screen.getAllByRole('option');
    const selectedOption = options.find((o) => o.getAttribute('aria-selected') === 'true');
    expect(selectedOption).toBeDefined();
  });

  it('closes dropdown when clicking an option', async () => {
    render(<LanguageSelector />);
    await userEvent.click(screen.getByRole('button', { name: 'select' }));
    const options = screen.getAllByRole('option');
    await userEvent.click(options[0]);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes dropdown when clicking backdrop', async () => {
    render(<LanguageSelector />);
    await userEvent.click(screen.getByRole('button', { name: 'select' }));
    // Find the backdrop (fixed div with aria-hidden)
    const backdrop = document.querySelector('.fixed.inset-0') as HTMLElement;
    expect(backdrop).not.toBeNull();
    await userEvent.click(backdrop);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('displays current locale label in button', () => {
    render(<LanguageSelector />);
    // useLocale() => 'en', LOCALE_LABELS['en'] => 'EN'
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('uses translation keys for locale names (no hardcoded strings in labels)', async () => {
    render(<LanguageSelector />);
    await userEvent.click(screen.getByRole('button', { name: 'select' }));
    // t('esAR') => 'esAR', t('es') => 'es', t('en') => 'en', t('ptBR') => 'ptBR'
    // Keys are locale strings with '-' removed: 'esAR', 'es', 'en', 'ptBR'
    expect(screen.getByText('esAR')).toBeInTheDocument();
  });
});
