import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OnboardingView } from '../OnboardingView';
import { createWrapper, makeFaq } from '@/test/mocks';

// Mock the API module
vi.mock('@/lib/api', () => ({
  getFaqs: vi.fn(),
  updateFaq: vi.fn(),
  updateAccount: vi.fn(),
  assistantChat: vi.fn(),
  previewAssistant: vi.fn().mockResolvedValue({ source: 'cache', answer: 'x', confidence: 1, willRespond: true }),
  getAccount: vi.fn().mockResolvedValue({ id: 'acc-1', plan: 'free' }),
}));

vi.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['es-AR', 'es', 'en', 'pt-BR'],
    defaultLocale: 'es-AR',
  },
}));

import { getFaqs, updateFaq, updateAccount, assistantChat } from '@/lib/api';

const mockGetFaqs = getFaqs as ReturnType<typeof vi.fn>;
const mockUpdateFaq = updateFaq as ReturnType<typeof vi.fn>;
const mockUpdateAccount = updateAccount as ReturnType<typeof vi.fn>;
const mockAssistantChat = assistantChat as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  mockGetFaqs.mockResolvedValue([]);
  mockUpdateFaq.mockResolvedValue({});
  mockUpdateAccount.mockResolvedValue({});
  mockAssistantChat.mockResolvedValue({ message: 'Assistant reply' });
});

describe('OnboardingView', () => {
  it('renders the initial greeting message', async () => {
    const { Wrapper } = createWrapper();
    render(<OnboardingView />, { wrapper: Wrapper });
    // t('greeting') => 'greeting'
    await waitFor(() => {
      expect(screen.getByText('greeting')).toBeInTheDocument();
    });
  });

  it('shows loading state while FAQs are loading', async () => {
    // Make getFaqs never resolve during this test
    mockGetFaqs.mockReturnValue(new Promise(() => {}));
    const { Wrapper } = createWrapper();
    render(<OnboardingView />, { wrapper: Wrapper });
    // Should see loading spinner
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  it('shows "noFaqs" when FAQs list is empty', async () => {
    mockGetFaqs.mockResolvedValue([]);
    const { Wrapper } = createWrapper();
    render(<OnboardingView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText('noFaqs')).toBeInTheDocument();
    });
  });

  it('renders FAQ cards when FAQs are loaded', async () => {
    const faqs = [makeFaq({ id: 'f1', question: 'Test Q', answer: 'Test A' })];
    mockGetFaqs.mockResolvedValue(faqs);
    const { Wrapper } = createWrapper();
    render(<OnboardingView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText('Test Q')).toBeInTheDocument();
      expect(screen.getByText('Test A')).toBeInTheDocument();
    });
  });

  it('renders multiple FAQ cards', async () => {
    const faqs = [
      makeFaq({ id: 'f1', question: 'Q1', answer: 'A1' }),
      makeFaq({ id: 'f2', question: 'Q2', answer: 'A2' }),
    ];
    mockGetFaqs.mockResolvedValue(faqs);
    const { Wrapper } = createWrapper();
    render(<OnboardingView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText('Q1')).toBeInTheDocument();
      expect(screen.getByText('Q2')).toBeInTheDocument();
    });
  });

  it('renders the activate responses switch', async () => {
    const { Wrapper } = createWrapper();
    render(<OnboardingView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });
  });

  it('switch starts unchecked (responses inactive)', async () => {
    const { Wrapper } = createWrapper();
    render(<OnboardingView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    });
  });

  it('activates responses when switch is clicked', async () => {
    mockUpdateAccount.mockResolvedValue({ responses_active: true });
    const { Wrapper } = createWrapper();
    render(<OnboardingView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByRole('switch'));
    await userEvent.click(screen.getByRole('switch'));
    expect(mockUpdateAccount).toHaveBeenCalledWith({ responses_active: true });
  });

  it('renders the chat input', async () => {
    const { Wrapper } = createWrapper();
    render(<OnboardingView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByLabelText('chatPlaceholder')).toBeInTheDocument();
    });
  });

  it('sends chat message and shows assistant reply', async () => {
    mockAssistantChat.mockResolvedValue({ message: 'Great question!' });
    const { Wrapper } = createWrapper();
    render(<OnboardingView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByLabelText('chatPlaceholder'));

    await userEvent.type(screen.getByLabelText('chatPlaceholder'), 'Hello assistant');
    await userEvent.click(screen.getByRole('button', { name: 'send' }));

    await waitFor(() => {
      expect(screen.getByText('Great question!')).toBeInTheDocument();
    });
  });

  it('shows error message when chat fails', async () => {
    mockAssistantChat.mockRejectedValue(new Error('Network error'));
    const { Wrapper } = createWrapper();
    render(<OnboardingView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByLabelText('chatPlaceholder'));

    await userEvent.type(screen.getByLabelText('chatPlaceholder'), 'Hello');
    await userEvent.click(screen.getByRole('button', { name: 'send' }));

    await waitFor(() => {
      // t('errorMessage') => 'errorMessage'
      expect(screen.getByText('errorMessage')).toBeInTheDocument();
    });
  });

  it('FAQ card has edit button', async () => {
    const faqs = [makeFaq()];
    mockGetFaqs.mockResolvedValue(faqs);
    const { Wrapper } = createWrapper();
    render(<OnboardingView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByText('Test question'));
    // edit button has aria-label from t('edit') => 'edit'
    expect(screen.getByRole('button', { name: 'edit' })).toBeInTheDocument();
  });

  it('FAQ card switches to edit mode on edit button click', async () => {
    const faqs = [makeFaq()];
    mockGetFaqs.mockResolvedValue(faqs);
    const { Wrapper } = createWrapper();
    render(<OnboardingView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByRole('button', { name: 'edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'edit' }));
    // Should now show save/cancel buttons
    expect(screen.getByRole('button', { name: 'save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'cancel' })).toBeInTheDocument();
  });

  it('FAQ card save calls updateFaq', async () => {
    const faqs = [makeFaq()];
    mockGetFaqs.mockResolvedValue(faqs);
    const { Wrapper } = createWrapper();
    render(<OnboardingView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByRole('button', { name: 'edit' }));

    await userEvent.click(screen.getByRole('button', { name: 'edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'save' }));

    await waitFor(() => {
      expect(mockUpdateFaq).toHaveBeenCalled();
    });
  });

  it('FAQ card cancel resets to read mode', async () => {
    const faqs = [makeFaq()];
    mockGetFaqs.mockResolvedValue(faqs);
    const { Wrapper } = createWrapper();
    render(<OnboardingView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByRole('button', { name: 'edit' }));

    await userEvent.click(screen.getByRole('button', { name: 'edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'cancel' }));

    // After cancel, edit button should be visible again
    expect(screen.getByRole('button', { name: 'edit' })).toBeInTheDocument();
  });

  it('shows proposedFaqs label when FAQs are present', async () => {
    const faqs = [makeFaq()];
    mockGetFaqs.mockResolvedValue(faqs);
    const { Wrapper } = createWrapper();
    render(<OnboardingView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText('proposedFaqs')).toBeInTheDocument();
    });
  });
});
