import { describe, it, expect } from '@jest/globals';
import {
  setupShadcnProject,
  getAvailableShadcnComponents,
  getAvailableShadcnPatterns,
  validateShadcnSetup,
} from '../component-libraries/shadcn/index.js';
import {
  setupHeadlessProject,
  getAvailableHeadlessComponents,
  getAvailableHeadlessPatterns,
} from '../component-libraries/headlessui/index.js';
import {
  setupRadixProject,
  getAvailableRadixComponents,
  getAvailableRadixPatterns,
} from '../component-libraries/radix/index.js';
import {
  setupMaterialProject,
  getAvailableMaterialComponents,
  getAvailableMaterialPatterns,
} from '../component-libraries/material/index.js';
import {
  setupPrimeVueProject,
  getAvailablePrimeVueComponents,
  getAvailablePrimeVuePatterns,
} from '../component-libraries/primevue/index.js';
import { generatePrimeVueComponent } from '../component-libraries/primevue/templates.js';

// ─── shadcn/ui ───────────────────────────────────────────────────────────────

describe('shadcn/ui library', () => {
  describe('setupShadcnProject', () => {
    it('returns a non-empty array of generated files', () => {
      const files = setupShadcnProject({ projectName: 'my-app', framework: 'react' });
      expect(Array.isArray(files)).toBe(true);
      expect(files.length).toBeGreaterThan(0);
    });

    it('every file has a path and non-empty content', () => {
      const files = setupShadcnProject({ projectName: 'my-app', framework: 'react' });
      for (const f of files) {
        expect(typeof f.path).toBe('string');
        expect(f.path.length).toBeGreaterThan(0);
        expect(typeof f.content).toBe('string');
        expect(f.content.length).toBeGreaterThan(0);
      }
    });

    it('includes package.json with shadcn dependencies', () => {
      const files = setupShadcnProject({ projectName: 'test-shadcn', framework: 'react' });
      const pkg = files.find((f) => f.path === 'package.json');
      expect(pkg).toBeDefined();
      expect(pkg!.content).toContain('@radix-ui');
    });

    it('includes tailwind config', () => {
      const files = setupShadcnProject({ projectName: 'test-shadcn', framework: 'react' });
      const tw = files.find((f) => f.path.includes('tailwind'));
      expect(tw).toBeDefined();
    });

    it('respects custom projectName', () => {
      const files = setupShadcnProject({ projectName: 'custom-name', framework: 'react' });
      const pkg = files.find((f) => f.path === 'package.json');
      expect(pkg!.content).toContain('custom-name');
    });
  });

  describe('getAvailableShadcnComponents', () => {
    it('returns a non-empty array of strings', () => {
      const components = getAvailableShadcnComponents();
      expect(Array.isArray(components)).toBe(true);
      expect(components.length).toBeGreaterThan(0);
      expect(typeof components[0]).toBe('string');
    });

    it('includes expected core components', () => {
      const components = getAvailableShadcnComponents();
      expect(components).toContain('Button');
    });
  });

  describe('getAvailableShadcnPatterns', () => {
    it('returns a non-empty array', () => {
      const patterns = getAvailableShadcnPatterns();
      expect(Array.isArray(patterns)).toBe(true);
      expect(patterns.length).toBeGreaterThan(0);
    });
  });

  describe('validateShadcnSetup', () => {
    it('validates a valid setup', () => {
      const files = setupShadcnProject({ projectName: 'valid-app', framework: 'react' });
      const result = validateShadcnSetup(files);
      expect(result).toHaveProperty('isValid');
      expect(typeof result.isValid).toBe('boolean');
    });

    it('returns isValid=false for empty files array', () => {
      const result = validateShadcnSetup([]);
      expect(result.isValid).toBe(false);
    });
  });
});

// ─── Headless UI ─────────────────────────────────────────────────────────────

describe('Headless UI library', () => {
  describe('setupHeadlessProject', () => {
    it('returns generated files', () => {
      const files = setupHeadlessProject({ projectName: 'headless-app', framework: 'react' });
      expect(files.length).toBeGreaterThan(0);
    });

    it('every file has path and content', () => {
      const files = setupHeadlessProject({ projectName: 'headless-app', framework: 'react' });
      for (const f of files) {
        expect(f.path.length).toBeGreaterThan(0);
        expect(f.content.length).toBeGreaterThan(0);
      }
    });

    it('includes headlessui dependency', () => {
      const files = setupHeadlessProject({ projectName: 'headless-app', framework: 'react' });
      const pkg = files.find((f) => f.path === 'package.json');
      expect(pkg).toBeDefined();
      expect(pkg!.content).toContain('@headlessui');
    });
  });

  describe('getAvailableHeadlessComponents', () => {
    it('returns a non-empty array', () => {
      const components = getAvailableHeadlessComponents();
      expect(components.length).toBeGreaterThan(0);
    });
  });

  describe('getAvailableHeadlessPatterns', () => {
    it('returns a non-empty array', () => {
      const patterns = getAvailableHeadlessPatterns();
      expect(patterns.length).toBeGreaterThan(0);
    });
  });
});

// ─── Radix UI ────────────────────────────────────────────────────────────────

