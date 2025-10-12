<template>
    <div class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 transition-all">
        <div class="bg-darkForeground shadow-lg p-6 rounded-lg">
            <h2 class="mb-4 font-bold text-headingColor text-xl">{{ title }}</h2>
            <p class="mb-12 text-headingColor">{{ message }}</p>
            <div class="flex justify-end gap-3">
                <button @click="close" class="bg-gray-300 px-4 py-2 rounded-md text-black text-sm">Cancel</button>
                <button @click="confirm" class="bg-red-500 px-4 py-2 rounded-md text-white text-sm">Confirm</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
    title: {
        type: String,
        default: 'Confirm Action',
    },
    message: {
        type: String,
        default: 'Are you sure you want to perform this action?',
    },
})

const emit = defineEmits(['confirm', 'close'])

const confirm = () => {
    emit('confirm')
}

const close = () => {
    emit('close')
}
</script>
