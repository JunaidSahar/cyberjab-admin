<template>
  <div class="w-full h-full">
    <div class="flex justify-between items-center w-full">
      <h1 class="text-headingColor text-3xl">Modules</h1>
      <button
      @click="router.push(`/modules/create-module`)"
        class="flex items-center gap-2 bg-[#292D32] hover:bg-darkForground px-5 py-2.5 rounded-lg font-semibold text-headingColor transition-all"
      >
        <Icon name="material-symbols:add" />
        Create
      </button>
    </div>
    <div class="space-x-12 pt-4 border-b border-border">
      <button
        @click="activeButton = button.id"
        :class="
          button.id == activeButton
            ? 'border-headingColor'
            : 'border-transparent'
        "
        class="pb-3 border-b-2 font-medium text-headingColor transition-all"
        v-for="(button, index) in tabs"
        :key="index"
      >
        {{ button.name }}
      </button>
    </div>

    <div class="flex items-center gap-4 pt-5">
      <div
        class="flex flex-1 items-center gap-2 bg-darkForground px-4 py-2 rounded-lg min-h-10"
      >
        <input
          type="text"
          placeholder="Search module by name..."
          class="bg-transparent focus:outline-none w-full text-headingColor text-sm"
        />
        <Icon
          class="w-5 h-5 text-headingColor"
          name="streamline:interface-search-glass-search-magnifying"
        />
      </div>
      <select
        class="block bg-darkForground px-4 py-2 rounded-lg w-60 min-h-10 dark:text-neutral-400 text-sm disabled:pointer-events-none"
      >
        <option selected="">Filters</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
      </select>
      <select
        class="block bg-darkForground px-4 py-2 rounded-lg w-60 min-h-10 dark:text-neutral-400 text-sm disabled:pointer-events-none"
      >
        <option selected="">Sort by</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
      </select>
    </div>

    <div class="gap-x-5 gap-y-8 grid grid-cols-4 pt-8">
        <Card v-for="(item, index) in 8" :key="index" />
    </div>
  </div>
</template>

<script setup>
import Card from '~/components/modules/card.vue';
const router = useRouter()
const activeButton = ref("all");
const tabs = ref([
  {
    name: "Published",
    id: "published",
    active: true,
  },
  {
    name: "Unpublished",
    id: "unpublished",
    active: false,
  },
  {
    name: "All",
    id: "all",
    active: false,
  },
]);
</script>
