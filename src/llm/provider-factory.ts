import { createLogger } from '../logger.js';
import type { ILLMConfig, ILLMProvider } from './types.js';
import { OllamaProvider } from './providers/ollama.js';
import { OpenAIProvider } from './providers/openai.js';
import { AnthropicProvider } from './providers/anthropic.js';
import { GeminiProvider } from './providers/gemini.js';

const logger = createLogger('llm:factory');

export function createProvider(config: ILLMConfig): ILLMProvider {
  switch (config.provider) {
    case 'ollama':
      return new OllamaProvider({
        model: config.model,
        baseUrl: config.baseUrl,
        timeoutMs: config.timeoutMs,
      });
    case 'openai':
      return new OpenAIProvider({
        apiKey: config.apiKey ?? '',
        model: config.model,
        baseUrl: config.baseUrl,
        timeoutMs: config.timeoutMs,
      });
    case 'anthropic':
      return new AnthropicProvider({
        apiKey: config.apiKey ?? '',
        model: config.model,
        baseUrl: config.baseUrl,
        timeoutMs: config.timeoutMs,
      });
    case 'gemini':
      return new GeminiProvider({
        apiKey: config.apiKey ?? '',
        model: config.model || 'gemini-2.0-flash',
        baseUrl: config.baseUrl,
        timeoutMs: config.timeoutMs,
      });
    default:
      throw new Error(`Unknown LLM provider: ${config.provider}`);
  }
}

export async function detectOllama(baseUrl?: string): Promise<boolean> {
  const provider = new OllamaProvider({ baseUrl });
  return provider.isAvailable();
}

export async function createProviderWithFallback(config?: ILLMConfig): Promise<ILLMProvider | null> {
  if (config) {
    try {
      const provider = createProvider(config);
      const available = await provider.isAvailable();
      if (available) {
        logger.info({ provider: config.provider, model: config.model }, 'LLM provider ready');
        return provider;
      }
      logger.warn({ provider: config.provider }, 'Configured provider unavailable, trying Ollama');
    } catch (err) {
      logger.warn({ error: (err as Error).message }, 'Provider creation failed, trying Ollama');
    }
  }

  const ollamaAvailable = await detectOllama();
  if (ollamaAvailable) {
    logger.info('Ollama detected as fallback LLM provider');
    return new OllamaProvider();
  }

  logger.debug('No LLM provider available');
  return null;
}
