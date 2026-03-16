import { getMemoryDatabase } from '../registry/database/store.js';
import {
  cosineSimilarity,
  findSimilar,
  configureEmbeddings,
  getEmbeddingConfig,
  isModelLoaded,
  unloadModel,
  embedBatch,
  embed,
} from '../ml/embeddings.js';
import { setSidecarUrl, resetAvailabilityCache } from '../ml/sidecar-client.js';
import {
  storeEmbedding,
  storeEmbeddings,
  loadEmbeddings,
  getEmbedding,
  semanticSearch,
  getEmbeddingCount,
  deleteEmbeddings,
  keywordScore,
  tokenizeQuery,
} from '../ml/embedding-store.js';
import type { IEmbedding } from '../ml/types.js';
import type Database from 'better-sqlite3';

// ── Helpers ────────────────────────────────────────────────

function makeVector(dims: number, seed: number): Float32Array {
  const v = new Float32Array(dims);
  for (let i = 0; i < dims; i++) {
    v[i] = Math.sin(seed * (i + 1));
  }
  // Normalize
  let norm = 0;
  for (let i = 0; i < dims; i++) norm += v[i]! * v[i]!;
  norm = Math.sqrt(norm);
  for (let i = 0; i < dims; i++) v[i] = v[i]! / norm;
  return v;
}

function makeEmbedding(id: string, seed: number, dims = 384): IEmbedding {
  return {
    sourceId: id,
    sourceType: 'component',
    text: `Test text for ${id}`,
    vector: makeVector(dims, seed),
    dimensions: dims,
    createdAt: Date.now(),
  };
}

// ── cosineSimilarity ───────────────────────────────────────

describe('cosineSimilarity', () => {
  it('returns 1 for identical normalized vectors', () => {
    const v = makeVector(384, 42);
    expect(cosineSimilarity(v, v)).toBeCloseTo(1, 5);
  });

  it('returns ~0 for orthogonal vectors', () => {
    const a = new Float32Array([1, 0, 0]);
    const b = new Float32Array([0, 1, 0]);
    expect(cosineSimilarity(a, b)).toBeCloseTo(0, 5);
  });

  it('returns -1 for opposite normalized vectors', () => {
    const a = new Float32Array([1, 0, 0]);
    const b = new Float32Array([-1, 0, 0]);
    expect(cosineSimilarity(a, b)).toBeCloseTo(-1, 5);
  });

  it('throws error for mismatched dimensions', () => {
    const a = new Float32Array([1, 0]);
    const b = new Float32Array([1, 0, 0]);
    expect(() => cosineSimilarity(a, b)).toThrow('Vector length mismatch: 2 vs 3');
  });
});

// ── findSimilar ────────────────────────────────────────────

describe('findSimilar', () => {
  it('ranks identical vector first', () => {
    const query = makeVector(16, 1);
    const candidates: IEmbedding[] = [makeEmbedding('same', 1, 16), makeEmbedding('different', 99, 16)];
    const results = findSimilar(query, candidates, 5, 0);
    expect(results[0]!.id).toBe('same');
    expect(results[0]!.similarity).toBeCloseTo(1, 3);
  });

  it('respects threshold', () => {
    const query = makeVector(16, 1);
    const candidates: IEmbedding[] = [makeEmbedding('close', 1, 16), makeEmbedding('far', 99, 16)];
    const results = findSimilar(query, candidates, 5, 0.99);
    expect(results.length).toBe(1);
    expect(results[0]!.id).toBe('close');
  });

  it('respects topK', () => {
    const query = makeVector(8, 1);
    const candidates = Array.from({ length: 10 }, (_, i) => makeEmbedding(`e-${i}`, i + 1, 8));
    const results = findSimilar(query, candidates, 3, 0);
    expect(results.length).toBe(3);
  });
});

// ── Embedding Store (SQLite) ───────────────────────────────

