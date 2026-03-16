/**
 * Scaffold templates — unit tests for decision-engine, template shapes, and customization.
 */
import { describe, it, expect } from '@jest/globals';
import { templates, templateList } from '../registry/scaffold-templates/index.js';
import { nextSaasTemplate } from '../registry/scaffold-templates/templates/next-saas.js';
import { nextAppTemplate } from '../registry/scaffold-templates/templates/next-app.js';
import { expressApiTemplate } from '../registry/scaffold-templates/templates/express-api.js';
import { fullstackMonoTemplate } from '../registry/scaffold-templates/templates/fullstack-mono.js';
import { reactSpaTemplate } from '../registry/scaffold-templates/templates/react-spa.js';
import {
  selectTemplate,
  getTemplate,
  getAllTemplates,
  customizeTemplate,
  getRecommendations,
} from '../registry/scaffold-templates/decision-engine.js';

describe('scaffold-templates', () => {
  it('templates map has all 5 project types', () => {
    const keys = Object.keys(templates);
    expect(keys).toContain('next-saas');
    expect(keys).toContain('next-app');
    expect(keys).toContain('express-api');
    expect(keys).toContain('fullstack-mono');
    expect(keys).toContain('react-spa');
  });

  it('templateList has 5 entries', () => {
    expect(templateList.length).toBe(5);
  });

  it('each template has id, name, and description', () => {
    for (const template of templateList) {
      expect(typeof template.id).toBe('string');
      expect(template.id.length).toBeGreaterThan(0);
      expect(typeof template.name).toBe('string');
      expect(typeof template.description).toBe('string');
    }
  });

  it('nextSaasTemplate has expected shape', () => {
    expect(nextSaasTemplate.id).toBe('next-saas');
    expect(typeof nextSaasTemplate.name).toBe('string');
    expect(typeof nextSaasTemplate.description).toBe('string');
  });

  it('nextAppTemplate has expected shape', () => {
    expect(nextAppTemplate.id).toBe('next-app');
  });

  it('expressApiTemplate has expected shape', () => {
    expect(expressApiTemplate.id).toBe('express-api');
  });

  it('fullstackMonoTemplate has expected shape', () => {
    expect(fullstackMonoTemplate.id).toBe('fullstack-mono');
  });

  it('reactSpaTemplate has expected shape', () => {
    expect(reactSpaTemplate.id).toBe('react-spa');
  });
});

describe('decision-engine — getTemplate', () => {
  it('returns template by id', () => {
    const t = getTemplate('next-saas');
    expect(t.id).toBe('next-saas');
  });

  it('throws for unknown project type', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => getTemplate('unknown-type' as any)).toThrow('Template not found for project type: unknown-type');
  });
});

describe('decision-engine — getAllTemplates', () => {
  it('returns all 5 templates', () => {
    const all = getAllTemplates();
    expect(all.length).toBe(5);
  });

  it('contains all expected project types', () => {
    const ids = getAllTemplates().map((t) => t.id);
    expect(ids).toContain('next-saas');
    expect(ids).toContain('next-app');
    expect(ids).toContain('express-api');
    expect(ids).toContain('fullstack-mono');
    expect(ids).toContain('react-spa');
  });
});

