<script setup lang="ts">
import { useRoute } from 'vue-router';
import IndexPage from './index.vue';
const route = useRoute();
</script>

<template>
  <!-- reuse your existing index.vue UI but pass the id just in case -->
  <IndexPage :id="Array.isArray(route.params.id) ? route.params.id[0] : route.params.id" />
</template>
