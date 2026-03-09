import type { IComponentSnippet } from '../types.js';

export const aiChatSnippets: IComponentSnippet[] = [
  {
    id: 'ai-streaming-message',
    name: 'AI Streaming Message',
    category: 'molecule',
    type: 'ai-chat',
    variant: 'streaming',
    tags: ['ai', 'chat', 'streaming', 'typewriter', 'animation'],
    mood: ['professional', 'minimal', 'futuristic'] as const,
    industry: ['saas', 'devtools', 'general'] as const,
    visualStyles: ['linear-modern', 'soft-depth', 'dark-premium'] as const,
    jsx: `<div className="flex gap-3">
  <div className="h-8 w-8 rounded-full bg-primary shrink-0 flex items-center justify-center">
    <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 22l-.394-1.433a2.25 2.25 0 0 0-1.423-1.423L13.25 18.75l1.433-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.433.394 1.433a2.25 2.25 0 0 0 1.423 1.423l1.433.394-1.433.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>
  </div>
  <div className="flex-1">
    <div className="flex items-baseline gap-2">
      <span className="text-sm font-medium text-foreground">AI Assistant</span>
      <span className="text-xs text-muted-foreground">Just now</span>
    </div>
    <div className="mt-1 rounded-lg bg-muted p-3 text-sm text-foreground">
      <p className="leading-relaxed">I can help you build that component. Let me start by</p>
      <span className="inline-flex gap-1 ml-1 animate-pulse" aria-live="polite">
        <span className="h-1 w-1 rounded-full bg-foreground"></span>
        <span className="h-1 w-1 rounded-full bg-foreground animation-delay-200"></span>
        <span className="h-1 w-1 rounded-full bg-foreground animation-delay-400"></span>
      </span>
    </div>
  </div>
</div>`,
    tailwindClasses: {
      container: 'flex gap-3',
      avatar: 'h-8 w-8 rounded-full bg-primary shrink-0 flex items-center justify-center',
      avatarIcon: 'h-4 w-4 text-primary-foreground',
      content: 'flex-1',
      header: 'flex items-baseline gap-2',
      name: 'text-sm font-medium text-foreground',
      timestamp: 'text-xs text-muted-foreground',
      bubble: 'mt-1 rounded-lg bg-muted p-3 text-sm text-foreground',
      text: 'leading-relaxed',
      dots: 'inline-flex gap-1 ml-1 animate-pulse',
      dot: 'h-1 w-1 rounded-full bg-foreground',
    },
    a11y: {
      roles: [],
      ariaAttributes: ['aria-live="polite" on streaming indicator', 'aria-hidden on icon'],
      keyboardNav: 'N/A — informational',
      contrastRatio: '4.5:1',
      focusVisible: false,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: ['sm'] },
    quality: {
      antiGeneric: [
        'sparkles icon for AI identity',
        'typewriter dots with staggered animation',
        'aria-live for screen reader streaming announcements',
        'animation-delay classes for sequential effect',
      ],
      inspirationSource: 'ChatGPT streaming responses',
      craftDetails: [
        'inline-flex dots for natural text flow',
        'animate-pulse for attention without distraction',
        'leading-relaxed for readability',
      ],
    },
  },
  {
    id: 'ai-code-block',
    name: 'AI Code Block',
    category: 'molecule',
    type: 'ai-chat',
    variant: 'code',
    tags: ['ai', 'code', 'syntax', 'copy', 'highlight'],
    mood: ['professional', 'minimal'] as const,
    industry: ['devtools', 'saas'] as const,
    visualStyles: ['dark-premium', 'linear-modern', 'soft-depth'] as const,
    jsx: `<div className="rounded-lg border bg-card overflow-hidden">
  <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
    <span className="text-xs font-medium text-muted-foreground font-mono">typescript</span>
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Copy code"
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /></svg>
      Copy
    </button>
  </div>
  <div className="bg-card p-4 overflow-x-auto">
    <pre className="text-sm font-mono text-foreground"><code>interface User {'{'}
  id: string;
  name: string;
  email: string;
{'}'}</code></pre>
  </div>
</div>`,
    tailwindClasses: {
      container: 'rounded-lg border bg-card overflow-hidden',
      header: 'flex items-center justify-between border-b bg-muted/50 px-4 py-2',
      language: 'text-xs font-medium text-muted-foreground font-mono',
      copyButton:
        'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      codeWrapper: 'bg-card p-4 overflow-x-auto',
      pre: 'text-sm font-mono text-foreground',
    },
    a11y: {
      roles: [],
      ariaAttributes: ['aria-label on copy button', 'aria-hidden on icon'],
      keyboardNav: 'Tab to copy button, Enter/Space to copy',
      contrastRatio: '7:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'language badge in header',
        'copy button with icon + label',
        'overflow-x-auto for long code lines',
        'bg-muted/50 header with subtle distinction',
      ],
      inspirationSource: 'GitHub code blocks',
      craftDetails: [
        'pre + code semantic structure',
        'font-mono for consistent rendering',
        'border-b separation between header and code',
      ],
    },
  },
  {
    id: 'ai-message-actions',
    name: 'AI Message Actions',
    category: 'molecule',
    type: 'ai-chat',
    variant: 'actions',
    tags: ['ai', 'actions', 'feedback', 'copy', 'regenerate'],
    mood: ['professional', 'minimal'] as const,
    industry: ['saas', 'devtools', 'general'] as const,
    visualStyles: ['linear-modern', 'soft-depth', 'minimal-editorial'] as const,
    jsx: `<div className="flex items-center gap-1 mt-2">
  <button
    type="button"
    className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    aria-label="Copy message"
  >
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /></svg>
    Copy
  </button>
  <button
    type="button"
    className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    aria-label="Regenerate response"
  >
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
    Retry
  </button>
  <div className="flex-1"></div>
  <button
    type="button"
    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    aria-label="Good response"
  >
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5.054 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" /></svg>
  </button>
  <button
    type="button"
    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    aria-label="Bad response"
  >
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.973 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 1.302-4.665c0-1.194-.232-2.333-.654-3.375Z" /></svg>
  </button>
</div>`,
    tailwindClasses: {
      container: 'flex items-center gap-1 mt-2',
      button:
        'inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      iconButton:
        'inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      spacer: 'flex-1',
      icon: 'h-3.5 w-3.5',
    },
    a11y: {
      roles: [],
      ariaAttributes: ['aria-label on all buttons', 'aria-hidden on icons'],
      keyboardNav: 'Tab through action buttons, Enter/Space to activate',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'thumbs up/down for feedback without disruption',
        'flex-1 spacer to separate copy/retry from feedback',
        'icon-only buttons for compact layout',
        'consistent h-7 height for visual balance',
      ],
      inspirationSource: 'Claude message actions',
      craftDetails: [
        'gap-1 tight spacing for action group',
        'text-xs for subtle presence',
        'hover:bg-accent for gentle feedback',
      ],
    },
  },
  {
    id: 'ai-context-pill',
    name: 'AI Context Pill',
    category: 'molecule',
    type: 'ai-chat',
    variant: 'context',
    tags: ['ai', 'context', 'file', 'attachment', 'pill'],
    mood: ['professional', 'minimal'] as const,
    industry: ['saas', 'devtools'] as const,
    visualStyles: ['linear-modern', 'soft-depth'] as const,
    jsx: `<div className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
  <svg className="h-3.5 w-3.5 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
  <span className="truncate max-w-[140px]">AuthContext.tsx</span>
  <button
    type="button"
    className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    aria-label="Remove context"
  >
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
  </button>
</div>`,
    tailwindClasses: {
      pill: 'inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm',
      icon: 'h-3.5 w-3.5 text-muted-foreground shrink-0',
      label: 'truncate max-w-[140px]',
      removeButton:
        'ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      removeIcon: 'h-3 w-3',
    },
    a11y: {
      roles: [],
      ariaAttributes: ['aria-label on remove button', 'aria-hidden on icons'],
      keyboardNav: 'Tab to remove button, Enter/Space to remove',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'truncate for long filenames with max-w constraint',
        'rounded-full pill shape for context distinction',
        'file icon for visual identification',
        'inline remove button for quick dismissal',
      ],
      inspirationSource: 'VSCode file tabs',
      craftDetails: ['shadow-sm for subtle elevation', 'gap-1.5 balanced spacing', 'h-4 w-4 compact remove button'],
    },
  },
  {
    id: 'ai-model-selector',
    name: 'AI Model Selector',
    category: 'molecule',
    type: 'ai-chat',
    variant: 'selector',
    tags: ['ai', 'model', 'dropdown', 'selector'],
    mood: ['professional', 'minimal'] as const,
    industry: ['saas', 'devtools'] as const,
    visualStyles: ['linear-modern', 'dark-premium', 'soft-depth'] as const,
    jsx: `<div className="relative inline-block">
  <button
    type="button"
    className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 22l-.394-1.433a2.25 2.25 0 0 0-1.423-1.423L13.25 18.75l1.433-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.433.394 1.433a2.25 2.25 0 0 0 1.423 1.423l1.433.394-1.433.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>
    <span>Claude Opus 4.6</span>
    <svg className="h-4 w-4 text-muted-foreground ml-auto" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
  </button>
</div>`,
    tailwindClasses: {
      container: 'relative inline-block',
      button:
        'inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      icon: 'h-4 w-4 text-primary',
      label: '',
      chevron: 'h-4 w-4 text-muted-foreground ml-auto',
    },
    a11y: {
      roles: ['button'],
      ariaAttributes: ['aria-haspopup="listbox"', 'aria-expanded', 'aria-hidden on icons'],
      keyboardNav: 'Space/Enter to open, Arrow keys to navigate, Escape to close',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'sparkles icon for AI model identity',
        'text-primary icon color for brand consistency',
        'ml-auto on chevron for right alignment',
        'shadow-sm for depth',
      ],
      inspirationSource: 'ChatGPT model selector',
      craftDetails: [
        'gap-2 comfortable spacing between elements',
        'hover:bg-accent for interaction feedback',
        'inline-flex for natural content width',
      ],
    },
  },
  {
    id: 'ai-chat-welcome',
    name: 'AI Chat Welcome',
    category: 'molecule',
    type: 'ai-chat',
    variant: 'welcome',
    tags: ['ai', 'chat', 'welcome', 'prompts', 'suggestions'],
    mood: ['professional', 'minimal', 'warm'] as const,
    industry: ['saas', 'devtools', 'general'] as const,
    visualStyles: ['linear-modern', 'soft-depth', 'minimal-editorial'] as const,
    jsx: `<div className="flex flex-col items-center justify-center p-8 text-center">
  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
    <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 22l-.394-1.433a2.25 2.25 0 0 0-1.423-1.423L13.25 18.75l1.433-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.433.394 1.433a2.25 2.25 0 0 0 1.423 1.423l1.433.394-1.433.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>
  </div>
  <h2 className="text-2xl font-bold text-foreground mb-2">How can I help you today?</h2>
  <p className="text-sm text-muted-foreground mb-6 max-w-md">Choose a suggestion below or type your own message to get started.</p>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
    <button type="button" className="rounded-lg border bg-card p-4 text-left text-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <p className="font-medium text-foreground">Build a React component</p>
      <p className="mt-1 text-xs text-muted-foreground">Create reusable UI elements</p>
    </button>
    <button type="button" className="rounded-lg border bg-card p-4 text-left text-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <p className="font-medium text-foreground">Debug my code</p>
      <p className="mt-1 text-xs text-muted-foreground">Find and fix issues quickly</p>
    </button>
    <button type="button" className="rounded-lg border bg-card p-4 text-left text-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <p className="font-medium text-foreground">Optimize performance</p>
      <p className="mt-1 text-xs text-muted-foreground">Make your app faster</p>
    </button>
    <button type="button" className="rounded-lg border bg-card p-4 text-left text-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <p className="font-medium text-foreground">Explain a concept</p>
      <p className="mt-1 text-xs text-muted-foreground">Learn something new today</p>
    </button>
  </div>
</div>`,
    tailwindClasses: {
      container: 'flex flex-col items-center justify-center p-8 text-center',
      iconWrapper: 'flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6',
      icon: 'h-8 w-8 text-primary',
      title: 'text-2xl font-bold text-foreground mb-2',
      description: 'text-sm text-muted-foreground mb-6 max-w-md',
      grid: 'grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl',
      suggestion:
        'rounded-lg border bg-card p-4 text-left text-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      suggestionTitle: 'font-medium text-foreground',
      suggestionDescription: 'mt-1 text-xs text-muted-foreground',
    },
    a11y: {
      roles: [],
      ariaAttributes: ['aria-hidden on icon'],
      keyboardNav: 'Tab through suggestion cards, Enter/Space to select',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div', headingLevel: 'h2' },
    responsive: { strategy: 'mobile-first', breakpoints: ['sm'] },
    quality: {
      antiGeneric: [
        'centered layout with large icon for welcoming feel',
        'grid of suggested prompts with descriptions',
        'text-left on cards despite centered parent',
        'max-w-md on description, max-w-2xl on grid for hierarchy',
      ],
      inspirationSource: 'Claude empty state',
      craftDetails: [
        'bg-primary/10 icon wrapper for subtle branding',
        'sm:grid-cols-2 responsive grid',
        'p-4 comfortable card padding',
      ],
    },
  },
  {
    id: 'ai-markdown-message',
    name: 'AI Markdown Message',
    category: 'molecule',
    type: 'ai-chat',
    variant: 'markdown',
    tags: ['ai', 'markdown', 'formatted', 'message'],
    mood: ['professional', 'minimal', 'editorial'] as const,
    industry: ['devtools', 'saas'] as const,
    visualStyles: ['minimal-editorial', 'linear-modern', 'soft-depth'] as const,
    jsx: `<div className="flex gap-3">
  <div className="h-8 w-8 rounded-full bg-primary shrink-0 flex items-center justify-center">
    <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 22l-.394-1.433a2.25 2.25 0 0 0-1.423-1.423L13.25 18.75l1.433-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.433.394 1.433a2.25 2.25 0 0 0 1.423 1.423l1.433.394-1.433.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>
  </div>
  <div className="flex-1">
    <div className="flex items-baseline gap-2">
      <span className="text-sm font-medium text-foreground">AI Assistant</span>
      <span className="text-xs text-muted-foreground">2:15 PM</span>
    </div>
    <div className="mt-1 rounded-lg bg-muted p-3 text-sm text-foreground prose prose-sm max-w-none">
      <h3 className="text-base font-semibold text-foreground mt-0 mb-2">Here's how to implement it:</h3>
      <ol className="space-y-1.5 text-foreground">
        <li>Install the required dependencies</li>
        <li>Configure your environment variables</li>
        <li>Set up the authentication flow</li>
      </ol>
      <p className="text-foreground mt-3 mb-0">You can also use <code className="rounded bg-card px-1.5 py-0.5 font-mono text-xs border">useState</code> for local state management.</p>
    </div>
  </div>
</div>`,
    tailwindClasses: {
      container: 'flex gap-3',
      avatar: 'h-8 w-8 rounded-full bg-primary shrink-0 flex items-center justify-center',
      avatarIcon: 'h-4 w-4 text-primary-foreground',
      content: 'flex-1',
      header: 'flex items-baseline gap-2',
      name: 'text-sm font-medium text-foreground',
      timestamp: 'text-xs text-muted-foreground',
      bubble: 'mt-1 rounded-lg bg-muted p-3 text-sm text-foreground prose prose-sm max-w-none',
      heading: 'text-base font-semibold text-foreground mt-0 mb-2',
      list: 'space-y-1.5 text-foreground',
      paragraph: 'text-foreground mt-3 mb-0',
      code: 'rounded bg-card px-1.5 py-0.5 font-mono text-xs border',
    },
    a11y: {
      roles: [],
      ariaAttributes: ['aria-hidden on icon'],
      keyboardNav: 'N/A — informational',
      contrastRatio: '4.5:1',
      focusVisible: false,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div', headingLevel: 'h3' },
    responsive: { strategy: 'mobile-first', breakpoints: ['sm'] },
    quality: {
      antiGeneric: [
        'prose classes for markdown styling',
        'inline code with bg-card and border',
        'space-y-1.5 for list items',
        'mt-0 mb-2 on heading for tight spacing',
      ],
      inspirationSource: 'GitHub markdown renderer',
      craftDetails: [
        'prose-sm for compact markdown',
        'max-w-none to allow full bubble width',
        'text-foreground overrides for theme consistency',
      ],
    },
  },
  {
    id: 'ai-chat-branch',
    name: 'AI Chat Branch',
    category: 'molecule',
    type: 'ai-chat',
    variant: 'branch',
    tags: ['ai', 'chat', 'branch', 'fork', 'conversation'],
    mood: ['professional', 'minimal'] as const,
    industry: ['saas', 'devtools'] as const,
    visualStyles: ['linear-modern', 'soft-depth'] as const,
    jsx: `<div className="relative flex flex-col gap-2 py-2">
  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
  <div className="relative flex items-center gap-3 pl-8">
    <div className="absolute left-4 h-3 w-3 rounded-full border-2 border-primary bg-card -translate-x-1/2"></div>
    <button
      type="button"
      className="flex-1 rounded-lg border bg-card p-3 text-left text-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <p className="font-medium text-foreground">Original Response</p>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">Here's a functional approach using React hooks and TypeScript...</p>
        </div>
        <svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
      </div>
    </button>
  </div>
  <div className="relative flex items-center gap-3 pl-8">
    <div className="absolute left-4 h-3 w-3 rounded-full border-2 border-border bg-card -translate-x-1/2"></div>
    <button
      type="button"
      className="flex-1 rounded-lg border bg-card p-3 text-left text-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <p className="font-medium text-foreground">Alternative Approach</p>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">Consider using a class-based component with lifecycle methods instead...</p>
        </div>
        <svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
      </div>
    </button>
  </div>
</div>`,
    tailwindClasses: {
      container: 'relative flex flex-col gap-2 py-2',
      timeline: 'absolute left-4 top-0 bottom-0 w-0.5 bg-border',
      item: 'relative flex items-center gap-3 pl-8',
      dotActive: 'absolute left-4 h-3 w-3 rounded-full border-2 border-primary bg-card -translate-x-1/2',
      dotInactive: 'absolute left-4 h-3 w-3 rounded-full border-2 border-border bg-card -translate-x-1/2',
      button:
        'flex-1 rounded-lg border bg-card p-3 text-left text-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      content: 'flex items-center justify-between gap-2',
      text: 'flex-1',
      title: 'font-medium text-foreground',
      preview: 'mt-1 text-xs text-muted-foreground line-clamp-2',
      chevron: 'h-4 w-4 shrink-0 text-muted-foreground',
    },
    a11y: {
      roles: [],
      ariaAttributes: ['aria-hidden on icons'],
      keyboardNav: 'Tab through branch options, Enter/Space to select',
      contrastRatio: '4.5:1',
      focusVisible: true,
      reducedMotion: true,
    },
    seo: { semanticElement: 'div' },
    responsive: { strategy: 'mobile-first', breakpoints: [] },
    quality: {
      antiGeneric: [
        'timeline visualization with vertical line',
        'border-2 border-primary for active branch',
        'line-clamp-2 for preview truncation',
        'absolute positioning for timeline dots',
      ],
      inspirationSource: 'Git branch visualization',
      craftDetails: [
        '-translate-x-1/2 to center dots on timeline',
        'pl-8 to clear space for timeline',
        'gap-2 for vertical rhythm',
      ],
    },
  },
];
