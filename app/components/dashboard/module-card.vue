<template>
    <div class="bg-darkForground rounded-xl max-w-sm overflow-hidden">
        <img :src="module?.image || '/module-1.png'" :alt="module?.name || 'Module image'" class="w-full h-48 object-cover">
        <div class="space-y-2 p-4 min-h-48">
            <h3 class="font-bold text-headingColor text-lg">{{ module?.name || 'Untitled Module' }}</h3>
            <p class="text-headingColor text-sm">{{ truncatedDescription }}</p>
            <div class="flex items-center gap-2 text-xs text-gray-400">
                <span>Created: {{ formatDate(module?.created_at) }}</span>
                <span v-if="module?.updated_at">• Updated: {{ formatDate(module?.updated_at) }}</span>
            </div>
        </div>
        <div class="flex justify-center items-center bg-[#292D32] px-4 py-2 border-[#303347] border-r-2 border-b-2 border-l-2 rounded-bl-xl rounded-br-xl">
            <p class="text-headingColor italic capitalize">{{ module?.published ? 'Published' : 'Draft' }}</p>
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

const truncatedDescription = computed(() => {
  const description = props.module?.description || 'No description available'
  return description.length > 150 ? description.substring(0, 150) + '...' : description
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}
</script>