describe('Radix UI library', () => {
  describe('setupRadixProject', () => {
    it('returns generated files', () => {
      const files = setupRadixProject({ projectName: 'radix-app', framework: 'react' });
      expect(files.length).toBeGreaterThan(0);
    });

    it('every file has path and content', () => {
      const files = setupRadixProject({ projectName: 'radix-app', framework: 'react' });
      for (const f of files) {
        expect(f.path.length).toBeGreaterThan(0);
        expect(f.content.length).toBeGreaterThan(0);
      }
    });

    it('includes radix dependency in package.json', () => {
      const files = setupRadixProject({ projectName: 'radix-app', framework: 'react' });
      const pkg = files.find((f) => f.path === 'package.json');
      expect(pkg).toBeDefined();
      expect(pkg!.content).toContain('@radix-ui');
    });
  });

  describe('getAvailableRadixComponents', () => {
    it('returns a non-empty array', () => {
      const components = getAvailableRadixComponents();
      expect(components.length).toBeGreaterThan(0);
    });
  });

  describe('getAvailableRadixPatterns', () => {
    it('returns a non-empty array', () => {
      const patterns = getAvailableRadixPatterns();
      expect(patterns.length).toBeGreaterThan(0);
    });
  });
});

// ─── Material UI ─────────────────────────────────────────────────────────────

describe('Material UI library', () => {
  describe('setupMaterialProject', () => {
    it('returns generated files', () => {
      const files = setupMaterialProject({ projectName: 'material-app', framework: 'react' });
      expect(files.length).toBeGreaterThan(0);
    });

    it('every file has path and content', () => {
      const files = setupMaterialProject({ projectName: 'material-app', framework: 'react' });
      for (const f of files) {
        expect(f.path.length).toBeGreaterThan(0);
        expect(f.content.length).toBeGreaterThan(0);
      }
    });

    it('includes MUI dependency in package.json', () => {
      const files = setupMaterialProject({ projectName: 'material-app', framework: 'react' });
      const pkg = files.find((f) => f.path === 'package.json');
      expect(pkg).toBeDefined();
      expect(pkg!.content).toContain('@mui');
    });
  });

  describe('getAvailableMaterialComponents', () => {
    it('returns a non-empty array', () => {
      const components = getAvailableMaterialComponents();
      expect(components.length).toBeGreaterThan(0);
    });
  });

  describe('getAvailableMaterialPatterns', () => {
    it('returns a non-empty array', () => {
      const patterns = getAvailableMaterialPatterns();
      expect(patterns.length).toBeGreaterThan(0);
    });
  });
});

// ─── PrimeVue ────────────────────────────────────────────────────────────────

describe('PrimeVue library', () => {
  const defaultDesignContext = {
    colorPalette: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f9fafb',
      text: { primary: '#111827', secondary: '#6b7280', disabled: '#d1d5db' },
      border: '#e5e7eb',
      status: { success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6' },
    },
    typography: { fontFamily: 'Inter', scale: 1, headingWeight: 700, bodyWeight: 400 },
    spacing: { base: 4, scale: 1.5 },
    borderRadius: { sm: 4, md: 8, lg: 16, full: 9999 },
    shadows: { sm: '0 1px 2px rgba(0,0,0,0.05)', md: '0 4px 6px rgba(0,0,0,0.1)', lg: '0 10px 15px rgba(0,0,0,0.1)' },
  };

  describe('setupPrimeVueProject', () => {
    it('returns a non-empty array of generated files', () => {
      const files = setupPrimeVueProject({ projectName: 'my-vue-app', framework: 'vue' });
      expect(Array.isArray(files)).toBe(true);
      expect(files.length).toBeGreaterThan(0);
    });

    it('includes package.json with primevue dependency', () => {
      const files = setupPrimeVueProject({ projectName: 'my-vue-app', framework: 'vue' });
      const pkg = files.find((f) => f.path === 'package.json');
      expect(pkg).toBeDefined();
      expect(pkg!.content).toContain('primevue');
    });

    it('includes main.ts with PrimeVue plugin registration', () => {
      const files = setupPrimeVueProject({ projectName: 'my-vue-app', framework: 'vue' });
      const main = files.find((f) => f.path === 'src/main.ts');
      expect(main).toBeDefined();
      expect(main!.content).toContain('PrimeVue');
    });

    it('generates requested components', () => {
      const files = setupPrimeVueProject({
        projectName: 'my-vue-app',
        framework: 'vue',
        components: ['Button'],
        designContext: defaultDesignContext as never,
      });
      const hasComponent = files.some((f) => f.path.includes('AppButton'));
      expect(hasComponent).toBe(true);
    });
  });

  describe('getAvailablePrimeVueComponents', () => {
    it('returns a large list including core components', () => {
      const components = getAvailablePrimeVueComponents();
      expect(components.length).toBeGreaterThan(20);
      expect(components).toContain('Button');
      expect(components).toContain('DataTable');
      expect(components).toContain('Dialog');
    });
  });

  describe('getAvailablePrimeVuePatterns', () => {
    it('returns a non-empty patterns array', () => {
      const patterns = getAvailablePrimeVuePatterns();
      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns).toContain('AdminDashboard');
    });
  });

  describe('generatePrimeVueComponent', () => {
    it('generates Button component files', () => {
      const files = generatePrimeVueComponent('Button', defaultDesignContext as never);
      expect(Array.isArray(files)).toBe(true);
      expect(files.length).toBeGreaterThan(0);
      expect(files[0].content).toContain('Button');
    });

    it('generates Dialog component files', () => {
      const files = generatePrimeVueComponent('Dialog', defaultDesignContext as never);
      expect(files[0].content).toContain('Dialog');
    });

    it('generates DataTable component files', () => {
      const files = generatePrimeVueComponent('DataTable', defaultDesignContext as never);
      expect(files[0].content).toContain('DataTable');
    });

    it('generates Toast component with composable', () => {
      const files = generatePrimeVueComponent('Toast', defaultDesignContext as never);
      expect(files.length).toBeGreaterThanOrEqual(2);
    });

    it('throws for unknown component name', () => {
      expect(() => generatePrimeVueComponent('NonExistentWidget', defaultDesignContext as never)).toThrow();
    });
  });
});