describe('embedding-store', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = getMemoryDatabase();
  });

  afterEach(() => {
    db.close();
  });

  it('stores and retrieves a single embedding', () => {
    const emb = makeEmbedding('btn-1', 42);
    storeEmbedding(emb, db);

    const retrieved = getEmbedding('btn-1', 'component', db);
    expect(retrieved).toBeDefined();
    expect(retrieved!.sourceId).toBe('btn-1');
    expect(retrieved!.dimensions).toBe(384);
    expect(retrieved!.vector.length).toBe(384);
    // Verify vector data survived round-trip
    expect(cosineSimilarity(emb.vector, retrieved!.vector)).toBeCloseTo(1, 5);
  });

  it('returns undefined for nonexistent embedding', () => {
    expect(getEmbedding('nope', 'component', db)).toBeUndefined();
  });

  it('storeEmbeddings batch inserts', () => {
    const embs = [makeEmbedding('a', 1), makeEmbedding('b', 2), makeEmbedding('c', 3)];
    storeEmbeddings(embs, db);
    expect(getEmbeddingCount('component', db)).toBe(3);
  });

  it('loadEmbeddings returns all of a type', () => {
    storeEmbeddings(
      [
        makeEmbedding('comp-1', 1),
        makeEmbedding('comp-2', 2),
        { ...makeEmbedding('prompt-1', 3), sourceType: 'prompt' as const },
      ],
      db
    );

    const components = loadEmbeddings('component', db);
    expect(components.length).toBe(2);

    const prompts = loadEmbeddings('prompt', db);
    expect(prompts.length).toBe(1);
  });

  it('deleteEmbeddings removes by type', () => {
    storeEmbeddings([makeEmbedding('a', 1), makeEmbedding('b', 2)], db);
    expect(getEmbeddingCount('component', db)).toBe(2);

    const deleted = deleteEmbeddings('component', db);
    expect(deleted).toBe(2);
    expect(getEmbeddingCount('component', db)).toBe(0);
  });

  it('upserts on duplicate (source_id, source_type)', () => {
    storeEmbedding(makeEmbedding('btn-1', 1), db);
    storeEmbedding(makeEmbedding('btn-1', 99), db);
    expect(getEmbeddingCount('component', db)).toBe(1);

    const retrieved = getEmbedding('btn-1', 'component', db)!;
    // Should have the updated vector (seed 99)
    const expected = makeVector(384, 99);
    expect(cosineSimilarity(retrieved.vector, expected)).toBeCloseTo(1, 3);
  });
});

// ── semanticSearch ─────────────────────────────────────────

describe('semanticSearch', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = getMemoryDatabase();
    storeEmbeddings(
      [
        makeEmbedding('hero-centered', 1),
        makeEmbedding('hero-split', 2),
        makeEmbedding('card-pricing', 50),
        makeEmbedding('footer-default', 99),
      ],
      db
    );
  });

  afterEach(() => {
    db.close();
  });

  it('finds the most similar component', () => {
    const queryVec = makeVector(384, 1); // Same seed as hero-centered
    const results = semanticSearch(queryVec, 'component', db, 5, 0);
    expect(results[0]!.id).toBe('hero-centered');
    expect(results[0]!.similarity).toBeCloseTo(1, 3);
  });

  it('returns results sorted by similarity', () => {
    const queryVec = makeVector(384, 1);
    const results = semanticSearch(queryVec, 'component', db, 10, 0);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1]!.similarity).toBeGreaterThanOrEqual(results[i]!.similarity);
    }
  });

  it('respects topK', () => {
    const queryVec = makeVector(384, 1);
    const results = semanticSearch(queryVec, 'component', db, 2, 0);
    expect(results.length).toBe(2);
  });

  it('returns empty for nonexistent type', () => {
    const queryVec = makeVector(384, 1);
    const results = semanticSearch(queryVec, 'prompt', db);
    expect(results).toEqual([]);
  });

  it('hybrid search boosts keyword-matching results', () => {
    db.close();
    db = getMemoryDatabase();
    const heroEmb: IEmbedding = {
      sourceId: 'hero-banner',
      sourceType: 'component',
      text: 'Hero banner with centered heading and call to action button',
      vector: makeVector(384, 10),
      dimensions: 384,
      createdAt: Date.now(),
    };
    const cardEmb: IEmbedding = {
      sourceId: 'card-pricing',
      sourceType: 'component',
      text: 'Pricing card with plan tiers and monthly toggle',
      vector: makeVector(384, 11),
      dimensions: 384,
      createdAt: Date.now(),
    };
    storeEmbeddings([heroEmb, cardEmb], db);

    const queryVec = makeVector(384, 10);
    const hybrid = semanticSearch(queryVec, 'component', db, 2, 0, 'hero banner heading', 0.5);
    expect(hybrid[0]!.id).toBe('hero-banner');
  });
});

describe('keywordScore', () => {
  it('returns 1.0 for exact match', () => {
    const tokens = tokenizeQuery('hero banner button');
    const score = keywordScore(tokens, 'Hero banner with button');
    expect(score).toBe(1.0);
  });

  it('returns 0 for no match', () => {
    const tokens = tokenizeQuery('pricing table');
    const score = keywordScore(tokens, 'Hero banner with button');
    expect(score).toBe(0);
  });

  it('returns partial score for partial match', () => {
    const tokens = tokenizeQuery('hero pricing card');
    const score = keywordScore(tokens, 'Pricing card with tiers');
    expect(score).toBeCloseTo(0.67, 1);
  });

  it('returns 0 for empty query', () => {
    const score = keywordScore([], 'any text');
    expect(score).toBe(0);
  });
});

