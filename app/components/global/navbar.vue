<template>
  <div>
    <div class="py-5 pl-6 border-b border-border">
      <img src="/logo.svg" alt="brand logo" class="w-auto h-10" />
    </div>
    <div class="mt-6">
      <ul>
        <li
          v-for="(link, index) in moduleList"
          :key="index"
          class="font-medium text-headingColor text-sm transition-all"
        >
          <NuxtLink
            :key="index"
            :to="link.link"
            :class="
            link.active
              ? 'bg-[linear-gradient(269.95deg,_rgba(21,_22,_26,_0)_0.04%,_rgba(41,_45,_50,_0.85)_99.94%)] border-primaryBlue'
              : 'border-transparent hover:bg-[linear-gradient(269.95deg,_rgba(21,_22,_26,_0)_0.04%,_rgba(41,_45,_50,_0.85)_99.94%)] hover:border-primaryBlue'
          "
            class="flex items-center gap-2 mb-2 px-6 py-2.5 border-l-4 rounded w-full h-full transition-colors"
          >
            <Icon class="w-5 h-5" :name="link.icon" />
            <span>
              {{ link.name }}
            </span>
          </NuxtLink>
          <hr class="my-3 border-border" v-if="index === 3 || index === 5" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const moduleList = ref([
  {
    name: "Home",
    icon: "material-symbols:home-outline",
    link: "/",
    active: route.path == "/" ? true : false
  },
  {
    name: "Modules",
    icon: "solar:notebook-minimalistic-linear",
    link: "/modules",
    active: route.path.includes("/modules"),
  },
  {
    name: "Learning Paths",
    icon: "material-symbols:bookmarks-outline-sharp",
    link: "/learning-paths",
    active: route.path.includes("/learning-paths"),
  },
  {
    name: "Instructors",
    icon: "ph:student",
    link: "/instructors",
    active: route.path.includes("/instructors"),
  },
  {
    name: "Users",
    icon: "lucide:user-round",
    link: "/users",
    active: route.path.includes("/users"),
  },

  {
    name: "Progress",
    icon: "material-symbols:arrow-upload-progress",
    link: "/progress",
    active: route.path.includes("/progress"),
  },
  {
    name: "Leads",
    icon: "mdi:magnet-on",
    link: "/leads",
    active: route.path.includes("/leads"),
  },
  {
    name: "Packages",
    icon: "mdi:tag-outline",
    link: "/packages",
    active: route.path.includes("/packages"),
  },
]);
</script>
