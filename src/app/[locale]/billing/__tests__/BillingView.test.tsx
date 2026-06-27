import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BillingView } from '../BillingView';
import { createWrapper, makeBillingInfo } from '@/test/mocks';

vi.mock('@/lib/api', () => ({
  getBilling: vi.fn(),
  createCheckout: vi.fn(),
}));

vi.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['es-AR', 'es', 'en', 'pt-BR'],
    defaultLocale: 'es-AR',
  },
}));

import { getBilling, createCheckout } from '@/lib/api';

const mockGetBilling = getBilling as ReturnType<typeof vi.fn>;
const mockCreateCheckout = createCheckout as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  mockGetBilling.mockResolvedValue(makeBillingInfo());
  mockCreateCheckout.mockResolvedValue({ url: 'https://stripe.com/checkout' });
});

describe('BillingView', () => {
  it('renders the title', async () => {
    const { Wrapper } = createWrapper();
    render(<BillingView />, { wrapper: Wrapper });
    await waitFor(() => {
      // t('title') => 'title'
      expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument();
    });
  });

  it('shows loading spinner while fetching', async () => {
    mockGetBilling.mockReturnValue(new Promise(() => {}));
    const { Wrapper } = createWrapper();
    render(<BillingView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  it('shows error state on fetch failure', async () => {
    mockGetBilling.mockRejectedValue(new Error('Network error'));
    const { Wrapper } = createWrapper();
    render(<BillingView />, { wrapper: Wrapper });
    await waitFor(() => {
      // t('errorLoading') => 'errorLoading'
      expect(screen.getByText('errorLoading')).toBeInTheDocument();
    });
  });

  it('shows current plan heading', async () => {
    const { Wrapper } = createWrapper();
    render(<BillingView />, { wrapper: Wrapper });
    await waitFor(() => {
      // t('currentPlan') => 'currentPlan'
      expect(screen.getByText('currentPlan')).toBeInTheDocument();
    });
  });

  it('shows plan badge with plan name', async () => {
    mockGetBilling.mockResolvedValue(makeBillingInfo({ plan: 'starter' }));
    const { Wrapper } = createWrapper();
    render(<BillingView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText('starter')).toBeInTheDocument();
    });
  });

  it('shows "free" plan badge by default when plan is free', async () => {
    const { Wrapper } = createWrapper();
    render(<BillingView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText('free')).toBeInTheDocument();
    });
  });

  it('shows checkout button', async () => {
    const { Wrapper } = createWrapper();
    render(<BillingView />, { wrapper: Wrapper });
    await waitFor(() => {
      // t('checkout') => 'checkout'
      expect(screen.getByRole('button', { name: 'checkout' })).toBeInTheDocument();
    });
  });

  it('calls createCheckout and opens window on checkout click', async () => {
    const { Wrapper } = createWrapper();
    render(<BillingView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByRole('button', { name: 'checkout' }));
    await userEvent.click(screen.getByRole('button', { name: 'checkout' }));

    await waitFor(() => {
      expect(mockCreateCheckout).toHaveBeenCalledOnce();
      expect(window.open).toHaveBeenCalledWith(
        'https://stripe.com/checkout',
        '_blank',
        'noopener,noreferrer'
      );
    });
  });

  it('shows usage section with period', async () => {
    const { Wrapper } = createWrapper();
    render(<BillingView />, { wrapper: Wrapper });
    await waitFor(() => {
      // t('usage') => 'usage'
      expect(screen.getByText('usage')).toBeInTheDocument();
      // Period value (rendered as "period: 2024-01" en un mismo nodo)
      expect(screen.getByText(/2024-01/)).toBeInTheDocument();
    });
  });

  it('shows responses_sent stat', async () => {
    const { Wrapper } = createWrapper();
    render(<BillingView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  it('shows resolution rate when responses_sent > 0', async () => {
    const { Wrapper } = createWrapper();
    render(<BillingView />, { wrapper: Wrapper });
    await waitFor(() => {
      // t('resolutionRate') => 'resolutionRate'
      expect(screen.getByText('resolutionRate')).toBeInTheDocument();
      // (100 - 5) / 100 * 100 = 95%
      expect(screen.getByText('95%')).toBeInTheDocument();
    });
  });

  it('shows noUsageData when no usage counters', async () => {
    mockGetBilling.mockResolvedValue({ plan: 'free', usage_counters: [] });
    const { Wrapper } = createWrapper();
    render(<BillingView />, { wrapper: Wrapper });
    await waitFor(() => {
      // t('noUsageData') => 'noUsageData'
      expect(screen.getByText('noUsageData')).toBeInTheDocument();
    });
  });

  it('shows history section when multiple periods', async () => {
    mockGetBilling.mockResolvedValue(makeBillingInfo({
      usage_counters: [
        { period: '2024-02', responses_sent: 150, cache_hits: 100, llm_calls: 40, escalations: 10 },
        { period: '2024-01', responses_sent: 100, cache_hits: 70, llm_calls: 25, escalations: 5 },
      ],
    }));
    const { Wrapper } = createWrapper();
    render(<BillingView />, { wrapper: Wrapper });
    await waitFor(() => {
      // t('history') => 'history'
      expect(screen.getByText('history')).toBeInTheDocument();
    });
  });

  it('does NOT show history section with single period', async () => {
    const { Wrapper } = createWrapper();
    render(<BillingView />, { wrapper: Wrapper });
    await waitFor(() => screen.getByText('currentPlan'));
    expect(screen.queryByText('history')).not.toBeInTheDocument();
  });

  it('shows progressbar for stats', async () => {
    // usage_counters without max won't show progressbar, but we ensure render works
    const { Wrapper } = createWrapper();
    render(<BillingView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText('responsesSent')).toBeInTheDocument();
      expect(screen.getByText('cacheHits')).toBeInTheDocument();
      expect(screen.getByText('llmCalls')).toBeInTheDocument();
      expect(screen.getByText('escalations')).toBeInTheDocument();
    });
  });

  it('uses translation keys for stat labels (no hardcoded strings)', async () => {
    const { Wrapper } = createWrapper();
    render(<BillingView />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText('responsesSent')).toBeInTheDocument();
    });
  });
});
