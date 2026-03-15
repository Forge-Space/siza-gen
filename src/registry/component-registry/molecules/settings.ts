import type { IComponentSnippet } from '../types.js';

export const settingsSnippets: IComponentSnippet[] = [
  {
    id: 'settings-toggle-group',
    name: 'Notification Toggle Group',
    category: 'molecule',
    type: 'settings',
    variant: 'toggle-group',
    tags: ['settings', 'toggle', 'switch', 'notifications', 'preferences'],
    mood: ['professional', 'minimal'],
    industry: ['saas', 'general', 'devtools'],
    visualStyles: ['linear-modern', 'minimal-editorial', 'soft-depth'],
    jsx: `<div className="rounded-xl border bg-card">
  <div className="border-b px-6 py-4">
    <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
    <p className="mt-0.5 text-xs text-muted-foreground">Choose how you want to be notified.</p>
  </div>
  <div className="divide-y">
    <label className="flex items-center justify-between px-6 py-4 cursor-pointer">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-foreground">Email notifications</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Receive updates about your account activity via email.</p>
      </div>
      <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary transition-colors" role="switch" aria-checked="true" tabIndex={0}>
        <span className="pointer-events-none inline-block h-5 w-5 translate-x-5 rounded-full bg-background shadow-lg ring-0 transition-transform" aria-hidden="true"></span>
      </div>
    </label>
    <label className="flex items-center justify-between px-6 py-4 cursor-pointer">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-foreground">Push notifications</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Get notified in your browser when something important happens.</p>
      </div>
      <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary transition-colors" role="switch" aria-checked="true" tabIndex={0}>
        <span className="pointer-events-none inline-block h-5 w-5 translate-x-5 rounded-full bg-background shadow-lg ring-0 transition-transform" aria-hidden="true"></span>
      </div>
    </label>
    <label className="flex items-center justify-between px-6 py-4 cursor-pointer">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-foreground">SMS alerts</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Critical security alerts sent to your phone number.</p>
      </div>
      <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-muted transition-colors" role="switch" aria-checked="false" tabIndex={0}>
        <span className="pointer-events-none inline-block h-5 w-5 translate-x-0 rounded-full bg-background shadow-lg ring-0 transition-transform" aria-hidden="true"></span>
      </div>
    </label>
  </div>
</div>`,
    tailwindClasses: {
      wrapper: 'rounded-xl border bg-card',
      header: 'border-b px-6 py-4',
      title: 'text-sm font-semibold text-foreground',
      subtitle: 'mt-0.5 text-xs text-muted-foreground',
      row: 'flex items-center justify-between px-6 py-4 cursor-pointer',
      label: 'text-sm font-medium text-foreground',
      description: 'mt-0.5 text-xs text-muted-foreground',
      switchOn:
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary transition-colors',
      switchOff:
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-muted transition-colors',
      switchThumb:
        'pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
    },
    a11y: {
      roles: ['switch'],
      ariaAttributes: ['aria-checked on switches', 'tabIndex for keyboard focus'],
      keyboardNav: 'Tab to each toggle, Space to flip state',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'role=switch with aria-checked for native semantics',
        'translate-x-5 / translate-x-0 for toggle position',
        'label wrapper for full-row click area',
      ],
      inspirationSource: 'iOS Settings toggle rows',
      craftDetails: [
        'shadow-lg on switch thumb for tactile depth',
        'divide-y for clean row separation',
        'pr-4 on text to prevent overlap with switch',
      ],
    },
  },
  {
    id: 'settings-profile-form',
    name: 'Profile Settings Form',
    category: 'molecule',
    type: 'settings',
    variant: 'profile-form',
    tags: ['settings', 'profile', 'form', 'avatar', 'account'],
    mood: ['professional', 'minimal'],
    industry: ['saas', 'general', 'devtools'],
    visualStyles: ['linear-modern', 'minimal-editorial', 'soft-depth'],
    jsx: `<div className="rounded-xl border bg-card">
  <div className="border-b px-6 py-4">
    <h3 className="text-sm font-semibold text-foreground">Profile</h3>
    <p className="mt-0.5 text-xs text-muted-foreground">Manage your public profile information.</p>
  </div>
  <div className="p-6 space-y-6">
    <div className="flex items-center gap-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-semibold text-muted-foreground" aria-hidden="true">AK</div>
      <div className="space-y-1">
        <button type="button" className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Change avatar</button>
        <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
      </div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="settings-first-name">First name</label>
        <input id="settings-first-name" type="text" value="Alex" className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="settings-last-name">Last name</label>
        <input id="settings-last-name" type="text" value="Kim" className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </div>
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground" htmlFor="settings-email">Email</label>
      <input id="settings-email" type="email" value="alex.kim@company.co" className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      <p className="text-xs text-muted-foreground">This is the email associated with your account.</p>
    </div>
  </div>
  <div className="flex items-center justify-end border-t px-6 py-4">
    <button type="submit" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Save changes</button>
  </div>
</div>`,
    tailwindClasses: {
      wrapper: 'rounded-xl border bg-card',
      header: 'border-b px-6 py-4',
      title: 'text-sm font-semibold text-foreground',
      avatar:
        'flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-semibold text-muted-foreground',
      input:
        'flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      label: 'text-sm font-medium text-foreground',
      hint: 'text-xs text-muted-foreground',
      footer: 'flex items-center justify-end border-t px-6 py-4',
      submitButton:
        'inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    },
    a11y: {
      roles: ['form'],
      ariaAttributes: ['htmlFor/id label pairing', 'aria-hidden on avatar'],
      keyboardNav: 'Tab through inputs, Enter to submit',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: ['sm'] },
    quality: {
      antiGeneric: [
        'avatar with initials fallback instead of generic icon',
        'file size hint under upload button for UX clarity',
        'htmlFor/id label pairing for proper form semantics',
      ],
      inspirationSource: 'GitHub profile settings',
      craftDetails: [
        'sm:grid-cols-2 for name fields side-by-side',
        'border-t footer for visual action separation',
        'shadow-sm on inputs for subtle depth',
      ],
    },
  },
  {
    id: 'settings-danger-zone',
    name: 'Danger Zone Settings',
    category: 'molecule',
    type: 'settings',
    variant: 'danger-zone',
    tags: ['settings', 'danger', 'delete', 'destructive', 'account'],
    mood: ['professional', 'minimal'],
    industry: ['saas', 'devtools', 'general'],
    visualStyles: ['linear-modern', 'minimal-editorial', 'corporate-trust'],
    jsx: `<div className="rounded-xl border border-destructive/30 bg-card">
  <div className="border-b border-destructive/30 px-6 py-4">
    <h3 className="text-sm font-semibold text-destructive">Danger Zone</h3>
    <p className="mt-0.5 text-xs text-muted-foreground">Irreversible and destructive actions.</p>
  </div>
  <div className="divide-y divide-destructive/10">
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-foreground">Transfer ownership</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Transfer this project to another user or organization.</p>
      </div>
      <button type="button" className="inline-flex h-8 items-center justify-center rounded-md border border-destructive/50 px-3 text-xs font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Transfer</button>
    </div>
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-foreground">Delete project</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Permanently delete this project and all of its data. This action cannot be undone.</p>
      </div>
      <button type="button" className="inline-flex h-8 items-center justify-center rounded-md bg-destructive px-3 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Delete project</button>
    </div>
  </div>
</div>`,
    tailwindClasses: {
      wrapper: 'rounded-xl border border-destructive/30 bg-card',
      header: 'border-b border-destructive/30 px-6 py-4',
      title: 'text-sm font-semibold text-destructive',
      subtitle: 'mt-0.5 text-xs text-muted-foreground',
      row: 'flex items-center justify-between px-6 py-4',
      label: 'text-sm font-medium text-foreground',
      description: 'mt-0.5 text-xs text-muted-foreground',
      outlineButton:
        'inline-flex h-8 items-center justify-center rounded-md border border-destructive/50 px-3 text-xs font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      solidButton:
        'inline-flex h-8 items-center justify-center rounded-md bg-destructive px-3 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    },
    a11y: {
      roles: [],
      ariaAttributes: [],
      keyboardNav: 'Tab through destructive action buttons',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'border-destructive/30 card wrapper for visual danger cue',
        'escalating button severity: outline (transfer) vs solid (delete)',
        'hover:bg-destructive on outline button for confirmation feel',
      ],
      inspirationSource: 'GitHub repository danger zone',
      craftDetails: [
        'divide-destructive/10 for thematic row separation',
        'pr-4 on text to prevent button overlap',
        'border-destructive/30 header matching card border',
      ],
    },
  },
  {
    id: 'settings-api-key-manager',
    name: 'API Key Management',
    category: 'molecule',
    type: 'settings',
    variant: 'api-keys',
    tags: ['settings', 'api', 'keys', 'tokens', 'security'],
    mood: ['professional', 'minimal'],
    industry: ['saas', 'devtools', 'fintech'],
    visualStyles: ['linear-modern', 'dark-premium', 'corporate-trust'],
    jsx: `<div className="rounded-xl border bg-card">
  <div className="flex items-center justify-between border-b px-6 py-4">
    <div>
      <h3 className="text-sm font-semibold text-foreground">API Keys</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">Manage keys for accessing the API programmatically.</p>
    </div>
    <button type="button" className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
      Generate key
    </button>
  </div>
  <div className="divide-y">
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">Production</p>
          <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success ring-1 ring-inset ring-success/20">Active</span>
        </div>
        <p className="mt-1 font-mono text-xs text-muted-foreground">sk_live_••••••••••••••••4f2a</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Created Jan 15, 2025 &middot; Last used 3 minutes ago</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Copy API key">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" /></svg>
        </button>
        <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Revoke API key">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
        </button>
      </div>
    </div>
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">Development</p>
          <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success ring-1 ring-inset ring-success/20">Active</span>
        </div>
        <p className="mt-1 font-mono text-xs text-muted-foreground">sk_test_••••••••••••••••8b1c</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Created Feb 3, 2025 &middot; Last used 1 hour ago</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Copy API key">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" /></svg>
        </button>
        <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Revoke API key">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
        </button>
      </div>
    </div>
  </div>
</div>`,
    tailwindClasses: {
      wrapper: 'rounded-xl border bg-card',
      header: 'flex items-center justify-between border-b px-6 py-4',
      title: 'text-sm font-semibold text-foreground',
      generateButton:
        'inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      keyName: 'text-sm font-medium text-foreground',
      keyValue: 'mt-1 font-mono text-xs text-muted-foreground',
      badge:
        'inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success ring-1 ring-inset ring-success/20',
      iconButton:
        'inline-flex h-8 w-8 items-center justify-center rounded-md border border-input text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      revokeButton:
        'inline-flex h-8 w-8 items-center justify-center rounded-md border border-input text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    },
    a11y: {
      roles: [],
      ariaAttributes: ['aria-label on copy/revoke buttons', 'aria-hidden on icons'],
      keyboardNav: 'Tab to generate, copy, and revoke buttons',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'masked key display with bullet characters for security',
        'font-mono on key values for code-like appearance',
        'status badge with ring-inset for environment clarity',
      ],
      inspirationSource: 'Stripe API keys management page',
      craftDetails: [
        'h-8 w-8 square icon buttons for compact actions',
        'gap-1.5 on action buttons for tight grouping',
        'text-[10px] on badge for minimal footprint',
      ],
    },
  },
  {
    id: 'settings-billing-plan',
    name: 'Billing Plan Card',
    category: 'molecule',
    type: 'settings',
    variant: 'billing-plan',
    tags: ['settings', 'billing', 'plan', 'pricing', 'subscription'],
    mood: ['professional', 'minimal'],
    industry: ['saas', 'devtools', 'startup'],
    visualStyles: ['linear-modern', 'corporate-trust', 'soft-depth'],
    jsx: `<div className="rounded-xl border bg-card">
  <div className="border-b px-6 py-4">
    <h3 className="text-sm font-semibold text-foreground">Current Plan</h3>
  </div>
  <div className="p-6 space-y-6">
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-foreground">Pro Plan</p>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary ring-1 ring-inset ring-primary/20">Current</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Everything you need to scale your business.</p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-semibold text-foreground tracking-tight">$29</p>
        <p className="text-xs text-muted-foreground">per month</p>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">API requests</span>
        <span className="font-medium text-foreground">8,420 / 10,000</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style="width: 84%"></div>
      </div>
      <p className="text-xs text-muted-foreground">1,580 requests remaining this billing cycle. Resets on Feb 1.</p>
    </div>
    <ul className="space-y-2">
      <li className="flex items-center gap-2 text-sm text-muted-foreground">
        <svg className="h-4 w-4 shrink-0 text-success" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
        10,000 API requests / month
      </li>
      <li className="flex items-center gap-2 text-sm text-muted-foreground">
        <svg className="h-4 w-4 shrink-0 text-success" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
        5 team members
      </li>
      <li className="flex items-center gap-2 text-sm text-muted-foreground">
        <svg className="h-4 w-4 shrink-0 text-success" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
        Priority support
      </li>
    </ul>
  </div>
  <div className="flex items-center justify-end gap-2 border-t px-6 py-4">
    <button type="button" className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Manage billing</button>
    <button type="button" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Upgrade plan</button>
  </div>
</div>`,
    tailwindClasses: {
      wrapper: 'rounded-xl border bg-card',
      header: 'border-b px-6 py-4',
      title: 'text-sm font-semibold text-foreground',
      planName: 'text-lg font-semibold text-foreground',
      planBadge:
        'inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary ring-1 ring-inset ring-primary/20',
      price: 'text-2xl font-semibold text-foreground tracking-tight',
      progressTrack: 'h-2 w-full overflow-hidden rounded-full bg-muted',
      progressBar: 'h-full rounded-full bg-primary transition-all',
      featureIcon: 'h-4 w-4 shrink-0 text-success',
      secondaryButton:
        'inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      primaryButton:
        'inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    },
    a11y: {
      roles: ['list', 'listitem'],
      ariaAttributes: ['aria-hidden on icons'],
      keyboardNav: 'Tab through manage billing and upgrade buttons',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'progress bar with usage count for quota awareness',
        'reset date context for billing cycle clarity',
        'checkmark feature list with semantic green icons',
      ],
      inspirationSource: 'Vercel billing and usage page',
      craftDetails: [
        'h-2 rounded-full progress bar for clean visualization',
        'tracking-tight on price for dense number rendering',
        'border-t footer separating actions from content',
      ],
    },
  },
];
