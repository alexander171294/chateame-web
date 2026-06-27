import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from '../ChatInput';

// next-intl is mocked globally via vitest config alias
// useTranslations('Common') returns key => key

describe('ChatInput', () => {
  it('renders a textarea', () => {
    render(<ChatInput onSend={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders a send button', () => {
    render(<ChatInput onSend={vi.fn()} />);
    // The button has aria-label from t('send') => 'send'
    expect(screen.getByRole('button', { name: 'send' })).toBeInTheDocument();
  });

  it('send button is disabled when textarea is empty', () => {
    render(<ChatInput onSend={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'send' })).toBeDisabled();
  });

  it('send button becomes enabled when text is entered', async () => {
    render(<ChatInput onSend={vi.fn()} />);
    await userEvent.type(screen.getByRole('textbox'), 'Hello');
    expect(screen.getByRole('button', { name: 'send' })).not.toBeDisabled();
  });

  it('calls onSend with trimmed text on button click', async () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);
    await userEvent.type(screen.getByRole('textbox'), '  Hello world  ');
    await userEvent.click(screen.getByRole('button', { name: 'send' }));
    expect(onSend).toHaveBeenCalledWith('Hello world');
  });

  it('clears textarea after send', async () => {
    render(<ChatInput onSend={vi.fn()} />);
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, 'Hello');
    await userEvent.click(screen.getByRole('button', { name: 'send' }));
    expect(textarea).toHaveValue('');
  });

  it('calls onSend on Enter key (without Shift)', async () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);
    await userEvent.type(screen.getByRole('textbox'), 'Hello{Enter}');
    expect(onSend).toHaveBeenCalledWith('Hello');
  });

  it('does NOT call onSend on Shift+Enter', async () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);
    await userEvent.type(screen.getByRole('textbox'), 'Hello{Shift>}{Enter}{/Shift}');
    expect(onSend).not.toHaveBeenCalled();
  });

  it('is disabled when loading=true', () => {
    render(<ChatInput onSend={vi.fn()} loading />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'send' })).toBeDisabled();
  });

  it('is disabled when disabled=true', () => {
    render(<ChatInput onSend={vi.fn()} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('shows spinner in send button when loading', () => {
    render(<ChatInput onSend={vi.fn()} loading />);
    const btn = screen.getByRole('button', { name: 'send' });
    // The spinner span has aria-hidden="true"
    expect(btn.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('uses provided placeholder', () => {
    render(<ChatInput onSend={vi.fn()} placeholder="Custom placeholder" />);
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('does not call onSend when text is only whitespace', async () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);
    await userEvent.type(screen.getByRole('textbox'), '   ');
    await userEvent.click(screen.getByRole('button', { name: 'send' }));
    expect(onSend).not.toHaveBeenCalled();
  });
});
