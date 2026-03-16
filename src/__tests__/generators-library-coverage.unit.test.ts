import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { generateComponent, generateProject } from '../generators/generator-factory.js';
import { SvelteGenerator } from '../generators/svelte-generator.js';
import { AngularGenerator } from '../generators/angular-generator.js';
import { VueGenerator } from '../generators/vue-generator.js';
import { HtmlGenerator } from '../generators/html-generator.js';
import { ReactGenerator } from '../generators/react-generator.js';
import { resetLogger, createLogger } from '../logger.js';

/**
 * Comprehensive coverage tests targeting uncovered library-specific methods.
 *
 * Key insight: SvelteGenerator implements abstract library methods
 * (getShadcnDependencies, getRadixDependencies, etc.) but its generateComponent
 * doesn't pass componentLibrary through. Angular/HTML/Vue DO pass it through.
 * For Svelte: directly instantiate + cast to access protected methods.
 * For Angular/HTML/Vue: use generateComponent() with library parameter.
 */

// ============================================================
// Svelte: direct instantiation to cover protected abstract implementations
// ============================================================

describe('SvelteGenerator — protected library method coverage', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let gen: any;

  beforeEach(() => {
    gen = new SvelteGenerator('svelte');
  });

  it('getShadcnDependencies returns array', () => {
    const deps = gen.getShadcnDependencies();
    expect(Array.isArray(deps)).toBe(true);
  });

  it('getRadixDependencies returns array', () => {
    const deps = gen.getRadixDependencies();
    expect(Array.isArray(deps)).toBe(true);
  });

  it('getHeadlessUIDependencies returns array', () => {
    const deps = gen.getHeadlessUIDependencies();
    expect(Array.isArray(deps)).toBe(true);
  });

  it('getPrimeVueDependencies returns array', () => {
    const deps = gen.getPrimeVueDependencies();
    expect(Array.isArray(deps)).toBe(true);
  });

  it('getMaterialDependencies returns array', () => {
    const deps = gen.getMaterialDependencies();
    expect(Array.isArray(deps)).toBe(true);
  });

  it('getShadcnImports returns array', () => {
    const imports = gen.getShadcnImports();
    expect(Array.isArray(imports)).toBe(true);
  });

  it('getRadixImports returns array', () => {
    const imports = gen.getRadixImports();
    expect(Array.isArray(imports)).toBe(true);
  });

  it('getHeadlessUIImports returns array', () => {
    const imports = gen.getHeadlessUIImports();
    expect(Array.isArray(imports)).toBe(true);
  });

  it('getPrimeVueImports returns array', () => {
    const imports = gen.getPrimeVueImports();
    expect(Array.isArray(imports)).toBe(true);
  });

  it('getMaterialImports returns array', () => {
    const imports = gen.getMaterialImports();
    expect(Array.isArray(imports)).toBe(true);
  });

  it('generateShadcnComponent returns string content', () => {
    const result = gen.generateShadcnComponent('button', { variant: 'primary' });
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('generateRadixComponent returns string content', () => {
    const result = gen.generateRadixComponent('button', {});
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('generateHeadlessUIComponent returns string content', () => {
    const result = gen.generateHeadlessUIComponent('button', {});
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('generatePrimeVueComponent returns string content', () => {
    const result = gen.generatePrimeVueComponent('card', {});
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('generateMaterialComponent returns string content', () => {
    const result = gen.generateMaterialComponent('input', {});
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('generateTailwindComponent returns string content', () => {
    const result = gen.generateTailwindComponent('button', {});
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

// ============================================================
// Angular/Vue/HTML: generateComponent with library parameter
// These generators DO pass componentLibrary through createComponentFile
// ============================================================

describe('Angular generator — library-specific methods coverage', () => {
  const libraries = ['shadcn', 'radix', 'headlessui', 'material'] as const;

  libraries.forEach((library) => {
    it(`${library}: generates button component`, () => {
      const files = generateComponent('angular', 'button', { variant: 'primary' }, undefined, library);
      expect(files.length).toBeGreaterThan(0);
      files.forEach((f) => {
        expect(typeof f.path).toBe('string');
        expect(f.content.length).toBeGreaterThan(0);
      });
    });

    it(`${library}: generates card component`, () => {
      const files = generateComponent('angular', 'card', {}, undefined, library);
      expect(files.length).toBeGreaterThan(0);
    });
  });
});

describe('Vue generator — library-specific methods coverage', () => {
  const libraries = ['shadcn', 'radix', 'headlessui', 'material'] as const;

  libraries.forEach((library) => {
    it(`${library}: generates button component`, () => {
      const files = generateComponent('vue', 'button', {}, undefined, library);
      expect(files.length).toBeGreaterThan(0);
    });

    it(`${library}: generates input component`, () => {
      const files = generateComponent('vue', 'input', {}, undefined, library);
      expect(files.length).toBeGreaterThan(0);
    });
  });
});

describe('HTML generator — library-specific methods coverage', () => {
  const libraries = ['shadcn', 'radix', 'headlessui', 'material'] as const;

  libraries.forEach((library) => {
    it(`${library}: generates button component`, () => {
      const files = generateComponent('html', 'button', {}, undefined, library);
      expect(files.length).toBeGreaterThan(0);
    });

    it(`${library}: generates table component`, () => {
      const files = generateComponent('html', 'table', {}, undefined, library);
      expect(files.length).toBeGreaterThan(0);
    });
  });
});

// React generator missing libraries
describe('React generator — additional library coverage', () => {
  const libraries = ['headlessui', 'primevue', 'material'] as const;
  libraries.forEach((library) => {
    it(`react ${library}: generates button component`, () => {
      const files = generateComponent('react', 'button', {}, undefined, library);
      expect(files.length).toBeGreaterThan(0);
    });

    it(`react ${library}: generates card component`, () => {
      const files = generateComponent('react', 'card', {}, undefined, library);
      expect(files.length).toBeGreaterThan(0);
    });
  });
});

// ============================================================
// Base generator: validateParams + getFileExtension via project generation
// ============================================================

describe('Base generator protected method coverage', () => {
  it('svelte: generates project (atomic + useState exercises validateParams + getFileExtension)', () => {
    const files = generateProject('svelte', 'my-test-app', 'atomic', 'useState');
    expect(files.length).toBeGreaterThan(0);
  });

  it('angular: generates project (feature-based + signals)', () => {
    const files = generateProject('angular', 'angular-test-app', 'feature-based', 'signals');
    expect(files.length).toBeGreaterThan(0);
  });

  it('html: generates project (flat + none)', () => {
    const files = generateProject('html', 'html-test-app', 'flat', 'none');
    expect(files.length).toBeGreaterThan(0);
  });

  it('vue: generates project (atomic + pinia)', () => {
    const files = generateProject('vue', 'vue-atomic-app', 'atomic', 'pinia');
    expect(files.length).toBeGreaterThan(0);
  });

  it('react: generates project (feature-based + zustand)', () => {
    const files = generateProject('react', 'react-feature-app', 'feature-based', 'zustand');
    expect(files.length).toBeGreaterThan(0);
  });
});

// ============================================================
// Logger: exercise consoleFallback functions
// ============================================================

describe('Logger — resetLogger + createLogger coverage', () => {
  beforeEach(() => {
    resetLogger();
  });

  afterEach(() => {
    resetLogger();
  });

  it('createLogger returns a usable logger', () => {
    const log = createLogger('test-module');
    expect(log).toBeDefined();
    expect(() => log.debug('debug message')).not.toThrow();
    expect(() => log.info('info message')).not.toThrow();
  });

  it('child logger is callable', () => {
    const log = createLogger('parent-module');
    const child = log.child({ module: 'child-module' });
    expect(child).toBeDefined();
    expect(() => child.info('child info')).not.toThrow();
  });

  it('resetLogger allows re-initialization', () => {
    const log1 = createLogger('mod-a');
    expect(log1).toBeDefined();
    resetLogger();
    const log2 = createLogger('mod-b');
    expect(log2).toBeDefined();
    resetLogger();
  });

  it('logger methods (error, warn, info, debug) work after reset', () => {
    resetLogger();
    const log = createLogger('coverage-test');
    expect(() => {
      log.error('error msg');
      log.warn('warn msg');
      log.info('info msg');
      log.debug('debug msg');
    }).not.toThrow();
  });
});

// ============================================================
// AngularGenerator: direct instantiation to cover protected methods
// ============================================================

describe('AngularGenerator — protected library method coverage', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let gen: any;

  beforeEach(() => {
    gen = new AngularGenerator('angular');
  });

  it('getShadcnDependencies returns array', () => {
    expect(Array.isArray(gen.getShadcnDependencies())).toBe(true);
  });
  it('getRadixDependencies returns array', () => {
    expect(Array.isArray(gen.getRadixDependencies())).toBe(true);
  });
  it('getHeadlessUIDependencies returns array', () => {
    expect(Array.isArray(gen.getHeadlessUIDependencies())).toBe(true);
  });
  it('getPrimeVueDependencies returns array', () => {
    expect(Array.isArray(gen.getPrimeVueDependencies())).toBe(true);
  });
  it('getMaterialDependencies returns array', () => {
    expect(Array.isArray(gen.getMaterialDependencies())).toBe(true);
  });
  it('getShadcnImports returns array', () => {
    expect(Array.isArray(gen.getShadcnImports())).toBe(true);
  });
  it('getRadixImports returns array', () => {
    expect(Array.isArray(gen.getRadixImports())).toBe(true);
  });
  it('getHeadlessUIImports returns array', () => {
    expect(Array.isArray(gen.getHeadlessUIImports())).toBe(true);
  });
  it('getPrimeVueImports returns array', () => {
    expect(Array.isArray(gen.getPrimeVueImports())).toBe(true);
  });
  it('getMaterialImports returns array', () => {
    expect(Array.isArray(gen.getMaterialImports())).toBe(true);
  });
});

// ============================================================
// VueGenerator: direct instantiation to cover protected methods
// ============================================================

describe('VueGenerator — protected library method coverage', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let gen: any;

  beforeEach(() => {
    gen = new VueGenerator('vue');
  });

  it('getShadcnDependencies returns array', () => {
    expect(Array.isArray(gen.getShadcnDependencies())).toBe(true);
  });
  it('getRadixDependencies returns array', () => {
    expect(Array.isArray(gen.getRadixDependencies())).toBe(true);
  });
  it('getHeadlessUIDependencies returns array', () => {
    expect(Array.isArray(gen.getHeadlessUIDependencies())).toBe(true);
  });
  it('getPrimeVueDependencies returns array', () => {
    expect(Array.isArray(gen.getPrimeVueDependencies())).toBe(true);
  });
  it('getMaterialDependencies returns array', () => {
    expect(Array.isArray(gen.getMaterialDependencies())).toBe(true);
  });
  it('getShadcnImports returns array', () => {
    expect(Array.isArray(gen.getShadcnImports())).toBe(true);
  });
  it('getRadixImports returns array', () => {
    expect(Array.isArray(gen.getRadixImports())).toBe(true);
  });
  it('getHeadlessUIImports returns array', () => {
    expect(Array.isArray(gen.getHeadlessUIImports())).toBe(true);
  });
  it('getPrimeVueImports returns array', () => {
    expect(Array.isArray(gen.getPrimeVueImports())).toBe(true);
  });
  it('getMaterialImports returns array', () => {
    expect(Array.isArray(gen.getMaterialImports())).toBe(true);
  });
});

// ============================================================
// HtmlGenerator: direct instantiation to cover protected methods
// ============================================================

describe('HtmlGenerator — protected library method coverage', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let gen: any;

  beforeEach(() => {
    gen = new HtmlGenerator('html');
  });

  it('getShadcnDependencies returns array', () => {
    expect(Array.isArray(gen.getShadcnDependencies())).toBe(true);
  });
  it('getRadixDependencies returns array', () => {
    expect(Array.isArray(gen.getRadixDependencies())).toBe(true);
  });
  it('getHeadlessUIDependencies returns array', () => {
    expect(Array.isArray(gen.getHeadlessUIDependencies())).toBe(true);
  });
  it('getPrimeVueDependencies returns array', () => {
    expect(Array.isArray(gen.getPrimeVueDependencies())).toBe(true);
  });
  it('getMaterialDependencies returns array', () => {
    expect(Array.isArray(gen.getMaterialDependencies())).toBe(true);
  });
  it('getShadcnImports returns array', () => {
    expect(Array.isArray(gen.getShadcnImports())).toBe(true);
  });
  it('getRadixImports returns array', () => {
    expect(Array.isArray(gen.getRadixImports())).toBe(true);
  });
  it('getHeadlessUIImports returns array', () => {
    expect(Array.isArray(gen.getHeadlessUIImports())).toBe(true);
  });
  it('getPrimeVueImports returns array', () => {
    expect(Array.isArray(gen.getPrimeVueImports())).toBe(true);
  });
  it('getMaterialImports returns array', () => {
    expect(Array.isArray(gen.getMaterialImports())).toBe(true);
  });
});

// ============================================================
// ReactGenerator: direct instantiation to cover protected methods
// ============================================================

describe('ReactGenerator — protected library method coverage', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let gen: any;

  beforeEach(() => {
    gen = new ReactGenerator('react');
  });

  it('getShadcnDependencies returns array', () => {
    expect(Array.isArray(gen.getShadcnDependencies())).toBe(true);
  });
  it('getRadixDependencies returns array', () => {
    expect(Array.isArray(gen.getRadixDependencies())).toBe(true);
  });
  it('getHeadlessUIDependencies returns array', () => {
    expect(Array.isArray(gen.getHeadlessUIDependencies())).toBe(true);
  });
  it('getPrimeVueDependencies returns array', () => {
    expect(Array.isArray(gen.getPrimeVueDependencies())).toBe(true);
  });
  it('getMaterialDependencies returns array', () => {
    expect(Array.isArray(gen.getMaterialDependencies())).toBe(true);
  });
  it('generateTailwindComponent returns string', () => {
    const result = gen.generateTailwindComponent('button', {});
    expect(typeof result).toBe('string');
  });
});
