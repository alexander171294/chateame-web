import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Passthrough translations mock — returns the key so tests can assert on translation keys
export const createTranslationsMock = (namespace?: string) => {
  return (key: string) => (namespace ? `${namespace}.${key}` : key);
};

// A generic t() that returns key regardless of namespace
export const mockT = (key: string) => key;

// Wrapper with a fresh QueryClient for each test
export function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: 0 },
    },
  });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }
  return { Wrapper, queryClient };
}

// Helper to create a minimal Faq object
export function makeFaq(overrides = {}) {
  return {
    id: 'faq-1',
    question: 'Test question',
    answer: 'Test answer',
    source: 'ai_seeded' as const,
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

// Helper to create a minimal Conversation
export function makeConversation(overrides = {}) {
  return {
    id: 'conv-1',
    contact_external_id: 'user123',
    last_message_at: '2024-01-01T00:00:00Z',
    channel: { id: 'ch-1', platform: 'instagram' as const, active: true },
    messages: [],
    escalations: [],
    ...overrides,
  };
}

// Helper to create a minimal Message
export function makeMessage(overrides = {}) {
  return {
    id: 'msg-1',
    direction: 'in' as const,
    body: 'Hello',
    handled_by: 'cache' as const,
    matched_faq_id: null,
    confidence: null,
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

// Helper for billing data (forma real del backend GET /billing)
export function makeBillingInfo(overrides = {}) {
  return {
    plan: 'free',
    period: '2024-01',
    usage: { responsesSent: 100, cacheHits: 70, llmCalls: 25, escalations: 5 },
    resolvedWithoutHumanRate: 0.95,
    paywall: { freeLimit: 5, totalResponses: 3, freeResponsesLeft: 2, requiresPayment: false },
    ...overrides,
  };
}
