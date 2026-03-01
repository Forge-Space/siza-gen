import { createLogger } from '../../logger.js';
import {
  type ILLMProvider,
  type ILLMGenerateOptions,
  type ILLMResponse,
  DEFAULT_TIMEOUT_MS,
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
} from '../types.js';

const logger = createLogger('llm:anthropic');

const DEFAULT_BASE_URL = 'https://api.anthropic.com';
const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const API_VERSION = '2023-06-01';

export class AnthropicProvider implements ILLMProvider {
  readonly type = 'anthropic' as const;
  readonly model: string;
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly defaultTimeout: number;

  constructor(opts: { apiKey: string; model?: string; baseUrl?: string; timeoutMs?: number }) {
    if (!opts.apiKey) {
      throw new Error('Anthropic provider requires an API key');
    }
    this.apiKey = opts.apiKey;
    this.model = opts.model ?? DEFAULT_MODEL;
    this.baseUrl = (opts.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '');
    this.defaultTimeout = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  async generate(prompt: string, options?: ILLMGenerateOptions): Promise<ILLMResponse> {
    const start = Date.now();
    const timeout = options?.timeoutMs ?? this.defaultTimeout;

    const body: Record<string, unknown> = {
      model: this.model,
      max_tokens: options?.maxTokens ?? DEFAULT_MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    };

    if (options?.systemPrompt) {
      body.system = options.systemPrompt;
    }
    if (options?.temperature !== undefined) {
      body.temperature = options.temperature;
    } else {
      body.temperature = DEFAULT_TEMPERATURE;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(`${this.baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': API_VERSION,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`Anthropic ${res.status}: ${errText.slice(0, 200)}`);
      }

      const data = (await res.json()) as {
        content?: Array<{ type: string; text?: string }>;
        usage?: {
          input_tokens?: number;
          output_tokens?: number;
        };
      };

      const textBlock = data.content?.find((b) => b.type === 'text');
      const text = textBlock?.text?.trim() ?? '';

      const tokensUsed = (data.usage?.input_tokens ?? 0) + (data.usage?.output_tokens ?? 0);

      return {
        text,
        model: this.model,
        provider: 'anthropic',
        tokensUsed: tokensUsed || undefined,
        latencyMs: Date.now() - start,
      };
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        throw new Error(`Anthropic request timed out after ${timeout}ms`, { cause: err });
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
      const res = await fetch(`${this.baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': API_VERSION,
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 1,
          messages: [{ role: 'user', content: 'ping' }],
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      return res.ok || res.status === 429;
    } catch {
      logger.debug('Anthropic API not reachable');
      return false;
    }
  }
}
