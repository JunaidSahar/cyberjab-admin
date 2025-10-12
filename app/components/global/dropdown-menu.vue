<template>
  <div class="relative inline-block text-left">
    <button
      @click="toggleDropdown"
      type="button"
      class="inline-flex items-center gap-x-2 disabled:opacity-50 border border-transparent rounded-lg focus:outline-hidden font-semibold text-white hover:text-white/80 focus:text-blue-800 dark:hover:text-blue-400 dark:focus:text-blue-400 dark:text-blue-500 text-sm disabled:pointer-events-none"
    >
      <Icon name="humbleicons:dots-vertical" class="w-5 h-5" />
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-darkForeground shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabindex="-1"
    >
      <div class="py-1" role="none">
        <button
          v-for="(option, index) in options"
          :key="index"
          @click="handleOptionClick(option)"
          :class="[
            'flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-darkBackground transition-colors',
            option.class || 'text-headingColor'
          ]"
          role="menuitem"
          tabindex="-1"
        >
          <Icon v-if="option.icon" :name="option.icon" class="w-4 h-4" />
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DropdownOption {
  label: string;
  icon?: string;
  action: string;
  class?: string;
}

interface Props {
  options: DropdownOption[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  action: [action: string];
}>();

const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const handleOptionClick = (option: DropdownOption) => {
  isOpen.value = false;
  emit('action', option.action);
};

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      isOpen.value = false;
    }
  });
});

onUnmounted(() => {
  document.removeEventListener('click', () => {});
});
</script>