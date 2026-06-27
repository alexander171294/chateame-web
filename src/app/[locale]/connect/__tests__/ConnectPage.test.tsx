import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConnectPage } from '../ConnectPage';

// next-intl mocked — t('...') => key
// @/i18n/navigation mocked — Link renders as <a>

vi.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['es-AR', 'es', 'en', 'pt-BR'],
    defaultLocale: 'es-AR',
  },
}));

describe('ConnectPage', () => {
  it('renders without crashing', () => {
    render(<ConnectPage />);
    // h1 with t('title') => 'title'
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('uses translation key for title (no hardcoded strings)', () => {
    render(<ConnectPage />);
    expect(screen.getByText('title')).toBeInTheDocument();
  });

  it('uses translation key for subtitle', () => {
    render(<ConnectPage />);
    expect(screen.getByText('subtitle')).toBeInTheDocument();
  });

  it('renders Instagram connect link with correct OAuth href', () => {
    render(<ConnectPage />);
    const igLink = screen.getByRole('link', { name: /connectInstagram/i });
    expect(igLink).toHaveAttribute('href', expect.stringContaining('/auth/meta/instagram/start'));
  });

  it('renders Facebook connect link with correct OAuth href', () => {
    render(<ConnectPage />);
    const fbLink = screen.getByRole('link', { name: /connectFacebook/i });
    expect(fbLink).toHaveAttribute('href', expect.stringContaining('/auth/meta/facebook/start'));
  });

  it('renders disabled WhatsApp button', () => {
    render(<ConnectPage />);
    const waBtn = screen.getByRole('button', { name: /connectWhatsApp/i });
    expect(waBtn).toBeDisabled();
  });

  it('WhatsApp button has aria-disabled="true"', () => {
    render(<ConnectPage />);
    const waBtn = screen.getByRole('button', { name: /connectWhatsApp/i });
    expect(waBtn).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows "comingSoon" badge on WhatsApp button', () => {
    render(<ConnectPage />);
    expect(screen.getByText('comingSoon')).toBeInTheDocument();
  });

  it('WhatsApp is wrapped in Tooltip', async () => {
    render(<ConnectPage />);
    const waBtn = screen.getByRole('button', { name: /connectWhatsApp/i });
    // Hover over the wrapper to show the tooltip
    const wrapper = waBtn.parentElement!;
    await userEvent.hover(wrapper);
    // Tooltip content = t('whatsappTooltip') => 'whatsappTooltip'
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toHaveTextContent('whatsappTooltip');
  });

  it('renders "noSignupRequired" footer note', () => {
    render(<ConnectPage />);
    expect(screen.getByText('noSignupRequired')).toBeInTheDocument();
  });

  it('uses NEXT_PUBLIC_API_URL env var in OAuth links (default localhost:3000)', () => {
    render(<ConnectPage />);
    const igLink = screen.getByRole('link', { name: /connectInstagram/i });
    expect(igLink.getAttribute('href')).toContain('localhost:3000');
  });
});
