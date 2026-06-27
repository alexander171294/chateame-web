import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from '../Switch';

describe('Switch', () => {
  it('renders with role="switch"', () => {
    render(<Switch checked={false} onChange={vi.fn()} />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('aria-checked reflects checked prop', () => {
    const { rerender } = render(<Switch checked={false} onChange={vi.fn()} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    rerender(<Switch checked={true} onChange={vi.fn()} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange with toggled value on click', async () => {
    const onChange = vi.fn();
    render(<Switch checked={false} onChange={onChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with false when checked is true', async () => {
    const onChange = vi.fn();
    render(<Switch checked={true} onChange={onChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Switch checked={false} onChange={vi.fn()} disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('does not call onChange when disabled', async () => {
    const onChange = vi.fn();
    render(<Switch checked={false} onChange={onChange} disabled />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders label text when label prop is provided', () => {
    render(<Switch checked={false} onChange={vi.fn()} label="Toggle me" />);
    expect(screen.getByText('Toggle me')).toBeInTheDocument();
  });

  it('renders description when description prop is provided', () => {
    render(<Switch checked={false} onChange={vi.fn()} description="Enables feature X" />);
    expect(screen.getByText('Enables feature X')).toBeInTheDocument();
  });

  it('label htmlFor matches switch id', () => {
    render(<Switch checked={false} onChange={vi.fn()} label="My Switch" id="my-switch" />);
    const label = screen.getByText('My Switch');
    expect(label).toHaveAttribute('for', 'my-switch');
    expect(screen.getByRole('switch')).toHaveAttribute('id', 'my-switch');
  });

  it('applies green background when checked', () => {
    render(<Switch checked={true} onChange={vi.fn()} />);
    expect(screen.getByRole('switch').className).toContain('bg-[var(--color-green)]');
  });

  it('applies gray background when unchecked', () => {
    render(<Switch checked={false} onChange={vi.fn()} />);
    expect(screen.getByRole('switch').className).not.toContain('bg-[var(--color-green)]');
  });
});
