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
      <h1 class="text-headingColor text-3xl">{{props?.moduleData?.name || "Create a new module" }}</h1>
    </div>
    <div class="flex justify-between items-center gap-2 pt-5 border-b border-border w-full">
      <div class="space-x-8">

        <button
          v-if="props.mode !== 'create'"
          @click="activeTab = 'settings'"
          :class="
            activeTab == 'settings' ? 'border-headingColor' : 'border-transparent'
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

      <div class="flex items-center gap-2">
        <button class="flex items-center gap-2 bg-darkForground px-5 py-2 rounded-lg text-white text-sm">
        <Icon name="mdi:eye-outline" />
          Preview
        </button>
        <button class="flex items-center gap-2 bg-[linear-gradient(90deg,_#00B9FF_0%,_#4E47FF_100%),linear-gradient(0deg,_rgba(0,_0,_0,_0.2),_rgba(0,_0,_0,_0.2))] px-5 py-2 rounded-lg text-white text-sm">
        <Icon name="material-symbols:arrow-upload-progress" />
          Publish
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

        <form action="" class="gap-5 grid grid-cols-2">
          <!-- Error display -->
          <div v-if="error" class="bg-red-900/50 border border-red-500 rounded-md p-3 col-span-2">
            <p class="text-red-300 text-sm">{{ error }}</p>
          </div>

          <div class="flex flex-col gap-2 col-span-1">
            <label for="name" class="text-headingColor">Name</label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="Enter first name"
              class="bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg text-headingColor text-sm"
              required
            />
          </div>
          <div class="flex flex-col gap-2 col-span-1">
            <label for="instructor" class="text-headingColor">Instructor</label>
            <select
              v-model="formData.instructor"
              name="instructor"
              id="instructor"
              class="bg-darkBackground px-4 py-3 rounded-lg text-headingColor/30 text-sm"
            >
              <option selected="">Select an instructor</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>
          <div class="flex flex-col gap-2 col-span-2">
            <label for="packages" class="text-headingColor">Packages</label>
            <select
              v-model="formData.packages"
              name="packages"
              id="packages"
              class="bg-darkBackground px-4 py-3 rounded-lg text-headingColor/30 text-sm"
            >
              <option selected="">Select Packages</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>
          <div class="flex flex-col gap-2 col-span-2">
            <label for="description" class="text-headingColor"
              >Description</label
            >
            <textarea
              v-model="formData.description"
              placeholder="Enter description for the module"
              rows="6"
              class="bg-darkBackground px-4 py-3 rounded-lg placeholder:text-headingColor/30 text-sm text-white"
              name="description"
              id="desc"
            ></textarea>
          </div>

          <div class="pt-3 flex gap-3">
            <button
              @click="saveDraft"
              :disabled="loading"
              type="button"
              class="bg-[#292D32] px-5 py-2.5 rounded-lg text-headingColor disabled:opacity-50"
            >
              {{ loading ? 'Saving...' : 'Save as draft' }}
            </button>
            <button
              @click="publishModule"
              :disabled="loading"
              type="button"
              class="bg-[linear-gradient(90deg,_#00B9FF_0%,_#4E47FF_100%)] px-5 py-2.5 rounded-lg text-white disabled:opacity-50"
            >
              {{ loading ? 'Publishing...' : 'Publish' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <div v-else class="flex gap-6 pt-6 w-full">
      <div class="space-y-2 w-[25%]">
        <div
          class="flex justify-between items-center bg-darkForground px-3 py-2 rounded-lg cursor-pointer"
          v-for="(item, index) in carriculums"
          :key="index"
          @click="selectedCarriculum = item"
        >
          <div class="flex items-center gap-3">
            <Icon
              name="material-symbols:drag-indicator"
              class="w-5 h-5 text-headingColor"
            />
            <div class="flex items-center gap-5">
              <div class="space-y-1">
                <p class="font-semibold text-headingColor text-sm">
                  {{ item.title }}
                </p>
                <div class="flex items-center gap-3">
                  <div
                    class="flex items-center gap-1 text-headingColor text-xs"
                  >
                    <Icon name="mingcute:time-duration-line" />
                    <span>{{ item.duration }}</span>
                  </div>
                  <div
                    v-if="item.lab"
                    class="flex items-center gap-1 text-headingColor text-xs"
                  >
                    <Icon name="hugeicons:test-tube-01" />
                    <span>Lab</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Icon
            name="material-symbols:delete-outline"
            class="w-5 h-5 text-headingColor"
          />
        </div>
      </div>

      <div class="bg-darkForground p-6 rounded-xl w-[75%]">
        <h3 class="pb-5 text-headingColor text-2xl">Lesson Information</h3>
        <form action="" class="gap-5 grid grid-cols-2">
          <div class="flex flex-col gap-2 col-span-2">
            <label for="name" class="text-headingColor">Title</label>
            <input
              type="text"
              :value="selectedCarriculum.title"
              placeholder="Enter title"
              class="bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg text-headingColor text-sm"
            />
          </div>
          <div class="flex flex-col gap-2 col-span-1">
            <label for="slug" class="text-headingColor">Slug</label>
            <input
              type="text"
              :value="selectedCarriculum.slug"
              placeholder="Enter slug"
              class="bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg text-headingColor text-sm"
            />
          </div>
          <div class="flex flex-col gap-2 col-span-1">
            <label class="text-headingColor">Lab</label>
            <div class="flex items-center space-x-2 min-h-10">
                <input type="checkbox" :checked="selectedCarriculum.lab" class="checked:fill-primaryBlue" />
                <label for="instructor" class="text-headingColor text-sm">Is lab available?</label>
            </div>
          </div>
          <div class="flex flex-col gap-2 col-span-2">
            <label for="content" class="text-headingColor"
              >Content</label
            >
            <ClientOnly>
                <TiptapEditor />
            </ClientOnly>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import TiptapEditor from '../global/tiptap-editor.vue';

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

const router = useRouter()
const { createModule, updateModule } = useModules()

const activeTab = ref("settings");
const selectedCarriculum = ref({})
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
  name: '',
  description: '',
  instructor: '',
  packages: '',
  image: '',
  status: 'draft'
})

// Form state
const loading = ref(false)
const error = ref(null)

// Initialize form data
const initializeForm = () => {
  if (props.mode === 'edit' && props.moduleData) {
    formData.value = {
      name: props.moduleData.name || '',
      description: props.moduleData.description || '',
      instructor: props.moduleData.instructor || '',
      packages: props.moduleData.packages || '',
      image: props.moduleData.image || '',
      status: props.moduleData.status || 'draft'
    }
  } else {
    // Reset form for create mode
    formData.value = {
      name: '',
      description: '',
      instructor: '',
      packages: '',
      image: '',
      status: 'draft'
    }
  }
}

// Watch for prop changes
watch(() => props.moduleData, () => {
  initializeForm()
}, { immediate: true })

// Save module (create or update)
const saveModule = async (isDraft = true) => {
  loading.value = true
  error.value = null
  
  try {
    const modulePayload = {
      ...formData.value,
      status: isDraft ? 'draft' : 'published'
    }
    
    let result
    if (props.mode === 'create') {
      result = await createModule(modulePayload)
    } else {
      result = await updateModule(props.moduleSlug, modulePayload)
    }
    
    if (result.error) {
      error.value = result.error
    } else {
      // Success - redirect to modules page
      router.push('/modules')
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.error('Save module error:', err)
  } finally {
    loading.value = false
  }
}

// Publish module
const publishModule = () => {
  saveModule(false)
}

// Save as draft
const saveDraft = () => {
  saveModule(true)
}
</script>
