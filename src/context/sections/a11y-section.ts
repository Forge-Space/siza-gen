export function buildA11ySection(): string {
  return [
    'Accessibility (WCAG 2.1 AA required):',
    '- Color contrast ratio >= 4.5:1 for text, >= 3:1 for UI',
    '- All images need descriptive alt text',
    '- Form inputs must have associated <label> elements',
    '- Buttons must have visible text or aria-label',
    '- Focus indicators must be visible (focus-visible)',
    '- Skip navigation link for complex layouts',
    '- Use semantic HTML (nav, main, header, footer)',
    '- ARIA roles only when no native semantic equivalent',
    '- Keyboard navigation: Tab, Escape, Arrow keys, Enter',
    '- Announce dynamic content changes with aria-live',
    '- Respect prefers-reduced-motion for animations',
    '- Touch targets minimum 44x44px on mobile',
  ].join('\n');
}
