import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PreviewSimulator } from '../PreviewSimulator';
import { createWrapper } from '@/test/mocks';

vi.mock('@/lib/api', () => ({ previewAssistant: vi.fn() }));
import { previewAssistant } from '@/lib/api';
const mockPreview = previewAssistant as ReturnType<typeof vi.fn>;

beforeEach(() => vi.clearAllMocks());

describe('PreviewSimulator', () => {
  it('renderiza título e input', () => {
    const { Wrapper } = createWrapper();
    render(<PreviewSimulator />, { wrapper: Wrapper });
    expect(screen.getByText('tryTitle')).toBeInTheDocument();
    expect(screen.getByLabelText('tryPlaceholder')).toBeInTheDocument();
  });

  it('cache hit muestra la respuesta y el badge', async () => {
    mockPreview.mockResolvedValue({ source: 'cache', answer: 'Sale $100', confidence: 0.95, willRespond: true });
    const { Wrapper } = createWrapper();
    render(<PreviewSimulator />, { wrapper: Wrapper });
    await userEvent.type(screen.getByLabelText('tryPlaceholder'), '¿precio?');
    await userEvent.click(screen.getByRole('button', { name: 'trySend' }));
    await waitFor(() => {
      expect(mockPreview).toHaveBeenCalledWith('¿precio?');
      expect(screen.getByText('Sale $100')).toBeInTheDocument();
      expect(screen.getByText('tryResultCache')).toBeInTheDocument();
    });
  });

  it('respuesta por IA muestra badge LLM', async () => {
    mockPreview.mockResolvedValue({ source: 'llm', answer: 'Respuesta IA', confidence: 0.8, willRespond: true });
    const { Wrapper } = createWrapper();
    render(<PreviewSimulator />, { wrapper: Wrapper });
    await userEvent.type(screen.getByLabelText('tryPlaceholder'), 'algo');
    await userEvent.click(screen.getByRole('button', { name: 'trySend' }));
    await waitFor(() => expect(screen.getByText('tryResultLlm')).toBeInTheDocument());
  });

  it('escalaría: muestra mensaje de escalado', async () => {
    mockPreview.mockResolvedValue({ source: 'escalate', answer: null, confidence: null, willRespond: false });
    const { Wrapper } = createWrapper();
    render(<PreviewSimulator />, { wrapper: Wrapper });
    await userEvent.type(screen.getByLabelText('tryPlaceholder'), 'raro');
    await userEvent.click(screen.getByRole('button', { name: 'trySend' }));
    await waitFor(() => expect(screen.getByText('tryWillEscalate')).toBeInTheDocument());
  });

  it('muestra error si falla', async () => {
    mockPreview.mockRejectedValue(new Error('down'));
    const { Wrapper } = createWrapper();
    render(<PreviewSimulator />, { wrapper: Wrapper });
    await userEvent.type(screen.getByLabelText('tryPlaceholder'), 'x');
    await userEvent.click(screen.getByRole('button', { name: 'trySend' }));
    await waitFor(() => expect(screen.getByText('tryError')).toBeInTheDocument());
  });

  it('el botón está deshabilitado sin texto', () => {
    const { Wrapper } = createWrapper();
    render(<PreviewSimulator />, { wrapper: Wrapper });
    expect(screen.getByRole('button', { name: 'trySend' })).toBeDisabled();
  });
});
