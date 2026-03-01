const LIBRARY_PATTERNS: Record<string, string> = {
  shadcn: [
    'Component library (shadcn/ui):',
    '- Import from @/components/ui/* path aliases',
    '- Use cn() utility for conditional class merging',
    '- Compose from primitives: Button, Card, Input, Dialog',
    '- Variants via cva() class-variance-authority',
    '- Dark mode with .dark class on parent element',
    '- Extend with Radix UI primitives when needed',
  ].join('\n'),
  radix: [
    'Component library (Radix UI):',
    '- Import from @radix-ui/* packages',
    '- Compound component pattern (Root, Trigger, Content)',
    '- Style with data-state attributes for open/closed',
    '- Use asChild prop for custom trigger elements',
    '- All primitives are unstyled — provide your own CSS',
    '- Built-in keyboard navigation and ARIA',
  ].join('\n'),
  headlessui: [
    'Component library (Headless UI):',
    '- Import from @headlessui/react or @headlessui/vue',
    '- Render prop pattern for state access',
    '- Use Transition component for animations',
    '- Listbox, Combobox, Dialog, Popover as building blocks',
    '- Style with Tailwind — components are unstyled',
    '- Automatic focus management and ARIA',
  ].join('\n'),
  material: [
    'Component library (Material-UI / MUI):',
    '- Import from @mui/material/*',
    '- Use sx prop for one-off styles',
    '- Theme via createTheme + ThemeProvider',
    '- Compose with Box, Stack, Grid layout primitives',
    '- Override with styled() for reusable variants',
    '- Use MUI system breakpoints (xs, sm, md, lg, xl)',
  ].join('\n'),
  tailwind: [
    'Styling (Tailwind CSS):',
    '- Utility-first with responsive prefixes (sm:, md:, lg:)',
    '- Dark mode with dark: variant',
    '- Custom values via arbitrary notation [value]',
    '- Group hover/focus with group and peer modifiers',
    '- Use @apply sparingly, prefer utility classes',
    '- Semantic tokens via CSS custom properties',
  ].join('\n'),
};

export function buildLibrarySection(
  componentLibrary?: string
): string {
  if (!componentLibrary || componentLibrary === 'none') return '';
  return LIBRARY_PATTERNS[componentLibrary] ?? '';
}
