import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner, LoadingPage } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with role="status" and aria-label', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('applies sm size classes', () => {
    render(<LoadingSpinner size="sm" />);
    expect(screen.getByRole('status').className).toContain('w-4');
  });

  it('applies md size classes (default)', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status').className).toContain('w-8');
  });

  it('applies lg size classes', () => {
    render(<LoadingSpinner size="lg" />);
    expect(screen.getByRole('status').className).toContain('w-12');
  });

  it('applies extra className', () => {
    render(<LoadingSpinner className="my-custom-class" />);
    expect(screen.getByRole('status').className).toContain('my-custom-class');
  });
});

describe('LoadingPage', () => {
  it('renders a centered spinner', () => {
    render(<LoadingPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders within a centering container', () => {
    render(<LoadingPage />);
    const spinner = screen.getByRole('status');
    const container = spinner.parentElement;
    expect(container?.className).toContain('flex');
  });
});
