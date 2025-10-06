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

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const result = await res.json();

    const users = result.results || result;
    data.value = users.map((u: any) => ({
      id: u.id,
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
  } catch (err) {
    console.error("❌ Error fetching users:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchUsers);

// call this when DataTable emits "delete" with the row object
async function handleDelete(row: any) {
  if (!confirm(`Are you sure you want to delete ${row.first_name} ${row.last_name || ''}?`)) return;

  try {
    const url = `${BASE_URL}api/users/admin/users/${row.id}/`; // matches backend curl
    console.log("Deleting:", url);

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/json",
        // If your backend requires CSRF token (curl showed X-CSRFTOKEN), add it here:
        // "X-CSRFTOKEN": "<CSRF_TOKEN_IF_NEEDED>"
      },
    });

    const text = await res.text().catch(() => "");
    console.log("Delete response:", res.status, text);

    if (!res.ok) {
      // show backend message if available
      const msg = text || `Delete failed (${res.status})`;
      alert(msg);
      return;
    }

    // success: remove the deleted user from local list
    data.value = data.value.filter((u) => u.id !== row.id);
    alert("User deleted successfully.");
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    alert("Server error: could not delete user. Check console.");
  }
}


// ✅ Handle Edit / Delete from Dropdown
function handleAction({ action, row }: any) {
  if (action === "edit") {
    router.push(`/users/create-user/${row.id}`);
  } else if (action === "delete") {
    handleDelete(row);
  }
}
</script>

<template>
  <div class="w-full h-full">
    <!-- Header -->
    <div class="flex justify-between items-center w-full">
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
      <DataTable
        v-if="!loading"
        :columns="columns"
        :data="data"
        @action="handleAction"
        @delete="handleDelete"
      />
      <div v-else class="text-center py-10">Loading users...</div>
    </div>
  </div>
</template>
