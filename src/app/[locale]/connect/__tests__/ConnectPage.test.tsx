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

  it('renders Instagram connect button', () => {
    render(<ConnectPage />);
    expect(screen.getByRole('button', { name: /connectInstagram/i })).toBeInTheDocument();
  });

  it('renders Facebook connect button', () => {
    render(<ConnectPage />);
    expect(screen.getByRole('button', { name: /connectFacebook/i })).toBeInTheDocument();
  });

  it('clicking Instagram opens the closed-beta waitlist modal', async () => {
    render(<ConnectPage />);
    await userEvent.click(screen.getByRole('button', { name: /connectInstagram/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('betaTitle')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('betaEmailPlaceholder')).toBeInTheDocument();
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

  it('submits the waitlist email to /api/waitlist', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    render(<ConnectPage />);
    await userEvent.click(screen.getByRole('button', { name: /connectFacebook/i }));
    await userEvent.type(screen.getByPlaceholderText('betaEmailPlaceholder'), 'test@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'betaSubmit' }));
    expect(fetchMock).toHaveBeenCalledWith('/api/waitlist', expect.objectContaining({ method: 'POST' }));
    vi.unstubAllGlobals();
  });
});
