import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '../ThemeToggle';

// next-intl is mocked — t('toggleDark') => 'toggleDark', t('toggleLight') => 'toggleLight'

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

describe('ThemeToggle', () => {
  it('renders a button', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('starts in light mode (no localStorage key, matchMedia returns false)', () => {
    render(<ThemeToggle />);
    // After effect, should be 'toggleDark' label (we're in light mode, click = go dark)
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'toggleDark');
  });

  it('toggles to dark mode on click', async () => {
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole('button'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('chateame-theme')).toBe('dark');
  });

  it('changes aria-label to toggleLight after switching to dark', async () => {
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'toggleLight');
  });

  it('toggles back to light mode on second click', async () => {
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole('button')); // dark
    await userEvent.click(screen.getByRole('button')); // light
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('chateame-theme')).toBe('light');
  });

  it('reads persisted dark theme from localStorage on mount', async () => {
    localStorage.setItem('chateame-theme', 'dark');
    await act(async () => {
      render(<ThemeToggle />);
    });
    // In dark mode, the label should be toggleLight
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'toggleLight');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('reads persisted light theme from localStorage on mount', async () => {
    localStorage.setItem('chateame-theme', 'light');
    await act(async () => {
      render(<ThemeToggle />);
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'toggleDark');
  });
});
