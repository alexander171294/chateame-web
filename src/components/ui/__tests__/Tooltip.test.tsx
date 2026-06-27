import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from '../Tooltip';

describe('Tooltip', () => {
  it('renders children', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
  });

  it('tooltip is not visible initially', () => {
    render(
      <Tooltip content="Secret tip">
        <button>Hover</button>
      </Tooltip>
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip on mouse enter', async () => {
    render(
      <Tooltip content="Helpful tip">
        <button>Hover</button>
      </Tooltip>
    );
    const wrapper = screen.getByRole('button').parentElement!;
    await userEvent.hover(wrapper);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful tip');
  });

  it('hides tooltip on mouse leave', async () => {
    render(
      <Tooltip content="Helpful tip">
        <button>Hover</button>
      </Tooltip>
    );
    const wrapper = screen.getByRole('button').parentElement!;
    await userEvent.hover(wrapper);
    await userEvent.unhover(wrapper);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip on focus', async () => {
    render(
      <Tooltip content="Focus tip">
        <button>Focus me</button>
      </Tooltip>
    );
    await userEvent.tab(); // focus the button
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('hides tooltip on blur', async () => {
    render(
      <Tooltip content="Focus tip">
        <button>Focus me</button>
      </Tooltip>
    );
    await userEvent.tab(); // focus
    await userEvent.tab(); // blur away
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('applies top position styles by default', async () => {
    render(
      <Tooltip content="Top tip">
        <button>Hover</button>
      </Tooltip>
    );
    const wrapper = screen.getByRole('button').parentElement!;
    await userEvent.hover(wrapper);
    expect(screen.getByRole('tooltip').className).toContain('bottom-full');
  });

  it('applies bottom position styles', async () => {
    render(
      <Tooltip content="Bottom tip" position="bottom">
        <button>Hover</button>
      </Tooltip>
    );
    const wrapper = screen.getByRole('button').parentElement!;
    await userEvent.hover(wrapper);
    expect(screen.getByRole('tooltip').className).toContain('top-full');
  });

  it('applies left position styles', async () => {
    render(
      <Tooltip content="Left tip" position="left">
        <button>Hover</button>
      </Tooltip>
    );
    const wrapper = screen.getByRole('button').parentElement!;
    await userEvent.hover(wrapper);
    expect(screen.getByRole('tooltip').className).toContain('right-full');
  });

  it('applies right position styles', async () => {
    render(
      <Tooltip content="Right tip" position="right">
        <button>Hover</button>
      </Tooltip>
    );
    const wrapper = screen.getByRole('button').parentElement!;
    await userEvent.hover(wrapper);
    expect(screen.getByRole('tooltip').className).toContain('left-full');
  });
});
