/**
 * PrimeVue Component Library Integration
 */

export * from './templates.js';

import type { IGeneratedFile, IDesignContext, Framework } from '../../types.js';
import { generatePrimeVueComponent, getPrimeVueTemplates } from './templates.js';

export interface PrimeVueSetupOptions {
  framework: Framework;
  projectName: string;
  components?: string[];
  designContext?: IDesignContext;
  customizations?: Record<string, unknown>;
}

export function setupPrimeVueProject(options: PrimeVueSetupOptions): IGeneratedFile[] {
  const files: IGeneratedFile[] = [];

  // Base package.json for Vue + PrimeVue
  files.push({
    path: 'package.json',
    content: JSON.stringify(
      {
        name: options.projectName,
        version: '0.1.0',
        private: true,
        scripts: {
          dev: 'vite',
          build: 'vue-tsc && vite build',
          preview: 'vite preview',
          'type-check': 'vue-tsc --noEmit',
        },
        dependencies: {
          vue: '^3.4.0',
          primevue: '^4.0.0',
          '@primevue/themes': '^4.0.0',
          primeicons: '^7.0.0',
        },
        devDependencies: {
          typescript: '^5.0.0',
          vite: '^5.0.0',
          '@vitejs/plugin-vue': '^5.0.0',
          'vue-tsc': '^2.0.0',
          '@types/node': '^20',
        },
      },
      null,
      2
    ),
  });

  // main.ts — register PrimeVue
  files.push({
    path: 'src/main.ts',
    content: `import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ToastService from 'primevue/toastservice'
import 'primeicons/primeicons.css'
import App from './App.vue'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark',
    },
  },
})
app.use(ToastService)

app.mount('#app')
`,
  });

  // App.vue shell
  files.push({
    path: 'src/App.vue',
    content: `<script setup lang="ts">
import AppToast from './components/ui/AppToast.vue'
</script>

<template>
  <AppToast />
  <RouterView />
</template>
`,
  });

  // Generate requested components
  if (options.components) {
    for (const name of options.components) {
      try {
        files.push(
          ...generatePrimeVueComponent(name, options.designContext ?? ({} as IDesignContext), options.customizations)
        );
      } catch {
        // skip unknown components
      }
    }
  }

  return files;
}

export function getAvailablePrimeVueComponents(): string[] {
  return getPrimeVueTemplates()
    .map((t) => t.name)
    .concat([
      'AutoComplete',
      'Calendar',
      'Checkbox',
      'Chips',
      'ColorPicker',
      'Dropdown',
      'Editor',
      'FileUpload',
      'InputMask',
      'InputNumber',
      'InputSwitch',
      'Knob',
      'Listbox',
      'MultiSelect',
      'Password',
      'RadioButton',
      'Rating',
      'SelectButton',
      'Slider',
      'Textarea',
      'ToggleButton',
      'TreeSelect',
      'TriStateCheckbox',
      'Accordion',
      'Card',
      'Carousel',
      'DeferredContent',
      'Divider',
      'Fieldset',
      'Image',
      'Panel',
      'ScrollPanel',
      'Splitter',
      'TabView',
      'Tag',
      'Timeline',
      'Tree',
      'TreeTable',
      'VirtualScroller',
      'ConfirmDialog',
      'ConfirmPopup',
      'DynamicDialog',
      'OverlayPanel',
      'Sidebar',
      'Tooltip',
      'Breadcrumb',
      'ContextMenu',
      'Dock',
      'MegaMenu',
      'Menubar',
      'PanelMenu',
      'Steps',
      'TabMenu',
      'TieredMenu',
      'Chart',
      'OrganizationChart',
      'ProgressBar',
      'ProgressSpinner',
      'ScrollTop',
      'Skeleton',
      'Terminal',
    ]);
}

export function getAvailablePrimeVuePatterns(): string[] {
  return [
    'AdminDashboard',
    'DataTablePage',
    'LoginForm',
    'RegistrationForm',
    'UserProfile',
    'SettingsPanel',
    'NotificationCenter',
    'SearchAndFilter',
    'WizardForm',
    'FileManager',
    'ChatInterface',
    'KanbanBoard',
  ];
}
