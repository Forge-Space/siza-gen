/**
 * PrimeVue Component Templates
 */

import type { IGeneratedFile, IDesignContext } from '../../types.js';

export interface PrimeVueTemplate {
  name: string;
  description: string;
  category: 'form' | 'navigation' | 'feedback' | 'layout' | 'data' | 'overlay';
  packages: string[];
  files: PrimeVueTemplateFile[];
}

export interface PrimeVueTemplateFile {
  path: string;
  content: string;
  type: 'component' | 'hook' | 'utility' | 'test';
}

export const buttonTemplate: PrimeVueTemplate = {
  name: 'Button',
  description: 'PrimeVue Button with variants and icons',
  category: 'form',
  packages: ['primevue', '@primevue/themes'],
  files: [
    {
      path: 'components/ui/AppButton.vue',
      type: 'component',
      content: `<script setup lang="ts">
import Button from 'primevue/button'

interface Props {
  label?: string
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast'
  variant?: 'outlined' | 'text' | 'link'
  icon?: string
  loading?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  severity: 'primary',
})
</script>

<template>
  <Button v-bind="$props" />
</template>`,
    },
  ],
};

export const inputTextTemplate: PrimeVueTemplate = {
  name: 'InputText',
  description: 'PrimeVue InputText field with label and validation',
  category: 'form',
  packages: ['primevue'],
  files: [
    {
      path: 'components/ui/AppInput.vue',
      type: 'component',
      content: `<script setup lang="ts">
import InputText from 'primevue/inputtext'
import { useId } from 'vue'

interface Props {
  label?: string
  placeholder?: string
  invalid?: boolean
  helpText?: string
}

const props = defineProps<Props>()
const model = defineModel<string>()
const id = useId()
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="props.label" :for="id" class="font-medium text-sm">
      {{ props.label }}
    </label>
    <InputText
      :id="id"
      v-model="model"
      :placeholder="props.placeholder"
      :invalid="props.invalid"
      class="w-full"
    />
    <small v-if="props.helpText" :class="props.invalid ? 'text-red-500' : 'text-muted-foreground'">
      {{ props.helpText }}
    </small>
  </div>
</template>`,
    },
  ],
};

export const dialogTemplate: PrimeVueTemplate = {
  name: 'Dialog',
  description: 'PrimeVue Dialog / modal with header and footer',
  category: 'overlay',
  packages: ['primevue'],
  files: [
    {
      path: 'components/ui/AppDialog.vue',
      type: 'component',
      content: `<script setup lang="ts">
import Dialog from 'primevue/dialog'

interface Props {
  header?: string
  modal?: boolean
  closable?: boolean
}

withDefaults(defineProps<Props>(), {
  modal: true,
  closable: true,
})

const visible = defineModel<boolean>({ default: false })
</script>

<template>
  <Dialog v-model:visible="visible" v-bind="$props">
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <slot />
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </Dialog>
</template>`,
    },
  ],
};

export const dataTableTemplate: PrimeVueTemplate = {
  name: 'DataTable',
  description: 'PrimeVue DataTable with sorting, filtering and pagination',
  category: 'data',
  packages: ['primevue'],
  files: [
    {
      path: 'components/ui/AppDataTable.vue',
      type: 'component',
      content: `<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { ref } from 'vue'

interface Column {
  field: string
  header: string
  sortable?: boolean
}

interface Props {
  data: Record<string, unknown>[]
  columns: Column[]
  paginator?: boolean
  rows?: number
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  paginator: true,
  rows: 10,
})

const filters = ref({})
</script>

<template>
  <DataTable
    :value="data"
    :loading="loading"
    :paginator="paginator"
    :rows="rows"
    v-model:filters="filters"
    filter-display="menu"
    sort-mode="multiple"
    striped-rows
    class="w-full"
  >
    <Column
      v-for="col in columns"
      :key="col.field"
      :field="col.field"
      :header="col.header"
      :sortable="col.sortable"
    />
  </DataTable>
</template>`,
    },
  ],
};

export const toastTemplate: PrimeVueTemplate = {
  name: 'Toast',
  description: 'PrimeVue Toast notification service integration',
  category: 'feedback',
  packages: ['primevue'],
  files: [
    {
      path: 'components/ui/AppToast.vue',
      type: 'component',
      content: `<script setup lang="ts">
import Toast from 'primevue/toast'
</script>

<template>
  <Toast position="top-right" />
</template>`,
    },
    {
      path: 'composables/useNotify.ts',
      type: 'hook',
      content: `import { useToast } from 'primevue/usetoast'

export function useNotify() {
  const toast = useToast()

  function success(message: string, summary = 'Success') {
    toast.add({ severity: 'success', summary, detail: message, life: 3000 })
  }

  function error(message: string, summary = 'Error') {
    toast.add({ severity: 'error', summary, detail: message, life: 5000 })
  }

  function warn(message: string, summary = 'Warning') {
    toast.add({ severity: 'warn', summary, detail: message, life: 4000 })
  }

  function info(message: string, summary = 'Info') {
    toast.add({ severity: 'info', summary, detail: message, life: 3000 })
  }

  return { success, error, warn, info }
}`,
    },
  ],
};

export const menuTemplate: PrimeVueTemplate = {
  name: 'Menu',
  description: 'PrimeVue navigation menu with router integration',
  category: 'navigation',
  packages: ['primevue'],
  files: [
    {
      path: 'components/ui/AppMenu.vue',
      type: 'component',
      content: `<script setup lang="ts">
import Menu from 'primevue/menu'
import type { MenuItem } from 'primevue/menuitem'
import { ref } from 'vue'

interface Props {
  items: MenuItem[]
  popup?: boolean
}

withDefaults(defineProps<Props>(), {
  popup: false,
})

const menu = ref()

function toggle(event: Event) {
  menu.value.toggle(event)
}

defineExpose({ toggle })
</script>

<template>
  <Menu ref="menu" :model="items" :popup="popup" />
</template>`,
    },
  ],
};

export const allPrimeVueTemplates: PrimeVueTemplate[] = [
  buttonTemplate,
  inputTextTemplate,
  dialogTemplate,
  dataTableTemplate,
  toastTemplate,
  menuTemplate,
];

export function getPrimeVueTemplates(): PrimeVueTemplate[] {
  return allPrimeVueTemplates;
}

export function generatePrimeVueComponent(
  name: string,
  _designContext: IDesignContext,
  _customizations?: Record<string, unknown>
): IGeneratedFile[] {
  const template = allPrimeVueTemplates.find((t) => t.name.toLowerCase() === name.toLowerCase());

  if (!template) {
    throw new Error(`PrimeVue component "${name}" not found`);
  }

  return template.files.map((f) => ({
    path: f.path,
    content: f.content,
  }));
}
