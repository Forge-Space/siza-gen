import { createLogger } from '../../logger.js';
import {
  type ILLMProvider,
  type ILLMGenerateOptions,
  type ILLMResponse,
  DEFAULT_TIMEOUT_MS,
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
} from '../types.js';

const logger = createLogger('llm:ollama');

const DEFAULT_BASE_URL = 'http://localhost:11434';
const DEFAULT_MODEL = 'llama3.2:3b';

export class OllamaProvider implements ILLMProvider {
  readonly type = 'ollama' as const;
  readonly model: string;
  private readonly baseUrl: string;
  private readonly defaultTimeout: number;

  constructor(opts?: { model?: string; baseUrl?: string; timeoutMs?: number }) {
    this.model = opts?.model ?? DEFAULT_MODEL;
    this.baseUrl = (opts?.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '');
    this.defaultTimeout = opts?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  async generate(prompt: string, options?: ILLMGenerateOptions): Promise<ILLMResponse> {
    const start = Date.now();
    const timeout = options?.timeoutMs ?? this.defaultTimeout;

    const body: Record<string, unknown> = {
      model: this.model,
      prompt: options?.systemPrompt ? `${options.systemPrompt}\n\n${prompt}` : prompt,
      stream: false,
      options: {
        num_predict: options?.maxTokens ?? DEFAULT_MAX_TOKENS,
        temperature: options?.temperature ?? DEFAULT_TEMPERATURE,
      },
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`Ollama ${res.status}: ${errText.slice(0, 200)}`);
      }

      const data = (await res.json()) as {
        response?: string;
        eval_count?: number;
      };

      return {
        text: data.response?.trim() ?? '',
        model: this.model,
        provider: 'ollama',
        tokensUsed: data.eval_count,
        latencyMs: Date.now() - start,
      };
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        throw new Error(`Ollama request timed out after ${timeout}ms`, { cause: err });
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${this.baseUrl}/api/tags`, {
        signal: controller.signal,
      });
      clearTimeout(timer);
      return res.ok;
    } catch {
      logger.debug('Ollama not available');
      return false;
    }
  }
}
