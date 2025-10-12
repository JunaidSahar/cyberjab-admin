<template>
  <div class="w-full h-full">
    <div class="flex justify-between items-center w-full">
      <h1 class="text-headingColor text-3xl">Instructors</h1>
      <button
        @click="() => router.push('/instructors/create')"
        class="flex items-center gap-2 bg-[#292D32] hover:bg-darkForeground px-5 py-2.5 rounded-lg font-semibold text-headingColor transition-all"
      >
        <Icon name="material-symbols:add" />
        Create Instructor
      </button>
    </div>
    
    <div class="flex items-center gap-4 pt-5">
      <div
        class="flex flex-1 items-center gap-2 bg-darkForeground px-4 py-2 rounded-lg min-h-10"
      >
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Search instructors by name, email, or expertise..."
          class="bg-transparent focus:outline-none w-full text-headingColor text-sm"
        />
        <Icon
          class="w-5 h-5 text-headingColor"
          name="streamline:interface-search-glass-search-magnifying"
        />
      </div>

      <select
        v-model="statusFilter"
        @change="handleFilterChange"
        class="block bg-darkForeground px-4 py-2 rounded-lg w-60 min-h-10 dark:text-neutral-400 text-sm disabled:pointer-events-none"
      >
        <option value="">All Status</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="pt-5 text-center">
      <div class="text-headingColor">Loading instructors...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="pt-5 text-center">
      <div class="text-red-500">{{ error }}</div>
      <button 
        @click="fetchInstructors"
        class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Retry
      </button>
    </div>

    <!-- Data Table -->
    <div v-else class="pt-5">
      <DataTable 
        :columns="columns" 
        :data="instructors" 
        @selected-action="handleBulkAction"
        @action="handleRowAction"
      />
      
      <!-- Pagination -->
      <div v-if="pagination.total > pagination.pageSize" class="flex justify-center mt-6">
        <div class="flex items-center gap-2">
          <button
            @click="goToPage(pagination.currentPage - 1)"
            :disabled="pagination.currentPage <= 1"
            class="px-3 py-2 bg-darkForeground text-headingColor rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          
          <span class="px-4 py-2 text-headingColor">
            Page {{ pagination.currentPage }} of {{ Math.ceil(pagination.total / pagination.pageSize) }}
          </span>
          
          <button
            @click="goToPage(pagination.currentPage + 1)"
            :disabled="pagination.currentPage >= Math.ceil(pagination.total / pagination.pageSize)"
            class="px-3 py-2 bg-darkForeground text-headingColor rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import DataTable from "~/components/global/data-table.vue";

interface Instructor {
  slug: string;
  first_name: string;
  last_name: string;
  email: string;
  expertise: string;
  years_of_experience: number;
  is_active: boolean;
  status: string;
}

interface PaginationParams {
  page: number;
  page_size: number;
  is_active?: string;
}

const router = useRouter();
const { getInstructors, searchInstructorsByName, deleteInstructor, bulkDeleteInstructors } = useInstructors();

// Reactive data
const instructors = ref<Instructor[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref('');
const statusFilter = ref('');

// Pagination
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// Search debounce timer
let searchTimeout: number | null = null;

const columns = [
  {
    key: "profile_image",
    title: "Photo",
  },
  {
    key: "first_name",
    title: "First Name",
  },
  {
    key: "last_name",
    title: "Last Name",
  },
  {
    key: "email",
    title: "Email",
  },
  {
    key: "expertise",
    title: "Expertise",
  },
  {
    key: "years_of_experience",
    title: "Experience",
  },
  {
    key: "status",
    title: "Status",
  },
  {
    key: "action",
    title: "Action",
    align: "end"
  },
];

// Fetch instructors from API
const fetchInstructors = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const filters: any = {};
    
    // Add search filter if present
    if (searchQuery.value.trim()) {
      filters.search = searchQuery.value.trim();
    }
    
    // Add status filter if present
    if (statusFilter.value) {
      filters.is_active = statusFilter.value === 'true';
    }
    
    const result = await getInstructors(pagination.value.currentPage, pagination.value.pageSize, filters);
     
     if (result.error) {
       error.value = result.error;
       instructors.value = [];
       pagination.value.total = 0;
     } else if (result.data) {
       const data = result.data as any;
       instructors.value = data.results.map((instructor: any) => ({
         ...instructor,
         status: instructor.is_active ? 'Active' : 'Inactive'
       }));
       pagination.value.total = data.count;
     }
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch instructors';
    instructors.value = [];
    pagination.value.total = 0;
  } finally {
    isLoading.value = false;
  }
};

// Handle search with debounce
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  searchTimeout = setTimeout(() => {
    performSearch();
  }, 500);
};

// Perform search
const performSearch = () => {
  pagination.value.currentPage = 1; // Reset to first page when searching
  fetchInstructors();
};

// Handle filter change
const handleFilterChange = () => {
  pagination.value.currentPage = 1; // Reset to first page when filtering
  fetchInstructors();
};

// Handle pagination
const goToPage = (page: number) => {
  if (page >= 1 && page <= Math.ceil(pagination.value.total / pagination.value.pageSize)) {
    pagination.value.currentPage = page;
    fetchInstructors();
  }
};

// Handle row action (three-dot menu)
const handleRowAction = (payload: { action: string; row: Instructor }) => {
  const { action, row: instructor } = payload;
  
  if (action === 'edit') {
    handleEdit(instructor);
  } else if (action === 'delete') {
    handleDelete(instructor);
  }
};

// Handle edit action
const handleEdit = (instructor: Instructor) => {
  router.push(`/instructors/${instructor.slug}`);
};

// Handle delete action
const handleDelete = async (instructor: Instructor) => {
  if (confirm(`Are you sure you want to delete ${instructor.first_name} ${instructor.last_name}?`)) {
    isLoading.value = true;
    const result = await deleteInstructor(instructor.slug);
    
    if (result.error) {
      error.value = result.error;
    } else {
      // Refresh the list after successful deletion
      await fetchInstructors();
    }
    isLoading.value = false;
  }
};

// Handle bulk action (from DataTable selection)
const handleBulkAction = async (selectedData: Instructor[]) => {
  if (selectedData.length === 0) return;
  
  const action = prompt(`Bulk actions for ${selectedData.length} instructor(s):\n1. Delete\n2. Activate\n3. Deactivate\n\nEnter 1, 2, or 3:`);
  
  if (action === '1') {
    if (confirm(`Are you sure you want to delete ${selectedData.length} instructor(s)?`)) {
      isLoading.value = true;
      
      // For bulk delete, we need instructor IDs, but we only have slugs
      // We'll delete them one by one for now
      let hasError = false;
      for (const instructor of selectedData) {
        const result = await deleteInstructor(instructor.slug);
        if (result.error) {
          error.value = result.error;
          hasError = true;
          break;
        }
      }
      
      if (!hasError) {
        await fetchInstructors();
      }
      isLoading.value = false;
    }
  } else if (action === '2' || action === '3') {
    // For status updates, we'll need to implement toggleInstructorStatus for each
    const newStatus = action === '2';
    isLoading.value = true;
    
    let hasError = false;
    for (const instructor of selectedData) {
      const { toggleInstructorStatus } = useInstructors();
      const result = await toggleInstructorStatus(instructor.slug, newStatus);
      if (result.error) {
        error.value = result.error;
        hasError = true;
        break;
      }
    }
    
    if (!hasError) {
      await fetchInstructors();
    }
    isLoading.value = false;
  }
};

// Initialize data on component mount
onMounted(() => {
  fetchInstructors();
});
</script>
