import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testMatch: ['<rootDir>/src/__tests__/**/*.unit.test.ts', '<rootDir>/src/__tests__/**/*.integration.test.ts'],
  testTimeout: 15_000,
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          verbatimModuleSyntax: false,
          isolatedModules: true,
        },
        diagnostics: {
          ignoreCodes: [151002],
        },
      },
    ],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  coverageProvider: 'v8',
  coverageReporters: ['text', 'lcov', 'json-summary'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/__tests__/**',
    '!src/scripts/**',
    '!src/types.ts',
    // Barrels, type files, and CLI entry points are not directly testable
    '!src/index.ts',
    '!src/lite.ts',
    '!src/**/index.ts',
    '!src/**/*.types.ts',
    '!src/benchmark/run.ts',
    '!src/benchmark/types.ts',
    '!src/artifacts/types.ts',
    '!src/artifacts/schema.ts',
    '!src/feedback/types.ts',
    '!src/ml/types.ts',
    '!src/registry/backend-registry/types.ts',
    // Template/pattern files are tested indirectly via the generator and setup functions
    '!src/component-libraries/shadcn/templates.ts',
    '!src/component-libraries/shadcn/patterns.ts',
    '!src/component-libraries/radix/templates.ts',
    '!src/component-libraries/headlessui/templates.ts',
    '!src/component-libraries/material/templates.ts',
    // CLI/runner files are not unit-testable
    '!src/benchmark/reporter.ts',
    '!src/benchmark/run.ts',
    // Design data files (static data structures)
    '!src/generators/default-design-context.ts',
    '!src/ml/design-to-training-data.ts',
    '!src/ml/image-design-analyzer.ts',
    '!src/ml/style-recommender.ts',
    '!src/ml/model-manager.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      // Functions: 68% — template/pattern files (static string builders) and ML embeddings
      // are excluded by collectCoverageFrom but generator abstract method impls lower this.
      // Raise incrementally as coverage improves.
      functions: 68,
      lines: 70,
      statements: 70,
    },
  },
};

export default config;
