import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KnowledgeBaseView } from '../KnowledgeBaseView';
import { createWrapper, makeFaq } from '@/test/mocks';

vi.mock('@/lib/api', () => ({
  getFaqs: vi.fn(),
  createFaq: vi.fn(),
  updateFaq: vi.fn(),
  deleteFaq: vi.fn(),
  getAccount: vi.fn(),
  updateAccount: vi.fn(),
}));

vi.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['es-AR', 'es', 'en', 'pt-BR'],
    defaultLocale: 'es-AR',
  },
}));

import { getFaqs, createFaq, updateFaq, deleteFaq, getAccount, updateAccount } from '@/lib/api';

const mockGetFaqs = getFaqs as ReturnType<typeof vi.fn>;
const mockCreateFaq = createFaq as ReturnType<typeof vi.fn>;
const mockUpdateFaq = updateFaq as ReturnType<typeof vi.fn>;
const mockDeleteFaq = deleteFaq as ReturnType<typeof vi.fn>;
const mockGetAccount = getAccount as ReturnType<typeof vi.fn>;
const mockUpdateAccount = updateAccount as ReturnType<typeof vi.fn>;

const mockAccount = {
  id: 'acc-1',
  plan: 'free',
  responses_active: false,
  escalation_policy: 'notify_owner',
  business_summary: null,
  system_prompt: 'My custom prompt',
  ui_locale: 'en',
  content_language: null,
  channels: [],
};

beforeEach(() => {
  vi.clearAllMocks();
  mockGetFaqs.mockResolvedValue([]);
  mockCreateFaq.mockResolvedValue(makeFaq());
  mockUpdateFaq.mockResolvedValue(makeFaq());
  mockDeleteFaq.mockResolvedValue(undefined);
  mockGetAccount.mockResolvedValue(mockAccount);
  mockUpdateAccount.mockResolvedValue(mockAccount);
  vi.spyOn(window, 'confirm').mockReturnValue(true);
});