describe('decision-engine — selectTemplate', () => {
  it('returns express-api for api appType', () => {
    expect(selectTemplate({ appType: 'api' })).toBe('express-api');
  });

  it('returns express-api when needsBackend is true', () => {
    expect(selectTemplate({ needsBackend: true })).toBe('express-api');
  });

  it('returns next-saas when needsMonorepo + saas', () => {
    expect(selectTemplate({ needsMonorepo: true, appType: 'saas' })).toBe('next-saas');
  });

  it('returns next-saas when needsMonorepo + enterprise scale', () => {
    expect(selectTemplate({ needsMonorepo: true, scale: 'enterprise' })).toBe('next-saas');
  });

  it('returns fullstack-mono when needsMonorepo (no saas/enterprise)', () => {
    expect(selectTemplate({ needsMonorepo: true })).toBe('fullstack-mono');
  });

  it('returns next-saas for saas + enterprise scale', () => {
    expect(selectTemplate({ appType: 'saas', scale: 'enterprise' })).toBe('next-saas');
  });

  it('returns next-saas for saas + authentication feature', () => {
    expect(selectTemplate({ appType: 'saas', features: ['authentication'] })).toBe('next-saas');
  });

  it('returns next-saas for saas + payments feature', () => {
    expect(selectTemplate({ appType: 'saas', features: ['payments'] })).toBe('next-saas');
  });

  it('returns next-saas for saas + team scale', () => {
    expect(selectTemplate({ appType: 'saas', scale: 'team' })).toBe('next-saas');
  });

  it('returns next-app for saas without special features or scale', () => {
    expect(selectTemplate({ appType: 'saas', scale: 'solo' })).toBe('next-app');
  });

  it('returns next-saas for ecommerce + enterprise scale', () => {
    expect(selectTemplate({ appType: 'ecommerce', scale: 'enterprise' })).toBe('next-saas');
  });

  it('returns next-saas for ecommerce + team scale', () => {
    expect(selectTemplate({ appType: 'ecommerce', scale: 'team' })).toBe('next-saas');
  });

  it('returns fullstack-mono for ecommerce + solo scale', () => {
    expect(selectTemplate({ appType: 'ecommerce', scale: 'solo' })).toBe('fullstack-mono');
  });

  it('returns next-saas for dashboard + enterprise scale', () => {
    expect(selectTemplate({ appType: 'dashboard', scale: 'enterprise' })).toBe('next-saas');
  });

  it('returns fullstack-mono for dashboard + team scale', () => {
    expect(selectTemplate({ appType: 'dashboard', scale: 'team' })).toBe('fullstack-mono');
  });

  it('returns react-spa for dashboard + spa feature', () => {
    expect(selectTemplate({ appType: 'dashboard', features: ['client-only'] })).toBe('react-spa');
  });

  it('returns next-app for dashboard + solo (no spa feature)', () => {
    expect(selectTemplate({ appType: 'dashboard', scale: 'solo' })).toBe('next-app');
  });

  it('returns next-app for landing + seo feature', () => {
    expect(selectTemplate({ appType: 'landing', features: ['seo'] })).toBe('next-app');
  });

  it('returns react-spa for landing without SSR features', () => {
    expect(selectTemplate({ appType: 'landing' })).toBe('react-spa');
  });

  it('returns next-saas for enterprise scale fallback', () => {
    expect(selectTemplate({ scale: 'enterprise' })).toBe('next-saas');
  });

  it('returns fullstack-mono for team scale fallback', () => {
    expect(selectTemplate({ scale: 'team' })).toBe('fullstack-mono');
  });

  it('returns next-app as solo-developer default', () => {
    expect(selectTemplate({})).toBe('next-app');
  });
});

/** Return a deep-enough clone of next-saas to prevent cross-test mutation. */
function freshBase() {
  const t = getTemplate('next-saas');
  return {
    ...t,
    dependencies: { ...t.dependencies },
    configFiles: t.configFiles.map((f) => ({ ...f })),
    features: [...t.features],
  };
}

