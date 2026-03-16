import {
  setSidecarUrl,
  getSidecarUrl,
  isSidecarAvailable,
  resetAvailabilityCache,
  sidecarEmbed,
  sidecarEmbedBatch,
  sidecarScoreQuality,
  sidecarEnhancePrompt,
  sidecarVectorSearch,
  sidecarVectorIndex,
  sidecarStartTraining,
  sidecarGetTrainingStatus,
  sidecarCancelTraining,
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

describe('setSidecarUrl / getSidecarUrl', () => {
  it('changes the base URL for requests', async () => {
    setSidecarUrl('http://custom:9999');
    const vec = makeBase64Vector();
    mockFetchResponse({ vector: vec, dimensions: DIMS });
    await sidecarEmbed('test');
    expect(fetchCalls[0]!.url).toBe('http://custom:9999/embed');
  });

  it('getSidecarUrl returns the current URL', () => {
    setSidecarUrl('http://myhost:1234');
    expect(getSidecarUrl()).toBe('http://myhost:1234');
  });
});

describe('sidecarVectorSearch', () => {
  it('calls /vector/search with base64 vector and top_k', async () => {
    const results = [{ id: 'btn-1', distance: 0.1 }];
    mockFetchResponse(results);
    const vec = new Float32Array([0.1, 0.2, 0.3]);
    const res = await sidecarVectorSearch(vec, 3);
    expect(res).toEqual(results);
    const body = JSON.parse(fetchCalls[0]!.init?.body as string);
    expect(body.top_k).toBe(3);
    expect(typeof body.vector).toBe('string'); // base64
    expect(fetchCalls[0]!.url).toBe('http://localhost:8100/vector/search');
  });

  it('defaults topK to 5', async () => {
    mockFetchResponse([]);
    await sidecarVectorSearch(new Float32Array([1]));
    const body = JSON.parse(fetchCalls[0]!.init?.body as string);
    expect(body.top_k).toBe(5);
  });
});

describe('sidecarVectorIndex', () => {
  it('calls /vector/index with entries array', async () => {
    mockFetchResponse({ indexed: 2 });
    const vec1 = new Float32Array([0.1, 0.2]);
    const vec2 = new Float32Array([0.3, 0.4]);
    const result = await sidecarVectorIndex([
      { id: 'a', vector: vec1, metadata: { type: 'component' } },
      { id: 'b', vector: vec2 },
    ]);
    expect(result.indexed).toBe(2);
    const body = JSON.parse(fetchCalls[0]!.init?.body as string);
    expect(body.entries).toHaveLength(2);
    expect(body.entries[0].id).toBe('a');
    expect(typeof body.entries[0].vector).toBe('string'); // base64
    expect(body.entries[0].metadata).toEqual({ type: 'component' });
    expect(fetchCalls[0]!.url).toBe('http://localhost:8100/vector/index');
  });
});

describe('sidecarStartTraining', () => {
  it('calls /train/start with correct payload', async () => {
    const job = { job_id: 'job-1', status: 'queued' };
    mockFetchResponse(job);
    const result = await sidecarStartTraining('lora', '/data/train.jsonl', {
      rank: 8,
      epochs: 3,
      learningRate: 0.0001,
      batchSize: 4,
    });
    expect(result.job_id).toBe('job-1');
    expect(result.status).toBe('queued');
    const body = JSON.parse(fetchCalls[0]!.init?.body as string);
    expect(body.adapter_type).toBe('lora');
    expect(body.data_path).toBe('/data/train.jsonl');
    expect(body.config.rank).toBe(8);
    expect(fetchCalls[0]!.url).toBe('http://localhost:8100/train/start');
  });

  it('calls /train/start without config when omitted', async () => {
    mockFetchResponse({ job_id: 'job-2', status: 'queued' });
    await sidecarStartTraining('lora', '/data/train.jsonl');
    const body = JSON.parse(fetchCalls[0]!.init?.body as string);
    expect(body.config).toBeUndefined();
  });
});

describe('sidecarGetTrainingStatus', () => {
  it('calls GET /train/status/:jobId', async () => {
    const status = { job_id: 'job-1', status: 'running', progress: 45 };
    mockFetchResponse(status);
    const result = await sidecarGetTrainingStatus('job-1');
    expect(result.job_id).toBe('job-1');
    expect(result.progress).toBe(45);
    expect(fetchCalls[0]!.url).toBe('http://localhost:8100/train/status/job-1');
  });
});

describe('sidecarCancelTraining', () => {
  it('calls /train/cancel/:jobId', async () => {
    mockFetchResponse({ cancelled: true });
    const result = await sidecarCancelTraining('job-1');
    expect(result.cancelled).toBe(true);
    expect(fetchCalls[0]!.url).toBe('http://localhost:8100/train/cancel/job-1');
  });
});
