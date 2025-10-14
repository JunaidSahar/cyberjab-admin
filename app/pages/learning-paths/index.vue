<template>
  <div class="w-full h-full">
    <div class="flex justify-between items-center w-full">
      <h1 class="text-headingColor text-3xl">Learning Paths</h1>
      <NuxtLink
        to="/learning-paths/create"
        class="flex items-center gap-2 bg-[linear-gradient(90deg,_#00B9FF_0%,_#4E47FF_100%)] hover:opacity-90 px-4 py-2 rounded-lg text-white transition-opacity"
      >
        <Icon name="material-symbols:add" />
        Create
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
        class="flex flex-1 items-center gap-2 bg-darkForeground px-4 py-2 rounded-lg min-h-10"
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
        v-model="sortBy"
        @change="fetchLearningPaths"
        class="block bg-darkForeground px-4 py-2 rounded-lg w-60 min-h-10 dark:text-neutral-400 text-sm disabled:pointer-events-none"
      >
        <option value="-created_at">Newest First</option>
        <option value="created_at">Oldest First</option>
        <option value="name">Name A-Z</option>
        <option value="-name">Name Z-A</option>
        <option value="-updated_at">Recently Updated</option>
      </select>
      </div>
    <div class="items-center gap-6 grid grid-cols-3 pt-5">
      <template v-for="index in 3" :key="index" v-if="isLoading" >
        <CardSkeleton />
      </template>
      <LazyLearningPathCards
        v-else-if="currentLearningPaths.length > 0"
        v-for="(learningPath, index) in currentLearningPaths"
        :key="learningPath.id"
        :title="learningPath?.name"
        :role="learningPath?.type"
        :module_count="learningPath?.module_count"
        :duration_days="learningPath?.duration_days"
        :slug="learningPath?.slug"
      />

      <div v-else>
        <p class="text-headingColor text-2xl text-center">
          No Learning Paths Found
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLearningPath } from "@/composables/useLearningPaths";
import CardSkeleton from "~/components/learning-path/card-skeleton.vue";
const isLoading = ref(false);
const router = useRouter();
const searchQuery = ref('')
const selectedFilter = ref('')
const selectedLearningPath = ref('')
const sortBy = ref('-created_at')
const currentPage = ref(1)
const totalPages = ref(1)
const totalCount = ref(0)
const currentLearningPaths = ref([]);
const error = ref(null)


const { getLearningPaths } = useLearningPath();

// onMounted(async () => {
//   isLoading.value = true;
//   const { data, error } = await getLearningPaths();
//   if (data) {
//     currentLearningPaths.value = data.results;
//     isLoading.value = false;
//   }
// });

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

const fetchLearningPaths = async () => {
  isLoading.value = true
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
    
    const { data, error: fetchError } = await getLearningPaths(currentPage.value, 12, filters)
    
    if (fetchError) {
      error.value = fetchError
    } else {
      currentLearningPaths.value = data?.results || []
      totalCount.value = data?.count || 0
      totalPages.value = Math.ceil(totalCount.value / 12)
    }
  } catch (err) {
    error.value = 'Failed to fetch modules'
    console.error('Error fetching modules:', err)
  } finally {
    isLoading.value = false
  }
}

// Debounced search
let searchTimeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1 // Reset to first page on search
    fetchLearningPaths()
  }, 500)
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
  fetchLearningPaths()
})

// Initialize
onMounted(() => {
  fetchLearningPaths()
})

</script>