describe('tokenizeQuery', () => {
  it('splits on whitespace and punctuation', () => {
    const tokens = tokenizeQuery('hero-banner, button.primary');
    expect(tokens).toEqual(['hero', 'banner', 'button', 'primary']);
  });

  it('filters short tokens', () => {
    const tokens = tokenizeQuery('a is the hero');
    expect(tokens).toEqual(['the', 'hero']);
  });

  it('lowercases all tokens', () => {
    const tokens = tokenizeQuery('Hero BANNER');
    expect(tokens).toEqual(['hero', 'banner']);
  });
});

// ── configureEmbeddings / getEmbeddingConfig ───────────────

describe('configureEmbeddings / getEmbeddingConfig', () => {
  const DEFAULT_MODEL = 'Xenova/all-MiniLM-L6-v2';

  afterEach(() => {
    // Restore defaults after each test
    configureEmbeddings({});
  });

  it('getEmbeddingConfig returns default config values', () => {
    configureEmbeddings({});
    const cfg = getEmbeddingConfig();
    expect(cfg.modelId).toBe(DEFAULT_MODEL);
    expect(cfg.dimensions).toBe(384);
    expect(typeof cfg.cacheDir).toBe('string');
  });

  it('configureEmbeddings overrides modelId', () => {
    configureEmbeddings({ modelId: 'Xenova/custom-model' });
    expect(getEmbeddingConfig().modelId).toBe('Xenova/custom-model');
  });

  it('configureEmbeddings overrides dimensions', () => {
    configureEmbeddings({ dimensions: 768 });
    expect(getEmbeddingConfig().dimensions).toBe(768);
  });

  it('getEmbeddingConfig returns a copy, not reference', () => {
    const cfg1 = getEmbeddingConfig();
    cfg1.modelId = 'mutated';
    expect(getEmbeddingConfig().modelId).toBe(DEFAULT_MODEL);
  });
});

// ── isModelLoaded / unloadModel ────────────────────────────

describe('isModelLoaded / unloadModel', () => {
  it('isModelLoaded returns false initially (no extractor loaded)', () => {
    unloadModel();
    expect(isModelLoaded()).toBe(false);
  });

  it('unloadModel is idempotent', () => {
    unloadModel();
    unloadModel();
    expect(isModelLoaded()).toBe(false);
  });
});

// ── Fetch mock helpers (for sidecar path tests) ───────────

const originalFetch = globalThis.fetch;
let fetchResponses: Array<{ body: unknown; status: number }> = [];

function enqueueFetchResponse(body: unknown, status = 200) {
  fetchResponses.push({ body, status });
}

function installFetchMock() {
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    const response = fetchResponses.shift();
    if (!response) throw new Error(`No mock response for ${url}`);
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      json: async () => response.body,
    } as Response;
  }) as typeof fetch;
}

// ── embedBatch empty-array shortcut ───────────────────────

describe('embedBatch', () => {
  it('returns empty array immediately for empty input', async () => {
    // Returns before checking sidecar — no fetch needed
    const result = await embedBatch([]);
    expect(result).toEqual([]);
  });
});

// ── embed / embedBatch via sidecar (fetch mock) ───────────

describe('embed (sidecar path)', () => {
  beforeEach(() => {
    setSidecarUrl('http://localhost:8100');
    resetAvailabilityCache();
    fetchResponses = [];
    installFetchMock();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('delegates to sidecarEmbed when sidecar is available', async () => {
    const fakeVec = new Float32Array([0.5, 0.5]);
    const base64 = Buffer.from(fakeVec.buffer).toString('base64');
    // First fetch: /ready → { ready: true }
    enqueueFetchResponse({ ready: true }, 200);
    // Second fetch: /embed → { vector: base64, dimensions: 2 }
    enqueueFetchResponse({ vector: base64, dimensions: 2 }, 200);

    const result = await embed('hello world');
    expect(result).toBeInstanceOf(Float32Array);
    expect(result.length).toBe(2);
  });
});

describe('embedBatch (sidecar path)', () => {
  beforeEach(() => {
    setSidecarUrl('http://localhost:8100');
    resetAvailabilityCache();
    fetchResponses = [];
    installFetchMock();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('delegates to sidecarEmbedBatch when sidecar is available', async () => {
    const v1 = new Float32Array([0.1]);
    const v2 = new Float32Array([0.2]);
    const b1 = Buffer.from(v1.buffer).toString('base64');
    const b2 = Buffer.from(v2.buffer).toString('base64');
    // First fetch: /ready → { ready: true }
    enqueueFetchResponse({ ready: true }, 200);
    // Second fetch: /embed/batch → { vectors: [...], dimensions: 1, count: 2 }
    enqueueFetchResponse({ vectors: [b1, b2], dimensions: 1, count: 2 }, 200);

    const result = await embedBatch(['a', 'b']);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Float32Array);
  });
});
