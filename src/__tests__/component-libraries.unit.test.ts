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
