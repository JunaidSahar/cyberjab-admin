<template>
  <div>
    <div class="space-y-2">
      <NuxtLink
        to="/modules"
        class="flex items-center gap-2 text-headingColor text-sm"
      >
        <Icon name="material-symbols:arrow-back-rounded" />
        <span> Modules </span>
      </NuxtLink>
      <h1 class="text-headingColor text-3xl">
        {{ props?.moduleData?.name || "Create a new module" }}
      </h1>
    </div>
    <div
      class="flex justify-between items-center gap-2 pt-5 border-b border-border w-full"
    >
      <div class="space-x-8">
        <button
          v-if="props.mode !== 'create'"
          @click="activeTab = 'settings'"
          :class="
            activeTab == 'settings'
              ? 'border-headingColor'
              : 'border-transparent'
          "
          type="button"
          class="pb-6 border-b-2 text-headingColor"
        >
          Settings
        </button>
        <button
          @click="activeTab = 'carriculum'"
          :class="
            activeTab == 'carriculum'
              ? 'border-headingColor'
              : 'border-transparent'
          "
          v-if="props.mode !== 'create'"
          type="button"
          class="pb-6 border-b-2 text-headingColor"
        >
          Carriculum
        </button>
      </div>

      <div class="flex items-center gap-2 pb-4" v-if="props.mode !== 'create'">
        <button
          class="flex items-center gap-2 bg-darkForground px-5 py-2 rounded-lg text-white text-sm"
        >
          <Icon name="mdi:eye-outline" />
          Preview
        </button>
        <button
          @click="publishModule"
          :disabled="loading || !isFormValid"
          class="flex items-center gap-2 bg-[linear-gradient(90deg,_#00B9FF_0%,_#4E47FF_100%),linear-gradient(0deg,_rgba(0,_0,_0,_0.2),_rgba(0,_0,_0,_0.2))] disabled:opacity-50 px-5 py-2 rounded-lg text-white text-sm"
        >
          <Icon name="material-symbols:arrow-upload-progress" />
          {{ loading ? "Publishing..." : "Publish" }}
        </button>
      </div>
    </div>

    <div v-if="activeTab == 'settings'" class="flex gap-6 pt-6 w-full">
      <div class="bg-darkForground p-6 rounded-xl w-[30%]">
        <h3 class="pb-5 text-headingColor text-2xl text-center">Image</h3>

        <div class="bg-darkBackground rounded-lg w-full min-h-60">
          <img src="" alt="" />
        </div>

        <div class="flex flex-col justify-center items-center gap-4 pt-6">
          <div
            class="group bg-gradient-to-r from-[#00B9FF] to-[#4E47FF] p-px rounded-lg w-fit"
          >
            <button
              class="flex bg-darkForground group-hover:bg-transparent px-4 py-2 rounded-lg w-full text-white text-sm transition-all"
            >
              Upload Photo
            </button>
          </div>
          <p class="opacity-50 max-w-48 text-[#E2E2E2] text-sm text-center">
            at least 536 x 300px PNG or JPG file.
          </p>
        </div>
      </div>
      <div class="bg-darkForground p-6 rounded-xl w-[70%]">
        <h3 class="pb-5 text-headingColor text-2xl">Module Information</h3>

        <form @submit.prevent="handleSubmit" class="gap-5 grid grid-cols-2">
          <!-- Error display -->
          <div
            v-if="error"
            class="col-span-2 bg-red-900/50 p-3 border border-red-500 rounded-md"
          >
            <p class="text-red-300 text-sm">{{ error }}</p>
          </div>

          <!-- Validation Summary -->
          <div
            v-if="validationErrors.length > 0"
            class="col-span-2 bg-yellow-900/50 p-3 border border-yellow-500 rounded-md"
          >
            <p class="mb-2 font-semibold text-yellow-300 text-sm">
              Please fix the following errors:
            </p>
            <ul class="text-yellow-300 text-sm list-disc list-inside">
              <li v-for="error in validationErrors" :key="error">
                {{ error }}
              </li>
            </ul>
          </div>

          <div class="flex flex-col gap-2 col-span-1">
            <label for="name" class="text-headingColor">
              Name <span class="text-red-400">*</span>
            </label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="Enter module name"
              :class="[
                'bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg text-headingColor text-sm',
                fieldErrors.name ? 'border border-red-500' : '',
              ]"
              required
              @blur="validateField('name')"
            />
            <span v-if="fieldErrors.name" class="text-red-400 text-xs">{{
              fieldErrors.name
            }}</span>
          </div>

          <div class="flex flex-col gap-2 col-span-1">
            <label for="instructor" class="text-headingColor">
              Instructor <span class="text-red-400">*</span>
            </label>
            <select
              v-model="formData.instructor"
              name="instructor"
              id="instructor"
              :class="[
                'bg-darkBackground px-4 py-3 rounded-lg text-headingColor/30 text-sm',
                fieldErrors.instructor ? 'border border-red-500' : '',
              ]"
              @change="validateField('instructor')"
            >
              <option value="" disabled>Select an instructor</option>
              <option
                v-for="(ins, index) in instructors"
                :key="index"
                :value="ins.id"
              >
                {{ ins?.first_name }} {{ ins?.last_name }}
              </option>
            </select>
            <span v-if="fieldErrors.instructor" class="text-red-400 text-xs">{{
              fieldErrors.instructor
            }}</span>
          </div>

          <div class="flex flex-col gap-2 col-span-2">
            <label for="packages" class="text-headingColor">Packages</label>
            <select
              v-model="formData.packages"
              name="packages"
              id="packages"
              class="bg-darkBackground px-4 py-3 rounded-lg text-headingColor/30 text-sm"
            >
              <option value="">Select Packages</option>
              <option value="1">Package 1</option>
              <option value="2">Package 2</option>
              <option value="3">Package 3</option>
            </select>
          </div>

          <div class="flex flex-col gap-2 col-span-2">
            <label for="description" class="text-headingColor">
              Description <span class="text-red-400">*</span>
            </label>
            <textarea
              v-model="formData.description"
              placeholder="Enter description for the module (minimum 20 characters)"
              rows="6"
              :class="[
                'bg-darkBackground px-4 py-3 rounded-lg text-white placeholder:text-headingColor/30 text-sm',
                fieldErrors.description ? 'border border-red-500' : '',
              ]"
              name="description"
              id="desc"
              @blur="validateField('description')"
            ></textarea>
            <div class="flex justify-between items-center">
              <span
                v-if="fieldErrors.description"
                class="text-red-400 text-xs"
                >{{ fieldErrors.description }}</span
              >
              <span class="text-headingColor/50 text-xs"
                >{{ formData.description.length }}/500 characters</span
              >
            </div>
          </div>

          <div class="flex gap-3 pt-3">
            <button
              @click="saveDraft"
              :disabled="loading"
              type="button"
              class="bg-[#292D32] disabled:opacity-50 px-5 py-2.5 rounded-lg text-headingColor"
            >
              {{ loading ? "Saving..." : "Save as draft" }}
            </button>
            <button
              v-if="props.mode !== 'create'"
              type="submit"
              :disabled="loading || !isFormValid"
              class="bg-[linear-gradient(90deg,_#00B9FF_0%,_#4E47FF_100%)] disabled:opacity-50 px-5 py-2.5 rounded-lg text-white"
            >
              {{ loading ? "Publishing..." : "Publish" }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <CreateCarriculum
      v-else
      v-model="moduleData.lessons"
      :module-id="moduleData.id"
      @lesson-saved="handleLessonSaved"
      @lesson-deleted="handleLessonDeleted"
    />
  </div>
</template>

<script setup>
import TiptapEditor from "../global/tiptap-editor.vue";
import CreateCarriculum from "./create-carriculum.vue";

const props = defineProps({
  mode: {
    type: String,
    default: "update",
  },
  moduleData: {
    type: Object,
    default: null,
  },
  moduleSlug: {
    type: String,
    default: null,
  },
});

const { getInstructors } = useInstructors();
const instructors = ref([]);

//fetch instructors
const fetchInstructors = async () => {
  const data = await getInstructors();
  if (data) {
    instructors.value = data.data?.results;
  }
};

onMounted(() => {
  fetchInstructors();
});

const router = useRouter();
const { createModule, updateModule } = useModules();

const activeTab = ref("settings");
const selectedCarriculum = ref({});
const carriculums = ref([
  {
    title: "Introduction",
    duration: "5m",
    slug: "intro",
    lab: false,
    content: "<p>content</p>",
  },
  {
    title: "Installing Linux",
    duration: "10m",
    slug: "linux",
    lab: true,
    content: "<p>content</p>",
  },
]);

// Form data
const formData = ref({
  name: "",
  description: "",
  instructor: "",
  packages: "",
  image: "",
  status: "draft",
});

// Validation state
const fieldErrors = ref({});
const validationErrors = ref([]);

// Form state
const loading = ref(false);
const error = ref(null);

// Validation rules
const validationRules = {
  name: {
    required: true,
    minLength: 3,
    maxLength: 100,
    message: "Module name is required and must be between 3-100 characters",
  },
  description: {
    required: true,
    minLength: 20,
    maxLength: 500,
    message: "Description is required and must be between 20-500 characters",
  },
  instructor: {
    required: true,
    message: "Please select an instructor",
  },
};

// Validate individual field
const validateField = (fieldName) => {
  const rule = validationRules[fieldName];
  const value = formData.value[fieldName];

  if (!rule) return true;

  // Clear previous error
  delete fieldErrors.value[fieldName];

  // Required validation
  if (rule.required && (!value || value.toString().trim() === "")) {
    fieldErrors.value[fieldName] = rule.message;
    return false;
  }

  // Skip other validations if field is empty and not required
  if (!value || value.toString().trim() === "") return true;

  // Length validations
  if (rule.minLength && value.toString().length < rule.minLength) {
    fieldErrors.value[fieldName] = rule.message;
    return false;
  }

  if (rule.maxLength && value.toString().length > rule.maxLength) {
    fieldErrors.value[fieldName] = rule.message;
    return false;
  }

  return true;
};

// Validate entire form
const validateForm = () => {
  fieldErrors.value = {};
  validationErrors.value = [];

  let isValid = true;

  // Validate each field with rules
  Object.keys(validationRules).forEach((fieldName) => {
    if (!validateField(fieldName)) {
      isValid = false;
      validationErrors.value.push(validationRules[fieldName].message);
    }
  });

  return isValid;
};

// Computed property for form validity
const isFormValid = computed(() => {
  return (
    Object.keys(fieldErrors.value).length === 0 &&
    formData.value.name.trim() !== "" &&
    formData.value.description.trim() !== "" &&
    formData.value.instructor !== ""
  );
});

// Handle form submission
const handleSubmit = () => {
  if (validateForm()) {
    publishModule();
  }
};

// Initialize form data
const initializeForm = () => {
  if (props.mode === "edit" && props.moduleData) {
    formData.value = {
      name: props.moduleData.name || "",
      description: props.moduleData.description || "",
      instructor: props.moduleData.instructor || "",
      packages: props.moduleData.packages || "",
      image: props.moduleData.image || "",
      status: props.moduleData.status || "draft",
    };
  } else {
    // Reset form for create mode
    formData.value = {
      name: "",
      description: "",
      instructor: "",
      packages: "",
      image: "",
      status: "draft",
    };
  }

  // Clear validation errors when initializing
  fieldErrors.value = {};
  validationErrors.value = [];
};

// Watch for prop changes
watch(
  () => props.moduleData,
  () => {
    initializeForm();
  },
  { immediate: true }
);

// Watch form data changes for real-time validation
watch(
  () => formData.value.name,
  () => {
    if (fieldErrors.value.name) {
      validateField("name");
    }
  }
);

watch(
  () => formData.value.description,
  () => {
    if (fieldErrors.value.description) {
      validateField("description");
    }
  }
);

watch(
  () => formData.value.instructor,
  () => {
    if (fieldErrors.value.instructor) {
      validateField("instructor");
    }
  }
);

// Save module (create or update)
const saveModule = async (isDraft = true) => {
  // Only validate for publishing, not for drafts
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const modulePayload = {
      ...formData.value,
      status: isDraft ? "draft" : "published",
    };

    let result;
    if (props.mode === "create") {
      result = await createModule(modulePayload);
    } else {
      result = await updateModule(props.moduleSlug, modulePayload);
    }

    if (result.error) {
      error.value = result.error;
    } else {
      // Success - redirect to modules page
      router.push("/modules");
    }
  } catch (err) {
    error.value = "An unexpected error occurred";
    console.error("Save module error:", err);
  } finally {
    loading.value = false;
  }
};

// Publish module
const publishModule = () => {
  saveModule(false);
};

// Save as draft (no validation required)
const saveDraft = () => {
  saveModule(true);
};
</script>
