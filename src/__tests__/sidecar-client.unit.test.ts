import {
  setSidecarUrl,
  isSidecarAvailable,
  resetAvailabilityCache,
  sidecarEmbed,
  sidecarEmbedBatch,
  sidecarScoreQuality,
  sidecarEnhancePrompt,
} from '../ml/sidecar-client.js';

const DIMS = 384;

function makeBase64Vector(dims: number = DIMS): string {
  const buf = new Float32Array(dims);
  for (let i = 0; i < dims; i++) buf[i] = Math.random();
  return Buffer.from(buf.buffer).toString('base64');
}

const originalFetch = globalThis.fetch;
let fetchCalls: { url: string; init?: RequestInit }[] = [];
let fetchResponses: Array<{ body: unknown; status: number }> = [];

function mockFetchResponse(body: unknown, status = 200) {
  fetchResponses.push({ body, status });
}

beforeEach(() => {
  setSidecarUrl('http://localhost:8100');
  resetAvailabilityCache();
  fetchCalls = [];
  fetchResponses = [];

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    fetchCalls.push({ url, init });

    const response = fetchResponses.shift();
    if (!response) {
      throw new Error(`No mock response for ${url}`);
    }

    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      statusText: response.status === 200 ? 'OK' : 'Error',
      json: async () => response.body,
    } as Response;
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('isSidecarAvailable', () => {
  it('returns true when sidecar is ready', async () => {
    mockFetchResponse({ ready: true });
    expect(await isSidecarAvailable()).toBe(true);
  });

  it('returns false when sidecar is not ready', async () => {
    mockFetchResponse({ ready: false });
    expect(await isSidecarAvailable()).toBe(false);
  });

  it('returns false on network error', async () => {
    globalThis.fetch = (() => {
      return Promise.reject(new Error('ECONNREFUSED'));
    }) as typeof fetch;
    expect(await isSidecarAvailable()).toBe(false);
  });

  it('caches availability for 30 seconds', async () => {
    mockFetchResponse({ ready: true });
    await isSidecarAvailable();
    await isSidecarAvailable();
    expect(fetchCalls).toHaveLength(1);
  });

  it('resets cache on resetAvailabilityCache()', async () => {
    mockFetchResponse({ ready: true });
    await isSidecarAvailable();
    resetAvailabilityCache();
    mockFetchResponse({ ready: false });
    expect(await isSidecarAvailable()).toBe(false);
    expect(fetchCalls).toHaveLength(2);
  });
});

describe('sidecarEmbed', () => {
  it('returns Float32Array with correct dimensions', async () => {
    const vec = makeBase64Vector();
    mockFetchResponse({ vector: vec, dimensions: DIMS });
    const result = await sidecarEmbed('hello');
    expect(result).toBeInstanceOf(Float32Array);
    expect(result.length).toBe(DIMS);
  });

  it('sends correct request body', async () => {
    const vec = makeBase64Vector();
    mockFetchResponse({ vector: vec, dimensions: DIMS });
    await sidecarEmbed('test text');
    expect(fetchCalls[0]!.url).toBe('http://localhost:8100/embed');
    expect(fetchCalls[0]!.init?.method).toBe('POST');
    expect(fetchCalls[0]!.init?.body).toBe(JSON.stringify({ text: 'test text' }));
  });

  it('throws on HTTP error', async () => {
    mockFetchResponse({}, 500);
    await expect(sidecarEmbed('fail')).rejects.toThrow('Sidecar /embed: 500');
  });
});

describe('sidecarEmbedBatch', () => {
  it('returns array of Float32Arrays', async () => {
    const vecs = [makeBase64Vector(), makeBase64Vector()];
    mockFetchResponse({ vectors: vecs, dimensions: DIMS, count: 2 });
    const result = await sidecarEmbedBatch(['a', 'b']);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Float32Array);
    expect(result[0]!.length).toBe(DIMS);
  });
});

describe('sidecarScoreQuality', () => {
  it('returns score result', async () => {
    const body = {
      score: 7.5,
      confidence: 0.8,
      factors: { security: 8, accessibility: 7 },
      source: 'sidecar',
    };
    mockFetchResponse(body);
    const result = await sidecarScoreQuality('make a button', '<button>Click</button>', 'button', 'react');
    expect(result.score).toBe(7.5);
    expect(result.source).toBe('sidecar');
  });
});

describe('sidecarEnhancePrompt', () => {
  it('returns enhanced prompt', async () => {
    const body = {
      enhanced: 'Create an accessible button with hover states',
      additions: ['accessibility', 'hover-states'],
      source: 'sidecar',
    };
    mockFetchResponse(body);
    const result = await sidecarEnhancePrompt('make a button', {
      componentType: 'button',
      framework: 'react',
    });
    expect(result.enhanced).toContain('accessible');
    expect(result.additions).toContain('accessibility');
  });
});

describe('setSidecarUrl', () => {
  it('changes the base URL for requests', async () => {
    setSidecarUrl('http://custom:9999');
    const vec = makeBase64Vector();
    mockFetchResponse({ vector: vec, dimensions: DIMS });
    await sidecarEmbed('test');
    expect(fetchCalls[0]!.url).toBe('http://custom:9999/embed');
  });
});
