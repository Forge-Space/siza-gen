import type { IGoldenPrompt } from './types.js';

const t = (overrides: Partial<IGoldenPrompt['expectedTraits']>) => ({
  hasAria: false,
  hasResponsive: false,
  hasDarkMode: false,
  hasSemanticHtml: false,
  hasErrorHandling: false,
  hasKeyboardNav: false,
  ...overrides,
});

export const goldenPrompts: IGoldenPrompt[] = [
  // ── Simple (4) ──────────────────────────────
  {
    id: 'simple-01',
    prompt:
      'A button component with loading spinner state, ' +
      'disabled styling, and 3 size variants (sm, md, lg)',
    componentType: 'button',
    complexity: 'simple',
    expectedTraits: t({
      hasAria: true,
      hasSemanticHtml: true,
    }),
    minAcceptableScore: 6,
  },
  {
    id: 'simple-02',
    prompt:
      'An avatar component with image, fallback initials, ' +
      'online/offline status indicator, and 4 sizes',
    componentType: 'avatar',
    complexity: 'simple',
    expectedTraits: t({
      hasAria: true,
    }),
    minAcceptableScore: 6,
  },
  {
    id: 'simple-03',
    prompt:
      'A badge component with 5 color variants ' +
      '(success, warning, error, info, neutral) and optional dismiss button',
    componentType: 'badge',
    complexity: 'simple',
    expectedTraits: t({
      hasAria: true,
      hasSemanticHtml: true,
    }),
    minAcceptableScore: 6,
  },
  {
    id: 'simple-04',
    prompt:
      'A toggle switch with on/off states, label text, ' +
      'and disabled state using Tailwind CSS',
    componentType: 'toggle',
    complexity: 'simple',
    expectedTraits: t({
      hasAria: true,
      hasKeyboardNav: true,
    }),
    minAcceptableScore: 6,
  },

  // ── Medium (4) ──────────────────────────────
  {
    id: 'medium-01',
    prompt:
      'A login form with email and password fields, ' +
      'client-side validation, show/hide password toggle, ' +
      'error messages, and a submit button with loading state',
    componentType: 'form',
    complexity: 'medium',
    expectedTraits: t({
      hasAria: true,
      hasSemanticHtml: true,
      hasErrorHandling: true,
      hasKeyboardNav: true,
    }),
    minAcceptableScore: 6.5,
  },
  {
    id: 'medium-02',
    prompt:
      'A data table with column sorting, row selection via checkboxes, ' +
      'pagination controls, and a search filter input',
    componentType: 'table',
    complexity: 'medium',
    expectedTraits: t({
      hasAria: true,
      hasSemanticHtml: true,
      hasResponsive: true,
      hasKeyboardNav: true,
    }),
    minAcceptableScore: 6.5,
  },
  {
    id: 'medium-03',
    prompt:
      'A search input with autocomplete dropdown, ' +
      'keyboard navigation for suggestions, debounced input, ' +
      'loading indicator, and "no results" empty state',
    componentType: 'search',
    complexity: 'medium',
    expectedTraits: t({
      hasAria: true,
      hasErrorHandling: true,
      hasKeyboardNav: true,
    }),
    minAcceptableScore: 6.5,
  },
  {
    id: 'medium-04',
    prompt:
      'A file upload zone with drag-and-drop, ' +
      'progress bar per file, file type validation, ' +
      'max size limit, and remove uploaded file button',
    componentType: 'upload',
    complexity: 'medium',
    expectedTraits: t({
      hasAria: true,
      hasErrorHandling: true,
      hasSemanticHtml: true,
    }),
    minAcceptableScore: 6.5,
  },

  // ── Complex (4) ─────────────────────────────
  {
    id: 'complex-01',
    prompt:
      'A dashboard layout with a stat cards row (revenue, users, ' +
      'orders, conversion rate), a line chart placeholder, ' +
      'a recent activity list, and a sidebar navigation',
    componentType: 'dashboard',
    complexity: 'complex',
    expectedTraits: t({
      hasSemanticHtml: true,
      hasResponsive: true,
      hasDarkMode: true,
    }),
    minAcceptableScore: 7,
  },
  {
    id: 'complex-02',
    prompt:
      'A multi-step wizard form with 4 steps: personal info, ' +
      'address, payment method, and review/confirm. ' +
      'Include step indicator, back/next navigation, ' +
      'and per-step validation before advancing',
    componentType: 'wizard',
    complexity: 'complex',
    expectedTraits: t({
      hasAria: true,
      hasSemanticHtml: true,
      hasErrorHandling: true,
      hasKeyboardNav: true,
      hasResponsive: true,
    }),
    minAcceptableScore: 7,
  },
  {
    id: 'complex-03',
    prompt:
      'A kanban board with 3 columns (To Do, In Progress, Done), ' +
      'draggable cards showing title and assignee avatar, ' +
      'add card button per column, and column card count badges',
    componentType: 'kanban',
    complexity: 'complex',
    expectedTraits: t({
      hasAria: true,
      hasSemanticHtml: true,
      hasResponsive: true,
    }),
    minAcceptableScore: 7,
  },
  {
    id: 'complex-04',
    prompt:
      'A real-time chat interface with message bubbles ' +
      '(sent vs received styling), typing indicator, ' +
      'timestamp grouping, auto-scroll to bottom, ' +
      'and a message input with send button and emoji picker trigger',
    componentType: 'chat',
    complexity: 'complex',
    expectedTraits: t({
      hasAria: true,
      hasSemanticHtml: true,
      hasResponsive: true,
      hasKeyboardNav: true,
    }),
    minAcceptableScore: 7,
  },

  // ── A11y-Focused (4) ────────────────────────
  {
    id: 'a11y-01',
    prompt:
      'A navigation menu fully operable by screen readers. ' +
      'Include aria-current for active page, landmark roles, ' +
      'skip-to-content link, and ARIA-expanded for submenus',
    componentType: 'nav',
    complexity: 'a11y-focused',
    expectedTraits: t({
      hasAria: true,
      hasSemanticHtml: true,
      hasKeyboardNav: true,
    }),
    minAcceptableScore: 7.5,
  },
  {
    id: 'a11y-02',
    prompt:
      'A date picker that is fully keyboard-operable: ' +
      'arrow keys to navigate days, Enter to select, ' +
      'Escape to close, Home/End for first/last day of month, ' +
      'and live region announcing the selected date',
    componentType: 'datepicker',
    complexity: 'a11y-focused',
    expectedTraits: t({
      hasAria: true,
      hasKeyboardNav: true,
      hasSemanticHtml: true,
    }),
    minAcceptableScore: 7.5,
  },
  {
    id: 'a11y-03',
    prompt:
      'A notification toast system with ARIA live region ' +
      '(polite for info, assertive for errors), auto-dismiss timer, ' +
      'manual dismiss button, and stacking for multiple toasts',
    componentType: 'toast',
    complexity: 'a11y-focused',
    expectedTraits: t({
      hasAria: true,
      hasSemanticHtml: true,
      hasKeyboardNav: true,
      hasErrorHandling: true,
    }),
    minAcceptableScore: 7.5,
  },
  {
    id: 'a11y-04',
    prompt:
      'A bar chart component that is accessible to color-blind users. ' +
      'Use patterns/textures in addition to color, include ' +
      'data table alternative, screen reader description, ' +
      'and high-contrast mode support',
    componentType: 'chart',
    complexity: 'a11y-focused',
    expectedTraits: t({
      hasAria: true,
      hasSemanticHtml: true,
      hasDarkMode: true,
    }),
    minAcceptableScore: 7.5,
  },

  // ── AI-Specific (4) ─────────────────────────
  {
    id: 'ai-01',
    prompt:
      'An AI prompt input with character/token counter, ' +
      'model selector dropdown, temperature slider, ' +
      'submit button with loading state, and Shift+Enter for newline',
    componentType: 'ai-input',
    complexity: 'ai-specific',
    expectedTraits: t({
      hasAria: true,
      hasKeyboardNav: true,
      hasSemanticHtml: true,
    }),
    minAcceptableScore: 7,
  },
  {
    id: 'ai-02',
    prompt:
      'A model comparison card showing two AI responses side-by-side ' +
      'with model name, latency, token count, cost, ' +
      'and thumbs up/down rating buttons for each',
    componentType: 'ai-comparison',
    complexity: 'ai-specific',
    expectedTraits: t({
      hasAria: true,
      hasSemanticHtml: true,
      hasResponsive: true,
    }),
    minAcceptableScore: 7,
  },
  {
    id: 'ai-03',
    prompt:
      'A streaming AI response viewer that displays tokens ' +
      'as they arrive with a blinking cursor, includes a ' +
      'stop generation button, copy-to-clipboard, ' +
      'and markdown rendering for code blocks',
    componentType: 'ai-stream',
    complexity: 'ai-specific',
    expectedTraits: t({
      hasAria: true,
      hasKeyboardNav: true,
      hasSemanticHtml: true,
    }),
    minAcceptableScore: 7,
  },
  {
    id: 'ai-04',
    prompt:
      'A conversation history sidebar listing past AI chats ' +
      'with title, date, message count, pinned conversations, ' +
      'search/filter, and swipe-to-delete on mobile',
    componentType: 'ai-sidebar',
    complexity: 'ai-specific',
    expectedTraits: t({
      hasSemanticHtml: true,
      hasResponsive: true,
      hasKeyboardNav: true,
    }),
    minAcceptableScore: 7,
  },
];
