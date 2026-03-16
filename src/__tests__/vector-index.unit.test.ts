import { jest } from '@jest/globals';
import {
  isVssAvailable,
  initVectorIndex,
  indexEmbedding,
  indexEmbeddings,
  removeFromIndex,
  searchVectors,
  rebuildIndex,
} from '../ml/vector-index.js';

// sqlite-vss is not installed in the test env, so initVectorIndex will always
// fail and leave vssAvailable = false. We test the guard branches that fire when
// vssAvailable is false and also that initVectorIndex returns false on failure.

// Minimal mock DB – the guard-branch functions return immediately without
// calling any DB methods, so we only need an object with the right shape.
function makeMockDb() {
  const mockRun = jest.fn();
  const mockAll = jest.fn<() => unknown[]>().mockReturnValue([]);
  const mockPrepare = jest.fn().mockReturnValue({ run: mockRun, all: mockAll });
  const mockExec = jest.fn();
  const mockTransaction = jest.fn((fn: () => void) => fn);
  return {
    prepare: mockPrepare,
    exec: mockExec,
    transaction: mockTransaction,
  } as unknown as import('better-sqlite3').Database;
}

describe('initVectorIndex', () => {
  it('returns false when sqlite-vss is unavailable', () => {
    const db = makeMockDb();
    const result = initVectorIndex(db);
    expect(result).toBe(false);
  });

  it('sets isVssAvailable to false on failure', () => {
    const db = makeMockDb();
    initVectorIndex(db);
    expect(isVssAvailable()).toBe(false);
  });
});

describe('isVssAvailable', () => {
  it('returns false when VSS is not loaded', () => {
    // initVectorIndex failed above, so vssAvailable stays false
    expect(isVssAvailable()).toBe(false);
  });
});

describe('guard-branch functions (vssAvailable = false)', () => {
  let db: ReturnType<typeof makeMockDb>;

  beforeEach(() => {
    db = makeMockDb();
    // Ensure vssAvailable is false
    initVectorIndex(db);
  });

  it('indexEmbedding returns without calling db when vss unavailable', () => {
    const vec = new Float32Array([0.1, 0.2, 0.3]);
    indexEmbedding(db, 1, vec);
    expect(db.prepare).not.toHaveBeenCalled();
  });

  it('indexEmbeddings returns without calling db when vss unavailable', () => {
    const vec = new Float32Array([0.1, 0.2]);
    indexEmbeddings(db, [{ rowid: 1, vector: vec }]);
    expect(db.prepare).not.toHaveBeenCalled();
  });

  it('indexEmbeddings returns early for empty rows array', () => {
    indexEmbeddings(db, []);
    expect(db.prepare).not.toHaveBeenCalled();
  });

  it('removeFromIndex returns without calling db when vss unavailable', () => {
    removeFromIndex(db, 1);
    expect(db.prepare).not.toHaveBeenCalled();
  });

  it('searchVectors returns empty array when vss unavailable', () => {
    const vec = new Float32Array([0.1, 0.2]);
    const result = searchVectors(db, vec, 5);
    expect(result).toEqual([]);
    expect(db.prepare).not.toHaveBeenCalled();
  });

  it('rebuildIndex returns 0 when vss unavailable', () => {
    const result = rebuildIndex(db);
    expect(result).toBe(0);
    expect(db.exec).not.toHaveBeenCalled();
  });
});