describe('decision-engine — customizeTemplate', () => {
  it('sets the project name', () => {
    const result = customizeTemplate(freshBase(), { projectName: 'my-project' });
    expect(result.name).toBe('my-project');
  });

  it('filters features when options.features provided', () => {
    const result = customizeTemplate(freshBase(), { projectName: 'test', features: ['auth'] });
    expect(Array.isArray(result.features)).toBe(true);
  });

  it('preserves all features when options.features is empty', () => {
    const base = freshBase();
    const result = customizeTemplate(base, { projectName: 'test', features: [] });
    expect(result.features).toEqual(base.features);
  });

  it('adds zustand dependency for zustand stateManagement', () => {
    const result = customizeTemplate(freshBase(), { projectName: 'test', stateManagement: 'zustand' });
    expect(result.dependencies['zustand']).toBeDefined();
  });

  it('adds redux-toolkit dependencies for redux-toolkit stateManagement', () => {
    const result = customizeTemplate(freshBase(), { projectName: 'test', stateManagement: 'redux-toolkit' });
    expect(result.dependencies['@reduxjs/toolkit']).toBeDefined();
    expect(result.dependencies['react-redux']).toBeDefined();
  });

  it('adds tanstack-query dependency for tanstack-query stateManagement', () => {
    const result = customizeTemplate(freshBase(), { projectName: 'test', stateManagement: 'tanstack-query' });
    expect(result.dependencies['@tanstack/react-query']).toBeDefined();
  });

  it('adds jotai dependency for jotai stateManagement', () => {
    const result = customizeTemplate(freshBase(), { projectName: 'test', stateManagement: 'jotai' });
    expect(result.dependencies['jotai']).toBeDefined();
  });

  it('adds vercel.json for vercel deployTarget', () => {
    const result = customizeTemplate(freshBase(), { projectName: 'test', deployTarget: 'vercel' });
    expect(result.configFiles.find((f) => f.path === 'vercel.json')).toBeDefined();
  });

  it('adds wrangler.jsonc for cloudflare deployTarget', () => {
    const result = customizeTemplate(freshBase(), { projectName: 'test', deployTarget: 'cloudflare' });
    expect(result.configFiles.find((f) => f.path === 'wrangler.jsonc')).toBeDefined();
    expect(result.dependencies['@opennextjs/cloudflare']).toBeDefined();
  });

  it('adds Dockerfile for docker deployTarget when not already present', () => {
    const result = customizeTemplate(freshBase(), { projectName: 'test', deployTarget: 'docker' });
    expect(result.configFiles.find((f) => f.path === 'Dockerfile')).toBeDefined();
  });

  it('does not duplicate Dockerfile if already in template', () => {
    const base = freshBase();
    base.configFiles.push({ path: 'Dockerfile', content: 'FROM node:22' });
    const result = customizeTemplate(base, { projectName: 'test', deployTarget: 'docker' });
    expect(result.configFiles.filter((f) => f.path === 'Dockerfile').length).toBe(1);
  });
});

describe('decision-engine — getRecommendations', () => {
  it('returns primary and alternatives for saas', () => {
    const recs = getRecommendations({ appType: 'saas' });
    expect(typeof recs.primary).toBe('string');
    expect(Array.isArray(recs.alternatives)).toBe(true);
    expect(typeof recs.reasoning).toBe('string');
  });

  it('returns api-specific reasoning for api type', () => {
    const recs = getRecommendations({ appType: 'api' });
    expect(recs.primary).toBe('express-api');
    expect(recs.reasoning).toContain('API-only');
  });

  it('returns monorepo reasoning when needsMonorepo', () => {
    const recs = getRecommendations({ needsMonorepo: true });
    expect(recs.reasoning).toContain('monorepo');
  });

  it('returns enterprise reasoning for enterprise scale', () => {
    const recs = getRecommendations({ scale: 'enterprise' });
    expect(recs.reasoning).toContain('Enterprise');
  });

  it('returns solo reasoning for solo scale', () => {
    const recs = getRecommendations({ scale: 'solo' });
    expect(recs.reasoning).toContain('Solo');
  });

  it('alternatives excludes the primary', () => {
    const recs = getRecommendations({ appType: 'saas' });
    expect(recs.alternatives).not.toContain(recs.primary);
  });

  it('alternatives has at most 2 entries', () => {
    const recs = getRecommendations({});
    expect(recs.alternatives.length).toBeLessThanOrEqual(2);
  });
});
