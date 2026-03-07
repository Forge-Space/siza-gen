import type { IDesignContext } from './types.js';

export interface BrandIdentityInput {
  colors: {
    primary: { hex: string };
    secondary: { hex: string };
    accent: { hex: string };
    neutral: Array<{ hex: string }>;
    semantic: {
      success: { hex: string };
      warning: { hex: string };
      error: { hex: string };
      info: { hex: string };
    };
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseSize: number;
    steps: Array<{
      name: string;
      size: string;
      lineHeight: string;
      weight: number;
    }>;
  };
  spacing: {
    unit: number;
    values: Record<string, string>;
  };
  shadows?: {
    levels: Record<string, { cssValue: string }>;
  };
  borders?: {
    radii: Record<string, string>;
  };
}

function normalizeHex(hex: string): string {
  const h = hex.replace(/^#/, '');
  if (/^[0-9a-fA-F]{6}$/.test(h)) return h;
  if (/^[0-9a-fA-F]{3}$/.test(h)) return h[0]! + h[0] + h[1]! + h[1] + h[2]! + h[2];
  if (/^[0-9a-fA-F]{8}$/.test(h)) return h.slice(0, 6);
  throw new Error(`Invalid hex color: ${hex}. Expected 3, 6, or 8 hex digits.`);
}

function hexToRgb(hex: string): [number, number, number] {
  const h = normalizeHex(hex);
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function linearize(c: number): number {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * linearize(r / 255) + 0.7152 * linearize(g / 255) + 0.0722 * linearize(b / 255);
}

function contrastForeground(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  return relativeLuminance(r, g, b) > 0.5 ? '#000000' : '#ffffff';
}

function normalizeHexForOutput(hex: string): string {
  try {
    return `#${  normalizeHex(hex)}`;
  } catch {
    return hex;
  }
}

function pickNeutral(neutrals: Array<{ hex: string }>, index: number): string {
  const clamped = Math.min(index, neutrals.length - 1);
  const hex = neutrals[clamped]?.hex ?? '#888888';
  return normalizeHexForOutput(hex);
}

const STEP_TO_KEY: Record<string, string> = {
  xs: 'xs',
  sm: 'sm',
  base: 'base',
  md: 'base',
  lg: 'lg',
  xl: 'xl',
  '2xl': '2xl',
  '3xl': '3xl',
};

function mapFontSizes(steps: BrandIdentityInput['typography']['steps']): IDesignContext['typography']['fontSize'] {
  const result: Record<string, string> = {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  };
  for (const step of steps) {
    const key = STEP_TO_KEY[step.name.toLowerCase()];
    if (key) result[key] = step.size;
  }
  return result as IDesignContext['typography']['fontSize'];
}

function categorizeLineHeight(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return 'normal';
  if (num < 1.3) return 'tight';
  if (num > 1.6) return 'relaxed';
  return 'normal';
}

function mapLineHeights(steps: BrandIdentityInput['typography']['steps']): IDesignContext['typography']['lineHeight'] {
  const lh: Record<string, string> = {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  };
  for (const step of steps) {
    const cat = categorizeLineHeight(step.lineHeight);
    lh[cat] = step.lineHeight;
  }
  return lh as IDesignContext['typography']['lineHeight'];
}

function parseSpacingScale(values: Record<string, string>): number[] {
  return Object.values(values)
    .map((v) => parseFloat(v))
    .filter((n) => !isNaN(n))
    .sort((a, b) => a - b);
}

function mapColors(colors: BrandIdentityInput['colors']): IDesignContext['colorPalette'] {
  const n = colors.neutral;
  const last = n.length - 1;
  const mid = Math.floor(last / 2);
  const midLight = Math.floor(last * 0.7);
  return {
    primary: normalizeHexForOutput(colors.primary.hex),
    primaryForeground: contrastForeground(colors.primary.hex),
    secondary: normalizeHexForOutput(colors.secondary.hex),
    secondaryForeground: contrastForeground(colors.secondary.hex),
    accent: normalizeHexForOutput(colors.accent.hex),
    accentForeground: contrastForeground(colors.accent.hex),
    background: pickNeutral(n, last),
    foreground: pickNeutral(n, 0),
    muted: pickNeutral(n, mid),
    mutedForeground: pickNeutral(n, 0),
    border: pickNeutral(n, midLight),
    destructive: normalizeHexForOutput(colors.semantic.error.hex),
    destructiveForeground: contrastForeground(colors.semantic.error.hex),
  };
}

function mapShadows(levels: Record<string, { cssValue: string }>): IDesignContext['shadows'] | undefined {
  const sm = levels['sm']?.cssValue;
  const md = levels['md']?.cssValue;
  const lg = levels['lg']?.cssValue;
  if (!sm && !md && !lg) return undefined;
  return {
    sm: sm ?? '0 1px 2px rgba(0,0,0,0.05)',
    md: md ?? '0 4px 6px rgba(0,0,0,0.1)',
    lg: lg ?? '0 10px 15px rgba(0,0,0,0.1)',
  };
}

function mapBorderRadius(radii: Record<string, string>): IDesignContext['borderRadius'] | undefined {
  const get = (key: string): string | undefined => radii[key];
  const sm = get('sm') ?? (get('none') !== undefined ? '0' : undefined);
  const md = get('md');
  const lg = get('lg') ?? get('xl');
  const full = get('full') ?? (get('circle') !== undefined ? '9999px' : undefined);
  if (!sm && !md && !lg && !full) return undefined;
  return {
    sm: sm ?? '0.125rem',
    md: md ?? '0.375rem',
    lg: lg ?? '0.5rem',
    full: full ?? '9999px',
  };
}

export function brandToDesignContext(brand: BrandIdentityInput): Partial<IDesignContext> {
  if (!brand.colors?.primary?.hex) {
    throw new Error('Invalid brand identity: missing colors.primary.hex');
  }
  const result: Partial<IDesignContext> = {
    colorPalette: mapColors(brand.colors),
    typography: {
      fontFamily: brand.typography.bodyFont,
      headingFont: brand.typography.headingFont,
      fontSize: mapFontSizes(brand.typography.steps),
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      lineHeight: mapLineHeights(brand.typography.steps),
    },
    spacing: {
      unit: brand.spacing.unit,
      scale: parseSpacingScale(brand.spacing.values),
    },
  };
  if (brand.shadows?.levels) {
    const shadows = mapShadows(brand.shadows.levels);
    if (shadows) result.shadows = shadows;
  }
  if (brand.borders?.radii) {
    const radii = mapBorderRadius(brand.borders.radii);
    if (radii) result.borderRadius = radii;
  }
  return result;
}
