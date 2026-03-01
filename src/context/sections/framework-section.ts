const FRAMEWORK_CONVENTIONS: Record<string, string> = {
  react: [
    'Framework conventions (React):',
    '- Functional components with TypeScript props interface',
    '- useState/useEffect for state, not class components',
    '- Destructure props in function signature',
    '- Use className for styling (Tailwind or CSS modules)',
    '- Forward refs with React.forwardRef when appropriate',
    '- Memoize expensive computations with useMemo',
  ].join('\n'),
  vue: [
    'Framework conventions (Vue 3):',
    '- <script setup lang="ts"> with defineProps/defineEmits',
    '- Composition API, not Options API',
    '- Use ref() and computed() for reactivity',
    '- Scoped styles with <style scoped>',
    '- Use v-bind for dynamic attributes',
    '- Emit typed events with defineEmits<{...}>()',
  ].join('\n'),
  angular: [
    'Framework conventions (Angular):',
    '- Standalone components with @Component decorator',
    '- Use signals for reactive state',
    '- OnPush change detection strategy',
    '- Template-driven or reactive forms as appropriate',
    '- Use @Input() and @Output() decorators',
    '- Host binding for component-level styles',
  ].join('\n'),
  svelte: [
    'Framework conventions (Svelte 5):',
    '- Use $state and $derived runes for reactivity',
    '- Export props with $props() rune',
    '- Scoped styles in <style> block',
    '- Use {#if}, {#each} template syntax',
    '- Event handlers with on:event directive',
    '- Slot-based composition with <slot>',
  ].join('\n'),
  html: [
    'Framework conventions (HTML5):',
    '- Semantic HTML elements (header, main, nav, section)',
    '- CSS custom properties for theming',
    '- Progressive enhancement approach',
    '- Vanilla JS only when needed, no frameworks',
    '- BEM naming convention for CSS classes',
    '- Mobile-first media queries',
  ].join('\n'),
};

export function buildFrameworkSection(framework: string): string {
  return FRAMEWORK_CONVENTIONS[framework] ?? '';
}
