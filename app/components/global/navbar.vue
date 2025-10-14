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

    <!-- User Info and Logout -->
    <div class="right-0 bottom-0 left-0 absolute p-6 border-t border-border">
      <ClientOnly>
        <div v-if="userStore.isAuthenticated" class="space-y-3">
          <div class="text-gray-400 text-sm">
            <p>Logged in as:</p>
            <p class="font-medium text-white">
              {{ userStore.user?.email || "Admin User" }}
            </p>
          </div>
          <button
            @click="handleLogout"
            :disabled="loggingOut"
            class="flex justify-center items-center bg-transparent hover:bg-gray-700 disabled:opacity-50 px-3 py-2 border border-gray-600 rounded-md w-full font-medium text-gray-300 hover:text-white text-sm transition-colors disabled:cursor-not-allowed"
          >
            <Icon name="material-symbols:logout" class="mr-2 w-4 h-4" />
            {{ loggingOut ? "Logging out..." : "Logout" }}
          </button>
        </div>
        <div v-else class="space-y-3">
          <div class="text-gray-400 text-sm">
            <p>Not logged in</p>
          </div>
          <button
            @click="$router.push('/login')"
            class="flex justify-center items-center bg-transparent hover:bg-gray-700 px-3 py-2 border border-gray-600 rounded-md w-full font-medium text-gray-300 hover:text-white text-sm transition-colors"
          >
            <Icon name="material-symbols:login" class="mr-2 w-4 h-4" />
            Login
          </button>
        </div>
        <template #fallback>
          <div class="space-y-3">
            <div class="text-gray-400 text-sm">
              <p>Loading...</p>
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { useAuth } from "@/composables/useAuth";
const route = useRoute();
const router = useRouter();
const { logout } = useAuth();

const loggingOut = ref(false);

const userStore = useUserStore();

const handleLogout = async () => {
  loggingOut.value = true;

  try {
    const { error } = await logout();

    if (error) {
      console.error("Failed to logout properly:", error);
    } else {
      console.log("You have been logged out successfully");
    }

    // Redirect to login page
    await router.push("/login");
  } catch (err) {
    console.error("An unexpected error occurred during logout:", err);
  } finally {
    loggingOut.value = false;
  }
};

const moduleList = computed(() => {
  return [
    {
      name: "Home",
      icon: "material-symbols:home-outline",
      link: "/",
      active: route.path == "/" ? true : false,
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
      active: route.path == "/instructors",
    },
    {
      name: "Users",
      icon: "lucide:user-round",
      link: "/users",
      active: route.path == "/users",
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
    {
      name: "Import Data",
      icon: "mdi:upload-outline",
      link: "/import",
      active: route.path.includes("/import"),
    },
  ];
});
</script>
