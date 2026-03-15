import type { IComponentSnippet } from '../types.js';

export const toggleSnippets: IComponentSnippet[] = [
  {
    id: 'switch-default',
    name: 'Switch Toggle',
    category: 'atom',
    type: 'switch',
    variant: 'default',
    tags: ['toggle', 'boolean', 'settings', 'energetic'],
    mood: ['professional', 'minimal'],
    industry: ['general', 'saas'],
    visualStyles: ['soft-depth', 'linear-modern', 'corporate-trust'],
    jsx: `<label className="inline-flex items-center gap-3 cursor-pointer">
  <span className="text-sm font-medium text-foreground">Notifications</span>
  <button
    type="button"
    role="switch"
    aria-checked="false"
    className="peer relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-muted transition-colors duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary"
  >
    <span className="pointer-events-none block h-4 w-4 rounded-full bg-background shadow-sm ring-0 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] translate-x-0 data-[state=checked]:translate-x-4" />
  </button>
</label>`,
    tailwindClasses: {
      label: 'inline-flex items-center gap-3 cursor-pointer',
      text: 'text-sm font-medium text-foreground',
      switch:
        'peer relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-muted transition-colors duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary',
      thumb:
        'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-sm ring-0 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] translate-x-0 data-[state=checked]:translate-x-4',
    },
    a11y: {
      roles: ['switch'],
      ariaAttributes: ['aria-checked', 'role="switch"'],
      keyboardNav: 'Space to toggle, Tab to focus',
      contrastRatio: '3:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'button' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'spring easing cubic-bezier(0.34,1.56,0.64,1) for delight',
        'role=switch for proper semantics',
        'data-[state=checked] for framework-agnostic state',
      ],
      inspirationSource: 'Radix UI Switch',
      craftDetails: ['spring physics overshoot on toggle', 'shadow-sm on thumb for depth'],
    },
  },
  {
    id: 'checkbox-default',
    name: 'Checkbox',
    category: 'atom',
    type: 'checkbox',
    variant: 'default',
    tags: ['form', 'boolean', 'multi-select', 'energetic'],
    mood: ['professional', 'minimal'],
    industry: ['general', 'saas'],
    visualStyles: ['soft-depth', 'corporate-trust', 'linear-modern'],
    jsx: `<label className="inline-flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    className="h-4 w-4 shrink-0 rounded border border-input bg-background text-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary checked:border-primary"
  />
  <span className="text-sm text-foreground leading-none">Accept terms and conditions</span>
</label>`,
    tailwindClasses: {
      label: 'inline-flex items-center gap-2 cursor-pointer',
      checkbox:
        'h-4 w-4 shrink-0 rounded border border-input bg-background text-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary checked:border-primary',
      text: 'text-sm text-foreground leading-none',
    },
    a11y: {
      roles: ['checkbox'],
      ariaAttributes: ['aria-checked'],
      keyboardNav: 'Space to toggle, Tab to focus',
      contrastRatio: '3:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'input' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: ['native input with styled appearance', 'leading-none on label for vertical alignment'],
      inspirationSource: 'shadcn/ui Checkbox',
      craftDetails: ['h-4 w-4 for appropriate click target', 'shrink-0 prevents checkbox compression'],
    },
  },
  {
    id: 'radio-group',
    name: 'Radio Group',
    category: 'atom',
    type: 'radio',
    variant: 'default',
    tags: ['form', 'single-select', 'options', 'energetic'],
    mood: ['professional', 'minimal'],
    industry: ['general', 'saas'],
    visualStyles: ['soft-depth', 'corporate-trust'],
    jsx: `<fieldset className="space-y-3" role="radiogroup" aria-label="Select option">
  <legend className="text-sm font-medium text-foreground mb-3">Choose an option</legend>
  <label className="inline-flex items-center gap-2 cursor-pointer">
    <input type="radio" name="option" value="1" className="h-4 w-4 shrink-0 border border-input text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
    <span className="text-sm text-foreground">Option one</span>
  </label>
  <label className="inline-flex items-center gap-2 cursor-pointer">
    <input type="radio" name="option" value="2" className="h-4 w-4 shrink-0 border border-input text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
    <span className="text-sm text-foreground">Option two</span>
  </label>
  <label className="inline-flex items-center gap-2 cursor-pointer">
    <input type="radio" name="option" value="3" className="h-4 w-4 shrink-0 border border-input text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
    <span className="text-sm text-foreground">Option three</span>
  </label>
</fieldset>`,
    tailwindClasses: {
      fieldset: 'space-y-3',
      legend: 'text-sm font-medium text-foreground mb-3',
      label: 'inline-flex items-center gap-2 cursor-pointer',
      radio:
        'h-4 w-4 shrink-0 border border-input text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      text: 'text-sm text-foreground',
    },
    a11y: {
      roles: ['radiogroup', 'radio'],
      ariaAttributes: ['aria-label', 'role="radiogroup"'],
      keyboardNav: 'Arrow keys to navigate, Space to select, Tab to exit group',
      contrastRatio: '3:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'fieldset' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'fieldset + legend for proper grouping',
        'arrow key navigation per WAI-ARIA',
        'shared name attribute for mutual exclusion',
      ],
      inspirationSource: 'Radix UI RadioGroup',
      craftDetails: ['fieldset semantics', 'consistent with checkbox sizing'],
    },
  },
  {
    id: 'toggle-button-group',
    name: 'Toggle Button Group',
    category: 'atom',
    type: 'toggle',
    variant: 'button-group',
    tags: ['toggle', 'group', 'segmented', 'single-select'],
    mood: ['professional', 'minimal'],
    industry: ['general', 'saas', 'devtools'],
    visualStyles: ['linear-modern', 'soft-depth', 'minimal-editorial'],
    jsx: `<div className="inline-flex rounded-lg border border-border bg-muted p-1 gap-1" role="group" aria-label="View mode">
  <button type="button" aria-pressed="true" className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors bg-background text-foreground shadow-sm aria-pressed:bg-background aria-[pressed=false]:text-muted-foreground aria-[pressed=false]:bg-transparent hover:text-foreground">
    List
  </button>
  <button type="button" aria-pressed="false" className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-background/50">
    Grid
  </button>
  <button type="button" aria-pressed="false" className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-background/50">
    Kanban
  </button>
</div>`,
    tailwindClasses: {
      group: 'inline-flex rounded-lg border border-border bg-muted p-1 gap-1',
      activeButton:
        'rounded-md px-3 py-1.5 text-sm font-medium transition-colors bg-background text-foreground shadow-sm',
      inactiveButton:
        'rounded-md px-3 py-1.5 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-background/50',
    },
    a11y: {
      roles: ['group', 'button'],
      ariaAttributes: ['aria-pressed', 'aria-label'],
      keyboardNav: 'Tab between buttons, Space/Enter to toggle',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'aria-pressed for individual toggle state',
        'role=group + aria-label for screen readers',
        'shadow-sm on active button for depth vs muted background',
      ],
      inspirationSource: 'GitHub Issues list/grid view toggles',
      craftDetails: [
        'p-1 + gap-1 inset padding with tight inner gap',
        'bg-background on active vs bg-muted on container for contrast',
      ],
    },
  },
  {
    id: 'switch-with-description',
    name: 'Switch with Description',
    category: 'atom',
    type: 'switch',
    variant: 'with-description',
    tags: ['toggle', 'settings', 'boolean', 'description'],
    mood: ['professional', 'minimal'],
    industry: ['general', 'saas', 'fintech'],
    visualStyles: ['soft-depth', 'corporate-trust', 'linear-modern'],
    jsx: `<label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors">
  <div className="space-y-1">
    <p className="text-sm font-medium text-foreground">Email notifications</p>
    <p className="text-xs text-muted-foreground">Receive updates about activity in your account.</p>
  </div>
  <button
    type="button"
    role="switch"
    aria-checked="true"
    className="mt-0.5 relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  >
    <span className="pointer-events-none block h-4 w-4 translate-x-4 rounded-full bg-background shadow-sm ring-0 transition-transform duration-200" />
  </button>
</label>`,
    tailwindClasses: {
      label:
        'flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors',
      textWrapper: 'space-y-1',
      title: 'text-sm font-medium text-foreground',
      description: 'text-xs text-muted-foreground',
      switch:
        'mt-0.5 relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      thumb:
        'pointer-events-none block h-4 w-4 translate-x-4 rounded-full bg-background shadow-sm ring-0 transition-transform duration-200',
    },
    a11y: {
      roles: ['switch'],
      ariaAttributes: ['aria-checked', 'role="switch"'],
      keyboardNav: 'Space to toggle, Tab to focus',
      contrastRatio: '3:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'label' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'entire row is the label — larger click target',
        'hover:bg-muted/50 for subtle row hover feedback',
        'description text explains the toggle purpose',
      ],
      inspirationSource: 'Vercel project settings toggles',
      craftDetails: [
        'items-start aligns switch with first line of text, not center',
        'mt-0.5 optically aligns switch top with text baseline',
      ],
    },
  },
];
