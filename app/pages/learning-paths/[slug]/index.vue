<template>
  <div class="min-h-screen w-full text-headingColor bg-darkBackground relative">
    <div class="max-w-7xl">
      <!-- Back Link -->
      <div class="flex items-center gap-2 mb-2">
        <NuxtLink
          to="/learning-paths"
          class="flex items-center gap-2 text-headingColor text-sm"
        >
          <Icon name="material-symbols:arrow-back-rounded" size="20" />
          <span class="text-sm">Learning Path</span>
        </NuxtLink>
      </div>

      <!-- Page Title -->
      <h1 class="text-3xl font-medium text-headingColor mb-8">
        {{ isEditMode ? form.name || 'Learning Path' : 'Create a New Learning Path' }}
      </h1>

      <!-- Tabs (only when editing) -->
      <div v-if="isEditMode" class="flex border-b border-[#2E2F34] space-x-12 mb-6">
        <button
          @click="activeTab = 'settings'"
          :class="[ 
            'py-2 text-lg font-medium',
            activeTab === 'settings'
              ? 'border-b-2 border-headingColor text-headingColor font-semibold'
              : 'text-[#B2BBC6]'
          ]"
        >
          Settings
        </button>

        <button
          @click="activeTab = 'modules'"
          :class="[ 
            'py-2 text-lg font-medium',
            activeTab === 'modules'
              ? 'border-b-2 border-headingColor text-headingColor font-semibold'
              : 'text-[#B2BBC6]'
          ]"
        >
          Modules
        </button>
      </div>

      <!-- Tab Content -->
      <div v-if="activeTab === 'settings'" class="bg-[#1E1F23] rounded-md p-6">
        <h2 class="text-headingColor font-medium text-3xl mb-5">
          Learning Path Information
        </h2>

        <!-- Form -->
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Row 1 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block mb-1 text-lg text-headingColor">Name</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Enter Name"
                class="w-full bg-darkBackground rounded-lg px-3 py-2.5 text-sm text-headingColor"
              />
            </div>
            <div>
              <label class="block mb-1 text-lg text-headingColor">Slug</label>
              <input
                v-model="form.slug"
                type="text"
                placeholder="Enter Slug"
                class="w-full bg-darkBackground rounded-lg px-3 py-2.5 text-sm text-headingColor"
              />
            </div>
          </div>

          <!-- Row 2 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block mb-1 text-lg text-headingColor">Type</label>
              <select
                v-model="form.type"
                class="w-full bg-darkBackground rounded-lg px-3 py-2.5 text-sm text-headingColor"
                required
              >
                <option value="">Select a type</option>
                <option value="role">Role</option>
                <option value="domain">Domain</option>
              </select>
            </div>
            <div>
              <label class="block mb-1 text-lg text-headingColor">Duration Days</label>
              <input
                v-model="form.duration_days"
                type="number"
                placeholder="Enter Duration"
                class="w-full bg-darkBackground rounded-lg px-3 py-2.5 text-sm text-headingColor"
              />
            </div>
          </div>

          <!-- Row 3 -->
          <div>
            <label class="block mb-1 text-lg text-headingColor">Description</label>
            <textarea
              v-model="form.description"
              rows="7"
              placeholder="Enter Description"
              class="w-full bg-darkBackground rounded-lg px-3 py-2.5 text-sm text-headingColor"
            ></textarea>
          </div>

          <!-- Button -->
          <div class="pt-2">
            <button
              type="submit"
              class="bg-darkBackground px-5 py-2.5 rounded-lg text-headingColor hover:opacity-90 transition"
            >
              {{ isEditMode ? 'Update' : 'Save' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Modules Tab -->
      <div v-else>
        <div class="flex bg-darkBackground text-headingColor">
          <!-- Sidebar -->
          <div class="w-[22rem] px-4">
            <h2 class="text-lg font-semibold mb-4"></h2>
            <draggable
              v-model="steps"
              group="steps"
              item-key="step_name"
              handle=".drag-handle"
              @end="onStepDragEnd"
              class="space-y-2"
            >
              <template #item="{ element: step, index }">
                <div
                  @click="selectStep(step)"
                  :class="[
                    'flex justify-between items-center px-4 py-2 bg-[#1E1F23] rounded-lg cursor-pointer transition-all',
                    selectedStep?.step_name === step.step_name ? 'ring-2 ring-blue-400' : ''
                  ]"
                >
                  <div class="flex items-center gap-3 flex-1">
                    <Icon
                      name="material-symbols:drag-indicator"
                      class="w-5 h-5 text-headingColor cursor-grab hover:cursor-grabbing drag-handle hover:text-blue-400 transition"
                    />
                    <div class="flex flex-col flex-1">
                      <span>{{ step.step_name }}</span>
                      <span class="text-gray-400 text-sm">{{ step.modules?.length || 0 }} module{{ step.modules?.length !== 1 ? 's' : '' }}</span>
                    </div>
                  </div>
                  <div 
                    @click.stop="deleteStep(step, index)"
                    class="flex items-center gap-1 cursor-pointer hover:text-red-500"
                  >
                    <Icon name="material-symbols:delete-outline-rounded" class="w-5 h-5" />
                  </div>
                </div>
              </template>
            </draggable>

            <button
              @click="openNewStepModal"
              class="mt-4 w-full bg-[#1E1F23] hover:bg-[#25272B] text-white py-3 rounded-lg transition-all"
            >
              + New Step
            </button>
          </div>

          <!-- Main Content -->
          <div class="flex-1 bg-darkBackground text-white px-6 pt-4">
            <!-- Heading -->
            <div v-if="selectedStep" class="flex mb-6 text-headingColor bg-[#1E1F23]   py-3 px-4 rounded-xl justify-between items-center">             
                <h1
                  class="text-3xl font-bold"
                >
                  {{ selectedStep.step_name }} Modules
                </h1>             
                <button
                  @click="openAddModuleModal"
                  class="flex items-center gap-2 bg-[linear-gradient(90deg,_#00B9FF_0%,_#4E47FF_100%)] hover:opacity-90 px-4 py-2 rounded-lg text-white transition-opacity"
                >
                  <Icon name="material-symbols:add" />
                  Add Module
                </button>
            </div>

            

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-12">
              <p class="text-gray-400">Loading modules...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="!selectedStep" class="text-center py-12">
              <p class="text-gray-400">Select a step to view modules</p>
            </div>

            <!-- ✅ Modules Draggable -->
            <draggable
              v-else-if="selectedStep.modules && selectedStep.modules.length > 0"
              v-model="selectedStep.modules"
              group="modules"
              item-key="id"
              handle=".drag-handle"
              @end="onModuleDragEnd"
              class="w-full grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              <template #item="{ element: module }">
                <div
                  class="bg-darkForground rounded-xl overflow-hidden flex flex-col w-[280px]"
                >
                  <img
                    :src="module.image || '/images/courseImage.png'"
                    :alt="module.name"
                    class="w-full h-48 object-cover"
                  />
                  <div class="space-y-2 p-4 flex flex-col flex-1 pb-4">
                    <h3 class="font-bold text-lg text-white">{{ module.name }}</h3>
                    <p class="text-sm text-gray-300 flex-1">
                      {{ module.description || 'No description available' }}
                    </p>
                  </div>

                  <div
                    class="relative flex justify-between items-center bg-[#292D32] px-4 py-2 border-[#303347] border-r-2 border-b-2 border-l-2 rounded-bl-xl rounded-br-xl"
                  >
                    <p class="text-gray-400 italic capitalize">{{ module.status || 'Published' }}</p>
                    <div class="flex items-center gap-2">
                      <Icon
                        name="material-symbols:drag-indicator"
                        class="w-5 h-5 text-headingColor cursor-grab hover:cursor-grabbing drag-handle hover:text-blue-400 transition"
                      />
                      <Icon
                        name="material-symbols:delete-outline-rounded"
                        class="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer transition"
                        @click="deleteModule(module, selectedStep.modules.indexOf(module))"
                      />
                    </div>
                  </div>
                </div>
              </template>
            </draggable>

            <!-- No modules in step -->
            <div v-else class="text-center py-12">
              <p class="text-gray-400">No modules in this step</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ Custom Toast -->
    <transition name="fade">
      <div
        v-if="toast.visible"
        :class="[ 
          'fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg text-sm font-medium z-50',
          toast.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
        ]"
      >
        {{ toast.message }}
      </div>
    </transition>

    <!-- New Step Modal -->
    <transition name="fade">
      <div
        v-if="showNewStepModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeNewStepModal"
      >
        <div class="bg-[#1E1F23] rounded-lg p-6 w-96">
          <h2 class="text-xl font-semibold text-headingColor mb-4">Create New Step</h2>
          <form @submit.prevent="createNewStep">
            <div class="mb-4">
              <label class="block mb-2 text-sm text-headingColor">Step Name</label>
              <input
                v-model="newStepName"
                type="text"
                placeholder="Enter step name"
                class="w-full bg-darkBackground rounded-lg px-3 py-2.5 text-sm text-headingColor"
                required
              />
            </div>
            <div class="flex gap-3 justify-end">
              <button
                type="button"
                @click="closeNewStepModal"
                class="px-4 py-2 rounded-lg text-gray-400 hover:bg-darkBackground transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded-lg bg-headingColor text-darkBackground hover:opacity-90 transition"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Add Module Modal -->
    <transition name="fade">
      <div
        v-if="showAddModuleModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeAddModuleModal"
      >
        <div class="bg-[#2A2D35] rounded-lg p-8 w-[400px]">
          <h2 class="text-2xl font-medium text-white mb-6">Add New Model</h2>
          <form @submit.prevent="addModuleToStep">
            <!-- Select Module -->
            <div class="mb-6">
              <label class="block mb-2 text-sm text-white">Select Module</label>
              <select
                v-model="selectedModuleId"
                class="w-full bg-[#1E1F23] text-white rounded-lg px-4 py-3 text-sm border border-[#3A3D45] focus:outline-none focus:border-headingColor"
                required
              >
                <option value="" disabled>Select a module</option>
                <option v-for="module in availableModules" :key="module.id" :value="module.id">
                  {{ module.name }}
                </option>
              </select>
            </div>

            <!-- Order -->
            <div class="mb-6">
              <label class="block mb-2 text-sm text-white">Order</label>
              <input
                v-model.number="moduleOrder"
                type="number"
                min="1"
                placeholder="Enter order"
                class="w-full bg-[#1E1F23] text-white rounded-lg px-4 py-3 text-sm border border-[#3A3D45] focus:outline-none focus:border-headingColor"
                required
              />
            </div>

            <!-- Buttons -->
            <div class="flex gap-3 justify-center">
              <button
                type="button"
                @click="closeAddModuleModal"
                class="px-6 py-2.5 rounded-lg bg-[#D84A4A] text-white hover:opacity-90 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-6 py-2.5 rounded-lg bg-[#4A5568] text-white hover:opacity-90 transition font-medium"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <transition name="fade">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeDeleteModal"
      >
        <div class="bg-[#2A2D35] rounded-lg p-8 w-[420px]">
          <h2 class="text-2xl font-medium text-white mb-4">Confirm Deletion</h2>
          <p class="text-gray-300 mb-6">
            Are you sure you want to delete 
            <span class="font-semibold text-white">"{{ deleteModalData.name }}"</span>
            {{ deleteModalData.type === 'step' ? 'step' : 'module' }}?
            <span v-if="deleteModalData.type === 'step' && deleteModalData.item?.modules?.length > 0" class="block mt-2 text-red-400">
              This will also remove {{ deleteModalData.item.modules.length }} module(s) from this step.
            </span>
          </p>
          <div class="flex gap-3 justify-center">
            <button
              type="button"
              @click="closeDeleteModal"
              class="px-6 py-2.5 rounded-lg bg-[#4A5568] text-white hover:opacity-90 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="confirmDelete"
              class="px-6 py-2.5 rounded-lg bg-[#D84A4A] text-white hover:opacity-90 transition font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import draggable from "vuedraggable";

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const activeTab = ref("settings");
const isEditMode = route.params.slug !== "create";

