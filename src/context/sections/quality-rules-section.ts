export function buildQualityRulesSection(): string {
  return [
    'Quality standards (non-negotiable):',
    '- Use semantic color tokens (bg-primary, text-foreground)',
    '  NOT raw Tailwind colors (bg-red-500, text-blue-700)',
    '- Include 2+ unique design decisions that make this',
    '  component non-generic (custom radius, brand-aware tokens)',
    '- Add 2+ craft micro-details (subtle shadow on hover,',
    '  8pt grid alignment, transition easing curves)',
    '- Reference a real-world design inspiration',
    '  (e.g. linear.app, stripe.com/checkout, vercel.com)',
    '- Use intentional typography: explicit font sizes,',
    '  tracking, and leading — never rely on browser defaults',
    '- Ensure focus-visible styles on all interactive elements',
    '- Provide reduced-motion alternatives for animations',
  ].join('\n');
}
