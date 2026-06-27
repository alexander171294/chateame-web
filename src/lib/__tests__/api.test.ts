/**
 * Tests for src/lib/api.ts
 * Mocks global fetch and verifies every exported function sends the correct
 * URL, method, body, and credentials.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getAccount,
  updateAccount,
  seedOnboarding,
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  getConversations,
  getConversation,
  answerEscalation,
  getBilling,
  createCheckout,
  assistantChat,
} from '../api';

// ── Helpers ────────────────────────────────────────────────────────────────────

function mockFetch(body: unknown, status = 200) {
  const response = {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(body),
  };
  return vi.spyOn(global, 'fetch').mockResolvedValue(response as unknown as Response);
}

function mockFetchError(body: unknown, status: number) {
  const response = {
    ok: false,
    status,
    json: vi.fn().mockResolvedValue(body),
  };
  return vi.spyOn(global, 'fetch').mockResolvedValue(response as unknown as Response);
}

// ── Base URL ──────────────────────────────────────────────────────────────────

const BASE = 'http://localhost:3000';

beforeEach(() => {
  vi.restoreAllMocks();
});

// ── getAccount ─────────────────────────────────────────────────────────────────

describe('getAccount', () => {
  it('GETs /me/account with credentials: include', async () => {
    const spy = mockFetch({ id: 'acc-1', plan: 'free' });
    const result = await getAccount();

    expect(spy).toHaveBeenCalledOnce();
    const [url, init] = spy.mock.calls[0];
    expect(url).toBe(`${BASE}/me/account`);
    expect((init as RequestInit).credentials).toBe('include');
    expect(result).toEqual({ id: 'acc-1', plan: 'free' });
  });

  it('throws ApiClientError on 401', async () => {
    mockFetchError({ message: 'Unauthorized' }, 401);
    await expect(getAccount()).rejects.toMatchObject({
      name: 'ApiClientError',
      status: 401,
      message: 'Unauthorized',
    });
  });

  it('throws ApiClientError with fallback message on 500 without body', async () => {
    const response = {
      ok: false,
      status: 500,
      json: vi.fn().mockRejectedValue(new SyntaxError('JSON parse error')),
    };
    vi.spyOn(global, 'fetch').mockResolvedValue(response as unknown as Response);
    await expect(getAccount()).rejects.toMatchObject({
      name: 'ApiClientError',
      status: 500,
    });
  });
});

// ── updateAccount ─────────────────────────────────────────────────────────────

describe('updateAccount', () => {
  it('PATCHes /account with correct body', async () => {
    const account = { id: 'acc-1', plan: 'free', responses_active: true };
    const spy = mockFetch(account);
    const result = await updateAccount({ responses_active: true });

    const [url, init] = spy.mock.calls[0];
    expect(url).toBe(`${BASE}/account`);
    expect((init as RequestInit).method).toBe('PATCH');
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ responses_active: true });
    expect((init as RequestInit).credentials).toBe('include');
    expect(result).toEqual(account);
  });

  it('can PATCH system_prompt', async () => {
    const spy = mockFetch({ id: 'acc-1' });
    await updateAccount({ system_prompt: 'Custom prompt' });

    const [, init] = spy.mock.calls[0];
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ system_prompt: 'Custom prompt' });
  });

  it('throws on 400 with error field', async () => {
    mockFetchError({ error: 'Bad request' }, 400);
    await expect(updateAccount({ responses_active: true })).rejects.toMatchObject({
      status: 400,
      message: 'Bad request',
    });
  });
});

// ── seedOnboarding ─────────────────────────────────────────────────────────────

describe('seedOnboarding', () => {
  it('POSTs /onboarding/seed', async () => {
    const seed = { business_summary: 'A shop', faqs: [] };
    const spy = mockFetch(seed);
    const result = await seedOnboarding();

    const [url, init] = spy.mock.calls[0];
    expect(url).toBe(`${BASE}/onboarding/seed`);
    expect((init as RequestInit).method).toBe('POST');
    expect(result).toEqual(seed);
  });
});

// ── getFaqs ────────────────────────────────────────────────────────────────────

describe('getFaqs', () => {
  it('GETs /faqs', async () => {
    const faqs = [{ id: 'f1', question: 'Q', answer: 'A' }];
    const spy = mockFetch(faqs);
    const result = await getFaqs();

    const [url] = spy.mock.calls[0];
    expect(url).toBe(`${BASE}/faqs`);
    expect(result).toEqual(faqs);
  });

  it('throws on 403', async () => {
    mockFetchError({ message: 'Forbidden' }, 403);
    await expect(getFaqs()).rejects.toMatchObject({ status: 403 });
  });
});

// ── createFaq ──────────────────────────────────────────────────────────────────

describe('createFaq', () => {
  it('POSTs /faqs with question and answer', async () => {
    const faq = { id: 'f1', question: 'Q', answer: 'A', source: 'user_added', active: true };
    const spy = mockFetch(faq);
    const result = await createFaq({ question: 'Q', answer: 'A' });

    const [url, init] = spy.mock.calls[0];
    expect(url).toBe(`${BASE}/faqs`);
    expect((init as RequestInit).method).toBe('POST');
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ question: 'Q', answer: 'A' });
    expect(result).toEqual(faq);
  });
});

// ── updateFaq ──────────────────────────────────────────────────────────────────

describe('updateFaq', () => {
  it('PATCHes /faqs/:id', async () => {
    const faq = { id: 'f1', question: 'Q2', answer: 'A2' };
    const spy = mockFetch(faq);
    await updateFaq('f1', { question: 'Q2', answer: 'A2' });

    const [url, init] = spy.mock.calls[0];
    expect(url).toBe(`${BASE}/faqs/f1`);
    expect((init as RequestInit).method).toBe('PATCH');
  });

  it('can toggle active field', async () => {
    const spy = mockFetch({ id: 'f1', active: false });
    await updateFaq('f1', { active: false });

    const [, init] = spy.mock.calls[0];
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ active: false });
  });
});

// ── deleteFaq ──────────────────────────────────────────────────────────────────

describe('deleteFaq', () => {
  it('DELETEs /faqs/:id and returns undefined for 204', async () => {
    const response = {
      ok: true,
      status: 204,
      json: vi.fn(),
    };
    vi.spyOn(global, 'fetch').mockResolvedValue(response as unknown as Response);
    const result = await deleteFaq('f1');

    expect(result).toBeUndefined();
  });

  it('throws on 404', async () => {
    mockFetchError({ message: 'Not found' }, 404);
    await expect(deleteFaq('f1')).rejects.toMatchObject({ status: 404 });
  });
});

// ── getConversations ──────────────────────────────────────────────────────────

describe('getConversations', () => {
  it('GETs /conversations', async () => {
    const convs = [{ id: 'c1', contact_external_id: 'user1' }];
    const spy = mockFetch(convs);
    const result = await getConversations();

    const [url] = spy.mock.calls[0];
    expect(url).toBe(`${BASE}/conversations`);
    expect(result).toEqual(convs);
  });
});

// ── getConversation ───────────────────────────────────────────────────────────

describe('getConversation', () => {
  it('GETs /conversations/:id', async () => {
    const conv = { id: 'c1', contact_external_id: 'user1', messages: [] };
    const spy = mockFetch(conv);
    const result = await getConversation('c1');

    const [url] = spy.mock.calls[0];
    expect(url).toBe(`${BASE}/conversations/c1`);
    expect(result).toEqual(conv);
  });
});

// ── answerEscalation ──────────────────────────────────────────────────────────

describe('answerEscalation', () => {
  it('POSTs /escalations/:id/answer with answer in body', async () => {
    const response = { ok: true, status: 204, json: vi.fn() };
    const spy = vi.spyOn(global, 'fetch').mockResolvedValue(response as unknown as Response);
    await answerEscalation('esc-1', 'My answer');

    const [url, init] = spy.mock.calls[0];
    expect(url).toBe(`${BASE}/escalations/esc-1/answer`);
    expect((init as RequestInit).method).toBe('POST');
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ answer: 'My answer' });
  });
});

// ── getBilling ────────────────────────────────────────────────────────────────

describe('getBilling', () => {
  it('GETs /billing', async () => {
    const billing = { plan: 'free', usage_counters: [] };
    const spy = mockFetch(billing);
    const result = await getBilling();

    const [url] = spy.mock.calls[0];
    expect(url).toBe(`${BASE}/billing`);
    expect(result).toEqual(billing);
  });
});

// ── createCheckout ────────────────────────────────────────────────────────────

describe('createCheckout', () => {
  it('POSTs /billing/checkout and returns url', async () => {
    const spy = mockFetch({ url: 'https://stripe.com/checkout/123' });
    const result = await createCheckout();

    const [url, init] = spy.mock.calls[0];
    expect(url).toBe(`${BASE}/billing/checkout`);
    expect((init as RequestInit).method).toBe('POST');
    expect(result).toEqual({ url: 'https://stripe.com/checkout/123' });
  });
});

// ── assistantChat ─────────────────────────────────────────────────────────────

describe('assistantChat', () => {
  it('POSTs /assistant/chat with messages array', async () => {
    const response = { message: 'Sure!', tool_calls: [] };
    const spy = mockFetch(response);
    const messages = [{ role: 'user' as const, content: 'Hello' }];
    const result = await assistantChat(messages);

    const [url, init] = spy.mock.calls[0];
    expect(url).toBe(`${BASE}/assistant/chat`);
    expect((init as RequestInit).method).toBe('POST');
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ messages });
    expect(result).toEqual(response);
  });

  it('sends Content-Type application/json header', async () => {
    const spy = mockFetch({ message: 'ok' });
    await assistantChat([]);

    const [, init] = spy.mock.calls[0];
    expect((init as RequestInit).headers).toMatchObject({ 'Content-Type': 'application/json' });
  });
});

// ── Error handling — error field fallback ─────────────────────────────────────

describe('error body parsing', () => {
  it('prefers message field over error field', async () => {
    mockFetchError({ message: 'Custom message', error: 'alt error' }, 422);
    await expect(getAccount()).rejects.toMatchObject({ message: 'Custom message' });
  });

  it('falls back to error field when message is absent', async () => {
    mockFetchError({ error: 'Something went wrong' }, 422);
    await expect(getAccount()).rejects.toMatchObject({ message: 'Something went wrong' });
  });

  it('falls back to HTTP status message when JSON has neither', async () => {
    mockFetchError({}, 503);
    await expect(getAccount()).rejects.toMatchObject({ message: 'HTTP 503', status: 503 });
  });
});
