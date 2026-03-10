import type { IComponentSnippet } from '../types.js';

export const aiPatternSnippets: IComponentSnippet[] = [
  {
    id: 'ai-token-usage',
    name: 'AI Token Usage Display',
    category: 'molecule',
    type: 'ai-patterns',
    variant: 'token-counter',
    tags: ['ai', 'tokens', 'usage', 'metrics', 'llm'],
    mood: ['professional', 'minimal'] as const,
    industry: ['saas', 'devtools'] as const,
    visualStyles: ['linear-modern', 'dark-premium'] as const,
    jsx: `<div className="flex items-center gap-4 rounded-lg border border-border bg-card p-3 text-sm">
  <div className="flex flex-col">
    <span className="text-xs text-muted-foreground">Prompt</span>
    <span className="font-mono font-medium text-foreground">1,247</span>
  </div>
  <div className="h-8 w-px bg-border" role="separator"></div>
  <div className="flex flex-col">
    <span className="text-xs text-muted-foreground">Completion</span>
    <span className="font-mono font-medium text-foreground">892</span>
  </div>
  <div className="h-8 w-px bg-border" role="separator"></div>
  <div className="flex flex-col">
    <span className="text-xs text-muted-foreground">Total</span>
    <span className="font-mono font-medium text-primary">2,139</span>
  </div>
  <div className="ml-auto flex items-center gap-1.5">
    <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
      <div className="h-full w-1/3 rounded-full bg-primary" role="progressbar" aria-valuenow={33} aria-valuemin={0} aria-valuemax={100} aria-label="Token usage: 33%"></div>
    </div>
    <span className="text-xs text-muted-foreground">33%</span>
  </div>
</div>`,
    tailwindClasses: {
      container: 'flex items-center gap-4 rounded-lg border border-border bg-card p-3 text-sm',
      label: 'text-xs text-muted-foreground',
      value: 'font-mono font-medium text-foreground',
      highlight: 'font-mono font-medium text-primary',
      divider: 'h-8 w-px bg-border',
      progressBar: 'h-2 w-16 overflow-hidden rounded-full bg-muted',
      progressFill: 'h-full rounded-full bg-primary',
    },
    a11y: {
      roles: ['separator', 'progressbar'],
      ariaAttributes: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-label'],
      keyboardNav: 'Static display, no keyboard interaction needed',
      contrastRatio: '4.5:1 text, 3:1 progress bar',
      focusVisible: false,
      reducedMotion: false,
    },
    responsive: {
      strategy: 'mobile-first',
      breakpoints: ['flex-wrap on sm:', 'gap-2 on mobile'],
    },
    quality: {
      antiGeneric: ['Uses font-mono for numeric values', 'Includes progress visualization'],
      inspirationSource: 'LangUI token usage patterns',
      craftDetails: ['Semantic separators', 'Proportional progress bar', 'Compact layout'],
    },
  },
  {
    id: 'ai-prompt-input',
    name: 'AI Prompt Input with Suggestions',
    category: 'molecule',
    type: 'ai-patterns',
    variant: 'prompt-suggestions',
    tags: ['ai', 'prompt', 'input', 'suggestions', 'chat'],
    mood: ['professional', 'minimal', 'futuristic'] as const,
    industry: ['saas', 'devtools', 'general'] as const,
    visualStyles: ['linear-modern', 'soft-depth'] as const,
    jsx: `<div className="w-full max-w-2xl space-y-3">
  <div className="flex flex-wrap gap-2">
    <button className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary" type="button">Explain this code</button>
    <button className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary" type="button">Write tests for</button>
    <button className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary" type="button">Refactor to</button>
    <button className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary" type="button">Debug why</button>
  </div>
  <div className="relative">
    <textarea className="min-h-[44px] w-full resize-none rounded-xl border border-border bg-card px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Ask anything..." rows={1} aria-label="Prompt input"></textarea>
    <button className="absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50" type="submit" aria-label="Send message">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
    </button>
  </div>
</div>`,
    tailwindClasses: {
      container: 'w-full max-w-2xl space-y-3',
      suggestions: 'flex flex-wrap gap-2',
      chip: 'rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary',
      textarea: 'min-h-[44px] w-full resize-none rounded-xl border border-border bg-card px-4 py-3 pr-12 text-sm',
      sendButton:
        'absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground',
    },
    a11y: {
      roles: ['textbox'],
      ariaAttributes: ['aria-label'],
      keyboardNav: 'Tab to suggestions, Enter to select, Tab to textarea, Enter to submit',
      contrastRatio: '4.5:1 text, 3:1 borders',
      focusVisible: true,
      reducedMotion: false,
    },
    responsive: {
      strategy: 'mobile-first',
      breakpoints: ['max-w-2xl centers on desktop'],
    },
    quality: {
      antiGeneric: ['Suggestion chips with hover state', 'Auto-resize textarea'],
      inspirationSource: 'LangUI prompt input patterns',
      craftDetails: ['Rounded pill suggestions', 'Embedded send button', 'Placeholder guidance'],
    },
  },
  {
    id: 'ai-error-retry',
    name: 'AI Error with Retry',
    category: 'molecule',
    type: 'ai-patterns',
    variant: 'error-state',
    tags: ['ai', 'error', 'retry', 'fallback', 'status'],
    mood: ['professional', 'calm'] as const,
    industry: ['saas', 'devtools', 'general'] as const,
    visualStyles: ['linear-modern', 'soft-depth'] as const,
    jsx: `<div className="flex gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-4" role="alert">
  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10">
    <svg className="h-4 w-4 text-destructive" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
  </div>
  <div className="flex-1">
    <p className="text-sm font-medium text-foreground">Generation failed</p>
    <p className="mt-0.5 text-sm text-muted-foreground">The model couldn't complete the response. This may be due to rate limiting or context length.</p>
    <div className="mt-3 flex gap-2">
      <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90" type="button">
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" /></svg>
        Retry
      </button>
      <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground" type="button">Edit prompt</button>
    </div>
  </div>
</div>`,
    tailwindClasses: {
      container: 'flex gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-4',
      icon: 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10',
      title: 'text-sm font-medium text-foreground',
      message: 'mt-0.5 text-sm text-muted-foreground',
      retryButton:
        'inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground',
      editButton:
        'inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground',
    },
    a11y: {
      roles: ['alert'],
      ariaAttributes: ['role'],
      keyboardNav: 'Tab to Retry and Edit prompt buttons',
      contrastRatio: '4.5:1 text, 3:1 destructive border',
      focusVisible: true,
      reducedMotion: false,
    },
    responsive: {
      strategy: 'mobile-first',
      breakpoints: ['full-width on mobile'],
    },
    quality: {
      antiGeneric: ['Specific error context', 'Dual action buttons'],
      inspirationSource: 'LangUI error state patterns',
      craftDetails: ['Destructive color theming', 'Icon + text hierarchy', 'Retry with visual icon'],
    },
  },
  {
    id: 'ai-model-comparison',
    name: 'AI Model Comparison Side-by-Side',
    category: 'molecule',
    type: 'ai-patterns',
    variant: 'comparison',
    tags: ['ai', 'model', 'comparison', 'side-by-side', 'evaluation'],
    mood: ['professional', 'minimal'] as const,
    industry: ['saas', 'devtools'] as const,
    visualStyles: ['linear-modern', 'dark-premium'] as const,
    jsx: `<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
  <div className="rounded-lg border border-border bg-card">
    <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary" aria-hidden="true"></div>
        <span className="text-sm font-medium text-foreground">Claude Sonnet</span>
      </div>
      <span className="text-xs text-muted-foreground">1.2s</span>
    </div>
    <div className="p-4 text-sm text-foreground leading-relaxed">
      <p>Here's a clean implementation using the repository pattern with dependency injection for testability.</p>
    </div>
    <div className="flex items-center gap-3 border-t border-border px-4 py-2">
      <span className="text-xs text-muted-foreground">847 tokens</span>
      <div className="flex gap-1 ml-auto" role="group" aria-label="Rate response">
        <button className="rounded p-1 text-muted-foreground hover:text-foreground" type="button" aria-label="Good response"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m7.72 2.52-1.04-.26a4.5 4.5 0 0 0-1.08-.13H5.82" /></svg></button>
        <button className="rounded p-1 text-muted-foreground hover:text-foreground" type="button" aria-label="Bad response"><svg className="h-3.5 w-3.5 rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m7.72 2.52-1.04-.26a4.5 4.5 0 0 0-1.08-.13H5.82" /></svg></button>
      </div>
    </div>
  </div>
  <div className="rounded-lg border border-border bg-card">
    <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-accent-foreground" aria-hidden="true"></div>
        <span className="text-sm font-medium text-foreground">GPT-4o</span>
      </div>
      <span className="text-xs text-muted-foreground">2.1s</span>
    </div>
    <div className="p-4 text-sm text-foreground leading-relaxed">
      <p>I'd recommend a service layer approach with clear separation of concerns and typed error handling.</p>
    </div>
    <div className="flex items-center gap-3 border-t border-border px-4 py-2">
      <span className="text-xs text-muted-foreground">1,203 tokens</span>
      <div className="flex gap-1 ml-auto" role="group" aria-label="Rate response">
        <button className="rounded p-1 text-muted-foreground hover:text-foreground" type="button" aria-label="Good response"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m7.72 2.52-1.04-.26a4.5 4.5 0 0 0-1.08-.13H5.82" /></svg></button>
        <button className="rounded p-1 text-muted-foreground hover:text-foreground" type="button" aria-label="Bad response"><svg className="h-3.5 w-3.5 rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m7.72 2.52-1.04-.26a4.5 4.5 0 0 0-1.08-.13H5.82" /></svg></button>
      </div>
    </div>
  </div>
</div>`,
    tailwindClasses: {
      grid: 'grid grid-cols-1 gap-4 md:grid-cols-2',
      card: 'rounded-lg border border-border bg-card',
      header: 'flex items-center justify-between border-b border-border px-4 py-2.5',
      indicator: 'h-2 w-2 rounded-full',
      content: 'p-4 text-sm text-foreground leading-relaxed',
      footer: 'flex items-center gap-3 border-t border-border px-4 py-2',
      rateButton: 'rounded p-1 text-muted-foreground hover:text-foreground',
    },
    a11y: {
      roles: ['group'],
      ariaAttributes: ['aria-label', 'aria-hidden'],
      keyboardNav: 'Tab between cards and rating buttons',
      contrastRatio: '4.5:1 text, 3:1 indicators',
      focusVisible: true,
      reducedMotion: false,
    },
    responsive: {
      strategy: 'mobile-first',
      breakpoints: ['grid-cols-1 mobile, md:grid-cols-2 desktop'],
    },
    quality: {
      antiGeneric: ['Color-coded model indicators', 'Inline token counts and latency'],
      inspirationSource: 'LangUI model comparison patterns',
      craftDetails: ['Side-by-side layout', 'Response rating', 'Latency display'],
    },
  },
  {
    id: 'ai-conversation-sidebar',
    name: 'AI Conversation History Sidebar',
    category: 'molecule',
    type: 'ai-patterns',
    variant: 'sidebar',
    tags: ['ai', 'conversation', 'history', 'sidebar', 'navigation'],
    mood: ['professional', 'minimal'] as const,
    industry: ['saas', 'devtools', 'general'] as const,
    visualStyles: ['linear-modern', 'dark-premium'] as const,
    jsx: `<nav className="flex h-full w-64 flex-col border-r border-border bg-card" aria-label="Conversation history">
  <div className="flex items-center justify-between p-4">
    <h2 className="text-sm font-semibold text-foreground">Conversations</h2>
    <button className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" type="button" aria-label="New conversation">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
    </button>
  </div>
  <div className="flex-1 overflow-y-auto px-2">
    <div className="mb-2">
      <span className="px-2 text-xs font-medium text-muted-foreground">Today</span>
    </div>
    <button className="mb-0.5 flex w-full items-center gap-2 rounded-md bg-accent px-3 py-2 text-left text-sm text-foreground" type="button" aria-current="true">
      <svg className="h-3.5 w-3.5 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>
      <span className="truncate">Building a dashboard layout</span>
    </button>
    <button className="mb-0.5 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" type="button">
      <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>
      <span className="truncate">Authentication flow setup</span>
    </button>
    <div className="mb-2 mt-4">
      <span className="px-2 text-xs font-medium text-muted-foreground">Yesterday</span>
    </div>
    <button className="mb-0.5 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" type="button">
      <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>
      <span className="truncate">API error handling patterns</span>
    </button>
  </div>
</nav>`,
    tailwindClasses: {
      nav: 'flex h-full w-64 flex-col border-r border-border bg-card',
      header: 'flex items-center justify-between p-4',
      newButton: 'flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground',
      section: 'px-2 text-xs font-medium text-muted-foreground',
      active: 'mb-0.5 flex w-full items-center gap-2 rounded-md bg-accent px-3 py-2 text-left text-sm text-foreground',
      item: 'mb-0.5 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted-foreground',
    },
    a11y: {
      roles: ['navigation'],
      ariaAttributes: ['aria-label', 'aria-current'],
      keyboardNav: 'Tab through conversations, Enter to select, New conversation button accessible',
      contrastRatio: '4.5:1 text, 3:1 active state',
      focusVisible: true,
      reducedMotion: false,
    },
    responsive: {
      strategy: 'mobile-first',
      breakpoints: ['hidden on mobile, visible md:'],
    },
    quality: {
      antiGeneric: ['Grouped by time period', 'Active state indicator', 'Truncated titles'],
      inspirationSource: 'LangUI conversation sidebar patterns',
      craftDetails: ['Temporal grouping', 'Chat icon per item', 'New conversation CTA'],
    },
  },
  {
    id: 'ai-response-rating',
    name: 'AI Response Feedback Rating',
    category: 'molecule',
    type: 'ai-patterns',
    variant: 'rating',
    tags: ['ai', 'feedback', 'rating', 'thumbs', 'evaluation'],
    mood: ['professional', 'minimal'] as const,
    industry: ['saas', 'devtools', 'general'] as const,
    visualStyles: ['linear-modern', 'soft-depth'] as const,
    jsx: `<div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
  <span className="text-xs text-muted-foreground">Was this helpful?</span>
  <div className="flex gap-1" role="group" aria-label="Rate this response">
    <button className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" type="button" aria-label="Helpful">
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m7.72 2.52-1.04-.26a4.5 4.5 0 0 0-1.08-.13H5.82" /></svg>
      Yes
    </button>
    <button className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" type="button" aria-label="Not helpful">
      <svg className="h-3.5 w-3.5 rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m7.72 2.52-1.04-.26a4.5 4.5 0 0 0-1.08-.13H5.82" /></svg>
      No
    </button>
  </div>
  <button className="ml-auto text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline" type="button">Report</button>
</div>`,
    tailwindClasses: {
      container: 'flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2',
      label: 'text-xs text-muted-foreground',
      button:
        'flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
      report: 'ml-auto text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline',
    },
    a11y: {
      roles: ['group'],
      ariaAttributes: ['aria-label'],
      keyboardNav: 'Tab between Yes, No, and Report buttons',
      contrastRatio: '4.5:1 text, 3:1 interactive elements',
      focusVisible: true,
      reducedMotion: false,
    },
    responsive: {
      strategy: 'mobile-first',
      breakpoints: ['flex-wrap on narrow screens'],
    },
    quality: {
      antiGeneric: ['Thumbs up/down with text labels', 'Report option'],
      inspirationSource: 'LangUI feedback patterns',
      craftDetails: ['Compact inline layout', 'Focus ring styling', 'Hover transitions'],
    },
  },
  {
    id: 'ai-loading-skeleton',
    name: 'AI Response Loading Skeleton',
    category: 'molecule',
    type: 'ai-patterns',
    variant: 'loading',
    tags: ['ai', 'loading', 'skeleton', 'placeholder', 'streaming'],
    mood: ['professional', 'minimal'] as const,
    industry: ['saas', 'devtools', 'general'] as const,
    visualStyles: ['linear-modern', 'soft-depth'] as const,
    jsx: `<div className="flex gap-3" role="status" aria-label="Loading AI response">
  <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-muted"></div>
  <div className="flex-1 space-y-3 pt-1">
    <div className="space-y-2">
      <div className="h-3 w-3/4 animate-pulse rounded bg-muted"></div>
      <div className="h-3 w-full animate-pulse rounded bg-muted"></div>
      <div className="h-3 w-5/6 animate-pulse rounded bg-muted"></div>
    </div>
    <div className="flex gap-2">
      <div className="h-6 w-16 animate-pulse rounded-md bg-muted"></div>
      <div className="h-6 w-20 animate-pulse rounded-md bg-muted"></div>
    </div>
  </div>
  <span className="sr-only">Generating response...</span>
</div>`,
    tailwindClasses: {
      container: 'flex gap-3',
      avatar: 'h-8 w-8 shrink-0 animate-pulse rounded-full bg-muted',
      line: 'h-3 animate-pulse rounded bg-muted',
      action: 'h-6 animate-pulse rounded-md bg-muted',
    },
    a11y: {
      roles: ['status'],
      ariaAttributes: ['aria-label'],
      htmlAttributes: ['sr-only announcement'],
      keyboardNav: 'No interaction during loading',
      contrastRatio: 'N/A (decorative skeleton)',
      focusVisible: false,
      reducedMotion: true,
    },
    responsive: {
      strategy: 'mobile-first',
      breakpoints: ['full-width on all screens'],
    },
    quality: {
      antiGeneric: ['Varies line widths for natural look', 'Includes action button skeletons'],
      inspirationSource: 'LangUI loading skeleton patterns',
      craftDetails: ['Three varying-width lines', 'Avatar placeholder', 'Screen reader announcement'],
    },
  },
  {
    id: 'ai-prompt-templates',
    name: 'AI Prompt Templates Gallery',
    category: 'molecule',
    type: 'ai-patterns',
    variant: 'templates',
    tags: ['ai', 'prompt', 'templates', 'gallery', 'presets'],
    mood: ['professional', 'calm', 'minimal'] as const,
    industry: ['saas', 'devtools', 'general'] as const,
    visualStyles: ['linear-modern', 'soft-depth', 'bento-grid'] as const,
    jsx: `<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
  <button className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-sm" type="button">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" /></svg>
    </div>
    <span className="text-sm font-medium text-foreground">Code Review</span>
    <span className="text-xs text-muted-foreground line-clamp-2">Analyze code for bugs, performance issues, and suggest improvements</span>
  </button>
  <button className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-sm" type="button">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
    </div>
    <span className="text-sm font-medium text-foreground">Documentation</span>
    <span className="text-xs text-muted-foreground line-clamp-2">Generate comprehensive documentation with examples and type signatures</span>
  </button>
  <button className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-sm" type="button">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
    </div>
    <span className="text-sm font-medium text-foreground">Test Generation</span>
    <span className="text-xs text-muted-foreground line-clamp-2">Create unit tests with edge cases, mocks, and full coverage</span>
  </button>
</div>`,
    tailwindClasses: {
      grid: 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3',
      card: 'group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-sm',
      icon: 'flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary',
      title: 'text-sm font-medium text-foreground',
      description: 'text-xs text-muted-foreground line-clamp-2',
    },
    a11y: {
      roles: ['button'],
      ariaAttributes: [],
      keyboardNav: 'Tab between template cards, Enter/Space to select',
      contrastRatio: '4.5:1 text, 3:1 icons',
      focusVisible: true,
      reducedMotion: false,
    },
    responsive: {
      strategy: 'mobile-first',
      breakpoints: ['1 col mobile, sm:2 cols, lg:3 cols'],
    },
    quality: {
      antiGeneric: ['Distinct icons per template', 'Line-clamped descriptions'],
      inspirationSource: 'LangUI prompt template gallery',
      craftDetails: ['Hover border color change', 'Icon background tinting', 'Responsive grid'],
    },
  },
  {
    id: 'ai-settings-panel',
    name: 'AI Settings Panel',
    category: 'molecule',
    type: 'ai-patterns',
    variant: 'settings',
    tags: ['ai', 'settings', 'temperature', 'configuration', 'parameters'],
    mood: ['professional', 'minimal'] as const,
    industry: ['saas', 'devtools'] as const,
    visualStyles: ['linear-modern', 'soft-depth'] as const,
    jsx: `<div className="w-72 rounded-lg border border-border bg-card p-4">
  <h3 className="text-sm font-semibold text-foreground">Model Settings</h3>
  <div className="mt-4 space-y-4">
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor="temperature" className="text-xs text-muted-foreground">Temperature</label>
        <span className="text-xs font-mono text-foreground">0.7</span>
      </div>
      <input id="temperature" type="range" min="0" max="2" step="0.1" defaultValue="0.7" className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary" />
    </div>
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor="max-tokens" className="text-xs text-muted-foreground">Max Tokens</label>
        <span className="text-xs font-mono text-foreground">4096</span>
      </div>
      <input id="max-tokens" type="range" min="256" max="8192" step="256" defaultValue="4096" className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary" />
    </div>
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor="top-p" className="text-xs text-muted-foreground">Top P</label>
        <span className="text-xs font-mono text-foreground">0.9</span>
      </div>
      <input id="top-p" type="range" min="0" max="1" step="0.05" defaultValue="0.9" className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary" />
    </div>
    <div className="flex items-center justify-between pt-2 border-t border-border">
      <label htmlFor="stream" className="text-xs text-muted-foreground">Stream response</label>
      <button id="stream" role="switch" aria-checked="true" className="relative inline-flex h-5 w-9 items-center rounded-full bg-primary transition-colors" type="button">
        <span className="inline-block h-3.5 w-3.5 translate-x-4 rounded-full bg-primary-foreground transition-transform" aria-hidden="true"></span>
      </button>
    </div>
  </div>
</div>`,
    tailwindClasses: {
      container: 'w-72 rounded-lg border border-border bg-card p-4',
      title: 'text-sm font-semibold text-foreground',
      label: 'text-xs text-muted-foreground',
      value: 'text-xs font-mono text-foreground',
      slider: 'mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary',
      toggle: 'relative inline-flex h-5 w-9 items-center rounded-full bg-primary transition-colors',
      toggleDot: 'inline-block h-3.5 w-3.5 translate-x-4 rounded-full bg-primary-foreground transition-transform',
    },
    a11y: {
      roles: ['switch'],
      ariaAttributes: ['aria-checked', 'aria-hidden'],
      htmlAttributes: ['htmlFor', 'id'],
      keyboardNav: 'Tab between sliders and toggle, Space toggles switch',
      contrastRatio: '4.5:1 labels, 3:1 slider track',
      focusVisible: true,
      reducedMotion: false,
    },
    responsive: {
      strategy: 'mobile-first',
      breakpoints: ['fixed width 18rem'],
    },
    quality: {
      antiGeneric: ['Live value display next to labels', 'Properly labeled form controls'],
      inspirationSource: 'LangUI AI settings patterns',
      craftDetails: ['Monospace values', 'Range inputs with accent color', 'Toggle switch pattern'],
    },
  },
  {
    id: 'ai-token-counter',
    name: 'AI Inline Token Counter',
    category: 'molecule',
    type: 'ai-patterns',
    variant: 'counter',
    tags: ['ai', 'tokens', 'counter', 'limit', 'input'],
    mood: ['professional', 'minimal'] as const,
    industry: ['saas', 'devtools'] as const,
    visualStyles: ['linear-modern', 'dark-premium'] as const,
    jsx: `<div className="flex items-center gap-2 text-xs">
  <div className="flex items-center gap-1.5">
    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
      <div className="h-full w-2/3 rounded-full bg-primary transition-all" role="progressbar" aria-valuenow={67} aria-valuemin={0} aria-valuemax={100} aria-label="Token usage"></div>
    </div>
    <span className="font-mono text-muted-foreground"><span className="text-foreground">2,731</span> / 4,096</span>
  </div>
  <span className="text-muted-foreground">tokens</span>
</div>`,
    tailwindClasses: {
      container: 'flex items-center gap-2 text-xs',
      progressBar: 'h-1.5 w-24 overflow-hidden rounded-full bg-muted',
      progressFill: 'h-full rounded-full bg-primary transition-all',
      count: 'font-mono text-muted-foreground',
      current: 'text-foreground',
    },
    a11y: {
      roles: ['progressbar'],
      ariaAttributes: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-label'],
      keyboardNav: 'Static display, no interaction',
      contrastRatio: '4.5:1 text',
      focusVisible: false,
      reducedMotion: false,
    },
    responsive: {
      strategy: 'mobile-first',
      breakpoints: ['inline, fits any width'],
    },
    quality: {
      antiGeneric: ['Progress bar with smooth transition', 'Current/max format'],
      inspirationSource: 'LangUI token counter patterns',
      craftDetails: ['Monospace numerals', 'Color-coded current value', 'Compact inline layout'],
    },
  },
];
