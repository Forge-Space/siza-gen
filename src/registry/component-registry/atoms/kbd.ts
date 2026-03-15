import type { IComponentSnippet } from '../types.js';

export const kbdSnippets: IComponentSnippet[] = [
  {
    id: 'kbd-single',
    name: 'Single Key',
    category: 'atom',
    type: 'kbd',
    variant: 'single',
    tags: ['keyboard', 'kbd', 'shortcut', 'key'],
    mood: ['professional', 'minimal'],
    industry: ['devtools', 'saas', 'saas'],
    visualStyles: ['minimal-editorial', 'soft-depth'],
    jsx: `<kbd className="inline-flex items-center justify-center rounded border border-border bg-muted px-2 py-1 font-mono text-xs font-medium text-foreground shadow-sm">
  K
</kbd>`,
    tailwindClasses: {
      kbd: 'inline-flex items-center justify-center rounded border border-border bg-muted px-2 py-1 font-mono text-xs font-medium text-foreground shadow-sm',
    },
    a11y: {
      roles: ['kbd semantic element'],
      ariaAttributes: [],
      keyboardNav: 'N/A — static content',
      contrastRatio: '4.5:1',
      focusVisible: false,
      reducedMotion: true,
    },
    seo: { semanticElement: 'kbd' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: ['shadow-sm creates subtle 3D key appearance', 'inline-flex centers single character'],
      inspirationSource: 'GitHub Primer kbd',
      craftDetails: ['font-mono for technical keyboard character', 'px-2 py-1 provides compact key proportions'],
    },
  },
  {
    id: 'kbd-combo',
    name: 'Key Combination',
    category: 'atom',
    type: 'kbd',
    variant: 'combo',
    tags: ['keyboard', 'kbd', 'shortcut', 'combination'],
    mood: ['professional', 'professional'],
    industry: ['devtools', 'saas', 'saas'],
    visualStyles: ['minimal-editorial', 'linear-modern'],
    jsx: `<div className="inline-flex items-center gap-1">
  <kbd className="inline-flex items-center justify-center rounded border border-border bg-muted px-2 py-1 font-mono text-xs font-medium text-foreground shadow-sm">
    Cmd
  </kbd>
  <span className="text-xs text-muted-foreground">+</span>
  <kbd className="inline-flex items-center justify-center rounded border border-border bg-muted px-2 py-1 font-mono text-xs font-medium text-foreground shadow-sm">
    K
  </kbd>
</div>`,
    tailwindClasses: {
      container: 'inline-flex items-center gap-1',
      kbd: 'inline-flex items-center justify-center rounded border border-border bg-muted px-2 py-1 font-mono text-xs font-medium text-foreground shadow-sm',
      separator: 'text-xs text-muted-foreground',
    },
    a11y: {
      roles: ['kbd semantic elements'],
      ariaAttributes: [],
      keyboardNav: 'N/A — static content',
      contrastRatio: '4.5:1',
      focusVisible: false,
      reducedMotion: true,
    },
    seo: { semanticElement: 'kbd' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'gap-1 for tight spacing between keys in combo',
        'text-muted-foreground on + separator for subtle emphasis',
      ],
      inspirationSource: 'HeroUI Kbd',
      craftDetails: [
        'inline-flex on container aligns keys and separator',
        'separate kbd elements for each key in combination',
      ],
    },
  },
  {
    id: 'kbd-inline',
    name: 'Inline Kbd',
    category: 'atom',
    type: 'kbd',
    variant: 'inline',
    tags: ['keyboard', 'kbd', 'inline', 'text'],
    mood: ['minimal', 'minimal'],
    industry: ['devtools', 'education', 'devtools'],
    visualStyles: ['minimal-editorial', 'linear-modern'],
    jsx: `<p className="text-sm text-foreground">
  Press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">Enter</kbd> to submit the form.
</p>`,
    tailwindClasses: {
      paragraph: 'text-sm text-foreground',
      kbd: 'rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground',
    },
    a11y: {
      roles: ['kbd semantic element'],
      ariaAttributes: [],
      keyboardNav: 'N/A — static content',
      contrastRatio: '4.5:1',
      focusVisible: false,
      reducedMotion: true,
    },
    seo: { semanticElement: 'kbd' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: ['px-1.5 py-0.5 for compact inline proportions', 'text-xs matches inline code size'],
      inspirationSource: 'GitHub documentation kbd',
      craftDetails: [
        'rounded instead of rounded-md for subtle inline appearance',
        'border border-border provides definition without shadow',
      ],
    },
  },
  {
    id: 'kbd-shortcut-hint',
    name: 'Shortcut Hint Badge',
    category: 'atom',
    type: 'kbd',
    variant: 'shortcut-hint',
    tags: ['keyboard', 'kbd', 'shortcut', 'badge', 'tooltip'],
    mood: ['professional', 'minimal'],
    industry: ['devtools', 'saas', 'general'],
    visualStyles: ['minimal-editorial', 'linear-modern', 'soft-depth'],
    jsx: `<div className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1">
  <kbd className="font-mono text-xs text-muted-foreground">⌘</kbd>
  <kbd className="font-mono text-xs text-muted-foreground">K</kbd>
  <span className="text-xs text-muted-foreground">Quick search</span>
</div>`,
    tailwindClasses: {
      container: 'inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1',
      key: 'font-mono text-xs text-muted-foreground',
      label: 'text-xs text-muted-foreground',
    },
    a11y: {
      roles: ['kbd semantic element'],
      ariaAttributes: [],
      keyboardNav: 'N/A — static hint',
      contrastRatio: '4.5:1',
      focusVisible: false,
      reducedMotion: true,
    },
    seo: { semanticElement: 'kbd' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'symbol glyphs (⌘) instead of text for compact display',
        'bg-muted container groups keys visually',
        'label inline to explain purpose',
      ],
      inspirationSource: 'Linear.app command palette trigger',
      craftDetails: [
        'gap-1.5 for tighter key grouping than gap-2',
        'combined in one pill container instead of individual bubbles',
      ],
    },
  },
  {
    id: 'kbd-dark',
    name: 'Dark Key Cap',
    category: 'atom',
    type: 'kbd',
    variant: 'dark',
    tags: ['keyboard', 'kbd', 'shortcut', 'dark', 'terminal'],
    mood: ['professional', 'minimal'],
    industry: ['devtools', 'saas', 'general'],
    visualStyles: ['dark-premium', 'minimal-editorial', 'linear-modern'],
    jsx: `<kbd className="inline-flex items-center justify-center rounded border border-zinc-600 bg-zinc-800 px-2 py-1 font-mono text-xs font-medium text-zinc-200 shadow-sm shadow-zinc-900">
  Escape
</kbd>`,
    tailwindClasses: {
      kbd: 'inline-flex items-center justify-center rounded border border-zinc-600 bg-zinc-800 px-2 py-1 font-mono text-xs font-medium text-zinc-200 shadow-sm shadow-zinc-900',
    },
    a11y: {
      roles: ['kbd semantic element'],
      ariaAttributes: [],
      keyboardNav: 'N/A — static content',
      contrastRatio: '4.5:1',
      focusVisible: false,
      reducedMotion: true,
    },
    seo: { semanticElement: 'kbd' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'zinc palette for neutral dark appearance',
        'shadow-zinc-900 creates depth against dark bg',
        'border-zinc-600 lighter than bg for key edge',
      ],
      inspirationSource: 'VS Code terminal keybindings panel',
      craftDetails: [
        'explicit dark colors instead of semantic tokens for consistent dark appearance',
        'shadow-sm + shadow-zinc-900 for subtle 3D depth',
      ],
    },
  },
];
