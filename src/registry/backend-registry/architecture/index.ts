import { registerBackendSnippets } from '../register.js';
import { cleanArchitectureSnippets } from './clean-architecture.js';
import { serviceLayerSnippets } from './service-layer.js';
import { eventDrivenSnippets } from './event-driven.js';

export function registerArchitecture(): void {
  registerBackendSnippets(cleanArchitectureSnippets);
  registerBackendSnippets(serviceLayerSnippets);
  registerBackendSnippets(eventDrivenSnippets);
}

export { cleanArchitectureSnippets, serviceLayerSnippets, eventDrivenSnippets };
