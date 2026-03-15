import { OllamaProvider } from '../llm/providers/ollama.js';
import { OpenAIProvider } from '../llm/providers/openai.js';
import { AnthropicProvider } from '../llm/providers/anthropic.js';
import { createProvider, detectOllama, createProviderWithFallback } from '../llm/provider-factory.js';
import type { ILLMConfig } from '../llm/types.js';

const originalFetch = global.fetch;

function mockFetch(handler: (url: string | URL | Request, init?: RequestInit) => Promise<Response>): void {
  global.fetch = handler as typeof fetch;
}

afterEach(() => {
  global.fetch = originalFetch;
});

// ── OllamaProvider ────────────────────────────────────────

describe('OllamaProvider', () => {
  it('has correct type and default model', () => {
    const p = new OllamaProvider();
    expect(p.type).toBe('ollama');
    expect(p.model).toBe('llama3.2:3b');
  });

  it('accepts custom model and baseUrl', () => {
    const p = new OllamaProvider({
      model: 'mistral',
      baseUrl: 'http://remote:11434/',
    });
    expect(p.model).toBe('mistral');
  });

  it('generates text successfully', async () => {
    mockFetch(
      async () =>
        new Response(
          JSON.stringify({
            response: 'Hello world',
            eval_count: 5,
          }),
          { status: 200 }
        )
    );

    const p = new OllamaProvider();
    const result = await p.generate('Say hello');

    expect(result.text).toBe('Hello world');
    expect(result.provider).toBe('ollama');
    expect(result.model).toBe('llama3.2:3b');
    expect(result.tokensUsed).toBe(5);
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('passes system prompt prepended to prompt', async () => {
    let capturedBody = '';
    mockFetch(async (_url, init) => {
      capturedBody = init?.body as string;
      return new Response(JSON.stringify({ response: 'ok' }), { status: 200 });
    });

    const p = new OllamaProvider();
    await p.generate('user message', {
      systemPrompt: 'You are helpful',
    });

    const parsed = JSON.parse(capturedBody);
    expect(parsed.prompt).toContain('You are helpful');
    expect(parsed.prompt).toContain('user message');
  });

  it('throws on HTTP error', async () => {
    mockFetch(async () => new Response('model not found', { status: 404 }));

    const p = new OllamaProvider();
    await expect(p.generate('test')).rejects.toThrow('Ollama 404');
  });

  it('throws on timeout', async () => {
    mockFetch(
      () =>
        new Promise((_, reject) => {
          const err = new Error('aborted');
          err.name = 'AbortError';
          setTimeout(() => reject(err), 10);
        })
    );

    const p = new OllamaProvider({ timeoutMs: 5 });
    await expect(p.generate('test')).rejects.toThrow('timed out');
  });

  it('isAvailable returns true when Ollama responds', async () => {
    mockFetch(
      async () =>
        new Response(JSON.stringify({ models: [] }), {
          status: 200,
        })
    );

    const p = new OllamaProvider();
    expect(await p.isAvailable()).toBe(true);
  });

  it('isAvailable returns false on connection error', async () => {
    mockFetch(async () => {
      throw new Error('ECONNREFUSED');
    });

    const p = new OllamaProvider();
    expect(await p.isAvailable()).toBe(false);
  });
});

// ── OpenAIProvider ────────────────────────────────────────

describe('OpenAIProvider', () => {
  it('requires an API key', () => {
    expect(() => new OpenAIProvider({ apiKey: '' })).toThrow('requires an API key');
  });

  it('has correct type and default model', () => {
    const p = new OpenAIProvider({ apiKey: 'sk-test' });
    expect(p.type).toBe('openai');
    expect(p.model).toBe('gpt-4o-mini');
  });

  it('generates text via chat completions', async () => {
    mockFetch(
      async () =>
        new Response(
          JSON.stringify({
            choices: [{ message: { content: 'Generated code' } }],
            usage: { total_tokens: 42 },
          }),
          { status: 200 }
        )
    );

    const p = new OpenAIProvider({ apiKey: 'sk-test' });
    const result = await p.generate('Write a button');

    expect(result.text).toBe('Generated code');
    expect(result.provider).toBe('openai');
    expect(result.tokensUsed).toBe(42);
  });

  it('sends system prompt as separate message', async () => {
    let capturedBody = '';
    mockFetch(async (_url, init) => {
      capturedBody = init?.body as string;
      return new Response(
        JSON.stringify({
          choices: [{ message: { content: 'ok' } }],
        }),
        { status: 200 }
      );
    });

    const p = new OpenAIProvider({ apiKey: 'sk-test' });
    await p.generate('user msg', {
      systemPrompt: 'system msg',
    });

    const parsed = JSON.parse(capturedBody);
    expect(parsed.messages).toHaveLength(2);
    expect(parsed.messages[0].role).toBe('system');
    expect(parsed.messages[0].content).toBe('system msg');
    expect(parsed.messages[1].role).toBe('user');
  });

  it('sends auth header', async () => {
    let capturedHeaders: Record<string, string> = {};
    mockFetch(async (_url, init) => {
      capturedHeaders = Object.fromEntries(new Headers(init?.headers as HeadersInit).entries());
      return new Response(
        JSON.stringify({
          choices: [{ message: { content: '' } }],
        }),
        { status: 200 }
      );
    });

    const p = new OpenAIProvider({ apiKey: 'sk-secret' });
    await p.generate('test');

    expect(capturedHeaders.authorization).toBe('Bearer sk-secret');
  });

  it('throws on HTTP error', async () => {
    mockFetch(async () => new Response('rate limited', { status: 429 }));

    const p = new OpenAIProvider({ apiKey: 'sk-test' });
    await expect(p.generate('test')).rejects.toThrow('OpenAI 429');
  });

  it('handles empty choices gracefully', async () => {
    mockFetch(async () => new Response(JSON.stringify({ choices: [] }), { status: 200 }));

    const p = new OpenAIProvider({ apiKey: 'sk-test' });
    const result = await p.generate('test');
    expect(result.text).toBe('');
  });

  it('isAvailable returns true on 200', async () => {
    mockFetch(
      async () =>
        new Response(JSON.stringify({ data: [] }), {
          status: 200,
        })
    );

    const p = new OpenAIProvider({ apiKey: 'sk-test' });
    expect(await p.isAvailable()).toBe(true);
  });
});

// ── AnthropicProvider ─────────────────────────────────────

describe('AnthropicProvider', () => {
  it('requires an API key', () => {
    expect(() => new AnthropicProvider({ apiKey: '' })).toThrow('requires an API key');
  });

  it('has correct type and default model', () => {
    const p = new AnthropicProvider({
      apiKey: 'sk-ant-test',
    });
    expect(p.type).toBe('anthropic');
    expect(p.model).toBe('claude-sonnet-4-20250514');
  });

  it('generates text via messages API', async () => {
    mockFetch(
      async () =>
        new Response(
          JSON.stringify({
            content: [{ type: 'text', text: 'Claude response' }],
            usage: { input_tokens: 10, output_tokens: 20 },
          }),
          { status: 200 }
        )
    );

    const p = new AnthropicProvider({
      apiKey: 'sk-ant-test',
    });
    const result = await p.generate('Explain TypeScript');

    expect(result.text).toBe('Claude response');
    expect(result.provider).toBe('anthropic');
    expect(result.tokensUsed).toBe(30);
  });

  it('sends system prompt as top-level field', async () => {
    let capturedBody = '';
    mockFetch(async (_url, init) => {
      capturedBody = init?.body as string;
      return new Response(
        JSON.stringify({
          content: [{ type: 'text', text: 'ok' }],
        }),
        { status: 200 }
      );
    });

    const p = new AnthropicProvider({
      apiKey: 'sk-ant-test',
    });
    await p.generate('user msg', {
      systemPrompt: 'Be concise',
    });

    const parsed = JSON.parse(capturedBody);
    expect(parsed.system).toBe('Be concise');
    expect(parsed.messages).toHaveLength(1);
    expect(parsed.messages[0].role).toBe('user');
  });

  it('sends correct headers', async () => {
    let capturedHeaders: Record<string, string> = {};
    mockFetch(async (_url, init) => {
      capturedHeaders = Object.fromEntries(new Headers(init?.headers as HeadersInit).entries());
      return new Response(
        JSON.stringify({
          content: [{ type: 'text', text: '' }],
        }),
        { status: 200 }
      );
    });

    const p = new AnthropicProvider({
      apiKey: 'sk-ant-key',
    });
    await p.generate('test');

    expect(capturedHeaders['x-api-key']).toBe('sk-ant-key');
    expect(capturedHeaders['anthropic-version']).toBe('2023-06-01');
  });

  it('throws on HTTP error', async () => {
    mockFetch(async () => new Response('invalid key', { status: 401 }));

    const p = new AnthropicProvider({
      apiKey: 'bad-key',
    });
    await expect(p.generate('test')).rejects.toThrow('Anthropic 401');
  });

  it('handles missing content gracefully', async () => {
    mockFetch(async () => new Response(JSON.stringify({ content: [] }), { status: 200 }));

    const p = new AnthropicProvider({
      apiKey: 'sk-ant-test',
    });
    const result = await p.generate('test');
    expect(result.text).toBe('');
  });

  it('isAvailable returns true on 200 or 429', async () => {
    mockFetch(async () => new Response('rate limited', { status: 429 }));

    const p = new AnthropicProvider({
      apiKey: 'sk-ant-test',
    });
    expect(await p.isAvailable()).toBe(true);
  });
});

// ── Provider Factory ──────────────────────────────────────

describe('createProvider', () => {
  it('creates Ollama provider', () => {
    const p = createProvider({
      provider: 'ollama',
      model: 'llama3.2:3b',
    });
    expect(p.type).toBe('ollama');
  });

  it('creates OpenAI provider', () => {
    const p = createProvider({
      provider: 'openai',
      model: 'gpt-4o',
      apiKey: 'sk-test',
    });
    expect(p.type).toBe('openai');
    expect(p.model).toBe('gpt-4o');
  });

  it('creates Anthropic provider', () => {
    const p = createProvider({
      provider: 'anthropic',
      model: 'claude-sonnet-4-20250514',
      apiKey: 'sk-ant-test',
    });
    expect(p.type).toBe('anthropic');
  });

  it('creates native Gemini provider', () => {
    const p = createProvider({
      provider: 'gemini',
      model: 'gemini-2.0-flash',
      apiKey: 'gm-test',
    });
    expect(p.type).toBe('gemini');
    expect(p.model).toBe('gemini-2.0-flash');
  });

  it('throws on unknown provider', () => {
    expect(() =>
      createProvider({
        provider: 'unknown' as ILLMConfig['provider'],
        model: 'test',
      })
    ).toThrow('Unknown LLM provider');
  });
});

describe('detectOllama', () => {
  it('returns true when Ollama is running', async () => {
    mockFetch(
      async () =>
        new Response(JSON.stringify({ models: [] }), {
          status: 200,
        })
    );
    expect(await detectOllama()).toBe(true);
  });

  it('returns false when Ollama is not running', async () => {
    mockFetch(async () => {
      throw new Error('ECONNREFUSED');
    });
    expect(await detectOllama()).toBe(false);
  });
});

describe('createProviderWithFallback', () => {
  it('returns configured provider when available', async () => {
    mockFetch(async (url) => {
      const urlStr = url.toString();
      if (urlStr.includes('/models')) {
        return new Response(JSON.stringify({ data: [] }), { status: 200 });
      }
      return new Response(
        JSON.stringify({
          choices: [{ message: { content: '' } }],
        }),
        { status: 200 }
      );
    });

    const p = await createProviderWithFallback({
      provider: 'openai',
      model: 'gpt-4o',
      apiKey: 'sk-test',
    });
    expect(p).not.toBeNull();
    expect(p!.type).toBe('openai');
  });

  it('falls back to Ollama when config unavailable', async () => {
    let callCount = 0;
    mockFetch(async (url) => {
      callCount++;
      const urlStr = url.toString();
      if (urlStr.includes('openai.com')) {
        throw new Error('ECONNREFUSED');
      }
      if (urlStr.includes('11434/api/tags')) {
        return new Response(JSON.stringify({ models: [] }), { status: 200 });
      }
      return new Response('', { status: 500 });
    });

    const p = await createProviderWithFallback({
      provider: 'openai',
      model: 'gpt-4o',
      apiKey: 'sk-test',
    });
    expect(p).not.toBeNull();
    expect(p!.type).toBe('ollama');
    expect(callCount).toBeGreaterThanOrEqual(2);
  });

  it('returns null when nothing is available', async () => {
    mockFetch(async () => {
      throw new Error('ECONNREFUSED');
    });

    const p = await createProviderWithFallback();
    expect(p).toBeNull();
  });

  it('tries Ollama when no config provided', async () => {
    mockFetch(
      async () =>
        new Response(JSON.stringify({ models: [] }), {
          status: 200,
        })
    );

    const p = await createProviderWithFallback();
    expect(p).not.toBeNull();
    expect(p!.type).toBe('ollama');
  });
});
