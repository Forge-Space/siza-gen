import { brandToDesignContext, type BrandIdentityInput } from '../brand-identity-transform.js';

function makeBrand(overrides?: Partial<BrandIdentityInput>): BrandIdentityInput {
  return {
    colors: {
      primary: { hex: '#1a56db' },
      secondary: { hex: '#7e3af2' },
      accent: { hex: '#ff5a1f' },
      neutral: [
        { hex: '#111827' },
        { hex: '#374151' },
        { hex: '#6b7280' },
        { hex: '#9ca3af' },
        { hex: '#d1d5db' },
        { hex: '#f3f4f6' },
        { hex: '#f9fafb' },
      ],
      semantic: {
        success: { hex: '#057a55' },
        warning: { hex: '#e3a008' },
        error: { hex: '#e02424' },
        info: { hex: '#1c64f2' },
      },
    },
    typography: {
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      baseSize: 16,
      steps: [
        {
          name: 'xs',
          size: '0.694rem',
          lineHeight: '1.2',
          weight: 400,
        },
        {
          name: 'sm',
          size: '0.833rem',
          lineHeight: '1.3',
          weight: 400,
        },
        {
          name: 'base',
          size: '1rem',
          lineHeight: '1.5',
          weight: 400,
        },
        {
          name: 'lg',
          size: '1.2rem',
          lineHeight: '1.5',
          weight: 500,
        },
        {
          name: 'xl',
          size: '1.44rem',
          lineHeight: '1.4',
          weight: 600,
        },
        {
          name: '2xl',
          size: '1.728rem',
          lineHeight: '1.2',
          weight: 700,
        },
        {
          name: '3xl',
          size: '2.074rem',
          lineHeight: '1.1',
          weight: 700,
        },
      ],
    },
    spacing: {
      unit: 4,
      values: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '6': '1.5rem',
        '8': '2rem',
        '12': '3rem',
      },
    },
    ...overrides,
  };
}

describe('brandToDesignContext', () => {
  it('maps primary/secondary/accent colors', () => {
    const result = brandToDesignContext(makeBrand());
    expect(result.colorPalette?.primary).toBe('#1a56db');
    expect(result.colorPalette?.secondary).toBe('#7e3af2');
    expect(result.colorPalette?.accent).toBe('#ff5a1f');
  });

  it('computes white foreground for dark colors', () => {
    const result = brandToDesignContext(makeBrand());
    expect(result.colorPalette?.primaryForeground).toBe('#ffffff');
    expect(result.colorPalette?.secondaryForeground).toBe('#ffffff');
  });

  it('computes black foreground for light colors', () => {
    const brand = makeBrand({
      colors: {
        ...makeBrand().colors,
        primary: { hex: '#fbbf24' },
      },
    });
    const result = brandToDesignContext(brand);
    expect(result.colorPalette?.primaryForeground).toBe('#000000');
  });

  it('maps neutral array to background/foreground/muted', () => {
    const result = brandToDesignContext(makeBrand());
    expect(result.colorPalette?.background).toBe('#f9fafb');
    expect(result.colorPalette?.foreground).toBe('#111827');
    expect(result.colorPalette?.muted).toBe('#9ca3af');
    expect(result.colorPalette?.mutedForeground).toBe('#111827');
  });

  it('maps border from mid-light neutral', () => {
    const result = brandToDesignContext(makeBrand());
    expect(result.colorPalette?.border).toBe('#d1d5db');
  });

  it('maps semantic error to destructive', () => {
    const result = brandToDesignContext(makeBrand());
    expect(result.colorPalette?.destructive).toBe('#e02424');
    expect(result.colorPalette?.destructiveForeground).toBe('#ffffff');
  });

  it('maps typography fonts', () => {
    const result = brandToDesignContext(makeBrand());
    expect(result.typography?.fontFamily).toBe('Inter');
    expect(result.typography?.headingFont).toBe('Poppins');
  });

  it('maps typography steps to fontSize keys', () => {
    const result = brandToDesignContext(makeBrand());
    expect(result.typography?.fontSize.xs).toBe('0.694rem');
    expect(result.typography?.fontSize.base).toBe('1rem');
    expect(result.typography?.fontSize['3xl']).toBe('2.074rem');
  });

  it('categorizes line heights', () => {
    const result = brandToDesignContext(makeBrand());
    expect(result.typography?.lineHeight.tight).toBe('1.1');
    expect(result.typography?.lineHeight.normal).toBe('1.4');
  });

  it('sets standard font weights', () => {
    const result = brandToDesignContext(makeBrand());
    expect(result.typography?.fontWeight.normal).toBe('400');
    expect(result.typography?.fontWeight.bold).toBe('700');
  });

  it('maps spacing unit and scale', () => {
    const result = brandToDesignContext(makeBrand());
    expect(result.spacing?.unit).toBe(4);
    expect(result.spacing?.scale).toEqual([0.25, 0.5, 0.75, 1, 1.5, 2, 3]);
  });

  it('maps shadows when present', () => {
    const brand = makeBrand();
    (brand as Record<string, unknown>).shadows = {
      levels: {
        sm: { cssValue: '0 1px 2px rgba(0,0,0,0.05)' },
        md: { cssValue: '0 4px 6px rgba(0,0,0,0.1)' },
        lg: { cssValue: '0 10px 15px rgba(0,0,0,0.15)' },
      },
    };
    const result = brandToDesignContext(brand);
    expect(result.shadows?.sm).toBe('0 1px 2px rgba(0,0,0,0.05)');
    expect(result.shadows?.lg).toBe('0 10px 15px rgba(0,0,0,0.15)');
  });

  it('omits shadows when not present', () => {
    const result = brandToDesignContext(makeBrand());
    expect(result.shadows).toBeUndefined();
  });

  it('maps border radii when present', () => {
    const brand = makeBrand();
    (brand as Record<string, unknown>).borders = {
      radii: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        full: '9999px',
      },
    };
    const result = brandToDesignContext(brand);
    expect(result.borderRadius?.sm).toBe('0.25rem');
    expect(result.borderRadius?.full).toBe('9999px');
  });

  it('omits borderRadius when not present', () => {
    const result = brandToDesignContext(makeBrand());
    expect(result.borderRadius).toBeUndefined();
  });

  it('handles minimal neutral array', () => {
    const brand = makeBrand({
      colors: {
        ...makeBrand().colors,
        neutral: [{ hex: '#000000' }, { hex: '#ffffff' }],
      },
    });
    const result = brandToDesignContext(brand);
    expect(result.colorPalette?.foreground).toBe('#000000');
    expect(result.colorPalette?.background).toBe('#ffffff');
    expect(result.colorPalette?.muted).toBe('#000000');
  });

  it('output is compatible with designContextStore.update', () => {
    const result = brandToDesignContext(makeBrand());
    expect(result.colorPalette).toBeDefined();
    expect(result.typography).toBeDefined();
    expect(result.spacing).toBeDefined();
    expect(typeof result.colorPalette?.primary).toBe('string');
    expect(typeof result.typography?.fontFamily).toBe('string');
    expect(Array.isArray(result.spacing?.scale)).toBe(true);
  });
});
