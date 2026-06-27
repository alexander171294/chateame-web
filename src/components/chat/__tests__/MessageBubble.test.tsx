import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageBubble } from '../MessageBubble';

describe('MessageBubble', () => {
  it('renders the message text', () => {
    render(<MessageBubble message="Hello world" role="user" />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders timestamp when provided', () => {
    render(<MessageBubble message="Hi" role="user" timestamp="10:00 AM" />);
    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
  });

  it('does not render timestamp when not provided', () => {
    render(<MessageBubble message="Hi" role="user" />);
    // No extra text beyond the message
    expect(screen.queryByText('AM')).not.toBeInTheDocument();
  });

  it('user bubble is right-aligned', () => {
    render(<MessageBubble message="User msg" role="user" />);
    const wrapper = screen.getByText('User msg').closest('.flex')!;
    expect(wrapper.className).toContain('justify-end');
  });

  it('assistant bubble is left-aligned', () => {
    render(<MessageBubble message="Assistant msg" role="assistant" />);
    const wrapper = screen.getByText('Assistant msg').closest('.flex')!;
    expect(wrapper.className).toContain('justify-start');
  });

  it('shows AI avatar for assistant role', () => {
    render(<MessageBubble message="AI response" role="assistant" />);
    // The AI avatar has aria-hidden="true" and contains "AI" text
    expect(screen.getByText('AI')).toBeInTheDocument();
  });

  it('does not show AI avatar for user role', () => {
    render(<MessageBubble message="User msg" role="user" />);
    expect(screen.queryByText('AI')).not.toBeInTheDocument();
  });

  it('user bubble has green background class', () => {
    render(<MessageBubble message="User" role="user" />);
    const bubble = screen.getByText('User').closest('[class*="bg-[var(--color-green)]"]');
    expect(bubble).not.toBeNull();
  });

  it('assistant bubble has secondary background class', () => {
    render(<MessageBubble message="Bot" role="assistant" />);
    const bubble = screen.getByText('Bot').closest('[class*="bg-[var(--bg-secondary)]"]');
    expect(bubble).not.toBeNull();
  });

  it('preserves whitespace in message', () => {
    render(<MessageBubble message={'Line 1\nLine 2'} role="user" />);
    const p = screen.getByText(/Line 1/);
    expect(p.className).toContain('whitespace-pre-wrap');
  });
});
