import type { IComponentSnippet } from '../types.js';

export const dashboardSnippets: IComponentSnippet[] = [
  {
    id: 'dashboard-kpi-row',
    name: 'KPI Metrics Row',
    category: 'molecule',
    type: 'dashboard',
    variant: 'kpi-row',
    tags: ['dashboard', 'kpi', 'metrics', 'stats', 'analytics'],
    mood: ['professional', 'minimal'],
    industry: ['saas', 'fintech', 'devtools'],
    visualStyles: ['linear-modern', 'corporate-trust', 'soft-depth'],
    jsx: `<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <div className="rounded-xl border bg-card p-6">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-1.997M15 19.128ZM12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">Total Users</p>
        <p className="text-2xl font-semibold text-foreground tracking-tight">12,847</p>
      </div>
    </div>
    <div className="mt-3 flex items-center gap-1 text-xs">
      <span className="inline-flex items-center gap-0.5 text-success">
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
        +12.5%
      </span>
      <span className="text-muted-foreground">vs last month</span>
    </div>
  </div>
  <div className="rounded-xl border bg-card p-6">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">Revenue</p>
        <p className="text-2xl font-semibold text-foreground tracking-tight">$48,290</p>
      </div>
    </div>
    <div className="mt-3 flex items-center gap-1 text-xs">
      <span className="inline-flex items-center gap-0.5 text-success">
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
        +8.2%
      </span>
      <span className="text-muted-foreground">vs last month</span>
    </div>
  </div>
  <div className="rounded-xl border bg-card p-6">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">Conversion</p>
        <p className="text-2xl font-semibold text-foreground tracking-tight">3.24%</p>
      </div>
    </div>
    <div className="mt-3 flex items-center gap-1 text-xs">
      <span className="inline-flex items-center gap-0.5 text-destructive">
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25M4.5 19.5V8.25" /></svg>
        -2.1%
      </span>
      <span className="text-muted-foreground">vs last month</span>
    </div>
  </div>
  <div className="rounded-xl border bg-card p-6">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">Avg. Response</p>
        <p className="text-2xl font-semibold text-foreground tracking-tight">1.4s</p>
      </div>
    </div>
    <div className="mt-3 flex items-center gap-1 text-xs">
      <span className="inline-flex items-center gap-0.5 text-success">
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
        -0.3s
      </span>
      <span className="text-muted-foreground">improved</span>
    </div>
  </div>
</div>`,
    tailwindClasses: {
      grid: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
      card: 'rounded-xl border bg-card p-6',
      iconWrap: 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10',
      icon: 'h-5 w-5 text-primary',
      label: 'text-sm text-muted-foreground',
      value: 'text-2xl font-semibold text-foreground tracking-tight',
      trendUp: 'inline-flex items-center gap-0.5 text-success',
      trendDown: 'inline-flex items-center gap-0.5 text-destructive',
    },
    a11y: {
      roles: [],
      ariaAttributes: ['aria-hidden on decorative icons'],
      keyboardNav: 'N/A — informational display',
      contrastRatio: '4.5:1',
      focusVisible: false,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: ['sm', 'lg'] },
    quality: {
      antiGeneric: [
        'trend arrows with color-coded success/destructive',
        'icon containers with bg-primary/10 for visual hierarchy',
        'tracking-tight on values for dense number display',
        'comparison text for contextual meaning',
      ],
      inspirationSource: 'Vercel Analytics dashboard',
      craftDetails: [
        'lg:grid-cols-4 responsive grid for KPI row',
        'shrink-0 on icon containers to prevent squishing',
        'min-w-0 on text containers for truncation safety',
      ],
    },
  },
  {
    id: 'dashboard-activity-feed-compact',
    name: 'Compact Activity Feed',
    category: 'molecule',
    type: 'dashboard',
    variant: 'activity-feed',
    tags: ['dashboard', 'activity', 'feed', 'timeline', 'events'],
    mood: ['professional', 'minimal'],
    industry: ['saas', 'devtools', 'general'],
    visualStyles: ['linear-modern', 'minimal-editorial', 'soft-depth'],
    jsx: `<div className="rounded-xl border bg-card">
  <div className="flex items-center justify-between border-b px-6 py-4">
    <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
    <button type="button" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm" aria-label="View all activity">View all</button>
  </div>
  <ul className="divide-y" role="list">
    <li className="flex items-start gap-3 px-6 py-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground" aria-hidden="true">AK</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground"><span className="font-medium">Anna Kim</span> deployed <span className="font-medium">api-gateway</span> to production</p>
        <p className="mt-0.5 text-xs text-muted-foreground">2 minutes ago</p>
      </div>
      <div className="h-2 w-2 mt-2 shrink-0 rounded-full bg-success" aria-label="Success"></div>
    </li>
    <li className="flex items-start gap-3 px-6 py-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground" aria-hidden="true">MJ</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground"><span className="font-medium">Marcus Johnson</span> opened PR <span className="font-medium">#847</span> in auth-service</p>
        <p className="mt-0.5 text-xs text-muted-foreground">14 minutes ago</p>
      </div>
      <div className="h-2 w-2 mt-2 shrink-0 rounded-full bg-primary" aria-label="Open"></div>
    </li>
    <li className="flex items-start gap-3 px-6 py-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground" aria-hidden="true">SL</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground"><span className="font-medium">Sara Lee</span> resolved incident <span className="font-medium">INC-2341</span></p>
        <p className="mt-0.5 text-xs text-muted-foreground">1 hour ago</p>
      </div>
      <div className="h-2 w-2 mt-2 shrink-0 rounded-full bg-muted-foreground" aria-label="Resolved"></div>
    </li>
  </ul>
</div>`,
    tailwindClasses: {
      wrapper: 'rounded-xl border bg-card',
      header: 'flex items-center justify-between border-b px-6 py-4',
      title: 'text-sm font-semibold text-foreground',
      viewAll: 'text-xs font-medium text-primary hover:text-primary/80 transition-colors',
      avatar:
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground',
      item: 'flex items-start gap-3 px-6 py-4',
      statusDot: 'h-2 w-2 mt-2 shrink-0 rounded-full',
    },
    a11y: {
      roles: ['list', 'listitem'],
      ariaAttributes: ['aria-label on status dots', 'aria-label on view-all'],
      keyboardNav: 'Tab to view-all link',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'avatar initials for recognizable identity',
        'color-coded status dots for event outcome',
        'relative timestamps for recency context',
      ],
      inspirationSource: 'Linear activity feed',
      craftDetails: [
        'divide-y for clean item separation',
        'min-w-0 on text containers for safe truncation',
        'mt-2 on status dot for baseline alignment',
      ],
    },
  },
  {
    id: 'dashboard-chart-card',
    name: 'Chart Card with Bar Visualization',
    category: 'molecule',
    type: 'dashboard',
    variant: 'chart-card',
    tags: ['dashboard', 'chart', 'bar-chart', 'analytics', 'visualization'],
    mood: ['professional', 'minimal'],
    industry: ['saas', 'fintech', 'devtools'],
    visualStyles: ['linear-modern', 'corporate-trust', 'dark-premium'],
    jsx: `<div className="rounded-xl border bg-card">
  <div className="flex items-center justify-between border-b px-6 py-4">
    <div>
      <h3 className="text-sm font-semibold text-foreground">Revenue Overview</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">Monthly revenue for the current year</p>
    </div>
    <div className="flex items-center gap-1 rounded-lg border p-1">
      <button type="button" className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground" aria-pressed="true">12M</button>
      <button type="button" className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors" aria-pressed="false">6M</button>
      <button type="button" className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors" aria-pressed="false">30D</button>
    </div>
  </div>
  <div className="px-6 py-6">
    <div className="flex items-end gap-2 h-40" role="img" aria-label="Bar chart showing monthly revenue from Jan to Dec">
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="w-full rounded-t bg-primary/20 transition-all" style="height: 40%"></div>
        <span className="text-[10px] text-muted-foreground">Jan</span>
      </div>
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="w-full rounded-t bg-primary/20 transition-all" style="height: 55%"></div>
        <span className="text-[10px] text-muted-foreground">Feb</span>
      </div>
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="w-full rounded-t bg-primary/20 transition-all" style="height: 45%"></div>
        <span className="text-[10px] text-muted-foreground">Mar</span>
      </div>
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="w-full rounded-t bg-primary/30 transition-all" style="height: 65%"></div>
        <span className="text-[10px] text-muted-foreground">Apr</span>
      </div>
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="w-full rounded-t bg-primary/30 transition-all" style="height: 58%"></div>
        <span className="text-[10px] text-muted-foreground">May</span>
      </div>
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="w-full rounded-t bg-primary/40 transition-all" style="height: 72%"></div>
        <span className="text-[10px] text-muted-foreground">Jun</span>
      </div>
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="w-full rounded-t bg-primary/40 transition-all" style="height: 68%"></div>
        <span className="text-[10px] text-muted-foreground">Jul</span>
      </div>
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="w-full rounded-t bg-primary/50 transition-all" style="height: 80%"></div>
        <span className="text-[10px] text-muted-foreground">Aug</span>
      </div>
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="w-full rounded-t bg-primary/50 transition-all" style="height: 75%"></div>
        <span className="text-[10px] text-muted-foreground">Sep</span>
      </div>
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="w-full rounded-t bg-primary/60 transition-all" style="height: 88%"></div>
        <span className="text-[10px] text-muted-foreground">Oct</span>
      </div>
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="w-full rounded-t bg-primary/70 transition-all" style="height: 92%"></div>
        <span className="text-[10px] text-muted-foreground">Nov</span>
      </div>
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="w-full rounded-t bg-primary transition-all" style="height: 100%"></div>
        <span className="text-[10px] text-muted-foreground">Dec</span>
      </div>
    </div>
  </div>
</div>`,
    tailwindClasses: {
      wrapper: 'rounded-xl border bg-card',
      header: 'flex items-center justify-between border-b px-6 py-4',
      title: 'text-sm font-semibold text-foreground',
      subtitle: 'mt-0.5 text-xs text-muted-foreground',
      toggleGroup: 'flex items-center gap-1 rounded-lg border p-1',
      toggleActive: 'rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground',
      toggleInactive:
        'rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors',
      chartArea: 'flex items-end gap-2 h-40',
      bar: 'w-full rounded-t bg-primary/40 transition-all',
      barLabel: 'text-[10px] text-muted-foreground',
    },
    a11y: {
      roles: ['img'],
      ariaAttributes: ['aria-label on chart', 'aria-pressed on toggle buttons'],
      keyboardNav: 'Tab through time range toggles',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: ['sm'] },
    quality: {
      antiGeneric: [
        'pure CSS bar chart with progressive opacity gradient',
        'toggle button group with aria-pressed for time range',
        'role=img with descriptive aria-label for accessibility',
      ],
      inspirationSource: 'Stripe Dashboard revenue chart',
      craftDetails: [
        'bg-primary with progressive opacity (20-100%) for depth',
        'rounded-t on bars for polished chart appearance',
        'text-[10px] for compact month labels under bars',
      ],
    },
  },
  {
    id: 'dashboard-quick-actions',
    name: 'Quick Actions Grid',
    category: 'molecule',
    type: 'dashboard',
    variant: 'quick-actions',
    tags: ['dashboard', 'actions', 'shortcuts', 'grid', 'launcher'],
    mood: ['professional', 'minimal'],
    industry: ['saas', 'devtools', 'startup'],
    visualStyles: ['linear-modern', 'soft-depth', 'bento-grid'],
    jsx: `<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
  <button type="button" className="group flex flex-col items-start gap-2 rounded-xl border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
    </div>
    <div>
      <p className="text-sm font-medium text-foreground">New Project</p>
      <p className="mt-0.5 text-xs text-muted-foreground">Start from scratch or template</p>
    </div>
  </button>
  <button type="button" className="group flex flex-col items-start gap-2 rounded-xl border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>
    </div>
    <div>
      <p className="text-sm font-medium text-foreground">Invite Team</p>
      <p className="mt-0.5 text-xs text-muted-foreground">Add collaborators to workspace</p>
    </div>
  </button>
  <button type="button" className="group flex flex-col items-start gap-2 rounded-xl border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
    </div>
    <div>
      <p className="text-sm font-medium text-foreground">Import Data</p>
      <p className="mt-0.5 text-xs text-muted-foreground">CSV, JSON, or API sync</p>
    </div>
  </button>
  <button type="button" className="group flex flex-col items-start gap-2 rounded-xl border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
    </div>
    <div>
      <p className="text-sm font-medium text-foreground">Settings</p>
      <p className="mt-0.5 text-xs text-muted-foreground">Workspace configuration</p>
    </div>
  </button>
</div>`,
    tailwindClasses: {
      grid: 'grid gap-3 sm:grid-cols-2 lg:grid-cols-4',
      card: 'group flex flex-col items-start gap-2 rounded-xl border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      iconWrap:
        'flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground',
      icon: 'h-4 w-4',
      title: 'text-sm font-medium text-foreground',
      description: 'mt-0.5 text-xs text-muted-foreground',
    },
    a11y: {
      roles: [],
      ariaAttributes: ['aria-hidden on icons'],
      keyboardNav: 'Tab through action cards, Enter/Space to activate',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: ['sm', 'lg'] },
    quality: {
      antiGeneric: [
        'group-hover icon color inversion for interactive feedback',
        'hover:border-primary/50 for subtle card highlight',
        'button elements for proper semantic interactivity',
      ],
      inspirationSource: 'Raycast launcher grid',
      craftDetails: [
        'transition-colors on icon wrap for smooth hover',
        'text-left on buttons for card-like layout',
        'hover:shadow-sm for subtle elevation on hover',
      ],
    },
  },
  {
    id: 'dashboard-overview-header',
    name: 'Dashboard Overview Header',
    category: 'molecule',
    type: 'dashboard',
    variant: 'overview-header',
    tags: ['dashboard', 'header', 'greeting', 'search', 'actions'],
    mood: ['professional', 'calm'],
    industry: ['saas', 'devtools', 'general'],
    visualStyles: ['linear-modern', 'minimal-editorial', 'soft-depth'],
    jsx: `<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <h1 className="text-2xl font-semibold text-foreground tracking-tight">Good morning, Alex</h1>
    <p className="mt-1 text-sm text-muted-foreground">Here is what is happening across your projects today.</p>
  </div>
  <div className="flex items-center gap-2">
    <div className="relative">
      <svg className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
      <input type="search" placeholder="Search projects..." className="h-9 rounded-md border border-input bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-64" aria-label="Search projects" />
    </div>
    <button type="button" className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
      Export
    </button>
    <button type="button" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      New Project
    </button>
  </div>
</div>`,
    tailwindClasses: {
      wrapper: 'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
      heading: 'text-2xl font-semibold text-foreground tracking-tight',
      subtitle: 'mt-1 text-sm text-muted-foreground',
      searchInput:
        'h-9 rounded-md border border-input bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      secondaryButton:
        'inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      primaryButton:
        'inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    },
    a11y: {
      roles: [],
      ariaAttributes: ['aria-label on search input', 'aria-hidden on icons'],
      keyboardNav: 'Tab through search, export, and new project buttons',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div', headingLevel: 'h1' },
    responsive: { strategy: 'mobile-first', breakpoints: ['sm'] },
    quality: {
      antiGeneric: [
        'personalized greeting with user name',
        'contextual subtitle with time-aware copy',
        'search input with icon for quick navigation',
      ],
      inspirationSource: 'Notion workspace header',
      craftDetails: [
        'sm:flex-row responsive stacking for mobile',
        'pl-8 on search input for icon inset',
        'tracking-tight on heading for dense display',
      ],
    },
  },
];
