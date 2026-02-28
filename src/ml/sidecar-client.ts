import { createLogger } from '../logger.js';

const logger = createLogger('sidecar-client');

let sidecarUrl = 'http://localhost:8100';
let lastAvailabilityCheck = 0;
let lastAvailabilityResult = false;
const AVAILABILITY_CACHE_MS = 30_000;
const REQUEST_TIMEOUT_MS = 5_000;

export function setSidecarUrl(url: string): void {
  sidecarUrl = url;
  lastAvailabilityCheck = 0;
  lastAvailabilityResult = false;
}

export function getSidecarUrl(): string {
  return sidecarUrl;
}

function decodeBase64Vector(b64: string): Float32Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Float32Array(bytes.buffer);
}

async function sidecarFetch<T>(path: string, body?: unknown, timeoutMs: number = REQUEST_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const resp = await fetch(`${sidecarUrl}${path}`, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!resp.ok) {
      throw new Error(`Sidecar ${path}: ${resp.status} ${resp.statusText}`);
    }

    return (await resp.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export async function isSidecarAvailable(): Promise<boolean> {
  const now = Date.now();
  if (now - lastAvailabilityCheck < AVAILABILITY_CACHE_MS) {
    return lastAvailabilityResult;
  }

  try {
    const result = await sidecarFetch<{ ready: boolean }>('/ready', undefined, 2_000);
    lastAvailabilityResult = result.ready;
  } catch {
    lastAvailabilityResult = false;
  }

  lastAvailabilityCheck = now;
  return lastAvailabilityResult;
}

export function resetAvailabilityCache(): void {
  lastAvailabilityCheck = 0;
  lastAvailabilityResult = false;
}

export async function sidecarEmbed(text: string): Promise<Float32Array> {
  const result = await sidecarFetch<{ vector: string; dimensions: number }>('/embed', { text });
  return decodeBase64Vector(result.vector);
}

export async function sidecarEmbedBatch(texts: string[]): Promise<Float32Array[]> {
  const result = await sidecarFetch<{
    vectors: string[];
    dimensions: number;
    count: number;
  }>('/embed/batch', { texts });
  return result.vectors.map(decodeBase64Vector);
}

export interface ISidecarScoreResult {
  score: number;
  confidence: number;
  factors: Record<string, number>;
  source: string;
}

export async function sidecarScoreQuality(
  prompt: string,
  code: string,
  componentType?: string,
  framework?: string
): Promise<ISidecarScoreResult> {
  return sidecarFetch<ISidecarScoreResult>(
    '/score',
    {
      prompt,
      code,
      component_type: componentType,
      framework,
    },
    10_000
  );
}

export interface ISidecarEnhanceResult {
  enhanced: string;
  additions: string[];
  source: string;
}

export async function sidecarEnhancePrompt(
  prompt: string,
  context?: {
    componentType?: string;
    framework?: string;
    style?: string;
    mood?: string;
    industry?: string;
  }
): Promise<ISidecarEnhanceResult> {
  return sidecarFetch<ISidecarEnhanceResult>(
    '/enhance',
    {
      prompt,
      component_type: context?.componentType,
      framework: context?.framework,
      style: context?.style,
      mood: context?.mood,
      industry: context?.industry,
    },
    10_000
  );
}

export interface ISidecarVectorSearchResult {
  id: string;
  distance: number;
  metadata?: Record<string, string>;
}

export async function sidecarVectorSearch(
  vector: Float32Array,
  topK: number = 5
): Promise<ISidecarVectorSearchResult[]> {
  const b64 = Buffer.from(vector.buffer).toString('base64');
  return sidecarFetch<ISidecarVectorSearchResult[]>('/vector/search', {
    vector: b64,
    top_k: topK,
  });
}

export async function sidecarVectorIndex(
  vectors: { id: string; vector: Float32Array; metadata?: Record<string, string> }[]
): Promise<{ indexed: number }> {
  const entries = vectors.map((v) => ({
    id: v.id,
    vector: Buffer.from(v.vector.buffer).toString('base64'),
    metadata: v.metadata,
  }));
  return sidecarFetch<{ indexed: number }>('/vector/index', { entries });
}

export interface ISidecarTrainingJob {
  job_id: string;
  status: string;
}

export async function sidecarStartTraining(
  adapterType: string,
  dataPath: string,
  config?: {
    rank?: number;
    epochs?: number;
    learningRate?: number;
    batchSize?: number;
  }
): Promise<ISidecarTrainingJob> {
  return sidecarFetch<ISidecarTrainingJob>(
    '/train/start',
    {
      adapter_type: adapterType,
      data_path: dataPath,
      config,
    },
    10_000
  );
}

export async function sidecarGetTrainingStatus(jobId: string): Promise<{
  job_id: string;
  status: string;
  progress: number;
  error?: string;
}> {
  return sidecarFetch(`/train/status/${jobId}`);
}

export async function sidecarCancelTraining(jobId: string): Promise<{ cancelled: boolean }> {
  return sidecarFetch<{ cancelled: boolean }>(`/train/cancel/${jobId}`, {});
}
