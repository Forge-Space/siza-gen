import type { IComponentSnippet } from '../types.js';

export const progressSnippets: IComponentSnippet[] = [
  {
    id: 'progress-bar',
    name: 'Progress Bar',
    category: 'atom',
    type: 'linear-modern',
    variant: 'bar',
    tags: ['loading', 'status', 'percentage', 'indicator'],
    mood: ['professional', 'minimal'],
    industry: ['general', 'saas'],
    visualStyles: ['soft-depth', 'linear-modern', 'corporate-trust'],
    jsx: `<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span className="text-foreground font-medium">Progress</span>
    <span className="text-muted-foreground">60%</span>
  </div>
  <div className="h-2 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100} aria-label="Progress">
    <div className="h-full rounded-full bg-primary transition-all duration-500 ease-out" style={{ width: '60%' }} />
  </div>
</div>`,
    tailwindClasses: {
      wrapper: 'space-y-2',
      header: 'flex justify-between text-sm',
      label: 'text-foreground font-medium',
      value: 'text-muted-foreground',
      track: 'h-2 w-full overflow-hidden rounded-full bg-muted',
      fill: 'h-full rounded-full bg-primary transition-all duration-500 ease-out',
    },
    a11y: {
      roles: ['progressbar'],
      ariaAttributes: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-label'],
      keyboardNav: 'N/A — informational',
      contrastRatio: '3:1',
      focusVisible: false,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'transition-all for animated fill',
        'label + percentage for context',
        'ease-out for natural deceleration',
      ],
      inspirationSource: 'shadcn/ui Progress',
      craftDetails: ['h-2 thin bar for modern look', 'rounded-full on both track and fill'],
    },
  },
  {
    id: 'progress-steps',
    name: 'Step Progress Indicator',
    category: 'atom',
    type: 'progress',
    variant: 'steps',
    tags: ['steps', 'progress', 'wizard', 'onboarding'],
    mood: ['professional', 'minimal'],
    industry: ['general', 'saas', 'fintech'],
    visualStyles: ['linear-modern', 'soft-depth', 'corporate-trust'],
    jsx: `<div className="flex items-center gap-0" role="progressbar" aria-valuenow={2} aria-valuemin={1} aria-valuemax={4} aria-label="Step 2 of 4">
  {[1, 2, 3, 4].map((step) => (
    <div key={step} className="flex items-center">
      <div className={\`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold \${
        step < 2 ? 'bg-primary text-primary-foreground' :
        step === 2 ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2' :
        'bg-muted text-muted-foreground'
      }\`}>
        {step < 2 ? <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : step}
      </div>
      {step < 4 && <div className={\`h-px w-8 \${step < 2 ? 'bg-primary' : 'bg-muted'}\`} />}
    </div>
  ))}
</div>`,
    tailwindClasses: {
      wrapper: 'flex items-center gap-0',
      stepCompleted:
        'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold bg-primary text-primary-foreground',
      stepActive:
        'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2',
      stepInactive:
        'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold bg-muted text-muted-foreground',
      connector: 'h-px w-8',
    },
    a11y: {
      roles: ['progressbar'],
      ariaAttributes: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-label'],
      keyboardNav: 'N/A — informational',
      contrastRatio: '4.5:1',
      focusVisible: false,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'ring-offset-2 on active step for visual separation',
        'checkmark icon for completed steps',
        'connector line changes color to track completion',
      ],
      inspirationSource: 'Stripe payment wizard steps',
      craftDetails: ['ring-2 + ring-offset-2 highlights current step', 'svg checkmark replaces number when completed'],
    },
  },
  {
    id: 'progress-gradient',
    name: 'Gradient Progress Bar',
    category: 'atom',
    type: 'progress',
    variant: 'gradient',
    tags: ['loading', 'status', 'gradient', 'indicator'],
    mood: ['bold', 'playful'],
    industry: ['general', 'saas', 'startup'],
    visualStyles: ['gradient-mesh', 'soft-depth', 'neubrutalism'],
    jsx: `<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span className="text-foreground font-medium">Uploading</span>
    <span className="text-muted-foreground">75%</span>
  </div>
  <div className="h-2 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100} aria-label="Upload progress">
    <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-500 ease-out" style={{ width: '75%' }} />
  </div>
</div>`,
    tailwindClasses: {
      wrapper: 'space-y-2',
      track: 'h-2 w-full overflow-hidden rounded-full bg-muted',
      fill: 'h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-500 ease-out',
    },
    a11y: {
      roles: ['progressbar'],
      ariaAttributes: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-label'],
      keyboardNav: 'N/A — informational',
      contrastRatio: '3:1',
      focusVisible: false,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'gradient fill adds visual excitement',
        'from-violet-500 to-pink-500 creates vivid spectrum',
        'transition-all for smooth width updates',
      ],
      inspirationSource: 'Linear.app file upload indicators',
      craftDetails: ['gradient on fill only, track stays neutral bg-muted', 'rounded-full on both track and fill'],
    },
  },
  {
    id: 'skeleton-default',
    name: 'Skeleton Loader',
    category: 'atom',
    type: 'skeleton',
    variant: 'default',
    tags: ['loading', 'placeholder', 'shimmer', 'feedback'],
    mood: ['professional', 'minimal'],
    industry: ['general', 'saas'],
    visualStyles: ['soft-depth', 'linear-modern', 'corporate-trust'],
    jsx: `<div className="space-y-3" aria-busy="true" aria-label="Loading content">
  <div className="h-4 w-3/4 animate-pulse motion-reduce:animate-none rounded-md bg-muted" />
  <div className="h-4 w-full animate-pulse motion-reduce:animate-none rounded-md bg-muted" />
  <div className="h-4 w-5/6 animate-pulse motion-reduce:animate-none rounded-md bg-muted" />
</div>`,
    tailwindClasses: {
      wrapper: 'space-y-3',
      line: 'h-4 animate-pulse motion-reduce:animate-none rounded-md bg-muted',
    },
    a11y: {
      roles: ['status'],
      ariaAttributes: ['aria-busy="true"', 'aria-label'],
      keyboardNav: 'N/A — loading state',
      contrastRatio: '3:1',
      focusVisible: false,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'varied widths (3/4, full, 5/6) mimic real content',
        'aria-busy for screen readers',
        'matches content shape for low CLS',
      ],
      inspirationSource: 'shadcn/ui Skeleton',
      craftDetails: ['staggered widths prevent uniform shimmer', 'animate-pulse with motion-reduce fallback'],
    },
  },
  {
    id: 'skeleton-card-loading',
    name: 'Card Skeleton',
    category: 'atom',
    type: 'skeleton',
    variant: 'card',
    tags: ['loading', 'placeholder', 'card', 'feedback'],
    mood: ['professional', 'minimal'],
    industry: ['general', 'saas'],
    visualStyles: ['soft-depth', 'linear-modern'],
    jsx: `<div className="rounded-lg border bg-card p-6 shadow-sm" aria-busy="true" aria-label="Loading card">
  <div className="space-y-4">
    <div className="h-5 w-1/3 animate-pulse motion-reduce:animate-none rounded-md bg-muted" />
    <div className="space-y-2">
      <div className="h-4 w-full animate-pulse motion-reduce:animate-none rounded-md bg-muted" />
      <div className="h-4 w-4/5 animate-pulse motion-reduce:animate-none rounded-md bg-muted" />
    </div>
    <div className="flex gap-2 pt-2">
      <div className="h-9 w-20 animate-pulse motion-reduce:animate-none rounded-lg bg-muted" />
      <div className="h-9 w-20 animate-pulse motion-reduce:animate-none rounded-lg bg-muted" />
    </div>
  </div>
</div>`,
    tailwindClasses: {
      card: 'rounded-lg border bg-card p-6 shadow-sm',
      title: 'h-5 w-1/3 animate-pulse motion-reduce:animate-none rounded-md bg-muted',
      textLine: 'h-4 animate-pulse motion-reduce:animate-none rounded-md bg-muted',
      button: 'h-9 w-20 animate-pulse motion-reduce:animate-none rounded-lg bg-muted',
    },
    a11y: {
      roles: ['status'],
      ariaAttributes: ['aria-busy="true"', 'aria-label'],
      keyboardNav: 'N/A — loading state',
      contrastRatio: '3:1',
      focusVisible: false,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'skeleton mirrors actual card layout',
        'button skeletons maintain action area',
        'prevents CLS when content loads',
      ],
      inspirationSource: 'Vercel dashboard loading states',
      craftDetails: ['exact match of card dimensions', 'rounded-lg on buttons matches real buttons'],
    },
  },
];
