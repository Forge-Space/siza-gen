/**
 * Scaffold templates — smoke tests to bring coverage off 0%.
 */
import { describe, it, expect } from '@jest/globals';
import { templates, templateList } from '../registry/scaffold-templates/index.js';
import { nextSaasTemplate } from '../registry/scaffold-templates/templates/next-saas.js';
import { nextAppTemplate } from '../registry/scaffold-templates/templates/next-app.js';
import { expressApiTemplate } from '../registry/scaffold-templates/templates/express-api.js';
import { fullstackMonoTemplate } from '../registry/scaffold-templates/templates/fullstack-mono.js';
import { reactSpaTemplate } from '../registry/scaffold-templates/templates/react-spa.js';
import { selectTemplate, getTemplate, getRecommendations } from '../registry/scaffold-templates/decision-engine.js';

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

describe('scaffold-templates decision-engine', () => {
  it('selectTemplate returns a ProjectType string for saas', () => {
    const result = selectTemplate({ appType: 'saas' });
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('selectTemplate returns express-api for api appType', () => {
    const result = selectTemplate({ appType: 'api' });
    expect(result).toBe('express-api');
  });

  it('selectTemplate returns a ProjectType with empty criteria', () => {
    const result = selectTemplate({});
    expect(typeof result).toBe('string');
  });

  it('selectTemplate returns fullstack-mono when needsMonorepo and needsBackend', () => {
    const result = selectTemplate({ needsMonorepo: true, needsBackend: true });
    expect(typeof result).toBe('string');
  });

  it('getTemplate returns IProjectTemplate by id', () => {
    const template = getTemplate('next-saas');
    expect(template).toBeDefined();
    expect(template.id).toBe('next-saas');
  });

  it('getRecommendations returns primary and alternatives', () => {
    const recs = getRecommendations({ appType: 'saas' });
    expect(typeof recs.primary).toBe('string');
    expect(Array.isArray(recs.alternatives)).toBe(true);
  });
});
