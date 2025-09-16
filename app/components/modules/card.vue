<template>
    <div class="bg-darkForground rounded-bl-xl rounded-br-xl">
        <img src="/module-1.png" alt="cardImage">
        <div class="space-y-2 p-4 min-h-48">
            <h3 class="font-bold text-headingColor text-lg">Learning Linux Basics Course & Labs</h3>
            <p class="text-headingColor text-sm">Product Management Masterclass, you will learn with Sarah Johnson - Head of Product Customer Platform Gojek Indonesia.</p>
        </div>
        <div class="relative flex justify-between items-center bg-[#292D32] px-4 py-2 border-[#303347] border-r-2 border-b-2 border-l-2 rounded-bl-xl rounded-br-xl">
            <p class="text-headingColor italic">Published</p>
            <div @click="hovered = !hovered" class="flex justify-center items-center hover:bg-darkBackground rounded-full w-8 h-8 cursor-pointer">
                <Icon name="tabler:dots-vertical" class="w-5 h-5 text-headingColor" />
            </div>
            <div v-if="hovered" class="-top-28 right-0 absolute space-y-1 bg-[#292D32] p-2 rounded-xl">
                <div class="flex items-center gap-1 hover:bg-darkBackground p-1 rounded-lg text-headingColor text-sm transition-all cursor-pointer">
                    <Icon name="material-symbols:edit-outline" />
                    <span>Edit</span>
                </div>
                <div class="flex items-center gap-1 hover:bg-darkBackground p-1 rounded-lg text-headingColor text-sm transition-all cursor-pointer">
                    <Icon name="material-symbols:delete-outline-rounded" />
                    <span>Delete</span>
                </div>
                <div class="flex items-center gap-1 hover:bg-darkBackground p-1 rounded-lg text-headingColor text-sm transition-all cursor-pointer">
                    <Icon name="material-symbols:arrow-upload-progress" />
                    <span>Published</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const hovered = ref(false)
</script>