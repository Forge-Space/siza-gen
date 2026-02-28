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

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function perceivedBrightness(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function contrastForeground(hex: string): string {
  return perceivedBrightness(hex) > 0.5 ? '#000000' : '#ffffff';
}

function pickNeutral(neutrals: Array<{ hex: string }>, index: number): string {
  const clamped = Math.min(index, neutrals.length - 1);
  return neutrals[clamped]?.hex ?? '#888888';
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
    primary: colors.primary.hex,
    primaryForeground: contrastForeground(colors.primary.hex),
    secondary: colors.secondary.hex,
    secondaryForeground: contrastForeground(colors.secondary.hex),
    accent: colors.accent.hex,
    accentForeground: contrastForeground(colors.accent.hex),
    background: pickNeutral(n, last),
    foreground: pickNeutral(n, 0),
    muted: pickNeutral(n, mid),
    mutedForeground: pickNeutral(n, 0),
    border: pickNeutral(n, midLight),
    destructive: colors.semantic.error.hex,
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
  if (!radii['sm'] && !radii['md'] && !radii['lg']) {
    return undefined;
  }
  return {
    sm: radii['sm'] ?? '0.125rem',
    md: radii['md'] ?? '0.375rem',
    lg: radii['lg'] ?? '0.5rem',
    full: radii['full'] ?? '9999px',
  };
}

export function brandToDesignContext(brand: BrandIdentityInput): Partial<IDesignContext> {
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
