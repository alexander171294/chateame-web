// Shared TypeScript types matching chateame-api data model

export interface Channel {
  id: string;
  platform: 'instagram' | 'facebook';
  active: boolean;
  external_ids?: Record<string, string>;
}

export interface Account {
  id: string;
  plan: string;
  responses_active: boolean;
  escalation_policy: 'notify_owner' | 'ask_owner' | 'do_nothing';
  business_summary: string | null;
  system_prompt: string | null;
  ui_locale: string;
  content_language: string | null;
  channels: Channel[];
  created_at?: string;
}

export interface Faq {
  id: string;
  account_id?: string;
  question: string;
  answer: string;
  source: 'ai_seeded' | 'user_edited' | 'user_added';
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id?: string;
  direction: 'in' | 'out';
  body: string;
  handled_by: 'cache' | 'llm' | 'human' | 'none';
  matched_faq_id: string | null;
  confidence: number | null;
  created_at: string;
}

export interface Escalation {
  id: string;
  account_id?: string;
  status: 'pending' | 'answered' | 'dismissed';
  owner_answer: string | null;
  created_at: string;
  message: Message;
}

export interface Conversation {
  id: string;
  account_id?: string;
  contact_external_id: string;
  last_message_at: string;
  channel?: Channel;
  messages?: Message[];
  escalations?: Escalation[];
}

export interface UsageCounter {
  period: string;
  responses_sent: number;
  cache_hits: number;
  llm_calls: number;
  escalations: number;
}

export interface BillingInfo {
  plan: string;
  usage_counters: UsageCounter[];
  checkout_url?: string;
}

// Chat message types for the assistant
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AssistantChatResponse {
  message: string;
  tool_calls?: AssistantToolCall[];
}

export interface AssistantToolCall {
  name: string;
  args: Record<string, unknown>;
  result?: unknown;
}

// GL1: resultado del simulador "probá tu asistente"
export interface PreviewResult {
  source: 'cache' | 'llm' | 'escalate';
  answer: string | null;
  confidence: number | null;
  willRespond: boolean;
}

// API error type
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Onboarding seed response
export interface OnboardingSeedResponse {
  business_summary: string;
  faqs: Faq[];
}
