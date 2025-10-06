<template>
  <div class="w-full h-full">
    <div class="flex justify-between items-center w-full">
      <h1 class="text-headingColor text-3xl">Modules</h1>
      <NuxtLink 
        to="/modules/create" 
        class="bg-[linear-gradient(90deg,_#00B9FF_0%,_#4E47FF_100%)] px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
      >
        Create Module
      </NuxtLink>
    </div>
    <div class="space-x-12 pt-4 border-b border-border">
      <button
        @click="activeButton = button.id"
        :class="
          button.id == activeButton
            ? 'border-headingColor'
            : 'border-transparent'
        "
        class="pb-3 border-b-2 font-medium text-headingColor transition-all"
        v-for="(button, index) in tabs"
        :key="index"
      >
        {{ button.name }}
      </button>
    </div>

    <div class="flex items-center gap-4 pt-5">
      <div
        class="flex flex-1 items-center gap-2 bg-darkForground px-4 py-2 rounded-lg min-h-10"
      >
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search module by name..."
          class="bg-transparent focus:outline-none w-full text-headingColor text-sm"
          @input="debouncedSearch"
        />
        <Icon
          class="w-5 h-5 text-headingColor"
          name="streamline:interface-search-glass-search-magnifying"
        />
      </div>
      <select
        v-model="selectedLearningPath"
        @change="fetchModules"
        class="block bg-darkForground px-4 py-2 rounded-lg w-60 min-h-10 dark:text-neutral-400 text-sm disabled:pointer-events-none"
      >
        <option value="">All LearningPaths</option>
        <option v-for="learningPath in learningPaths" :key="learningPath.id" :value="learningPath.slug">
          {{ learningPath.name }}
        </option>
      </select>
      <select
        v-model="sortBy"
        @change="fetchModules"
        class="block bg-darkForground px-4 py-2 rounded-lg w-60 min-h-10 dark:text-neutral-400 text-sm disabled:pointer-events-none"
      >
        <option value="-created_at">Newest First</option>
        <option value="created_at">Oldest First</option>
        <option value="name">Name A-Z</option>
        <option value="-name">Name Z-A</option>
        <option value="-updated_at">Recently Updated</option>
      </select>
    </div>

    <!-- Modules Grid -->
    <ClientOnly>
        <!-- Loading State -->
        <div v-if="loading" class="gap-x-5 gap-y-8 grid grid-cols-4 pt-8">
            <div v-for="i in 8" :key="i" class="animate-pulse bg-gray-200 rounded-xl h-80"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-red-500 p-8 text-center">
            <p>Error loading modules: {{ error }}</p>
            <button @click="fetchModules" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Retry
            </button>
        </div>

        <!-- Modules Grid -->
        <div v-else-if="modules && modules.length > 0" class="gap-x-5 gap-y-8 grid grid-cols-4 pt-8">
            <Card 
              v-for="module in modules" 
              :key="module.id" 
              :module="module"
              @edit="editModule"
              @delete="deleteModule"
              @toggle-status="toggleModuleStatus"
            />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
            <Icon name="heroicons:document-text" class="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 class="text-lg font-medium text-headingColor mb-2">No modules found</h3>
            <p class="text-gray-400 mb-6">
              {{ searchQuery ? 'No modules match your search criteria.' : 'Get started by creating your first module.' }}
            </p>
            <button
              @click="router.push('/modules/create')"
              class="bg-[#292D32] hover:bg-darkForground px-6 py-3 rounded-lg font-semibold text-headingColor transition-all"
            >
              Create Module
            </button>
        </div>
        <template #fallback>
            <div class="gap-x-5 gap-y-8 grid grid-cols-4 pt-8">
                <div v-for="i in 8" :key="i" class="animate-pulse bg-gray-200 rounded-xl h-80"></div>
            </div>
        </template>
    </ClientOnly>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 pt-8">
        <button 
          @click="changePage(currentPage - 1)"
          :disabled="currentPage <= 1"
          class="px-4 py-2 bg-darkForground text-headingColor rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span class="text-headingColor">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button 
          @click="changePage(currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="px-4 py-2 bg-darkForground text-headingColor rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
    </div>
  </div>
</template>

<script setup>
import Card from '~/components/modules/card.vue';
import { useLearningPath } from "@/composables/useLearningPaths";

const router = useRouter()
const { getModules, deleteModule: deleteModuleAPI, updateModule } = useModules()

// State
const modules = ref([])
const learningPaths = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const selectedFilter = ref('')
const selectedLearningPath = ref('')
const sortBy = ref('-created_at')
const currentPage = ref(1)
const totalPages = ref(1)
const totalCount = ref(0)

const activeButton = ref("all");
const tabs = ref([
  {
    name: "Published",
    id: "published",
    active: true,
  },
  {
    name: "Unpublished",
    id: "unpublished",
    active: false,
  },
  {
    name: "All",
    id: "all",
    active: false,
  },
]);

// Fetch modules function
const fetchModules = async () => {
  loading.value = true
  error.value = null
  
  try {
    const filters = {
      ordering: sortBy.value
    }

    if(selectedLearningPath.value){
      filters.roadmap = selectedLearningPath.value
    }
    
    if (searchQuery.value) {
      filters.search = searchQuery.value
    }
    
    if (selectedFilter.value && selectedFilter.value !== 'all') {
      filters.published = selectedFilter.value === 'true'
    }
    
    const { data, error: fetchError } = await getModules(currentPage.value, 12, filters)
    
    if (fetchError) {
      error.value = fetchError
    } else {
      modules.value = data?.results || []
      totalCount.value = data?.count || 0
      totalPages.value = Math.ceil(totalCount.value / 12)
    }
  } catch (err) {
    error.value = 'Failed to fetch modules'
    console.error('Error fetching modules:', err)
  } finally {
    loading.value = false
  }
}

const fetchLearningPaths = async()=>{
  const { data, error: fetchError } = await useLearningPath().getLearningPaths()
  if (fetchError) {
    error.value = fetchError
  } else {
    learningPaths.value = data?.results || []
  }
};


// Debounced search
let searchTimeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1 // Reset to first page on search
    fetchModules()
  }, 500)
}

// Pagination
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchModules()
  }
}

// Module actions
const editModule = (module) => {
  router.push(`/modules/${module.slug}`)
}

const deleteModule = async (module) => {
  if (confirm(`Are you sure you want to delete "${module.title}"?`)) {
    const { error: deleteError } = await deleteModuleAPI(module.slug)
    
    if (deleteError) {
      alert('Failed to delete module: ' + deleteError)
    } else {
      // Refresh the modules list
      fetchModules()
    }
  }
}

const toggleModuleStatus = async (module) => {
  const newPublishedStatus = !module.published
  
  const { error: updateError } = await updateModule(module.slug, {
    ...module,
    published: newPublishedStatus
  })
  
  if (updateError) {
    alert('Failed to update module status: ' + updateError)
  } else {
    // Refresh the modules list
    fetchModules()
  }
}

// Watch for tab changes
watch(activeButton, (newTab) => {
  if (newTab === 'published') {
    selectedFilter.value = 'true'
  } else if (newTab === 'unpublished') {
    selectedFilter.value = 'false'
  } else {
    selectedFilter.value = 'all'
  }
  currentPage.value = 1
  fetchModules()
})

// Initialize
onMounted(() => {
  fetchModules()
  fetchLearningPaths()
})
</script>