const form = ref({
  name: "",
  slug: "",
  description: "",
  type: "",
  duration_days: "",
});

const steps = ref([]);
const selectedStep = ref(null);
const loading = ref(false);
const activeMenuId = ref(null);
const showNewStepModal = ref(false);
const newStepName = ref("");

// Add Module Modal State
const showAddModuleModal = ref(false);
const availableModules = ref([]);
const selectedModuleId = ref("");
const moduleOrder = ref(1);

// Delete Confirmation Modal State
const showDeleteModal = ref(false);
const deleteModalData = ref({
  type: '', // 'step' or 'module'
  name: '',
  item: null,
  index: null
});

const toast = ref({ visible: false, message: "", type: "success" });
const showToast = (message, type = "success") => {
  toast.value = { visible: true, message, type };
  setTimeout(() => (toast.value.visible = false), 2500);
};

const fetchRoadmapData = async () => {
  if (!isEditMode) return;
  loading.value = true;
  try {
    const res = await fetch(`${config.public.API_BASE_URL}api/lms/roadmaps/${route.params.slug}/`);
    const data = await res.json();
    form.value = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      type: data.type,
      duration_days: data.duration_days,
    };
    steps.value = data.steps || [];
    if (steps.value.length > 0) selectedStep.value = steps.value[0];
  } catch {
    showToast("Failed to load learning path", "error");
  } finally {
    loading.value = false;
  }
};

