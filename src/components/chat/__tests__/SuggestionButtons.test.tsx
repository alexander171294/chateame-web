import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SuggestionButtons } from '../SuggestionButtons';

// @/i18n/navigation is mocked globally — Link renders as <a>
// next-intl useTranslations returns key => key

describe('SuggestionButtons', () => {
  it('renders 3 navigation links', () => {
    render(<SuggestionButtons />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
  });

  it('renders conversations link with correct href', () => {
    render(<SuggestionButtons />);
    const link = screen.getByRole('link', { name: /conversations/i });
    expect(link).toHaveAttribute('href', '/conversations');
  });

  it('renders knowledge-base link with correct href', () => {
    render(<SuggestionButtons />);
    const link = screen.getByRole('link', { name: /knowledgeBase/i });
    expect(link).toHaveAttribute('href', '/knowledge-base');
  });

  it('renders billing link with correct href', () => {
    render(<SuggestionButtons />);
    const link = screen.getByRole('link', { name: /billing/i });
    expect(link).toHaveAttribute('href', '/billing');
  });

  it('uses translation keys for button labels (no hardcoded strings)', () => {
    render(<SuggestionButtons />);
    // With our mock, t('conversations') => 'conversations'
    expect(screen.getByText('conversations')).toBeInTheDocument();
    expect(screen.getByText('knowledgeBase')).toBeInTheDocument();
    expect(screen.getByText('billing')).toBeInTheDocument();
  });
});
