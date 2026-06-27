/**
 * Typed fetch client for chateame-api.
 * Base URL from NEXT_PUBLIC_API_URL env var (default: http://localhost:3000).
 * Always sends credentials (cookie session).
 */

import type {
  Account,
  Faq,
  Conversation,
  BillingInfo,
  ChatMessage,
  AssistantChatResponse,
  OnboardingSeedResponse,
  PreviewResult,
  PaymentProvider,
} from './types';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const body = await response.json() as { message?: string; error?: string };
      errorMessage = body.message ?? body.error ?? errorMessage;
    } catch {
      // Ignore JSON parse errors
    }
    throw new ApiClientError(errorMessage, response.status);
  }

  // Handle empty responses (e.g., 204 No Content)
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ── Account ──────────────────────────────────────────────────────────────────

export async function getAccount(): Promise<Account> {
  return apiFetch<Account>('/me/account');
}

export async function updateAccount(
  data: Partial<Pick<Account, 'responses_active' | 'system_prompt' | 'business_summary' | 'escalation_policy' | 'ui_locale'>>,
): Promise<Account> {
  return apiFetch<Account>('/account', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// ── Onboarding ────────────────────────────────────────────────────────────────

export async function seedOnboarding(): Promise<OnboardingSeedResponse> {
  return apiFetch<OnboardingSeedResponse>('/onboarding/seed', {
    method: 'POST',
  });
}

// ── FAQs ──────────────────────────────────────────────────────────────────────

export async function getFaqs(): Promise<Faq[]> {
  return apiFetch<Faq[]>('/faqs');
}

export async function createFaq(data: { question: string; answer: string }): Promise<Faq> {
  return apiFetch<Faq>('/faqs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateFaq(
  id: string,
  data: { question?: string; answer?: string; active?: boolean },
): Promise<Faq> {
  return apiFetch<Faq>(`/faqs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteFaq(id: string): Promise<void> {
  return apiFetch<void>(`/faqs/${id}`, {
    method: 'DELETE',
  });
}

// ── Conversations ─────────────────────────────────────────────────────────────

export async function getConversations(): Promise<Conversation[]> {
  return apiFetch<Conversation[]>('/conversations');
}

export async function getConversation(id: string): Promise<Conversation> {
  return apiFetch<Conversation>(`/conversations/${id}`);
}

// ── Escalations ───────────────────────────────────────────────────────────────

export async function answerEscalation(
  id: string,
  answer: string,
): Promise<void> {
  return apiFetch<void>(`/escalations/${id}/answer`, {
    method: 'POST',
    body: JSON.stringify({ answer }),
  });
}

// ── Billing ───────────────────────────────────────────────────────────────────

export async function getBilling(): Promise<BillingInfo> {
  return apiFetch<BillingInfo>('/billing');
}

export async function createCheckout(provider?: PaymentProvider): Promise<{ url: string }> {
  return apiFetch<{ url: string }>('/billing/checkout', {
    method: 'POST',
    body: JSON.stringify({ provider: provider ?? 'creem' }),
  });
}

// ── Assistant chat ────────────────────────────────────────────────────────────

export async function assistantChat(
  messages: ChatMessage[],
): Promise<AssistantChatResponse> {
  return apiFetch<AssistantChatResponse>('/assistant/chat', {
    method: 'POST',
    body: JSON.stringify({ messages }),
  });
}

// GL1: "probá tu asistente" — corre la decisión read-only (no envía a Meta).
export async function previewAssistant(message: string): Promise<PreviewResult> {
  return apiFetch<PreviewResult>('/assistant/preview', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}
