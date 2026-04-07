export {
  registerBackendSnippets,
  getBackendSnippet,
  getBackendSnippetsByCategory,
  getBackendSnippetsByFramework,
  searchBackendSnippets,
  getAllBackendSnippets,
  clearAllBackendSnippets,
} from './register.js';

export type { IBackendSnippet, BackendCategory, BackendFramework } from './types.js';

let initialized = false;

export async function initializeBackendRegistry(): Promise<void> {
  if (initialized) return;
  const { registerBackendSnippets } = await import('./register.js');
  const { registerApiRoutes } = await import('./api-routes/index.js');
  const { registerMiddleware } = await import('./middleware/index.js');
  const { registerArchitecture } = await import('./architecture/index.js');
  const { registerDatabase } = await import('./database/index.js');
  const { registerSecurity } = await import('./security/index.js');
  const { registerObservability } = await import('./observability/index.js');
  const { registerPerformance } = await import('./performance/index.js');
  const { registerDocumentation } = await import('./documentation/index.js');
  registerApiRoutes();
  registerMiddleware();
  registerArchitecture();
  registerDatabase();
  registerSecurity();
  registerObservability();
  registerPerformance();
  registerDocumentation();
  initialized = true;
}
