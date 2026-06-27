import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppShell } from '../AppShell';

vi.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['es-AR', 'es', 'en', 'pt-BR'],
    defaultLocale: 'es-AR',
  },
}));

describe('AppShell', () => {
  it('renders children', () => {
    render(
      <AppShell>
        <div>Hello</div>
      </AppShell>
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders header by default (showHeader=true)', () => {
    render(<AppShell><span>Content</span></AppShell>);
    expect(screen.getByRole('banner')).toBeInTheDocument(); // <header>
  });

  it('does not render header when showHeader=false', () => {
    render(<AppShell showHeader={false}><span>Content</span></AppShell>);
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
  });

  it('renders main element', () => {
    render(<AppShell><span>Content</span></AppShell>);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('passes showNav to AppHeader', () => {
    render(<AppShell showNav={false}><span>Content</span></AppShell>);
    // When showNav=false, nav is not rendered
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});
