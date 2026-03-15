/**
 * Artifact store — smoke tests to bring coverage off 0%.
 */
import { describe, it, expect, beforeEach } from '@jest/globals';
import Database from 'better-sqlite3';
import {
  generateArtifactId,
  storeArtifact,
  getArtifact,
  queryArtifacts,
  updateFeedbackScore,
  updateQualityScore,
  getArtifactCount,
  getTopArtifacts,
  deleteArtifact,
  resetSchemaInit,
} from '../artifacts/artifact-store.js';
import { recordGeneratedArtifact, getLearningStats, getRecentArtifacts } from '../artifacts/learning-loop.js';

function makeDb(): Database.Database {
  const db = new Database(':memory:');
  return db;
}

describe('artifact-store', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = makeDb();
    resetSchemaInit();
  });

  it('generateArtifactId returns a string prefixed with art-', () => {
    const id = generateArtifactId('create a button', 'component');
    expect(typeof id).toBe('string');
    expect(id.startsWith('art-')).toBe(true);
  });

  it('storeArtifact and getArtifact roundtrip', () => {
    const id = generateArtifactId('button prompt', 'component');
    storeArtifact(
      {
        id,
        type: 'component',
        prompt: 'button prompt',
        code: '<button>Click</button>',
        createdAt: Date.now(),
      },
      db
    );
    const retrieved = getArtifact(id, db);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(id);
    expect(retrieved?.code).toBe('<button>Click</button>');
  });

  it('getArtifact returns undefined for unknown id', () => {
    const result = getArtifact('nonexistent-id', makeDb());
    expect(result).toBeUndefined();
  });

  it('queryArtifacts returns an array', () => {
    const id = generateArtifactId('query test', 'page');
    storeArtifact({ id, type: 'page', prompt: 'query test', code: '<div />', createdAt: Date.now() }, db);
    const results = queryArtifacts({ type: 'page' }, db);
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('updateFeedbackScore does not throw', () => {
    const id = generateArtifactId('fb test', 'component');
    storeArtifact({ id, type: 'component', prompt: 'fb test', code: '<span />', createdAt: Date.now() }, db);
    expect(() => updateFeedbackScore(id, 0.8, db)).not.toThrow();
  });

  it('updateQualityScore does not throw', () => {
    const id = generateArtifactId('qs test', 'component');
    storeArtifact({ id, type: 'component', prompt: 'qs test', code: '<span />', createdAt: Date.now() }, db);
    expect(() => updateQualityScore(id, 0.9, db)).not.toThrow();
  });

  it('getArtifactCount returns a number', () => {
    const count = getArtifactCount(db);
    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThanOrEqual(0);
  });

  it('getTopArtifacts returns an array', () => {
    const results = getTopArtifacts(db, 5);
    expect(Array.isArray(results)).toBe(true);
  });

  it('deleteArtifact removes the artifact', () => {
    const id = generateArtifactId('delete test', 'component');
    storeArtifact({ id, type: 'component', prompt: 'delete test', code: '<del />', createdAt: Date.now() }, db);
    deleteArtifact(id, db);
    expect(getArtifact(id, db)).toBeUndefined();
  });
});

describe('learning-loop', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = makeDb();
    resetSchemaInit();
  });

  it('recordGeneratedArtifact does not throw', () => {
    expect(() =>
      recordGeneratedArtifact('create a nav', '<nav />', 'component', db, {
        category: 'navigation',
        qualityScore: 8,
      })
    ).not.toThrow();
  });

  it('getLearningStats returns stats object', () => {
    const stats = getLearningStats(db);
    expect(typeof stats).toBe('object');
    expect(typeof stats.totalArtifacts).toBe('number');
  });

  it('getRecentArtifacts returns an array', () => {
    const results = getRecentArtifacts(db, 5);
    expect(Array.isArray(results)).toBe(true);
  });
});
