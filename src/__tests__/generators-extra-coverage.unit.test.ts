import { describe, it, expect } from '@jest/globals';
import { generateComponent, generateProject } from '../generators/generator-factory.js';
import { getComponentLibrariesForFramework, getRecommendedLibrary } from '../registry/component-libraries.js';

/**
 * Extra coverage tests targeting uncovered functions:
 * 1. primevue library path in vue/angular/svelte/html generators
 * 2. Svelte createStateManagementFiles (stateManagement === 'stores')
 * 3. component-libraries registry helper functions
 */

describe('Generator primevue library coverage', () => {
  const frameworks = ['vue', 'angular', 'svelte', 'html'] as const;

  frameworks.forEach((framework) => {
    describe(`${framework} generator — primevue library`, () => {
      it('generates a component with primevue library', () => {
        const files = generateComponent(framework, 'button', { variant: 'primary' }, undefined, 'primevue');
        expect(files.length).toBeGreaterThan(0);
        files.forEach((f) => {
          expect(f.path.length).toBeGreaterThan(0);
          expect(f.content.length).toBeGreaterThan(0);
        });
      });

      it('generates a card component with primevue library', () => {
        const files = generateComponent(framework, 'card', {}, undefined, 'primevue');
        expect(files.length).toBeGreaterThan(0);
      });

      it('generates an input component with primevue library', () => {
        const files = generateComponent(framework, 'input', {}, undefined, 'primevue');
        expect(files.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('Svelte createStateManagementFiles coverage', () => {
  it('generates project with stores state management', () => {
    const files = generateProject('svelte', 'svelte-stores-app', 'flat', 'stores');
    expect(files.length).toBeGreaterThan(0);
    const paths = files.map((f) => f.path);
    // createStateManagementFiles adds store files when stateManagement !== 'none'
    const hasStoreFile = paths.some((p) => p.includes('store') || p.includes('lib'));
    expect(hasStoreFile).toBe(true);
  });

  it('generates project with pinia state management (svelte)', () => {
    const files = generateProject('svelte', 'svelte-pinia-app', 'flat', 'pinia');
    expect(files.length).toBeGreaterThan(0);
  });

  it('generates project with zustand state management (svelte)', () => {
    const files = generateProject('svelte', 'svelte-zustand-app', 'flat', 'zustand');
    expect(files.length).toBeGreaterThan(0);
  });

  it('generates project with useState state management (svelte)', () => {
    const files = generateProject('svelte', 'svelte-usestate-app', 'flat', 'useState');
    expect(files.length).toBeGreaterThan(0);
  });

  it('generates project with signals state management (svelte)', () => {
    const files = generateProject('svelte', 'svelte-signals-app', 'flat', 'signals');
    expect(files.length).toBeGreaterThan(0);
  });
});

describe('Vue createStateManagementFiles coverage', () => {
  it('generates project with pinia state management', () => {
    const files = generateProject('vue', 'vue-pinia-app', 'flat', 'pinia');
    expect(files.length).toBeGreaterThan(0);
  });

  it('generates project with zustand state management', () => {
    const files = generateProject('vue', 'vue-zustand-app', 'flat', 'zustand');
    expect(files.length).toBeGreaterThan(0);
  });
});

describe('Angular createStateManagementFiles coverage', () => {
  it('generates project with pinia state management', () => {
    const files = generateProject('angular', 'angular-pinia-app', 'flat', 'pinia');
    expect(files.length).toBeGreaterThan(0);
  });

  it('generates project with signals state management', () => {
    const files = generateProject('angular', 'angular-signals-app', 'flat', 'signals');
    expect(files.length).toBeGreaterThan(0);
  });
});

describe('component-libraries registry helpers', () => {
  it('getComponentLibrariesForFramework returns libraries for vue', () => {
    const libs = getComponentLibrariesForFramework('vue');
    expect(Array.isArray(libs)).toBe(true);
    expect(libs.length).toBeGreaterThan(0);
    libs.forEach((lib) => {
      expect(lib.frameworks).toContain('vue');
    });
  });

  it('getComponentLibrariesForFramework returns libraries for react', () => {
    const libs = getComponentLibrariesForFramework('react');
    expect(Array.isArray(libs)).toBe(true);
    expect(libs.length).toBeGreaterThan(0);
  });

  it('getComponentLibrariesForFramework returns libraries for angular', () => {
    const libs = getComponentLibrariesForFramework('angular');
    expect(Array.isArray(libs)).toBe(true);
    expect(libs.length).toBeGreaterThan(0);
  });

  it('getComponentLibrariesForFramework returns empty array for unknown framework', () => {
    const libs = getComponentLibrariesForFramework('unknown-framework');
    expect(Array.isArray(libs)).toBe(true);
    expect(libs.length).toBe(0);
  });

  it('getRecommendedLibrary returns recommended library for vue', () => {
    const lib = getRecommendedLibrary('vue');
    expect(lib).toBeDefined();
    expect(lib!.recommended).toBe(true);
    expect(lib!.frameworks).toContain('vue');
  });

  it('getRecommendedLibrary returns recommended library for angular', () => {
    const lib = getRecommendedLibrary('angular');
    expect(lib).toBeDefined();
    expect(lib!.recommended).toBe(true);
  });

  it('getRecommendedLibrary returns recommended library for react', () => {
    const lib = getRecommendedLibrary('react');
    expect(lib).toBeDefined();
    expect(lib!.recommended).toBe(true);
  });

  it('getRecommendedLibrary returns undefined for unknown framework', () => {
    const lib = getRecommendedLibrary('unknown-framework');
    expect(lib).toBeUndefined();
  });
});
