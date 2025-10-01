<template>
    <div class="bg-darkForground rounded-xl overflow-hidden flex flex-col">
        <img :src="module?.photo || '/module-1.png'" :alt="module?.name || 'Module image'" class="w-full h-48 object-cover">
        <div class="space-y-2 p-4 min-h-48 flex flex-col h-full">
            <h3 class="font-bold text-headingColor text-lg">{{ module?.name || 'Untitled Module' }}</h3>
            <p class="text-headingColor text-sm flex-1">{{ truncatedDescription }}</p>
            <div v-if="module?.instructor" class="text-xs text-blue-400">
                Instructor: {{ module.instructor.name }}
            </div>
            <div v-if="module?.plans?.length" class="text-xs text-green-400">
                Plans: {{ module.plans.map(p => p.name).join(', ') }}
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-400">
                <span>Created: {{ formatDate(module?.created_at) }}</span>
                <span v-if="module?.updated_at">• Updated: {{ formatDate(module?.updated_at) }}</span>
            </div>
        </div>
        <div class="relative flex justify-between items-center bg-[#292D32] px-4 py-2 border-[#303347] border-r-2 border-b-2 border-l-2 rounded-bl-xl rounded-br-xl">
            <p class="text-headingColor italic capitalize">{{ module?.published ? 'Published' : 'Draft' }}</p>
            <div @click="hovered = !hovered" class="flex justify-center items-center hover:bg-darkBackground rounded-full w-8 h-8 cursor-pointer">
                <Icon name="tabler:dots-vertical" class="w-5 h-5 text-headingColor" />
            </div>
            <div v-if="hovered" class="-top-28 right-0 absolute space-y-1 bg-[#292D32] p-2 rounded-xl">
                <div @click="editModule" class="flex items-center gap-1 hover:bg-darkBackground p-1 rounded-lg text-headingColor text-sm transition-all cursor-pointer">
                    <Icon name="material-symbols:edit-outline" />
                    <span>Edit</span>
                </div>
                <div @click="deleteModuleHandler" class="flex items-center gap-1 hover:bg-darkBackground p-1 rounded-lg text-red-400 text-sm transition-all cursor-pointer">
                    <Icon name="material-symbols:delete-outline-rounded" />
                    <span>Delete</span>
                </div>
                <div @click="toggleStatus" class="flex items-center gap-1 hover:bg-darkBackground p-1 rounded-lg text-headingColor text-sm transition-all cursor-pointer">
                    <Icon name="material-symbols:arrow-upload-progress" />
                    <span>{{ module?.published ? 'Unpublish' : 'Publish' }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
  module: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['edit', 'delete', 'toggle-status'])

const hovered = ref(false)

const truncatedDescription = computed(() => {
  const description = props.module?.description || 'No description available'
  return description.length > 150 ? description.substring(0, 150) + '...' : description
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

const editModule = () => {
  hovered.value = false
  emit('edit', props.module)
}

const deleteModuleHandler = () => {
  hovered.value = false
  emit('delete', props.module)
}

const toggleStatus = () => {
  hovered.value = false
  emit('toggle-status', props.module)
}
</script>