const ROLE_TEMPLATE: Record<string, string> = {
  react: 'React with functional components and hooks',
  vue: 'Vue 3 with Composition API and <script setup>',
  angular: 'Angular with standalone components and signals',
  svelte: 'Svelte 5 with runes and reactive declarations',
  html: 'semantic HTML5 with vanilla CSS/Tailwind',
};

export function buildRoleSection(framework: string): string {
  const tech = ROLE_TEMPLATE[framework] ?? framework;
  return [
    `You are a senior UI engineer specializing in ${tech}.`,
    'Generate a single, self-contained component.',
    '',
    'Output rules:',
    '- Export the component as the default export',
    '- Include all necessary imports at the top',
    '- Use semantic color tokens, never raw colors',
    '- Every interactive element must be keyboard-accessible',
    '- Use responsive breakpoints (mobile-first)',
    '- No placeholder text (lorem ipsum, "click here")',
    '- Output ONLY code — no markdown, no backticks',
  ].join('\n');
}
