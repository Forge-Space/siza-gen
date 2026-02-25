import { defineConfig, type Options } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node22',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  dts: true,
  splitting: false,
  treeshake: true,
  minify: false,
  bundle: true,
  external: ['pino', 'pino-pretty', 'tailwindcss-animate'],
  esbuildOptions(options, _context) {
    options.platform = 'node';
  },
  onSuccess: 'echo "✓ Build completed successfully"',
} satisfies Options);
