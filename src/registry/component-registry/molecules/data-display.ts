import type { IComponentSnippet } from '../types.js';

export const dataDisplaySnippets: IComponentSnippet[] = [
  {
    id: 'data-metric-card',
    name: 'Metric Card with Sparkline',
    category: 'molecule',
    type: 'data-display',
    variant: 'metric',
    tags: ['data', 'metric', 'sparkline', 'trend', 'kpi'],
    mood: ['professional', 'minimal'] as const,
    industry: ['saas', 'fintech', 'devtools'] as const,
    visualStyles: ['linear-modern', 'dark-premium', 'corporate-trust'] as const,
    jsx: `<div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
  <div className="flex items-start justify-between gap-4">
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">API Response Time</p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold tracking-tight text-foreground">142ms</p>
        <span className="inline-flex items-center gap-0.5 text-xs font-medium text-success">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 4.5 15 15m0 0V8.25m0 11.25H8.25" /></svg>
          -12%
        </span>
      </div>
      <p className="text-xs text-muted-foreground">vs previous week</p>
    </div>
    <div className="h-12 w-20 shrink-0" aria-hidden="true">
      <svg viewBox="0 0 80 48" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" className="text-success" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-success" />
          </linearGradient>
        </defs>
        <path d="M 0 32 L 10 28 L 20 30 L 30 24 L 40 26 L 50 20 L 60 22 L 70 18 L 80 16" fill="url(#sparkline-gradient)" />
        <path d="M 0 32 L 10 28 L 20 30 L 30 24 L 40 26 L 50 20 L 60 22 L 70 18 L 80 16" fill="none" stroke="currentColor" strokeWidth="2" className="text-success" />
      </svg>
    </div>
  </div>
</div>`,
    tailwindClasses: {
      card: 'rounded-xl border bg-card p-6 text-card-foreground shadow-sm',
      container: 'flex items-start justify-between gap-4',
      content: 'space-y-1',
      label: 'text-sm font-medium text-muted-foreground',
      valueWrapper: 'flex items-baseline gap-2',
      value: 'text-3xl font-bold tracking-tight text-foreground',
      trend: 'inline-flex items-center gap-0.5 text-xs font-medium text-success',
      description: 'text-xs text-muted-foreground',
      sparkline: 'h-12 w-20 shrink-0',
    },
    a11y: {
      roles: [],
      ariaAttributes: ['aria-hidden on sparkline'],
      keyboardNav: 'N/A — informational',
      contrastRatio: '4.5:1',
      focusVisible: false,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'inline SVG sparkline with gradient fill',
        'preserveAspectRatio="none" for responsive stretch',
        'text-success contextual color for improvement',
        'tracking-tight on large metric',
      ],
      inspirationSource: 'Datadog metrics dashboard',
      craftDetails: [
        'h-12 w-20 compact sparkline',
        'linearGradient with opacity fade',
        'currentColor for theme adaptability',
      ],
    },
  },
  {
    id: 'data-comparison-table',
    name: 'Data Comparison Table',
    category: 'molecule',
    type: 'data-display',
    variant: 'comparison',
    tags: ['data', 'comparison', 'table', 'features', 'pricing'],
    mood: ['professional', 'minimal'] as const,
    industry: ['saas', 'ecommerce', 'general'] as const,
    visualStyles: ['linear-modern', 'minimal-editorial', 'corporate-trust'] as const,
    jsx: `<div className="rounded-xl border bg-card overflow-hidden">
  <div className="grid grid-cols-3 border-b bg-muted/50">
    <div className="px-4 py-3 text-sm font-medium text-muted-foreground">Feature</div>
    <div className="px-4 py-3 text-center text-sm font-medium text-foreground border-l">Basic</div>
    <div className="px-4 py-3 text-center text-sm font-medium text-foreground border-l">Pro</div>
  </div>
  <div className="divide-y">
    <div className="grid grid-cols-3 items-center">
      <div className="px-4 py-3 text-sm text-foreground">API Calls/month</div>
      <div className="px-4 py-3 text-center text-sm text-muted-foreground border-l">10,000</div>
      <div className="px-4 py-3 text-center text-sm font-medium text-foreground border-l">100,000</div>
    </div>
    <div className="grid grid-cols-3 items-center">
      <div className="px-4 py-3 text-sm text-foreground">Team Members</div>
      <div className="px-4 py-3 text-center text-sm text-muted-foreground border-l">3</div>
      <div className="px-4 py-3 text-center text-sm font-medium text-foreground border-l">Unlimited</div>
    </div>
    <div className="grid grid-cols-3 items-center">
      <div className="px-4 py-3 text-sm text-foreground">Support</div>
      <div className="px-4 py-3 flex justify-center border-l">
        <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
      </div>
      <div className="px-4 py-3 flex justify-center border-l">
        <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
      </div>
    </div>
  </div>
</div>`,
    tailwindClasses: {
      container: 'rounded-xl border bg-card overflow-hidden',
      header: 'grid grid-cols-3 border-b bg-muted/50',
      headerCell: 'px-4 py-3 text-sm font-medium',
      headerFeature: 'text-muted-foreground',
      headerPlan: 'text-center text-foreground border-l',
      rows: 'divide-y',
      row: 'grid grid-cols-3 items-center',
      cellFeature: 'px-4 py-3 text-sm text-foreground',
      cellValue: 'px-4 py-3 text-center text-sm border-l',
      cellValueMuted: 'text-muted-foreground',
      cellValueEmphasis: 'font-medium text-foreground',
      icon: 'px-4 py-3 flex justify-center border-l',
    },
    a11y: {
      roles: ['table'],
      ariaAttributes: ['aria-label="Feature comparison"', 'aria-hidden on icons'],
      keyboardNav: 'N/A — informational',
      contrastRatio: '4.5:1',
      focusVisible: false,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'grid layout for perfect alignment',
        'border-l on columns for visual separation',
        'check/x icons for boolean features',
        'bg-muted/50 header for subtle distinction',
      ],
      inspirationSource: 'Vercel pricing comparison',
      craftDetails: ['divide-y for row separation', 'text-center on value columns', 'font-medium for emphasis'],
    },
  },
  {
    id: 'data-activity-feed',
    name: 'Activity Feed',
    category: 'molecule',
    type: 'data-display',
    variant: 'feed',
    tags: ['data', 'activity', 'feed', 'timeline', 'events'],
    mood: ['professional', 'minimal'] as const,
    industry: ['saas', 'devtools', 'general'] as const,
    visualStyles: ['linear-modern', 'soft-depth'] as const,
    jsx: `<div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
  <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
  <div className="space-y-4">
    <div className="flex gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
        <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
      </div>
      <div className="flex-1 space-y-0.5">
        <p className="text-sm text-foreground"><span className="font-medium">Sarah Chen</span> edited <span className="font-medium">API Documentation</span></p>
        <p className="text-xs text-muted-foreground">2 minutes ago</p>
      </div>
    </div>
    <div className="flex gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 shrink-0">
        <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
      </div>
      <div className="flex-1 space-y-0.5">
        <p className="text-sm text-foreground"><span className="font-medium">New deployment</span> to production</p>
        <p className="text-xs text-muted-foreground">1 hour ago</p>
      </div>
    </div>
    <div className="flex gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent shrink-0">
        <svg className="h-4 w-4 text-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
      </div>
      <div className="flex-1 space-y-0.5">
        <p className="text-sm text-foreground"><span className="font-medium">Alex Kim</span> joined the team</p>
        <p className="text-xs text-muted-foreground">3 hours ago</p>
      </div>
    </div>
  </div>
</div>`,
    tailwindClasses: {
      container: 'rounded-xl border bg-card p-6 text-card-foreground shadow-sm',
      title: 'text-sm font-semibold text-foreground mb-4',
      feed: 'space-y-4',
      item: 'flex gap-3',
      icon: 'flex h-8 w-8 items-center justify-center rounded-full shrink-0',
      iconPrimary: 'bg-primary/10',
      iconSuccess: 'bg-success/10',
      iconNeutral: 'bg-accent',
      iconSvg: 'h-4 w-4',
      content: 'flex-1 space-y-0.5',
      text: 'text-sm text-foreground',
      emphasis: 'font-medium',
      timestamp: 'text-xs text-muted-foreground',
    },
    a11y: {
      roles: ['feed'],
      ariaAttributes: ['aria-label="Activity feed"', 'aria-hidden on icons'],
      keyboardNav: 'N/A — informational',
      contrastRatio: '4.5:1',
      focusVisible: false,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div', headingLevel: 'h3' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'contextual icon colors (primary, success, neutral)',
        'rounded-full icon wrappers with /10 backgrounds',
        'space-y-0.5 tight content spacing',
        'font-medium for emphasis on actor and object',
      ],
      inspirationSource: 'Linear activity feed',
      craftDetails: ['space-y-4 for item separation', 'gap-3 for icon-text spacing', 'shrink-0 prevents icon collapse'],
    },
  },
  {
    id: 'data-progress-tracker',
    name: 'Progress Tracker',
    category: 'molecule',
    type: 'data-display',
    variant: 'progress',
    tags: ['data', 'progress', 'stepper', 'status', 'tracker'],
    mood: ['professional', 'minimal'] as const,
    industry: ['saas', 'general'] as const,
    visualStyles: ['linear-modern', 'soft-depth', 'corporate-trust'] as const,
    jsx: `<div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-sm font-semibold text-foreground">Onboarding Progress</h3>
    <span className="text-xs font-medium text-muted-foreground">3 of 5 completed</span>
  </div>
  <div className="space-y-4">
    <div className="flex items-start gap-3">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-success-foreground shrink-0">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">Create Account</p>
        <p className="text-xs text-muted-foreground mt-0.5">Completed 2 days ago</p>
      </div>
    </div>
    <div className="flex items-start gap-3">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-success-foreground shrink-0">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">Verify Email</p>
        <p className="text-xs text-muted-foreground mt-0.5">Completed 2 days ago</p>
      </div>
    </div>
    <div className="flex items-start gap-3">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
        <span className="text-xs font-semibold">3</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">Complete Profile</p>
        <p className="text-xs text-muted-foreground mt-0.5">In progress</p>
      </div>
    </div>
    <div className="flex items-start gap-3">
      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-border bg-card shrink-0">
        <span className="text-xs font-semibold text-muted-foreground">4</span>
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">Connect Integrations</p>
        <p className="text-xs text-muted-foreground mt-0.5">Not started</p>
      </div>
    </div>
    <div className="flex items-start gap-3">
      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-border bg-card shrink-0">
        <span className="text-xs font-semibold text-muted-foreground">5</span>
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">Invite Team</p>
        <p className="text-xs text-muted-foreground mt-0.5">Not started</p>
      </div>
    </div>
  </div>
</div>`,
    tailwindClasses: {
      container: 'rounded-xl border bg-card p-6 text-card-foreground shadow-sm',
      header: 'flex items-center justify-between mb-6',
      title: 'text-sm font-semibold text-foreground',
      count: 'text-xs font-medium text-muted-foreground',
      steps: 'space-y-4',
      step: 'flex items-start gap-3',
      iconComplete: 'flex h-6 w-6 items-center justify-center rounded-full bg-success text-success-foreground shrink-0',
      iconActive: 'flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0',
      iconPending: 'flex h-6 w-6 items-center justify-center rounded-full border-2 border-border bg-card shrink-0',
      check: 'h-3.5 w-3.5',
      number: 'text-xs font-semibold',
      content: 'flex-1',
      label: 'text-sm font-medium text-foreground',
      labelInactive: 'text-sm text-muted-foreground',
      status: 'text-xs text-muted-foreground mt-0.5',
    },
    a11y: {
      roles: ['progressbar'],
      ariaAttributes: ['aria-valuenow="3"', 'aria-valuemin="0"', 'aria-valuemax="5"', 'aria-hidden on icons'],
      keyboardNav: 'N/A — informational',
      contrastRatio: '4.5:1',
      focusVisible: false,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div', headingLevel: 'h3' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'three distinct states (complete, active, pending)',
        'check icon for completed steps',
        'numbered badges for pending steps',
        'text-muted-foreground on incomplete labels',
      ],
      inspirationSource: 'Stripe onboarding flow',
      craftDetails: ['space-y-4 for step separation', 'h-6 w-6 consistent badge size', 'border-2 for pending state'],
    },
  },
  {
    id: 'data-key-value-list',
    name: 'Key-Value List',
    category: 'molecule',
    type: 'data-display',
    variant: 'key-value',
    tags: ['data', 'key-value', 'details', 'properties'],
    mood: ['professional', 'minimal'] as const,
    industry: ['devtools', 'saas', 'general'] as const,
    visualStyles: ['minimal-editorial', 'linear-modern', 'soft-depth'] as const,
    jsx: `<div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
  <div className="border-b bg-muted/50 px-6 py-3">
    <h3 className="text-sm font-semibold text-foreground">User Details</h3>
  </div>
  <div className="divide-y">
    <div className="flex items-center justify-between px-6 py-3">
      <dt className="text-sm font-medium text-muted-foreground">Full Name</dt>
      <dd className="text-sm text-foreground">Sarah Chen</dd>
    </div>
    <div className="flex items-center justify-between px-6 py-3">
      <dt className="text-sm font-medium text-muted-foreground">Email</dt>
      <dd className="text-sm text-foreground font-mono">sarah.chen@acme.co</dd>
    </div>
    <div className="flex items-center justify-between px-6 py-3">
      <dt className="text-sm font-medium text-muted-foreground">Role</dt>
      <dd className="text-sm">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Admin</span>
      </dd>
    </div>
    <div className="flex items-center justify-between px-6 py-3">
      <dt className="text-sm font-medium text-muted-foreground">Member Since</dt>
      <dd className="text-sm text-foreground">January 15, 2024</dd>
    </div>
    <div className="flex items-center justify-between px-6 py-3">
      <dt className="text-sm font-medium text-muted-foreground">Status</dt>
      <dd className="flex items-center gap-1.5 text-sm text-foreground">
        <span className="h-2 w-2 rounded-full bg-success"></span>
        Active
      </dd>
    </div>
  </div>
</div>`,
    tailwindClasses: {
      container: 'rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden',
      header: 'border-b bg-muted/50 px-6 py-3',
      title: 'text-sm font-semibold text-foreground',
      list: 'divide-y',
      row: 'flex items-center justify-between px-6 py-3',
      key: 'text-sm font-medium text-muted-foreground',
      value: 'text-sm text-foreground',
      valueMono: 'text-sm text-foreground font-mono',
      badge: 'inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary',
      status: 'flex items-center gap-1.5 text-sm text-foreground',
      statusDot: 'h-2 w-2 rounded-full bg-success',
    },
    a11y: {
      roles: ['list'],
      ariaAttributes: [],
      htmlAttributes: ['dt/dd for semantic structure'],
      keyboardNav: 'N/A — informational',
      contrastRatio: '4.5:1',
      focusVisible: false,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div', headingLevel: 'h3' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'dt/dd semantic HTML for description list',
        'font-mono for email/technical values',
        'badge for role with bg-primary/10',
        'status dot with color indicator',
      ],
      inspirationSource: 'GitHub user profile details',
      craftDetails: [
        'divide-y for row separation',
        'justify-between for key-value alignment',
        'bg-muted/50 header for hierarchy',
      ],
    },
  },
  {
    id: 'data-badge-grid',
    name: 'Badge Grid',
    category: 'molecule',
    type: 'data-display',
    variant: 'badges',
    tags: ['data', 'badges', 'tags', 'categories', 'status'],
    mood: ['professional', 'minimal'] as const,
    industry: ['saas', 'devtools', 'general'] as const,
    visualStyles: ['linear-modern', 'soft-depth'] as const,
    jsx: `<div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
  <h3 className="text-sm font-semibold text-foreground mb-4">Issue Status Overview</h3>
  <div className="grid grid-cols-2 gap-3">
    <div className="rounded-lg border bg-card p-4 hover:bg-accent transition-colors cursor-pointer">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">Open</span>
        <span className="text-2xl font-bold tracking-tight text-foreground">24</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Needs attention</p>
    </div>
    <div className="rounded-lg border bg-card p-4 hover:bg-accent transition-colors cursor-pointer">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">In Progress</span>
        <span className="text-2xl font-bold tracking-tight text-foreground">12</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Being worked on</p>
    </div>
    <div className="rounded-lg border bg-card p-4 hover:bg-accent transition-colors cursor-pointer">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-foreground">Review</span>
        <span className="text-2xl font-bold tracking-tight text-foreground">8</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Awaiting review</p>
    </div>
    <div className="rounded-lg border bg-card p-4 hover:bg-accent transition-colors cursor-pointer">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">Closed</span>
        <span className="text-2xl font-bold tracking-tight text-foreground">156</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Resolved</p>
    </div>
  </div>
</div>`,
    tailwindClasses: {
      container: 'rounded-xl border bg-card p-6 text-card-foreground shadow-sm',
      title: 'text-sm font-semibold text-foreground mb-4',
      grid: 'grid grid-cols-2 gap-3',
      card: 'rounded-lg border bg-card p-4 hover:bg-accent transition-colors cursor-pointer',
      header: 'flex items-center justify-between',
      badge: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      badgeDestructive: 'bg-destructive/10 text-destructive',
      badgePrimary: 'bg-primary/10 text-primary',
      badgeNeutral: 'bg-accent text-foreground',
      badgeSuccess: 'bg-success/10 text-success',
      count: 'text-2xl font-bold tracking-tight text-foreground',
      description: 'mt-2 text-xs text-muted-foreground',
    },
    a11y: {
      roles: ['button'],
      ariaAttributes: [],
      keyboardNav: 'Tab through cards, Enter/Space to activate',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div', headingLevel: 'h3' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'contextual badge colors (destructive, primary, neutral, success)',
        'hover:bg-accent for interaction feedback',
        'text-2xl count for visual emphasis',
        'cursor-pointer for affordance',
      ],
      inspirationSource: 'GitHub issue dashboard',
      craftDetails: ['grid-cols-2 for compact layout', 'gap-3 for visual breathing room', 'tracking-tight on counts'],
    },
  },
  {
    id: 'data-changelog-entry',
    name: 'Changelog Entry',
    category: 'molecule',
    type: 'data-display',
    variant: 'changelog',
    tags: ['data', 'changelog', 'release', 'version', 'notes'],
    mood: ['professional', 'minimal', 'editorial'] as const,
    industry: ['devtools', 'saas'] as const,
    visualStyles: ['minimal-editorial', 'linear-modern', 'soft-depth'] as const,
    jsx: `<article className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
  <div className="flex items-start justify-between gap-4 mb-4">
    <div>
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-foreground">Version 2.4.0</h3>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Latest</span>
      </div>
      <p className="text-sm text-muted-foreground mt-1">Released on March 8, 2024</p>
    </div>
  </div>
  <div className="space-y-3">
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="inline-flex items-center rounded-md bg-success/10 px-2 py-0.5 text-xs font-medium text-success">New</span>
        <h4 className="text-sm font-medium text-foreground">AI-powered code generation</h4>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed ml-[54px]">Generate production-ready components with natural language prompts.</p>
    </div>
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Improved</span>
        <h4 className="text-sm font-medium text-foreground">Build performance</h4>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed ml-[54px]">30% faster builds with optimized bundler configuration.</p>
    </div>
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="inline-flex items-center rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-foreground">Fixed</span>
        <h4 className="text-sm font-medium text-foreground">Memory leak in dev mode</h4>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed ml-[54px]">Resolved HMR-related memory leak affecting long-running dev servers.</p>
    </div>
  </div>
</article>`,
    tailwindClasses: {
      container: 'rounded-xl border bg-card p-6 text-card-foreground shadow-sm',
      header: 'flex items-start justify-between gap-4 mb-4',
      titleWrapper: '',
      titleRow: 'flex items-center gap-2',
      title: 'text-lg font-semibold text-foreground',
      latestBadge: 'inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary',
      date: 'text-sm text-muted-foreground mt-1',
      changes: 'space-y-3',
      change: '',
      changeHeader: 'flex items-center gap-1.5 mb-2',
      changeType: 'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
      changeTypeNew: 'bg-success/10 text-success',
      changeTypeImproved: 'bg-primary/10 text-primary',
      changeTypeFixed: 'bg-accent text-foreground',
      changeTitle: 'text-sm font-medium text-foreground',
      changeDescription: 'text-sm text-muted-foreground leading-relaxed ml-[54px]',
    },
    a11y: {
      roles: ['article'],
      ariaAttributes: [],
      keyboardNav: 'N/A — informational',
      contrastRatio: '4.5:1',
      focusVisible: false,
      reducedMotion: true,
    },
    seo: { semanticElement: 'article', headingLevel: 'h3, h4' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'contextual change type badges (new, improved, fixed)',
        'ml-[54px] indent for description alignment',
        'Latest badge for current version',
        'article semantic element',
      ],
      inspirationSource: 'Linear changelog',
      craftDetails: [
        'space-y-3 for change separation',
        'leading-relaxed for readability',
        'rounded-md vs rounded-full for type badges',
      ],
    },
  },
  {
    id: 'data-tree-view',
    name: 'Tree View',
    category: 'molecule',
    type: 'data-display',
    variant: 'tree',
    tags: ['data', 'tree', 'hierarchy', 'expandable', 'nested'],
    mood: ['professional', 'minimal'] as const,
    industry: ['devtools', 'saas'] as const,
    visualStyles: ['linear-modern', 'minimal-editorial', 'soft-depth'] as const,
    jsx: `<div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
  <div className="space-y-1">
    <button type="button" className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
      <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" /></svg>
      <span className="font-medium text-foreground">src</span>
    </button>
    <div className="ml-6 space-y-1">
      <button type="button" className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
        <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" /></svg>
        <span className="text-foreground">components</span>
      </button>
      <div className="ml-6 space-y-1">
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm">
          <span className="w-4"></span>
          <svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
          <span className="text-muted-foreground">Button.tsx</span>
        </div>
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm">
          <span className="w-4"></span>
          <svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
          <span className="text-muted-foreground">Input.tsx</span>
        </div>
      </div>
    </div>
  </div>
</div>`,
    tailwindClasses: {
      container: 'rounded-xl border bg-card p-4 text-card-foreground shadow-sm',
      tree: 'space-y-1',
      branch:
        'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      leaf: 'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm',
      indent: 'ml-6 space-y-1',
      chevron: 'h-4 w-4 shrink-0 text-muted-foreground',
      folderIcon: 'h-4 w-4 shrink-0 text-primary',
      fileIcon: 'h-4 w-4 shrink-0 text-muted-foreground',
      label: 'font-medium text-foreground',
      labelMuted: 'text-muted-foreground',
      spacer: 'w-4',
    },
    a11y: {
      roles: ['tree', 'treeitem'],
      ariaAttributes: ['aria-expanded on expandable items', 'aria-level for depth', 'aria-hidden on icons'],
      keyboardNav: 'Arrow keys to navigate, Space/Enter to expand/collapse, Tab to exit tree',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'ml-6 indent for nested levels',
        'chevron for expandable folders',
        'text-primary folder icon for distinction',
        'w-4 spacer for leaf alignment',
      ],
      inspirationSource: 'VSCode file explorer',
      craftDetails: [
        'space-y-1 for compact vertical rhythm',
        'hover:bg-accent for interaction feedback',
        'shrink-0 prevents icon collapse',
      ],
    },
  },
];
