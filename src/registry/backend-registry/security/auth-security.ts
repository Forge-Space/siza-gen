import type { IBackendSnippet } from '../types.js';

export const authSecuritySnippets: IBackendSnippet[] = [
  {
    id: 'sec-csrf-protection',
    name: 'CSRF Protection Middleware',
    category: 'security',
    type: 'middleware',
    variant: 'csrf',
    tags: ['security', 'csrf', 'middleware', 'express', 'cookie'],
    framework: ['framework-agnostic'],
    patterns: ['middleware-chain'],
    typescript: `import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';

const CSRF_COOKIE = 'csrf_token';
const CSRF_HEADER = 'x-csrf-token';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Double-submit cookie CSRF middleware.
 * Client must read cookie and echo it as X-CSRF-Token header on mutations.
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  if (SAFE_METHODS.has(req.method)) {
    if (!req.cookies[CSRF_COOKIE]) {
      const token = generateToken();
      res.cookie(CSRF_COOKIE, token, {
        httpOnly: false,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
    }
    return next();
  }

  const cookieToken = req.cookies[CSRF_COOKIE] as string | undefined;
  const headerToken = req.headers[CSRF_HEADER] as string | undefined;

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    res.status(403).json({ error: 'Invalid CSRF token' });
    return;
  }
  next();
}`,
    dependencies: ['cookie-parser'],
    envVars: [],
    quality: {
      securityChecks: [
        'Double-submit cookie pattern prevents CSRF',
        'sameSite: strict reduces cookie leakage',
        'Secure flag enforced in production',
        'Constant-time comparison not required (public token)',
      ],
      performanceConsiderations: ['Token generation uses crypto.randomBytes (non-blocking)'],
      antiPatterns: [
        'Never use synchronous CSRF tokens without session binding',
        'Never skip CSRF on mutations even for JSON APIs',
      ],
      inspirationSource: 'OWASP CSRF Prevention Cheat Sheet',
    },
    testHint: 'Test: POST without header returns 403, with matching header passes, GET sets cookie',
  },
  {
    id: 'sec-jwt-validation',
    name: 'JWT Validation Middleware',
    category: 'security',
    type: 'middleware',
    variant: 'jwt',
    tags: ['security', 'jwt', 'auth', 'middleware', 'bearer', 'token'],
    framework: ['framework-agnostic'],
    patterns: ['middleware-chain'],
    typescript: `import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';

export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  [key: string]: unknown;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

function base64urlDecode(str: string): string {
  const pad = '='.repeat((4 - (str.length % 4)) % 4);
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64').toString();
}

function verifySignature(header: string, payload: string, sig: string, secret: string): boolean {
  const expected = createHmac('sha256', secret).update(\`\${header}.\${payload}\`).digest('base64url');
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

/** Parse and verify a compact JWT (HS256). Throws on failure. */
export function parseJwt(token: string, secret: string): JwtPayload {
  const [headerB64, payloadB64, signature] = token.split('.') as [string, string, string];
  if (!headerB64 || !payloadB64 || !signature) throw new Error('Malformed JWT');

  if (!verifySignature(headerB64, payloadB64, signature, secret)) {
    throw new Error('Invalid JWT signature');
  }

  const payload = JSON.parse(base64urlDecode(payloadB64)) as JwtPayload;
  if (typeof payload.exp === 'number' && Date.now() / 1000 > payload.exp) {
    throw new Error('JWT expired');
  }
  return payload;
}

/** Express middleware: require a valid Bearer JWT. */
export function requireAuth(secret: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing authorization header' });
      return;
    }
    try {
      req.user = parseJwt(auth.slice(7), secret);
      next();
    } catch (err) {
      res.status(401).json({ error: (err as Error).message });
    }
  };
}`,
    dependencies: [],
    envVars: ['JWT_SECRET'],
    quality: {
      securityChecks: [
        'timingSafeEqual prevents timing attacks on signature comparison',
        'Explicit expiry check before returning payload',
        'Zero runtime dependencies (Node crypto only)',
      ],
      performanceConsiderations: ['HMAC-SHA256 is fast; ~0.1ms per verification'],
      antiPatterns: [
        'Never decode without verifying',
        'Never use algorithm: none',
        'Store JWT_SECRET in env, never in code',
      ],
      inspirationSource: 'RFC 7519 JWT spec + OWASP JWT Security Cheat Sheet',
    },
    testHint: 'Test: missing header 401, expired token 401, tampered payload 401, valid token passes',
  },
  {
    id: 'sec-oauth2-pkce',
    name: 'OAuth2 PKCE Authorization Flow',
    category: 'security',
    type: 'auth',
    variant: 'oauth2-pkce',
    tags: ['security', 'oauth2', 'pkce', 'auth', 'authorization-code', 'social-login'],
    framework: ['framework-agnostic'],
    patterns: ['middleware-chain'],
    typescript: `import crypto from 'node:crypto';
import type { Request, Response } from 'express';

export interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  scopes: string[];
}

interface PKCEState {
  codeVerifier: string;
  createdAt: number;
}

// Replace with Redis in production
const pendingStates = new Map<string, PKCEState>();
const STATE_TTL_MS = 10 * 60 * 1000;

function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

function cleanupStates() {
  const now = Date.now();
  for (const [key, val] of pendingStates) {
    if (now - val.createdAt > STATE_TTL_MS) pendingStates.delete(key);
  }
}

/** Step 1: redirect user to OAuth provider with PKCE challenge. */
export function initiateOAuth(config: OAuthConfig) {
  return (_req: Request, res: Response): void => {
    cleanupStates();
    const { verifier, challenge } = generatePKCE();
    const state = crypto.randomBytes(16).toString('hex');
    pendingStates.set(state, { codeVerifier: verifier, createdAt: Date.now() });

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scopes.join(' '),
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256',
    });
    res.redirect(\`\${config.authorizationEndpoint}?\${params}\`);
  };
}

/** Step 2: exchange authorization code for tokens. */
export function handleOAuthCallback(config: OAuthConfig) {
  return async (req: Request, res: Response): Promise<void> => {
    const { code, state, error } = req.query as Record<string, string>;
    if (error) { res.status(400).json({ error }); return; }

    const pending = pendingStates.get(state);
    if (!pending || Date.now() - pending.createdAt > STATE_TTL_MS) {
      res.status(400).json({ error: 'Invalid or expired state' });
      return;
    }
    pendingStates.delete(state);

    const resp = await fetch(config.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri,
        client_id: config.clientId,
        code_verifier: pending.codeVerifier,
      }),
    });
    if (!resp.ok) { res.status(502).json({ error: 'Token exchange failed' }); return; }

    const tokens = await resp.json();
    // Store tokens in httpOnly session cookie — never expose access_token to JS
    res.json({ success: true, tokens });
  };
}`,
    dependencies: [],
    envVars: ['OAUTH_CLIENT_ID', 'OAUTH_REDIRECT_URI', 'OAUTH_AUTH_ENDPOINT', 'OAUTH_TOKEN_ENDPOINT'],
    quality: {
      securityChecks: [
        'PKCE S256 challenge prevents authorization code interception',
        'State parameter prevents CSRF on callback',
        'Code verifier stored server-side (never in URL)',
        'State TTL prevents replay after 10 minutes',
        'No client_secret needed (public client pattern)',
      ],
      performanceConsiderations: ['State stored in-memory — replace with Redis for multi-instance'],
      antiPatterns: [
        'Never use implicit flow (no PKCE)',
        'Never store access tokens in localStorage',
        'Never skip state validation on callback',
      ],
      inspirationSource: 'RFC 7636 PKCE + OAuth 2.0 Security Best Current Practice',
    },
    testHint:
      'Test: missing state 400, expired state 400, valid code exchange succeeds, PKCE verifier mismatch fails at provider',
  },
];