// Fetch available modules
const fetchAvailableModules = async () => {
  try {
    const res = await fetch(`${config.public.API_BASE_URL}api/lms/modules/`);
    const data = await res.json();
    availableModules.value = data.results || data || [];
  } catch {
    showToast("Failed to load modules", "error");
  }
};

const formatStepsForAPI = () =>
  steps.value.map((step, i) => ({
    step_name: step.step_name,
    step_order: i + 1,
    modules: (step.modules || []).map((m, j) => ({
      id: m.id,
      module_order: j + 1,
    })),
  }));

onMounted(() => {
  fetchRoadmapData();
  fetchAvailableModules();
});

const selectStep = (s) => (selectedStep.value = s);

const handleSubmit = async () => {
  const url = isEditMode
    ? `${config.public.API_BASE_URL}api/lms/roadmaps/${route.params.slug}/`
    : `${config.public.API_BASE_URL}api/lms/roadmaps/`;
  const method = isEditMode ? "PUT" : "POST";
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form.value, steps: formatStepsForAPI() }),
    });
    if (!res.ok) throw new Error();
    showToast(isEditMode ? "Updated successfully!" : "Saved successfully!");
    if (isEditMode) fetchRoadmapData();
  } catch {
    showToast("Network error while saving.", "error");
  }
};

