<script setup lang="ts">
import CreateEditModule from '~/components/modules/create-edit-module.vue';

const route = useRoute()
const router = useRouter()
const { getModule } = useModules()

// Determine if we're in create or edit mode
const isCreateMode = computed(() => route.params.slug === 'create')
const moduleSlug = computed(() => isCreateMode.value ? null : String(route.params.slug))

// Module data for editing
const moduleData = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Fetch module data if in edit mode
const fetchModuleData = async () => {
  if (isCreateMode.value || !moduleSlug.value) return
  
  loading.value = true
  error.value = null
  
  try {
    const { data, error: fetchError } = await getModule(moduleSlug.value)
    if (fetchError) {
      error.value = fetchError
      // Redirect to modules page if module not found
      if (fetchError.includes('404') || fetchError.includes('not found')) {
        router.push('/modules')
      }
    } else {
      moduleData.value = data
    }
  } catch (err) {
    error.value = 'Failed to load module data'
    console.error('Error fetching module:', err)
  } finally {
    loading.value = false
  }
}

// Initialize data on mount
onMounted(() => {
  fetchModuleData()
})

// Watch for route changes (if navigating between create/edit)
watch(() => route.params.slug, () => {
  fetchModuleData()
})
</script>

<template>
    <div v-if="loading" class="flex justify-center items-center min-h-96">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="error" class="text-center py-12">
        <div class="text-red-500 mb-4">{{ error }}</div>
        <button 
            @click="router.push('/modules')" 
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            Back to Modules
        </button>
    </div>
    
    <CreateEditModule 
        v-else
        :mode="isCreateMode ? 'create' : 'edit'"
        :module-data="moduleData"
        :module-slug="moduleSlug"
    />
</template>