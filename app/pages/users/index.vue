<script setup lang="ts">
import { ref, onMounted } from "vue";
import DataTable from "~/components/global/data-table.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const config = useRuntimeConfig();
const BASE_URL = config.public.API_BASE_URL;
const TOKEN = config.public.API_TOKEN;

const columns = [
  { key: "first_name", title: "First Name" },
  { key: "last_name", title: "Last Name" },
  { key: "email", title: "Email" },
  { key: "roles", title: "Roles" },
  { key: "status", title: "Status" },
  { key: "last_login", title: "Last Login" },
  { key: "created_at", title: "Date Created" },
  { key: "action", title: "Action", align: "end" },
];

const data = ref<any[]>([]);
const loading = ref(true);

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await fetch(
      `${BASE_URL}api/users/admin/users/?page=1&page_size=20`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response status:", res.status);
    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const result = await res.json();
    console.log("API Result:", result);

    // ✅ Check: Array ya Object?
    if (Array.isArray(result)) {
      // Direct array
      data.value = result.map((u: any) => ({
        first_name: u.first_name,
        last_name: u.last_name,
        email: u.email,
        roles: u.is_staff ? "Admin" : "User",
        status: u.is_active ? "Active" : "Inactive",
        last_login: u.last_login
          ? new Date(u.last_login).toLocaleDateString()
          : "-",
        created_at: new Date(u.date_joined).toLocaleDateString(),
      }));
    } else if (result.results) {
      // Pagination object
      data.value = result.results.map((u: any) => ({
        first_name: u.first_name,
        last_name: u.last_name,
        email: u.email,
        roles: u.is_staff ? "Admin" : "User",
        status: u.is_active ? "Active" : "Inactive",
        last_login: u.last_login
          ? new Date(u.last_login).toLocaleDateString()
          : "-",
        created_at: new Date(u.date_joined).toLocaleDateString(),
      }));
    } else {
      console.warn("⚠️ API response format unexpected:", result);
    }
  } catch (err) {
    console.error("❌ Error fetching users:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchUsers);
</script>

<template>
  <div class="w-full h-full">
    <!-- Header -->
    <div class="flex justify-between items-center w-full">1
      <h1 class="text-headingColor text-3xl">Users</h1>
      <button
        @click="() => router.push('/users/create-user')"
        class="flex items-center gap-2 bg-[#292D32] hover:bg-darkForground px-5 py-2.5 rounded-lg font-semibold text-headingColor transition-all"
      >
        <Icon name="material-symbols:add" />
        Create
      </button>
    </div>

    <!-- Table -->
    <div class="pt-5">
      <DataTable v-if="!loading" :columns="columns" :data="data" />
      <div v-else class="text-center py-10">Loading users...</div>
    </div>
  </div>
</template>