const deleteStep = async (step, i) => {
  showDeleteModal.value = true;
  deleteModalData.value = {
    type: 'step',
    name: step.step_name,
    item: step,
    index: i
  };
};

const deleteModule = (module, moduleIndex) => {
  showDeleteModal.value = true;
  deleteModalData.value = {
    type: 'module',
    name: module.name,
    item: module,
    index: moduleIndex
  };
};

const confirmDelete = async () => {
  if (deleteModalData.value.type === 'step') {
    await executeStepDelete();
  } else if (deleteModalData.value.type === 'module') {
    await executeModuleDelete();
  }
};

const executeStepDelete = async () => {
  try {
    const step = deleteModalData.value.item;
    const i = deleteModalData.value.index;
    
    const updated = steps.value.filter((_, idx) => idx !== i);
    const res = await fetch(
      `${config.public.API_BASE_URL}api/lms/roadmaps/${route.params.slug}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...form.value, 
          steps: updated.map((s, idx) => ({
            step_name: s.step_name,
            step_order: idx + 1,
            modules: (s.modules || []).map((m, j) => ({
              id: m.id,
              module_order: j + 1,
            })),
          }))
        }),
      }
    );
    if (!res.ok) throw new Error();
    showToast("Step deleted successfully!");
    await fetchRoadmapData();
    if (selectedStep.value?.step_name === step.step_name) {
      selectedStep.value = steps.value.length > 0 ? steps.value[0] : null;
    }
    closeDeleteModal();
  } catch {
    showToast("Failed to delete step", "error");
    closeDeleteModal();
  }
};

const executeModuleDelete = async () => {
  try {
    const moduleIndex = deleteModalData.value.index;
    
    // Remove module from selected step
    const updatedModules = selectedStep.value.modules.filter((_, idx) => idx !== moduleIndex);
    
    // Update the step in steps array
    const stepIndex = steps.value.findIndex(s => s.step_name === selectedStep.value.step_name);
    steps.value[stepIndex].modules = updatedModules;
    
    // Save to API
    const res = await fetch(
      `${config.public.API_BASE_URL}api/lms/roadmaps/${route.params.slug}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form.value, steps: formatStepsForAPI() }),
      }
    );
    
    if (!res.ok) throw new Error();
    
    showToast("Module deleted successfully!");
    await fetchRoadmapData();
    closeDeleteModal();
  } catch {
    showToast("Failed to delete module", "error");
    closeDeleteModal();
  }
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  deleteModalData.value = {
    type: '',
    name: '',
    item: null,
    index: null
  };
};

