import { registerBackendSnippets } from '../register.js';
import { inputSanitizationSnippets } from './input-sanitization.js';
import { secretsManagementSnippets } from './secrets-management.js';
import { authSecuritySnippets } from './auth-security.js';

export function registerSecurity(): void {
  registerBackendSnippets(inputSanitizationSnippets);
  registerBackendSnippets(secretsManagementSnippets);
  registerBackendSnippets(authSecuritySnippets);
}

export { inputSanitizationSnippets, secretsManagementSnippets, authSecuritySnippets };
