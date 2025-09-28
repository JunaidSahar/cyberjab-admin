<script setup lang="ts">
import Navbar from '~/components/global/navbar.vue';

</script>

<template>
    <div class="flex bg-darkBackground w-full min-h-screen">
        <div class="top-0 left-0 sticky border-r border-border w-80 h-screen">

            <Navbar />
        </div>
        <div class="flex-1 p-10 h-full overflow-y-auto max-w-[1400px]">
            <NuxtPage />
        </div>
    </div>
</template>