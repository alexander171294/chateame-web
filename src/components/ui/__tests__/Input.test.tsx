import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input, Textarea } from '../Input';

// ── Input ─────────────────────────────────────────────────────────────────────

describe('Input', () => {
  it('renders without label', () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('renders with label and links it to input via htmlFor', () => {
    render(<Input label="Email" />);
    const label = screen.getByText('Email');
    expect(label.tagName).toBe('LABEL');
    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Input error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('applies error border class when error is set', () => {
    render(<Input error="Error" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('border-[var(--color-red)]');
  });

  it('calls onChange when user types', async () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'hello');
    expect(onChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is set', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('uses provided id over generated one', () => {
    render(<Input id="custom-id" label="My label" />);
    expect(document.getElementById('custom-id')).toBeInTheDocument();
  });
});

// ── Textarea ──────────────────────────────────────────────────────────────────

describe('Textarea', () => {
  it('renders without label', () => {
    render(<Textarea placeholder="Write here" />);
    expect(screen.getByPlaceholderText('Write here')).toBeInTheDocument();
  });

  it('renders with label linked via htmlFor', () => {
    render(<Textarea label="Message" />);
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Textarea error="Too long" />);
    expect(screen.getByText('Too long')).toBeInTheDocument();
  });

  it('calls onChange on input', async () => {
    const onChange = vi.fn();
    render(<Textarea onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'abc');
    expect(onChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is set', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
