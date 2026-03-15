import { createLogger } from '../../logger.js';
import {
  type ILLMProvider,
  type ILLMGenerateOptions,
  type ILLMResponse,
  DEFAULT_TIMEOUT_MS,
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
} from '../types.js';

const logger = createLogger('llm:gemini');

const DEFAULT_BASE_URL = 'https://generativelanguage.googleapis.com';
const DEFAULT_MODEL = 'gemini-2.0-flash';

export class GeminiProvider implements ILLMProvider {
  readonly type = 'gemini' as const;
  readonly model: string;
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly defaultTimeout: number;

  constructor(opts: { apiKey: string; model?: string; baseUrl?: string; timeoutMs?: number }) {
    if (!opts.apiKey) {
      throw new Error('Gemini provider requires an API key');
    }
    this.apiKey = opts.apiKey;
    this.model = opts.model ?? DEFAULT_MODEL;
    this.baseUrl = (opts.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '');
    this.defaultTimeout = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  async generate(prompt: string, options?: ILLMGenerateOptions): Promise<ILLMResponse> {
    const start = Date.now();
    const timeout = options?.timeoutMs ?? this.defaultTimeout;

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    if (options?.systemPrompt) {
      contents.push({
        role: 'user',
        parts: [{ text: options.systemPrompt }],
      });
      contents.push({
        role: 'model',
        parts: [{ text: 'Understood.' }],
      });
    }
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const body = {
      contents,
      generationConfig: {
        maxOutputTokens: options?.maxTokens ?? DEFAULT_MAX_TOKENS,
        temperature: options?.temperature ?? DEFAULT_TEMPERATURE,
      },
    };

    const url = `${this.baseUrl}/v1beta/models/${this.model}` + `:generateContent?key=${this.apiKey}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`Gemini ${res.status}: ${errText.slice(0, 200)}`);
      }

      const data = (await res.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
        }>;
        usageMetadata?: {
          promptTokenCount?: number;
          candidatesTokenCount?: number;
          totalTokenCount?: number;
        };
      };

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
      const tokensUsed = data.usageMetadata?.totalTokenCount;

      return {
        text,
        model: this.model,
        provider: 'gemini',
        tokensUsed,
        latencyMs: Date.now() - start,
      };
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        throw new Error(`Gemini request timed out after ${timeout}ms`, { cause: err });
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  async isAvailable(): Promise<boolean> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const url = `${this.baseUrl}/v1beta/models/${this.model}` + `?key=${this.apiKey}`;
    try {
      const res = await fetch(url, { signal: controller.signal });
      return res.ok;
    } catch {
      logger.debug('Gemini API not reachable');
      return false;
    } finally {
      clearTimeout(timer);
    }
  }
}
