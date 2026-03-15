/**
 * Backend registry — smoke tests to bring coverage off 0%.
 */
import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  registerBackendSnippets,
  getBackendSnippet,
  getBackendSnippetsByCategory,
  getBackendSnippetsByFramework,
  getAllBackendSnippets,
  clearAllBackendSnippets,
  searchBackendSnippets,
} from '../registry/backend-registry/index.js';
import type { IBackendSnippet } from '../registry/backend-registry/types.js';

const sampleSnippet: IBackendSnippet = {
  id: 'test-rest-endpoint',
  name: 'Test REST Endpoint',
  category: 'api-route',
  type: 'rest',
  variant: 'get',
  framework: ['express', 'fastify'],
  patterns: ['service-layer'],
  tags: ['rest', 'get', 'endpoint'],
  typescript: `app.get('/items', (req, res) => { res.json([]) })`,
  dependencies: ['express'],
  quality: { securityChecks: [], performanceConsiderations: [], antiPatterns: [], inspirationSource: 'test' },
  testHint: 'supertest',
};

describe('backend-registry', () => {
  beforeEach(() => {
    clearAllBackendSnippets();
  });

  it('registerBackendSnippets adds snippets to the store', () => {
    registerBackendSnippets([sampleSnippet]);
    const all = getAllBackendSnippets();
    expect(all.length).toBe(1);
    expect(all[0].id).toBe('test-rest-endpoint');
  });

  it('registerBackendSnippets deduplicates on id', () => {
    registerBackendSnippets([sampleSnippet]);
    const updated = { ...sampleSnippet, name: 'Updated' };
    registerBackendSnippets([updated]);
    const all = getAllBackendSnippets();
    expect(all.length).toBe(1);
    expect(all[0].name).toBe('Updated');
  });

  it('getBackendSnippet returns snippet by id', () => {
    registerBackendSnippets([sampleSnippet]);
    const found = getBackendSnippet('test-rest-endpoint');
    expect(found).toBeDefined();
    expect(found?.id).toBe('test-rest-endpoint');
  });

  it('getBackendSnippet returns undefined for unknown id', () => {
    expect(getBackendSnippet('no-such-id')).toBeUndefined();
  });

  it('getBackendSnippetsByCategory filters correctly', () => {
    registerBackendSnippets([sampleSnippet]);
    const results = getBackendSnippetsByCategory('api-route');
    expect(results.length).toBeGreaterThanOrEqual(1);
    results.forEach((s) => expect(s.category).toBe('api-route'));
  });

  it('getBackendSnippetsByCategory returns empty for unregistered category', () => {
    registerBackendSnippets([sampleSnippet]);
    const results = getBackendSnippetsByCategory('middleware');
    expect(results.length).toBe(0);
  });

  it('getBackendSnippetsByFramework filters correctly', () => {
    registerBackendSnippets([sampleSnippet]);
    const results = getBackendSnippetsByFramework('express');
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('getAllBackendSnippets returns frozen array', () => {
    registerBackendSnippets([sampleSnippet]);
    const all = getAllBackendSnippets();
    expect(all.length).toBe(1);
    // readonly — should not throw on access
    expect(() => all[0]).not.toThrow();
  });

  it('searchBackendSnippets filters by category', () => {
    registerBackendSnippets([sampleSnippet]);
    const results = searchBackendSnippets({ category: 'api-route' });
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('searchBackendSnippets filters by framework', () => {
    registerBackendSnippets([sampleSnippet]);
    const results = searchBackendSnippets({ framework: 'fastify' });
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('searchBackendSnippets filters by tag', () => {
    registerBackendSnippets([sampleSnippet]);
    const results = searchBackendSnippets({ tags: ['rest'] });
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('searchBackendSnippets returns empty for no match', () => {
    registerBackendSnippets([sampleSnippet]);
    const results = searchBackendSnippets({ framework: 'django' as never });
    expect(results.length).toBe(0);
  });

  it('clearAllBackendSnippets empties the store', () => {
    registerBackendSnippets([sampleSnippet]);
    clearAllBackendSnippets();
    expect(getAllBackendSnippets().length).toBe(0);
  });
});
