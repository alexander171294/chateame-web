import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReferralShare } from '../ReferralShare';
import { createWrapper } from '@/test/mocks';

vi.mock('@/lib/api', () => ({ getAccount: vi.fn() }));
import { getAccount } from '@/lib/api';
const mockGetAccount = getAccount as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  mockGetAccount.mockResolvedValue({ id: 'acc-1', plan: 'free' });
});

describe('ReferralShare', () => {
  it('copia el link al portapapeles si no hay navigator.share', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText }, share: undefined });
    const { Wrapper } = createWrapper();
    render(<ReferralShare />, { wrapper: Wrapper });
    await waitFor(() => expect(screen.getByRole('button')).not.toBeDisabled());
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(expect.stringContaining('ref=acc-1'));
      expect(screen.getByText('copied')).toBeInTheDocument();
    });
  });

  it('usa navigator.share cuando está disponible', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { share });
    const { Wrapper } = createWrapper();
    render(<ReferralShare />, { wrapper: Wrapper });
    await waitFor(() => expect(screen.getByRole('button')).not.toBeDisabled());
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() =>
      expect(share).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('ref=acc-1') })),
    );
  });
});
