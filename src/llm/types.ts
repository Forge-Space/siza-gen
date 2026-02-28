export type LLMProviderType = 'ollama' | 'openai' | 'anthropic' | 'gemini';

export interface ILLMConfig {
  provider: LLMProviderType;
  model: string;
  baseUrl?: string;
  apiKey?: string;
  timeoutMs?: number;
  maxTokens?: number;
  temperature?: number;
}

export interface ILLMGenerateOptions {
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  timeoutMs?: number;
}

export interface ILLMResponse {
  text: string;
  model: string;
  provider: LLMProviderType;
  tokensUsed?: number;
  latencyMs: number;
}

export interface ILLMProvider {
  readonly type: LLMProviderType;
  readonly model: string;
  generate(prompt: string, options?: ILLMGenerateOptions): Promise<ILLMResponse>;
  isAvailable(): Promise<boolean>;
}

export const DEFAULT_TIMEOUT_MS = 30_000;
export const DEFAULT_MAX_TOKENS = 1024;
export const DEFAULT_TEMPERATURE = 0.3;
