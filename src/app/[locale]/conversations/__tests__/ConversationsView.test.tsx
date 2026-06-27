import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConversationsView } from '../ConversationsView';
import { createWrapper, makeConversation, makeMessage } from '@/test/mocks';

vi.mock('@/lib/api', () => ({
  getConversations: vi.fn(),
  getConversation: vi.fn(),
  answerEscalation: vi.fn(),
}));

vi.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['es-AR', 'es', 'en', 'pt-BR'],
    defaultLocale: 'es-AR',
  },
}));

import { getConversations, getConversation, answerEscalation } from '@/lib/api';

const mockGetConversations = getConversations as ReturnType<typeof vi.fn>;
const mockGetConversation = getConversation as ReturnType<typeof vi.fn>;
const mockAnswerEscalation = answerEscalation as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  mockGetConversations.mockResolvedValue([]);
  mockGetConversation.mockResolvedValue(makeConversation());
  mockAnswerEscalation.mockResolvedValue(undefined);
});

describe('ConversationsView', () => {
  it('renders the title', async () => {
    const { Wrapper } = createWrapper();
    render(<ConversationsView />, { wrapper: Wrapper });
    // t('title') => 'title'
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument();
    });
  });

  it('shows loading spinner while fetching', async () => {
    mockGetConversations.mockReturnValue(new Promise(() => {}));
    const { Wrapper } = createWrapper();
    render(<ConversationsView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  it('shows empty state when no conversations', async () => {
    mockGetConversations.mockResolvedValue([]);
    const { Wrapper } = createWrapper();
    render(<ConversationsView />, { wrapper: Wrapper });
    await waitFor(() => {
      // t('empty') => 'empty'
      expect(screen.getByText('empty')).toBeInTheDocument();
    });
  });

  it('shows error state on fetch failure', async () => {
    mockGetConversations.mockRejectedValue(new Error('Network error'));
    const { Wrapper } = createWrapper();
    render(<ConversationsView />, { wrapper: Wrapper });
    await waitFor(() => {
      // t('errorLoading') => 'errorLoading'
      expect(screen.getByText('errorLoading')).toBeInTheDocument();
    });
  });

  it('renders conversation list items', async () => {
    const convs = [
      makeConversation({ id: 'c1', contact_external_id: 'user_abc' }),
      makeConversation({ id: 'c2', contact_external_id: 'user_xyz' }),
    ];
    mockGetConversations.mockResolvedValue(convs);
    const { Wrapper } = createWrapper();
    render(<ConversationsView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText('user_abc')).toBeInTheDocument();
      expect(screen.getByText('user_xyz')).toBeInTheDocument();
    });
  });

  it('shows contact initial as avatar', async () => {
    mockGetConversations.mockResolvedValue([
      makeConversation({ contact_external_id: 'user_abc' }),
    ]);
    const { Wrapper } = createWrapper();
    render(<ConversationsView />, { wrapper: Wrapper });
    await waitFor(() => {
      // Avatar shows first letter uppercased
      expect(screen.getAllByText('U').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('shows selectConversation prompt on desktop', async () => {
    mockGetConversations.mockResolvedValue([]);
    const { Wrapper } = createWrapper();
    render(<ConversationsView />, { wrapper: Wrapper });
    await waitFor(() => {
      // t('selectConversation') => 'selectConversation'
      expect(screen.getByText('selectConversation')).toBeInTheDocument();
    });
  });

  it('loads conversation detail on list item click', async () => {
    const conv = makeConversation({ id: 'c1', contact_external_id: 'user_abc' });
    mockGetConversations.mockResolvedValue([conv]);
    const detailConv = {
      ...conv,
      messages: [makeMessage({ id: 'm1', body: 'Hello from user', direction: 'in' })],
      escalations: [],
    };
    mockGetConversation.mockResolvedValue(detailConv);

    const { Wrapper } = createWrapper();
    render(<ConversationsView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByText('user_abc'));
    await userEvent.click(screen.getByText('user_abc'));

    await waitFor(() => {
      expect(mockGetConversation).toHaveBeenCalledWith('c1');
    });
  });

  it('shows messages when conversation is selected', async () => {
    const conv = makeConversation({ id: 'c1', contact_external_id: 'user_abc' });
    mockGetConversations.mockResolvedValue([conv]);
    const detailConv = {
      ...conv,
      messages: [makeMessage({ id: 'm1', body: 'Hello from user', direction: 'in' })],
    };
    mockGetConversation.mockResolvedValue(detailConv);

    const { Wrapper } = createWrapper();
    render(<ConversationsView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByText('user_abc'));
    await userEvent.click(screen.getByText('user_abc'));

    await waitFor(() => {
      expect(screen.getByText('Hello from user')).toBeInTheDocument();
    });
  });

  it('shows noMessages when conversation has no messages', async () => {
    const conv = makeConversation({ id: 'c1', contact_external_id: 'user_abc' });
    mockGetConversations.mockResolvedValue([conv]);
    mockGetConversation.mockResolvedValue({ ...conv, messages: [], escalations: [] });

    const { Wrapper } = createWrapper();
    render(<ConversationsView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByText('user_abc'));
    await userEvent.click(screen.getByText('user_abc'));

    await waitFor(() => {
      // t('noMessages') => 'noMessages'
      expect(screen.getByText('noMessages')).toBeInTheDocument();
    });
  });

  it('shows escalation panel for pending escalations', async () => {
    const conv = makeConversation({ id: 'c1', contact_external_id: 'user_abc' });
    mockGetConversations.mockResolvedValue([conv]);
    const escalation = {
      id: 'esc-1',
      status: 'pending' as const,
      owner_answer: null,
      created_at: '2024-01-01',
      message: makeMessage({ body: 'Escalated message' }),
    };
    mockGetConversation.mockResolvedValue({
      ...conv,
      messages: [],
      escalations: [escalation],
    });

    const { Wrapper } = createWrapper();
    render(<ConversationsView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByText('user_abc'));
    await userEvent.click(screen.getByText('user_abc'));

    await waitFor(() => {
      // t('escalationPending') => 'escalationPending'
      expect(screen.getByText('escalationPending')).toBeInTheDocument();
      expect(screen.getByText('Escalated message')).toBeInTheDocument();
    });
  });

  it('submits answer to escalation', async () => {
    const conv = makeConversation({ id: 'c1', contact_external_id: 'user_abc' });
    mockGetConversations.mockResolvedValue([conv]);
    const escalation = {
      id: 'esc-1',
      status: 'pending' as const,
      owner_answer: null,
      created_at: '2024-01-01',
      message: makeMessage({ body: 'Escalated message' }),
    };
    mockGetConversation.mockResolvedValue({
      ...conv,
      messages: [],
      escalations: [escalation],
    });

    const { Wrapper } = createWrapper();
    render(<ConversationsView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByText('user_abc'));
    await userEvent.click(screen.getByText('user_abc'));
    await waitFor(() => screen.getByText('escalationPending'));

    // Find the textarea for the answer and type in it
    const textarea = screen.getByPlaceholderText('yourAnswer');
    await userEvent.type(textarea, 'My answer here');
    await userEvent.click(screen.getByRole('button', { name: 'answerEscalation' }));

    await waitFor(() => {
      expect(mockAnswerEscalation).toHaveBeenCalledWith('esc-1', 'My answer here');
    });
  });

  it('shows Instagram platform for instagram channel', async () => {
    mockGetConversations.mockResolvedValue([
      makeConversation({ channel: { id: 'ch-1', platform: 'instagram', active: true } }),
    ]);
    const { Wrapper } = createWrapper();
    render(<ConversationsView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText('Instagram')).toBeInTheDocument();
    });
  });

  it('shows Facebook platform for facebook channel', async () => {
    mockGetConversations.mockResolvedValue([
      makeConversation({ channel: { id: 'ch-1', platform: 'facebook', active: true } }),
    ]);
    const { Wrapper } = createWrapper();
    render(<ConversationsView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText('Facebook')).toBeInTheDocument();
    });
  });
});
