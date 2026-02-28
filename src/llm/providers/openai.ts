import { createLogger } from '../../logger.js';
import {
  type ILLMProvider,
  type ILLMGenerateOptions,
  type ILLMResponse,
  DEFAULT_TIMEOUT_MS,
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
} from '../types.js';

const logger = createLogger('llm:openai');

const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_MODEL = 'gpt-4o-mini';

export class OpenAIProvider implements ILLMProvider {
  readonly type = 'openai' as const;
  readonly model: string;
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly defaultTimeout: number;

  constructor(opts: { apiKey: string; model?: string; baseUrl?: string; timeoutMs?: number }) {
    if (!opts.apiKey) {
      throw new Error('OpenAI provider requires an API key');
    }
    this.apiKey = opts.apiKey;
    this.model = opts.model ?? DEFAULT_MODEL;
    this.baseUrl = (opts.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '');
    this.defaultTimeout = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  async generate(prompt: string, options?: ILLMGenerateOptions): Promise<ILLMResponse> {
    const start = Date.now();
    const timeout = options?.timeoutMs ?? this.defaultTimeout;

    const messages: Array<{ role: string; content: string }> = [];
    if (options?.systemPrompt) {
      messages.push({
        role: 'system',
        content: options.systemPrompt,
      });
    }
    messages.push({ role: 'user', content: prompt });

    const body = {
      model: this.model,
      messages,
      max_tokens: options?.maxTokens ?? DEFAULT_MAX_TOKENS,
      temperature: options?.temperature ?? DEFAULT_TEMPERATURE,
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`OpenAI ${res.status}: ${errText.slice(0, 200)}`);
      }

      const data = (await res.json()) as {
        choices?: Array<{
          message?: { content?: string };
        }>;
        usage?: { total_tokens?: number };
      };

      const text = data.choices?.[0]?.message?.content?.trim() ?? '';

      return {
        text,
        model: this.model,
        provider: 'openai',
        tokensUsed: data.usage?.total_tokens,
        latencyMs: Date.now() - start,
      };
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        throw new Error(`OpenAI request timed out after ${timeout}ms`);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${this.baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        signal: controller.signal,
      });
      clearTimeout(timer);
      return res.ok;
    } catch {
      logger.debug('OpenAI API not reachable');
      return false;
    }
  }
}