describe('KnowledgeBaseView', () => {
  it('renders the title', async () => {
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => {
      // t('title') => 'title'
      expect(screen.getByRole('heading', { name: 'title', level: 1 })).toBeInTheDocument();
    });
  });

  it('shows loading spinner while fetching', async () => {
    mockGetFaqs.mockReturnValue(new Promise(() => {}));
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  it('shows empty state when no FAQs', async () => {
    mockGetFaqs.mockResolvedValue([]);
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => {
      // t('empty') => 'empty'
      expect(screen.getByText('empty')).toBeInTheDocument();
    });
  });

  it('renders FAQ items when FAQs exist', async () => {
    mockGetFaqs.mockResolvedValue([makeFaq({ question: 'My FAQ Q', answer: 'My FAQ A' })]);
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText('My FAQ Q')).toBeInTheDocument();
      expect(screen.getByText('My FAQ A')).toBeInTheDocument();
    });
  });

  it('renders Add FAQ button', async () => {
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => {
      // Button text is `+ ${t('addFaq')}` => '+ addFaq'
      expect(screen.getByRole('button', { name: /addFaq/i })).toBeInTheDocument();
    });
  });

  it('shows AddFaqForm when Add FAQ button is clicked', async () => {
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByRole('button', { name: /addFaq/i }));
    await userEvent.click(screen.getByRole('button', { name: /addFaq/i }));
    // AddFaqForm has question and answer textareas
    expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(2);
  });

  it('calls createFaq when save is clicked in AddFaqForm', async () => {
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByRole('button', { name: /addFaq/i }));
    await userEvent.click(screen.getByRole('button', { name: /addFaq/i }));

    const textareas = screen.getAllByRole('textbox');
    await userEvent.type(textareas[0], 'New question');
    await userEvent.type(textareas[1], 'New answer');

    // Click the save button (in AddFaqForm)
    const saveBtn = screen.getByRole('button', { name: 'save' });
    await userEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockCreateFaq).toHaveBeenCalledWith({
        question: 'New question',
        answer: 'New answer',
      });
    });
  });

  it('hides AddFaqForm when cancel is clicked', async () => {
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByRole('button', { name: /addFaq/i }));
    await userEvent.click(screen.getByRole('button', { name: /addFaq/i }));
    await userEvent.click(screen.getByRole('button', { name: 'cancel' }));
    // AddFaqForm should be gone
    expect(screen.queryByPlaceholderText('questionPlaceholder')).not.toBeInTheDocument();
  });

  it('FAQ item has edit button', async () => {
    mockGetFaqs.mockResolvedValue([makeFaq()]);
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByText('Test question'));
    // edit button aria-label => t('edit') => 'edit'
    expect(screen.getByRole('button', { name: 'edit' })).toBeInTheDocument();
  });

  it('FAQ item edit mode shows save/cancel', async () => {
    mockGetFaqs.mockResolvedValue([makeFaq()]);
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByRole('button', { name: 'edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'edit' }));
    expect(screen.getByRole('button', { name: 'save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'cancel' })).toBeInTheDocument();
  });

  it('calls updateFaq when saving edited FAQ', async () => {
    mockGetFaqs.mockResolvedValue([makeFaq({ id: 'f1' })]);
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByRole('button', { name: 'edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'save' }));

    await waitFor(() => {
      expect(mockUpdateFaq).toHaveBeenCalled();
    });
  });

  it('calls deleteFaq when delete button is clicked and confirmed', async () => {
    mockGetFaqs.mockResolvedValue([makeFaq({ id: 'f1' })]);
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByRole('button', { name: 'delete' }));
    await userEvent.click(screen.getByRole('button', { name: 'delete' }));

    await waitFor(() => {
      expect(mockDeleteFaq).toHaveBeenCalledWith('f1');
    });
  });

  it('does NOT call deleteFaq when confirm is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    mockGetFaqs.mockResolvedValue([makeFaq({ id: 'f1' })]);
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByRole('button', { name: 'delete' }));
    await userEvent.click(screen.getByRole('button', { name: 'delete' }));
    expect(mockDeleteFaq).not.toHaveBeenCalled();
  });

  it('renders System Prompt section heading', async () => {
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => {
      // t('systemPrompt') => 'systemPrompt'
      expect(screen.getByRole('heading', { name: 'systemPrompt' })).toBeInTheDocument();
    });
  });

  it('renders base prompt label (read-only)', async () => {
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => {
      // t('basePrompt') => 'basePrompt'
      expect(screen.getByText('basePrompt')).toBeInTheDocument();
    });
  });

  it('renders dynamic prompt section', async () => {
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => {
      // t('dynamicPrompt') => 'dynamicPrompt'
      expect(screen.getByText('dynamicPrompt')).toBeInTheDocument();
    });
  });

  it('loads system_prompt from account data', async () => {
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText('My custom prompt')).toBeInTheDocument();
    });
  });

  it('clicking dynamic prompt area enters edit mode', async () => {
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    // El área del prompt dinámico es role="button" y su nombre accesible es su
    // contenido (el system_prompt cargado de la cuenta, async).
    const promptArea = await screen.findByRole('button', { name: /My custom prompt/ });
    await userEvent.click(promptArea);
    // Should show a textarea
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('calls updateAccount when saving dynamic prompt', async () => {
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    // Esperar a que cargue la cuenta (el área muestra el system_prompt).
    const promptArea = await screen.findByRole('button', { name: /My custom prompt/ });
    await userEvent.click(promptArea);

    // Click save
    await userEvent.click(screen.getByRole('button', { name: 'save' }));

    await waitFor(() => {
      expect(mockUpdateAccount).toHaveBeenCalled();
    });
  });

  it('FAQ source badge shows "AI" for ai_seeded', async () => {
    mockGetFaqs.mockResolvedValue([makeFaq({ source: 'ai_seeded' })]);
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText('AI')).toBeInTheDocument();
    });
  });

  it('FAQ source badge shows "edited" for user_edited', async () => {
    mockGetFaqs.mockResolvedValue([makeFaq({ source: 'user_edited' })]);
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => {
      // t('edited') => 'edited'
      expect(screen.getByText('edited')).toBeInTheDocument();
    });
  });

  it('FAQ source badge shows "manual" for user_added', async () => {
    mockGetFaqs.mockResolvedValue([makeFaq({ source: 'user_added' })]);
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => {
      // t('manual') => 'manual'
      expect(screen.getByText('manual')).toBeInTheDocument();
    });
  });

  it('shows inactive badge for inactive FAQ', async () => {
    mockGetFaqs.mockResolvedValue([makeFaq({ active: false })]);
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => {
      // tCommon('inactive') => 'inactive'
      expect(screen.getByText('inactive')).toBeInTheDocument();
    });
  });

  it('activate/deactivate button calls updateFaq with active toggle', async () => {
    mockGetFaqs.mockResolvedValue([makeFaq({ id: 'f1', active: true })]);
    const { Wrapper } = createWrapper();
    render(<KnowledgeBaseView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByRole('button', { name: 'deactivate' }));
    await userEvent.click(screen.getByRole('button', { name: 'deactivate' }));

    await waitFor(() => {
      expect(mockUpdateFaq).toHaveBeenCalledWith('f1', {
        question: 'Test question',
        answer: 'Test answer',
        active: false,
      });
    });
  });
});
