import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppHeader } from '../AppHeader';

// next-intl mocked — t returns key
// @/i18n/navigation mocked — Link renders as <a>

vi.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['es-AR', 'es', 'en', 'pt-BR'],
    defaultLocale: 'es-AR',
  },
}));

describe('AppHeader', () => {
  it('renders the logo link', () => {
    render(<AppHeader />);
    // The logo Link href="/"
    const logoLink = screen.getByRole('link', { name: /chateame/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('renders nav links when showNav=true (default)', () => {
    render(<AppHeader />);
    // Nav links use t('conversations') => 'conversations', etc.
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders conversations, knowledge-base, billing nav links', () => {
    render(<AppHeader />);
    expect(screen.getByRole('link', { name: 'conversations' })).toHaveAttribute('href', '/conversations');
    expect(screen.getByRole('link', { name: 'knowledgeBase' })).toHaveAttribute('href', '/knowledge-base');
    expect(screen.getByRole('link', { name: 'billing' })).toHaveAttribute('href', '/billing');
  });

  it('hides nav when showNav=false', () => {
    render(<AppHeader showNav={false} />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('renders ThemeToggle button', () => {
    render(<AppHeader />);
    // ThemeToggle button aria-label is 'toggleDark' or 'toggleLight'
    const themeBtn = screen.getByRole('button', { name: /toggle/i });
    expect(themeBtn).toBeInTheDocument();
  });

  it('renders LanguageSelector button', () => {
    render(<AppHeader />);
    // LanguageSelector button has aria-label='select'
    expect(screen.getByRole('button', { name: 'select' })).toBeInTheDocument();
  });
});
