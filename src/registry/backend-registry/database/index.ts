import { registerBackendSnippets } from '../register.js';
import { prismaPatternSnippets } from './prisma-patterns.js';
import { seedingSnippets } from './seeding.js';

export function registerDatabase(): void {
  registerBackendSnippets(prismaPatternSnippets);
  registerBackendSnippets(seedingSnippets);
}

export { prismaPatternSnippets, seedingSnippets };
