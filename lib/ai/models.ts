// @ts-nocheck
import { anthropic } from '@ai-sdk/anthropic';
import { customProvider } from 'ai';

export const DEFAULT_CHAT_MODEL: string = 'claude-3-7-sonnet';

export const myProvider = customProvider({
  languageModels: {
    'claude-3-7-sonnet': anthropic('claude-3-7-sonnet-20250219'),
    'claude-3-5-sonnet': anthropic('claude-3-5-sonnet-20241022'),
    'claude-3-5-haiku': anthropic('claude-3-5-haiku-20241022'),
  },
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    description: 'Most capable model for complex legal document analysis and reasoning',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Balanced model for general legal document analysis',
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    description: 'Faster model for simpler legal document tasks',
  },
];
