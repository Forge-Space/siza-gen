import { getDatabase } from '../registry/database/store.js';
import { storeEmbedding } from '../ml/embedding-store.js';

const SIDECAR_URL = process.env.SIZA_ML_URL ?? 'http://localhost:8100';

interface IngestEntry {
  id: string;
  text: string;
  vector: string;
  entry_type: string;
  metadata?: Record<string, string>;
}

function decodeBase64Vector(b64: string): Float32Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Float32Array(bytes.buffer);
}

async function main() {
  console.log('Seeding axe-core accessibility rules...');

  let entries: IngestEntry[];

  try {
    const resp = await fetch(`${SIDECAR_URL}/ingest/axe-core`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    if (!resp.ok) throw new Error(`Sidecar: ${resp.status}`);
    const data = (await resp.json()) as { entries: IngestEntry[]; count: number };
    entries = data.entries;
    console.log(`Sidecar returned ${entries.length} axe-core rules`);
  } catch {
    console.log('Sidecar unavailable, skipping axe-core seeding');
    console.log('Start the sidecar with: npm run sidecar:start');
    process.exit(0);
  }

  const db = getDatabase();
  let stored = 0;

  for (const entry of entries) {
    const vector = decodeBase64Vector(entry.vector);
    storeEmbedding(
      {
        sourceId: entry.id,
        sourceType: 'rule',
        text: entry.text,
        vector,
        dimensions: vector.length,
        createdAt: Date.now(),
      },
      db
    );
    stored++;
  }

  console.log(`Stored ${stored} axe-core rules in rag.sqlite`);
}

main().catch(console.error);