const openNewStepModal = () => (showNewStepModal.value = true);
const closeNewStepModal = () => {
  showNewStepModal.value = false;
  newStepName.value = "";
};

const createNewStep = async () => {
  if (!newStepName.value.trim()) {
    showToast("Please enter a step name", "error");
    return;
  }
  
  try {
    // Create new step object
    const newStep = {
      step_name: newStepName.value.trim(),
      step_order: steps.value.length + 1,
      modules: [],
    };
    
    // Add to local steps array
    steps.value.push(newStep);
    
    // Save to API
    const res = await fetch(
      `${config.public.API_BASE_URL}api/lms/roadmaps/${route.params.slug}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form.value, steps: formatStepsForAPI() }),
      }
    );
    
    if (!res.ok) {
      // Remove from local array if API call fails
      steps.value.pop();
      throw new Error("API request failed");
    }
    
    showToast("Step created successfully!");
    
    // Select the newly created step
    selectedStep.value = newStep;
    
    // Refresh data from server
    await fetchRoadmapData();
    
    closeNewStepModal();
  } catch (error) {
    showToast("Failed to create step", "error");
    console.error("Error creating step:", error);
  }
};

// Add Module Modal Functions
const openAddModuleModal = () => {
  if (!selectedStep.value) {
    showToast("Please select a step first", "error");
    return;
  }
  moduleOrder.value = (selectedStep.value.modules?.length || 0) + 1;
  showAddModuleModal.value = true;
};

const closeAddModuleModal = () => {
  showAddModuleModal.value = false;
  selectedModuleId.value = "";
  moduleOrder.value = 1;
};

const addModuleToStep = async () => {
  if (!selectedModuleId.value || !selectedStep.value) return;
  
  try {
    // Find the selected module details
    const moduleToAdd = availableModules.value.find(m => m.id === selectedModuleId.value);
    if (!moduleToAdd) {
      showToast("Module not found", "error");
      return;
    }

    // Check if module already exists in the step
    const existingModule = selectedStep.value.modules?.find(m => m.id === selectedModuleId.value);
    if (existingModule) {
      showToast("Module already exists in this step", "error");
      return;
    }

    // Add module to the selected step
    const updatedModules = [...(selectedStep.value.modules || []), {
      id: moduleToAdd.id,
      name: moduleToAdd.name,
      description: moduleToAdd.description,
      image: moduleToAdd.image,
      status: moduleToAdd.status,
      module_order: moduleOrder.value
    }];

    // Update the step with new modules
    const stepIndex = steps.value.findIndex(s => s.step_name === selectedStep.value.step_name);
    steps.value[stepIndex].modules = updatedModules;

    // Save to API
    const res = await fetch(
      `${config.public.API_BASE_URL}api/lms/roadmaps/${route.params.slug}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form.value, steps: formatStepsForAPI() }),
      }
    );
    
    if (!res.ok) throw new Error();
    
    showToast("Module added successfully!");
    fetchRoadmapData();
    closeAddModuleModal();
  } catch {
    showToast("Failed to add module", "error");
  }
};

watch(activeTab, (t) => {
  router.push({ query: { ...route.query, tab: t } });
  if (t === "modules" && isEditMode) fetchRoadmapData();
});

const onStepDragEnd = async () => {
  try {
    const res = await fetch(
      `${config.public.API_BASE_URL}api/lms/roadmaps/${route.params.slug}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form.value, steps: formatStepsForAPI() }),
      }
    );
    if (!res.ok) throw new Error();
    showToast("Step order updated successfully!");
  } catch {
    showToast("Failed to update step order", "error");
    fetchRoadmapData();
  }
};

const onModuleDragEnd = async () => {
  try {
    const res = await fetch(
      `${config.public.API_BASE_URL}api/lms/roadmaps/${route.params.slug}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form.value, steps: formatStepsForAPI() }),
      }
    );
    if (!res.ok) throw new Error();
    showToast("Module order updated successfully!");
    fetchRoadmapData();
  } catch {
    showToast("Failed to update module order", "error");
    fetchRoadmapData();
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>