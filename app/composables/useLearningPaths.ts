// Type Definitions
interface Module {
  id: number;
  name: string;
  description: string;
  image?: string;
  status?: string;
  module_order: number;
}

interface Step {
  step_name: string;
  step_order: number;
  modules: Module[];
}

interface LearningPathForm {
  name: string;
  slug: string;
  description: string;
  type: string;
  duration_days: string | number;
}

interface DeleteModalData {
  type: "step" | "module" | "modules" | "";
  name: string;
  item: Step | Module | number[] | null;
  index: number | null;
}

interface Toast {
  visible: boolean;
  message: string;
  type: "success" | "error";
}

interface Filters {
  search?: string;
  published?: boolean;
  ordering?: string;
}

export const useLearningPath = () => {
  const config = useRuntimeConfig();
  const { getAccessToken } = useAuth();
  const route = useRoute();
  const router = useRouter();

  // State
  const activeTab = ref<string>("settings");
  const isEditMode = computed(() => route.params.slug !== "create");

  const form = ref<LearningPathForm>({
    name: "",
    slug: "",
    description: "",
    type: "",
    duration_days: "",
  });

  const steps = ref<Step[]>([]);
  const selectedStep = ref<Step | null>(null);
  const loading = ref<boolean>(false);
  const showNewStepModal = ref<boolean>(false);
  const newStepName = ref<string>("");

  // Add Module Modal State
  const showAddModuleModal = ref<boolean>(false);
  const availableModules = ref<Module[]>([]);
  const selectedModuleId = ref<number | string>("");
  const moduleOrder = ref<number>(1);

  // Delete Confirmation Modal State
  const showDeleteModal = ref<boolean>(false);
  const deleteModalData = ref<DeleteModalData>({
    type: "",
    name: "",
    item: null,
    index: null,
  });

  // Selected modules for bulk delete
  const selectedModules = ref<number[]>([]);

  // Toast
  const toast = ref<Toast>({ visible: false, message: "", type: "success" });

  // Helper Functions
  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    toast.value = { visible: true, message, type };
    setTimeout(() => (toast.value.visible = false), 2500);
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

  // API Calls
  const getLearningPaths = async (
    page: number = 1,
    pageSize: number = 10,
    filters: Filters = {}
  ) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      const queryParams: Record<string, any> = {
        page,
        page_size: pageSize,
      };

      if (filters.search) queryParams.search = filters.search;
      if (filters.published !== undefined)
        queryParams.is_active = filters.published;
      if (filters.ordering) queryParams.ordering = filters.ordering;

      const res = await $fetch(
        `${config.public.API_BASE_URL}api/lms/roadmaps/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          query: queryParams,
          credentials: "include",
        }
      );
      return { data: res, error: null };
    } catch (error: any) {
      return {
        error: error?.data?.error || "Failed to fetch learning paths",
        data: null,
      };
    }
  };

  const fetchRoadmapData = async (preserveSelectedStep = false) => {
    if (!isEditMode.value) return;
    loading.value = true;
    
    // Store the currently selected step name to preserve selection
    const currentSelectedStepName = preserveSelectedStep ? selectedStep.value?.step_name : null;
    
    try {
      const res = await fetch(
        `${config.public.API_BASE_URL}api/lms/roadmaps/${route.params.slug}/`
      );
      const data = await res.json();
      form.value = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        type: data.type,
        duration_days: data.duration_days,
      };
      steps.value = data.steps || [];
      
      // Preserve the selected step if requested, otherwise default to first step
      if (preserveSelectedStep && currentSelectedStepName) {
        const foundStep = steps.value.find(step => step.step_name === currentSelectedStepName);
        selectedStep.value = foundStep || (steps.value.length > 0 ? steps.value[0] : null);
      } else if (steps.value.length > 0) {
        selectedStep.value = steps.value[0];
      }
    } catch {
      showToast("Failed to load learning path", "error");
    } finally {
      loading.value = false;
    }
  };

  const fetchAvailableModules = async () => {
    try {
      const res = await fetch(`${config.public.API_BASE_URL}api/lms/modules/`);
      const data = await res.json();
      availableModules.value = data.results || data || [];
    } catch {
      showToast("Failed to load modules", "error");
    }
  };

  const handleSubmit = async () => {
    const url = isEditMode.value
      ? `${config.public.API_BASE_URL}api/lms/roadmaps/${route.params.slug}/`
      : `${config.public.API_BASE_URL}api/lms/roadmaps/`;
    const method = isEditMode.value ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form.value, steps: formatStepsForAPI() }),
      });
      if (!res.ok) throw new Error();
      showToast(
        isEditMode.value ? "Updated successfully!" : "Saved successfully!"
      );
      router.push("/learning-paths");
      if (isEditMode.value) fetchRoadmapData();
    } catch {
      showToast("Network error while saving.", "error");
    }
  };

  // Step Management
  const selectStep = (s: Step) => {
    selectedStep.value = s;
    selectedModules.value = [];
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
      const newStep: Step = {
        step_name: newStepName.value.trim(),
        step_order: steps.value.length + 1,
        modules: [],
      };

      steps.value.push(newStep);

      const res = await fetch(
        `${config.public.API_BASE_URL}api/lms/roadmaps/${route.params.slug}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form.value, steps: formatStepsForAPI() }),
        }
      );

      if (!res.ok) {
        steps.value.pop();
        throw new Error("API request failed");
      }

      showToast("Step created successfully!");
      selectedStep.value = newStep;
      await fetchRoadmapData(true); // Preserve selected step (the newly created one)
      closeNewStepModal();
    } catch (error) {
      showToast("Failed to create step", "error");
      console.error("Error creating step:", error);
    }
  };

  const deleteStep = (step: Step, i: number) => {
    showDeleteModal.value = true;
    deleteModalData.value = {
      type: "step",
      name: step.step_name,
      item: step,
      index: i,
    };
  };

  const executeStepDelete = async () => {
    try {
      const step = deleteModalData.value.item as Step;
      const i = deleteModalData.value.index;

      if (i === null) return;

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
            })),
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
      fetchRoadmapData(true); // Preserve selected step
    }
  };

  // Module Management
  const isModuleSelected = (moduleId: number) => {
    return selectedModules.value.includes(moduleId);
  };

  const toggleModuleSelection = (moduleId: number) => {
    const index = selectedModules.value.indexOf(moduleId);
    if (index > -1) {
      selectedModules.value.splice(index, 1);
    } else {
      selectedModules.value.push(moduleId);
    }
  };

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
      const moduleToAdd = availableModules.value.find(
        (m) => m.id === Number(selectedModuleId.value)
      );
      if (!moduleToAdd) {
        showToast("Module not found", "error");
        return;
      }

      const existingModule = selectedStep.value.modules?.find(
        (m) => m.id === Number(selectedModuleId.value)
      );
      if (existingModule) {
        showToast("Module already exists in this step", "error");
        return;
      }

      const updatedModules: Module[] = [
        ...(selectedStep.value.modules || []),
        {
          id: moduleToAdd.id,
          name: moduleToAdd.name,
          description: moduleToAdd.description,
          image: moduleToAdd.image,
          status: moduleToAdd.status,
          module_order: moduleOrder.value,
        },
      ];

      const stepIndex = steps.value.findIndex(
        (s) => s.step_name === selectedStep.value!.step_name
      );
      steps.value[stepIndex].modules = updatedModules;

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
      fetchRoadmapData(true); // Preserve selected step
      closeAddModuleModal();
    } catch {
      showToast("Failed to add module", "error");
    }
  };

  const deleteModule = (module: Module, moduleIndex: number) => {
    showDeleteModal.value = true;
    deleteModalData.value = {
      type: "module",
      name: module.name,
      item: module,
      index: moduleIndex,
    };
  };

  const deleteSelectedModules = () => {
    if (selectedModules.value.length === 0 || !selectedStep.value) return;

    const moduleNames = selectedStep.value.modules
      .filter((m) => selectedModules.value.includes(m.id))
      .map((m) => m.name)
      .join(", ");

    showDeleteModal.value = true;
    deleteModalData.value = {
      type: "modules",
      name: moduleNames,
      item: selectedModules.value,
      index: null,
    };
  };

  const executeModuleDelete = async () => {
    try {
      const moduleIndex = deleteModalData.value.index;

      if (moduleIndex === null || !selectedStep.value) return;

      const updatedModules = selectedStep.value.modules.filter(
        (_, idx) => idx !== moduleIndex
      );

      const stepIndex = steps.value.findIndex(
        (s) => s.step_name === selectedStep.value!.step_name
      );
      steps.value[stepIndex].modules = updatedModules;

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
      await fetchRoadmapData(true); // Preserve selected step
      closeDeleteModal();
    } catch {
      showToast("Failed to delete module", "error");
      closeDeleteModal();
    }
  };

  const executeBulkModuleDelete = async () => {
    try {
      const moduleIdsToDelete = deleteModalData.value.item as number[];

      if (!selectedStep.value) return;

      const updatedModules = selectedStep.value.modules.filter(
        (m) => !moduleIdsToDelete.includes(m.id)
      );

      const stepIndex = steps.value.findIndex(
        (s) => s.step_name === selectedStep.value!.step_name
      );
      steps.value[stepIndex].modules = updatedModules;

      const res = await fetch(
        `${config.public.API_BASE_URL}api/lms/roadmaps/${route.params.slug}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form.value, steps: formatStepsForAPI() }),
        }
      );

      if (!res.ok) throw new Error();

      showToast(`${moduleIdsToDelete.length} module(s) deleted successfully!`);
      selectedModules.value = [];
      await fetchRoadmapData(true); // Preserve selected step
      closeDeleteModal();
    } catch {
      showToast("Failed to delete modules", "error");
      closeDeleteModal();
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
      fetchRoadmapData(true); // Preserve selected step
    } catch {
      showToast("Failed to update module order", "error");
      fetchRoadmapData(true); // Preserve selected step
    }
  };

  // Delete Modal Management
  const confirmDelete = async () => {
    if (deleteModalData.value.type === "step") {
      await executeStepDelete();
    } else if (deleteModalData.value.type === "module") {
      await executeModuleDelete();
    } else if (deleteModalData.value.type === "modules") {
      await executeBulkModuleDelete();
    }
  };

  const closeDeleteModal = () => {
    showDeleteModal.value = false;
    deleteModalData.value = {
      type: "",
      name: "",
      item: null,
      index: null,
    };
  };

  // Tab Management
  const handleTabChange = (tab: string) => {
    activeTab.value = tab;
    router.push({ query: { ...route.query, tab } });
    if (tab === "modules" && isEditMode.value) fetchRoadmapData(true); // Preserve selected step when switching to modules tab
  };

  const handleDeleteLearningPath = async () => {
    try {
      const res = await fetch(
        `${config.public.API_BASE_URL}api/lms/roadmaps/${route.params.slug}/`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error();
      if (res.status === 204) {
        showToast("Learning Path deleted successfully!");
      }
      router.push("/learning-paths");
    } catch {
      showToast("Failed to delete Learning Path", "error");
    }
  };

  return {
    // State
    activeTab,
    isEditMode,
    form,
    steps,
    selectedStep,
    loading,
    showNewStepModal,
    newStepName,
    showAddModuleModal,
    availableModules,
    selectedModuleId,
    moduleOrder,
    showDeleteModal,
    deleteModalData,
    selectedModules,
    toast,

    // Methods
    getLearningPaths,
    fetchRoadmapData,
    fetchAvailableModules,
    handleSubmit,
    selectStep,
    openNewStepModal,
    closeNewStepModal,
    createNewStep,
    deleteStep,
    onStepDragEnd,
    isModuleSelected,
    toggleModuleSelection,
    openAddModuleModal,
    closeAddModuleModal,
    addModuleToStep,
    deleteModule,
    deleteSelectedModules,
    onModuleDragEnd,
    confirmDelete,
    closeDeleteModal,
    handleTabChange,
    handleDeleteLearningPath,
  };
};
